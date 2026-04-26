/**
 * 新山钟点女佣对接平台 — Apps Script 后端
 *
 * 两种用途,共用一份代码,通过【两个不同的 deployment】区分:
 *   1. 公共 API (Anyone has access):前端表单 POST → 写入 Sheet
 *   2. 管理后台 (Only myself):  GET → 返回 admin HTML
 *
 * 安全说明:
 *   - admin HTML 即使暴露,server 函数会检查
 *     Session.getActiveUser().getEmail() === ADMIN_EMAIL
 *     非 admin 调用会被拒绝,保险起见双重防护。
 */

const SHEET_ID = '1G0FQ4VLkSCU74pTA5P0FvwUJX3gwOkf-V0vUwamHehE';
const NOTIFY_EMAIL = 'ongcheongwei@yesteaching.com';
const ADMIN_EMAIL = 'ongcheongwei@yesteaching.com';

// ============================================
// 公共 API:doPost 接收表单提交
// ============================================
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'No payload' });
    }
    const data = JSON.parse(e.postData.contents);
    const formType = (data.form_type || '').trim();
    if (!formType) return jsonResponse({ success: false, error: 'Missing form_type' });

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let result;
    switch (formType) {
      case 'user_lead':   result = handleUserLead_(ss, data); break;
      case 'partner_app': result = handlePartnerApp_(ss, data); break;
      case 'contact':     result = handleContact_(ss, data); break;
      default: return jsonResponse({ success: false, error: 'Invalid form_type: ' + formType });
    }
    if (NOTIFY_EMAIL) {
      try {
        MailApp.sendEmail(
          NOTIFY_EMAIL,
          '[Maid Platform] New ' + formType,
          buildEmailBody_(formType, data)
        );
      } catch (mailErr) { console.error('Mail error:', mailErr); }
    }
    return jsonResponse({ success: true, ...result });
  } catch (err) {
    console.error(err);
    return jsonResponse({ success: false, error: String(err && err.message || err) });
  }
}

// ============================================
// 管理后台:doGet 返回 admin HTML
// ============================================
function doGet(e) {
  // ?api=status 时返回 JSON(健康检查)
  if (e && e.parameter && e.parameter.api === 'status') {
    return jsonResponse({ status: 'API is running', service: 'Maid Platform' });
  }
  return HtmlService.createHtmlOutput(ADMIN_HTML)
    .setTitle('Maid Platform · Admin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
}

// ============================================
// 后台 server 函数(从 admin HTML 通过 google.script.run 调用)
// 全部加上 admin 身份检查
// ============================================
function _assertAdmin_() {
  const email = Session.getActiveUser().getEmail();
  if (email && email !== ADMIN_EMAIL) {
    throw new Error('Unauthorized: ' + email);
  }
  // 注:Session.getActiveUser().getEmail() 在跨域名情况下可能返回空字符串,
  // 但因为这个 deployment 设了「Only myself」access,Google 已经在 URL 层面
  // 先做了一道认证,所以即便 email 拿不到,能进到这一步的也只有 ADMIN_EMAIL。
}

function adminGetLeads(sheetName) {
  _assertAdmin_();
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  const rows = data.slice(1).map((row, i) => {
    const obj = { _row: i + 2 };
    headers.forEach((h, j) => {
      let v = row[j];
      if (v instanceof Date) v = v.toISOString();
      obj[h] = v;
    });
    return obj;
  });
  return rows.reverse(); // 最新的在前
}

function adminGetCounts() {
  _assertAdmin_();
  const ss = SpreadsheetApp.openById(SHEET_ID);
  function statusCounts(name, statusCol) {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return { total: 0, pending: 0 };
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return { total: 0, pending: 0 };
    const total = lastRow - 1;
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const idx = headers.indexOf(statusCol);
    let pending = 0;
    if (idx !== -1 && total > 0) {
      const col = sheet.getRange(2, idx + 1, total, 1).getValues();
      const pendingValues = ['未联系', '待审核', '未处理'];
      pending = col.filter(r => pendingValues.indexOf(r[0]) !== -1).length;
    }
    return { total, pending };
  }
  return {
    User_Leads: statusCounts('User_Leads', 'status'),
    Partner_Applications: statusCounts('Partner_Applications', 'status'),
    Contact_Forms: statusCounts('Contact_Forms', 'status')
  };
}

function adminUpdateField(sheetName, rowNum, field, value) {
  _assertAdmin_();
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet not found: ' + sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colIdx = headers.indexOf(field);
  if (colIdx === -1) throw new Error('Field not found: ' + field);
  sheet.getRange(rowNum, colIdx + 1).setValue(value);
  return true;
}

// ============================================
// 各表写入 handler
// ============================================
function handleUserLead_(ss, d) {
  const sheet = getOrCreateSheet_(ss, 'User_Leads', [
    'timestamp', 'service_type', 'property_type', 'property_size',
    'timing', 'name', 'whatsapp', 'location', 'remarks',
    'status', 'assigned_partner', 'follow_up_notes'
  ]);
  sheet.appendRow([
    new Date(), d.service_type || '', d.property_type || '', d.property_size || '',
    d.timing || '', d.name || '', d.whatsapp || '', d.location || '', d.remarks || '',
    '未联系', '', ''
  ]);
  return { sheet: 'User_Leads' };
}

function handlePartnerApp_(ss, d) {
  const sheet = getOrCreateSheet_(ss, 'Partner_Applications', [
    'timestamp', 'center_name', 'contact_name', 'contact_phone', 'email',
    'ssm_number', 'coverage_areas', 'services_offered',
    'monthly_volume', 'preferred_model', 'remarks', 'status'
  ]);
  sheet.appendRow([
    new Date(), d.center_name || '', d.contact_name || '', d.contact_phone || '', d.email || '',
    d.ssm_number || '',
    Array.isArray(d.coverage_areas) ? d.coverage_areas.join(', ') : (d.coverage_areas || ''),
    Array.isArray(d.services_offered) ? d.services_offered.join(', ') : (d.services_offered || ''),
    d.monthly_volume || '', d.preferred_model || '', d.remarks || '',
    '待审核'
  ]);
  return { sheet: 'Partner_Applications' };
}

function handleContact_(ss, d) {
  const sheet = getOrCreateSheet_(ss, 'Contact_Forms', [
    'timestamp', 'name', 'email', 'inquiry_type', 'message', 'status'
  ]);
  sheet.appendRow([
    new Date(), d.name || '', d.email || '', d.inquiry_type || '',
    d.message || '', '未处理'
  ]);
  return { sheet: 'Contact_Forms' };
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#FAF7F2');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function buildEmailBody_(formType, d) {
  const lines = ['New ' + formType + ' submission:', ''];
  Object.keys(d).forEach(k => {
    if (k === 'form_type') return;
    let v = d[k];
    if (Array.isArray(v)) v = v.join(', ');
    lines.push(k + ': ' + v);
  });
  lines.push('');
  lines.push('Open the admin panel to manage this lead.');
  return lines.join('\n');
}

function setupSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  getOrCreateSheet_(ss, 'User_Leads', [
    'timestamp', 'service_type', 'property_type', 'property_size',
    'timing', 'name', 'whatsapp', 'location', 'remarks',
    'status', 'assigned_partner', 'follow_up_notes'
  ]);
  getOrCreateSheet_(ss, 'Partner_Applications', [
    'timestamp', 'center_name', 'contact_name', 'contact_phone', 'email',
    'ssm_number', 'coverage_areas', 'services_offered',
    'monthly_volume', 'preferred_model', 'remarks', 'status'
  ]);
  getOrCreateSheet_(ss, 'Contact_Forms', [
    'timestamp', 'name', 'email', 'inquiry_type', 'message', 'status'
  ]);
  console.log('Sheets initialized.');
}

// ============================================
// Admin HTML(单页应用,内嵌 CSS + JS)
// 通过 google.script.run 调用 admin* 系列函数
// ============================================
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>Maid Platform · Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #E07856; --primary-dark: #C65D3C;
  --secondary: #2C5F4E; --bg: #FAF7F2; --card: #FFFFFF;
  --text: #2A2520; --muted: #6B6259; --border: #E8E2D8;
  --pending: #C65D3C; --done: #2C5F4E; --lost: #999;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', 'Noto Sans TC', sans-serif; background: var(--bg); color: var(--text); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }

.topbar { background: var(--secondary); color: white; padding: 12px 16px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 10; }
.topbar h1 { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; flex: 1; }
.topbar button { background: rgba(255,255,255,0.18); color: white; border: none; padding: 6px 12px; border-radius: 4px; font-family: inherit; font-size: 13px; cursor: pointer; }
.topbar button:hover { background: rgba(255,255,255,0.28); }

.tabs { display: flex; background: var(--card); border-bottom: 1px solid var(--border); position: sticky; top: 49px; z-index: 9; overflow-x: auto; }
.tabs button { background: none; border: none; padding: 14px 18px; font-family: inherit; font-size: 14px; font-weight: 500; color: var(--muted); cursor: pointer; white-space: nowrap; border-bottom: 3px solid transparent; }
.tabs button.active { color: var(--primary-dark); border-bottom-color: var(--primary); font-weight: 600; }
.tabs .badge { display: inline-block; background: var(--primary); color: white; font-size: 11px; padding: 2px 7px; border-radius: 999px; margin-left: 6px; font-weight: 600; }
.tabs button:not(.active) .badge { background: var(--muted); }

.container { max-width: 880px; margin: 0 auto; padding: 16px; }
.empty { text-align: center; padding: 48px 16px; color: var(--muted); }
.loading { text-align: center; padding: 32px; color: var(--muted); }

.card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; margin-bottom: 10px; box-shadow: 0 1px 2px rgba(60,40,20,0.04); }
.card-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.card-time { color: var(--muted); font-size: 12px; }
.status-badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600; letter-spacing: 0.02em; }
.s-pending { background: rgba(224,120,86,0.14); color: var(--primary-dark); }
.s-active { background: rgba(244,185,66,0.18); color: #966500; }
.s-done { background: rgba(44,95,78,0.14); color: var(--done); }
.s-lost { background: rgba(120,120,120,0.14); color: #555; }

.card-body { font-size: 14px; }
.name-line { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
.name-line .wa-btn { float: right; font-size: 12px; background: #25D366; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-weight: 600; }
.name-line .wa-btn:hover { background: #1DA851; }
.meta { color: var(--muted); font-size: 13px; margin-bottom: 6px; }
.remarks { font-size: 13px; padding: 6px 10px; background: var(--bg); border-left: 3px solid var(--primary); border-radius: 0 4px 4px 0; margin: 6px 0; }
.remarks strong { color: var(--muted); font-weight: 600; }

details { margin-top: 8px; }
details summary { cursor: pointer; color: var(--primary-dark); font-size: 13px; padding: 4px 0; user-select: none; font-weight: 500; }
details summary::-webkit-details-marker { color: var(--primary); }

.actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border); }
.actions label { font-size: 12px; color: var(--muted); display: block; margin-bottom: 3px; font-weight: 500; }
.actions select, .actions input, .actions textarea { width: 100%; padding: 6px 8px; font-family: inherit; font-size: 13px; border: 1px solid var(--border); border-radius: 4px; background: white; color: var(--text); }
.actions select:focus, .actions input:focus, .actions textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px rgba(224,120,86,0.15); }
.actions textarea { resize: vertical; min-height: 50px; grid-column: 1 / -1; }
.actions .full { grid-column: 1 / -1; }
.actions .saving { font-size: 11px; color: var(--muted); grid-column: 1 / -1; min-height: 14px; }
.actions .saving.ok { color: var(--done); }
.actions .saving.err { color: #C44536; }

@media (max-width: 540px) {
  .actions { grid-template-columns: 1fr; }
}

.full-fields { font-size: 12px; color: var(--muted); padding: 8px 10px; background: var(--bg); border-radius: 4px; margin-top: 8px; }
.full-fields div { padding: 2px 0; }
.full-fields strong { color: var(--text); display: inline-block; min-width: 110px; }
</style>
</head>
<body>
<div class="topbar">
  <h1>Maid Platform · Admin</h1>
  <button id="btn-refresh">↻ 刷新</button>
</div>

<div class="tabs">
  <button data-sheet="User_Leads" class="active">用户咨询 <span class="badge" data-c="User_Leads">·</span></button>
  <button data-sheet="Partner_Applications">合作申请 <span class="badge" data-c="Partner_Applications">·</span></button>
  <button data-sheet="Contact_Forms">联系留言 <span class="badge" data-c="Contact_Forms">·</span></button>
</div>

<div class="container" id="content">
  <div class="loading">加载中…</div>
</div>

<script>
let currentSheet = 'User_Leads';
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

const STATUS_OPTIONS = {
  User_Leads: ['未联系', '已派单', '跟进中', '成交', '流失'],
  Partner_Applications: ['待审核', '已合作', '已拒绝'],
  Contact_Forms: ['未处理', '已回复']
};

const STATUS_CLASS = {
  '未联系': 's-pending', '待审核': 's-pending', '未处理': 's-pending',
  '已派单': 's-active', '跟进中': 's-active',
  '成交': 's-done', '已合作': 's-done', '已回复': 's-done',
  '流失': 's-lost', '已拒绝': 's-lost'
};

function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function escHTML(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function waLink(num) {
  const digits = String(num || '').replace(/\\D/g, '');
  if (!digits) return '';
  return 'https://wa.me/' + digits;
}

function renderUserLead(r) {
  const stCls = STATUS_CLASS[r.status] || 's-pending';
  const wa = waLink(r.whatsapp);
  return \`
    <div class="card" data-row="\${r._row}">
      <div class="card-head">
        <span class="card-time">\${fmtTime(r.timestamp)}</span>
        <span class="status-badge \${stCls}">\${escHTML(r.status)}</span>
      </div>
      <div class="card-body">
        <div class="name-line">
          \${escHTML(r.name || '(无姓名)')}
          \${wa ? \`<a class="wa-btn" href="\${wa}" target="_blank">WhatsApp</a>\` : ''}
        </div>
        <div class="meta">📞 \${escHTML(r.whatsapp)} · 📍 \${escHTML(r.location)}</div>
        <div class="meta">\${escHTML(r.service_type)} · \${escHTML(r.property_type)} · \${escHTML(r.property_size)} · \${escHTML(r.timing)}</div>
        \${r.remarks ? \`<div class="remarks"><strong>备注:</strong> \${escHTML(r.remarks)}</div>\` : ''}
      </div>
      <div class="actions">
        <div>
          <label>状态</label>
          <select data-field="status">\${STATUS_OPTIONS.User_Leads.map(s => \`<option \${s===r.status?'selected':''}>\${s}</option>\`).join('')}</select>
        </div>
        <div>
          <label>分配给</label>
          <input data-field="assigned_partner" value="\${escHTML(r.assigned_partner)}" placeholder="中心名称" />
        </div>
        <div class="full">
          <label>跟进记录</label>
          <textarea data-field="follow_up_notes" placeholder="跟进记录(每次写完点击外部自动保存)">\${escHTML(r.follow_up_notes)}</textarea>
        </div>
        <div class="saving" data-saving></div>
      </div>
    </div>
  \`;
}

function renderPartner(r) {
  const stCls = STATUS_CLASS[r.status] || 's-pending';
  const wa = waLink(r.contact_phone);
  return \`
    <div class="card" data-row="\${r._row}">
      <div class="card-head">
        <span class="card-time">\${fmtTime(r.timestamp)}</span>
        <span class="status-badge \${stCls}">\${escHTML(r.status)}</span>
      </div>
      <div class="card-body">
        <div class="name-line">
          \${escHTML(r.center_name || '(无中心名)')}
          \${wa ? \`<a class="wa-btn" href="\${wa}" target="_blank">WhatsApp</a>\` : ''}
        </div>
        <div class="meta">联络人:\${escHTML(r.contact_name)} · 📞 \${escHTML(r.contact_phone)} · ✉ \${escHTML(r.email)}</div>
        <div class="meta">SSM:\${escHTML(r.ssm_number)} · 月单量:\${escHTML(r.monthly_volume)} · 模式:\${escHTML(r.preferred_model)}</div>
        <div class="meta">服务:\${escHTML(r.services_offered)}</div>
        <div class="meta">区域:\${escHTML(r.coverage_areas)}</div>
        \${r.remarks ? \`<div class="remarks"><strong>备注:</strong> \${escHTML(r.remarks)}</div>\` : ''}
      </div>
      <div class="actions">
        <div class="full">
          <label>状态</label>
          <select data-field="status">\${STATUS_OPTIONS.Partner_Applications.map(s => \`<option \${s===r.status?'selected':''}>\${s}</option>\`).join('')}</select>
        </div>
        <div class="saving" data-saving></div>
      </div>
    </div>
  \`;
}

function renderContact(r) {
  const stCls = STATUS_CLASS[r.status] || 's-pending';
  return \`
    <div class="card" data-row="\${r._row}">
      <div class="card-head">
        <span class="card-time">\${fmtTime(r.timestamp)}</span>
        <span class="status-badge \${stCls}">\${escHTML(r.status)}</span>
      </div>
      <div class="card-body">
        <div class="name-line">
          \${escHTML(r.name || '(无姓名)')}
          <a class="wa-btn" style="background: var(--secondary)" href="mailto:\${escHTML(r.email)}">邮件</a>
        </div>
        <div class="meta">✉ \${escHTML(r.email)} · 类型:\${escHTML(r.inquiry_type)}</div>
        <div class="remarks"><strong>内容:</strong> \${escHTML(r.message)}</div>
      </div>
      <div class="actions">
        <div class="full">
          <label>状态</label>
          <select data-field="status">\${STATUS_OPTIONS.Contact_Forms.map(s => \`<option \${s===r.status?'selected':''}>\${s}</option>\`).join('')}</select>
        </div>
        <div class="saving" data-saving></div>
      </div>
    </div>
  \`;
}

function render(rows) {
  const c = $('#content');
  if (!rows || rows.length === 0) {
    c.innerHTML = '<div class="empty">还没有记录。</div>';
    return;
  }
  const renderer = currentSheet === 'User_Leads' ? renderUserLead
    : currentSheet === 'Partner_Applications' ? renderPartner : renderContact;
  c.innerHTML = rows.map(renderer).join('');
  attachHandlers();
}

function attachHandlers() {
  $$('.actions select, .actions input, .actions textarea').forEach(el => {
    const evt = el.tagName === 'SELECT' ? 'change' : 'blur';
    el.addEventListener(evt, () => {
      const card = el.closest('.card');
      const row = parseInt(card.dataset.row, 10);
      const field = el.dataset.field;
      const value = el.value;
      const saving = card.querySelector('[data-saving]');
      saving.textContent = '保存中…'; saving.className = 'saving';
      google.script.run
        .withSuccessHandler(() => {
          saving.textContent = '✓ 已保存 ' + new Date().toLocaleTimeString();
          saving.className = 'saving ok';
          // 状态改变后,重新加载这条 row 的 UI(badge + class)
          if (field === 'status') loadCounts();
        })
        .withFailureHandler(err => {
          saving.textContent = '× 保存失败:' + err.message;
          saving.className = 'saving err';
        })
        .adminUpdateField(currentSheet, row, field, value);
    });
  });
}

function loadLeads() {
  $('#content').innerHTML = '<div class="loading">加载中…</div>';
  google.script.run
    .withSuccessHandler(render)
    .withFailureHandler(err => {
      $('#content').innerHTML = '<div class="empty">加载失败:' + err.message + '</div>';
    })
    .adminGetLeads(currentSheet);
}

function loadCounts() {
  google.script.run
    .withSuccessHandler(counts => {
      Object.keys(counts).forEach(k => {
        const el = document.querySelector('[data-c="' + k + '"]');
        if (el) {
          const c = counts[k];
          el.textContent = c.pending + ' / ' + c.total;
        }
      });
    })
    .withFailureHandler(() => {})
    .adminGetCounts();
}

$$('.tabs button').forEach(b => {
  b.addEventListener('click', () => {
    currentSheet = b.dataset.sheet;
    $$('.tabs button').forEach(x => x.classList.toggle('active', x === b));
    loadLeads();
  });
});
$('#btn-refresh').addEventListener('click', () => { loadLeads(); loadCounts(); });

loadLeads();
loadCounts();
</script>
</body>
</html>`;
