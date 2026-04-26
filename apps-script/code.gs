/**
 * ============================================
 * 新山钟点女佣对接平台 — Apps Script 后端
 * ============================================
 * 部署:Web app → Execute as: Me → Who has access: Anyone
 *
 * 三个 Sheet:
 *   - User_Leads          (用户填表)
 *   - Partner_Applications(中心合作申请)
 *   - Contact_Forms       (联系表单)
 *
 * 使用 doPost 接收 JSON,根据 form_type 路由到对应 sheet。
 *
 * 因为前端用 mode: 'no-cors',body 会以 text/plain 送来,
 * 我们用 e.postData.contents 解析 JSON,无需特别处理 CORS。
 */

// !!! 替换:你的 Google Sheet ID(从 URL /spreadsheets/d/<这里>/edit 复制)
const SHEET_ID = 'YOUR_SHEET_ID_HERE';

// !!! 选填:留空就不发邮件;填入运营邮箱后,每条新 lead 会发邮件提醒
const NOTIFY_EMAIL = ''; // 例:'youremail@gmail.com'

// ============================================
// 入口
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
      case 'user_lead':
        result = handleUserLead_(ss, data);
        break;
      case 'partner_app':
        result = handlePartnerApp_(ss, data);
        break;
      case 'contact':
        result = handleContact_(ss, data);
        break;
      default:
        return jsonResponse({ success: false, error: 'Invalid form_type: ' + formType });
    }

    if (NOTIFY_EMAIL) {
      try {
        MailApp.sendEmail(
          NOTIFY_EMAIL,
          '[Maid Platform] New ' + formType,
          JSON.stringify(data, null, 2)
        );
      } catch (mailErr) {
        // 不让邮件失败导致整体失败
        console.error('Mail error:', mailErr);
      }
    }

    return jsonResponse({ success: true, ...result });

  } catch (err) {
    console.error(err);
    return jsonResponse({ success: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return jsonResponse({ status: 'API is running', service: 'Maid Platform' });
}

// ============================================
// 各表处理
// ============================================
function handleUserLead_(ss, d) {
  const sheet = getOrCreateSheet_(ss, 'User_Leads', [
    'timestamp', 'service_type', 'property_type', 'property_size',
    'timing', 'name', 'whatsapp', 'location', 'remarks',
    'status', 'assigned_partner', 'follow_up_notes'
  ]);
  sheet.appendRow([
    new Date(),
    d.service_type || '',
    d.property_type || '',
    d.property_size || '',
    d.timing || '',
    d.name || '',
    d.whatsapp || '',
    d.location || '',
    d.remarks || '',
    '未联系',
    '',
    ''
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
    new Date(),
    d.center_name || '',
    d.contact_name || '',
    d.contact_phone || '',
    d.email || '',
    d.ssm_number || '',
    Array.isArray(d.coverage_areas) ? d.coverage_areas.join(', ') : (d.coverage_areas || ''),
    Array.isArray(d.services_offered) ? d.services_offered.join(', ') : (d.services_offered || ''),
    d.monthly_volume || '',
    d.preferred_model || '',
    d.remarks || '',
    '待审核'
  ]);
  return { sheet: 'Partner_Applications' };
}

function handleContact_(ss, d) {
  const sheet = getOrCreateSheet_(ss, 'Contact_Forms', [
    'timestamp', 'name', 'email', 'inquiry_type', 'message', 'status'
  ]);
  sheet.appendRow([
    new Date(),
    d.name || '',
    d.email || '',
    d.inquiry_type || '',
    d.message || '',
    '未处理'
  ]);
  return { sheet: 'Contact_Forms' };
}

// ============================================
// 工具函数
// ============================================
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
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// 一次性初始化:在 Apps Script 编辑器中手动跑一次
// 会自动创建 3 个 sheet 和 header,省去手动设置
// ============================================
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
