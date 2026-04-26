// ============================================
// 中心合作申请(partner.html)
// ============================================
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('partner-form');
    if (!form) return;

    const submitBtn = form.querySelector('#btn-submit');
    const formCard = document.getElementById('form-card');
    const thankYou = document.getElementById('thank-you');

    function getChecked(name) {
      return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
    }

    function validate() {
      let ok = true;
      form.querySelectorAll('.form-group').forEach(g => MaidUI.clearError(g));

      const f = form.elements;
      if (!MaidValidate.nonEmpty(f['center_name'].value)) {
        MaidUI.showError(f['center_name'].closest('.form-group'), '请填写中心名称'); ok = false;
      }
      if (!MaidValidate.nonEmpty(f['contact_name'].value)) {
        MaidUI.showError(f['contact_name'].closest('.form-group'), '请填写联络人姓名'); ok = false;
      }
      if (!MaidValidate.internationalPhone(f['contact_phone'].value)) {
        MaidUI.showError(f['contact_phone'].closest('.form-group'), '请填写有效的电话号码(7–15 位数字)'); ok = false;
      }
      if (!MaidValidate.email(f['email'].value)) {
        MaidUI.showError(f['email'].closest('.form-group'), '请填写有效的电邮'); ok = false;
      }
      if (!MaidValidate.nonEmpty(f['ssm_number'].value)) {
        MaidUI.showError(f['ssm_number'].closest('.form-group'), '请填写 SSM 号码'); ok = false;
      }
      if (getChecked('coverage_areas').length === 0) {
        MaidUI.showError(form.querySelector('[data-group="coverage_areas"]'), '请至少选择一个区域'); ok = false;
      }
      if (getChecked('services_offered').length === 0) {
        MaidUI.showError(form.querySelector('[data-group="services_offered"]'), '请至少选择一个服务'); ok = false;
      }
      if (!f['monthly_volume'].value) {
        MaidUI.showError(f['monthly_volume'].closest('.form-group'), '请选择月承接量'); ok = false;
      }
      if (!f['preferred_model'].value) {
        MaidUI.showError(f['preferred_model'].closest('.form-group'), '请选择合作模式'); ok = false;
      }
      return ok;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) return;

      const f = form.elements;
      const data = {
        center_name: f['center_name'].value.trim(),
        contact_name: f['contact_name'].value.trim(),
        contact_phone: f['contact_phone'].value.trim(),
        email: f['email'].value.trim(),
        ssm_number: f['ssm_number'].value.trim(),
        coverage_areas: getChecked('coverage_areas'),
        services_offered: getChecked('services_offered'),
        monthly_volume: f['monthly_volume'].value,
        preferred_model: f['preferred_model'].value,
        remarks: f['remarks'].value.trim()
      };

      MaidUI.setLoading(submitBtn, true);
      const result = await window.submitForm('partner_app', data);
      MaidUI.setLoading(submitBtn, false);

      if (result.success) {
        formCard.style.display = 'none';
        thankYou.style.display = 'block';
        window.scrollTo({ top: thankYou.offsetTop - 80, behavior: 'smooth' });
      } else {
        alert('提交失败,请直接 WhatsApp 我们。');
      }
    });
  });
})();
