// ============================================
// 共用脚本:导航开关、FAQ、表单提交工具
// ============================================

// !!! 部署时替换:Apps Script Web App URL
window.APPS_SCRIPT_URL = 'YOUR_DEPLOYED_APPS_SCRIPT_URL';

// !!! 部署时替换:WhatsApp 号码(纯数字,带国码,例如 60123456789)
window.WHATSAPP_NUMBER = '60123456789';
window.CONTACT_EMAIL = 'hello@example.com';

document.addEventListener('DOMContentLoaded', () => {
  // ===== 移动端导航 =====
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => menu.classList.remove('open'))
    );
  }

  // ===== FAQ 折叠 =====
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) q.addEventListener('click', () => item.classList.toggle('open'));
  });

  // ===== WhatsApp 链接占位填充 =====
  const waMsg = encodeURIComponent('Hi,我想咨询钟点女佣服务');
  document.querySelectorAll('[data-whatsapp]').forEach(a => {
    a.href = `https://wa.me/${window.WHATSAPP_NUMBER}?text=${waMsg}`;
  });

  // 联系邮箱
  document.querySelectorAll('[data-email]').forEach(a => {
    a.href = `mailto:${window.CONTACT_EMAIL}`;
    if (a.dataset.email === 'show') a.textContent = window.CONTACT_EMAIL;
  });

  // ===== Option-card 选择(单选)=====
  document.querySelectorAll('.option-grid').forEach(grid => {
    if (!grid.dataset.multi) {
      grid.addEventListener('change', () => {
        grid.querySelectorAll('.option-card').forEach(card => {
          const input = card.querySelector('input');
          card.classList.toggle('selected', input && input.checked);
        });
      });
    } else {
      grid.addEventListener('change', () => {
        grid.querySelectorAll('.option-card').forEach(card => {
          const input = card.querySelector('input');
          card.classList.toggle('selected', input && input.checked);
        });
      });
    }
  });

  // ===== URL 参数预选服务类型(从 services 页跳转用)=====
  const params = new URLSearchParams(window.location.search);
  const preService = params.get('service');
  if (preService) {
    const radio = document.querySelector(`input[name="service_type"][value="${preService}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
});

// ===== 表单提交统一函数 =====
window.submitForm = async function (formType, data) {
  if (!window.APPS_SCRIPT_URL || window.APPS_SCRIPT_URL.startsWith('YOUR_')) {
    console.warn('[MaidPlatform] APPS_SCRIPT_URL 未配置,模拟提交成功。');
    await new Promise(r => setTimeout(r, 500));
    return { success: true, mock: true };
  }
  try {
    await fetch(window.APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ form_type: formType, ...data })
    });
    return { success: true };
  } catch (err) {
    console.error('Submit error:', err);
    return { success: false, error: err };
  }
};

// ===== 验证工具 =====
window.MaidValidate = {
  // 马来西亚号码:60xxxxxxxxx (10–11 digits after country code) or 0xxxxxxxxx
  malaysiaPhone(raw) {
    const digits = String(raw || '').replace(/\D/g, '');
    if (/^60\d{9,10}$/.test(digits)) return true;
    if (/^0\d{9,10}$/.test(digits)) return true;
    return false;
  },
  email(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
  },
  nonEmpty(v) {
    return String(v || '').trim().length > 0;
  },
  lengthRange(v, min, max) {
    const len = String(v || '').trim().length;
    return len >= min && len <= max;
  }
};

// ===== UI 提示工具 =====
window.MaidUI = {
  showError(group, msg) {
    if (!group) return;
    group.classList.add('has-error');
    const errEl = group.querySelector('.form-error');
    if (errEl && msg) errEl.textContent = msg;
  },
  clearError(group) {
    if (group) group.classList.remove('has-error');
  },
  setLoading(btn, loading, loadingText) {
    if (!btn) return;
    if (loading) {
      btn.dataset.origText = btn.textContent;
      btn.textContent = loadingText || (window.MaidI18n ? window.MaidI18n.t('btn_submitting') : '提交中…');
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.origText || btn.textContent;
      btn.disabled = false;
    }
  }
};
