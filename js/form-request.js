// ============================================
// 用户填表(request.html)— 两步骤表单
// ============================================
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('request-form');
    if (!form) return;

    const step1 = form.querySelector('[data-step="1"]');
    const step2 = form.querySelector('[data-step="2"]');
    const dot1 = document.querySelector('.dot-1');
    const dot2 = document.querySelector('.dot-2');
    const nextBtn = form.querySelector('#btn-next');
    const backBtn = form.querySelector('#btn-back');
    const submitBtn = form.querySelector('#btn-submit');
    const formCard = document.getElementById('form-card');
    const thankYou = document.getElementById('thank-you');

    function showStep(n) {
      step1.style.display = n === 1 ? 'block' : 'none';
      step2.style.display = n === 2 ? 'block' : 'none';
      if (dot1) dot1.classList.toggle('done', n === 2);
      if (dot1) dot1.classList.toggle('active', n === 1);
      if (dot2) dot2.classList.toggle('active', n === 2);
      window.scrollTo({ top: formCard.offsetTop - 80, behavior: 'smooth' });
    }

    function validateStep1() {
      const groups = step1.querySelectorAll('.form-group');
      let ok = true;
      groups.forEach(g => MaidUI.clearError(g));

      const required = ['service_type', 'property_type', 'property_size', 'timing'];
      required.forEach(name => {
        const checked = form.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
          const group = step1.querySelector(`[data-group="${name}"]`);
          MaidUI.showError(group, '请选择一项');
          ok = false;
        }
      });
      return ok;
    }

    function validateStep2() {
      let ok = true;
      step2.querySelectorAll('.form-group').forEach(g => MaidUI.clearError(g));

      const name = form.elements['name'].value.trim();
      const phone = form.elements['whatsapp'].value.trim();
      const location = form.elements['location'].value;

      if (!MaidValidate.lengthRange(name, 2, 30)) {
        MaidUI.showError(form.elements['name'].closest('.form-group'), '姓名 2–30 字');
        ok = false;
      }
      if (!MaidValidate.internationalPhone(phone)) {
        MaidUI.showError(form.elements['whatsapp'].closest('.form-group'), '请填写有效的电话号码(7–15 位数字)');
        ok = false;
      }
      if (!MaidValidate.nonEmpty(location)) {
        MaidUI.showError(form.elements['location'].closest('.form-group'), '请选择服务地点');
        ok = false;
      }
      return ok;
    }

    nextBtn.addEventListener('click', () => {
      if (validateStep1()) showStep(2);
    });
    backBtn.addEventListener('click', () => showStep(1));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep2()) return;

      const data = {
        service_type: form.querySelector('input[name="service_type"]:checked')?.value || '',
        property_type: form.querySelector('input[name="property_type"]:checked')?.value || '',
        property_size: form.querySelector('input[name="property_size"]:checked')?.value || '',
        timing: form.querySelector('input[name="timing"]:checked')?.value || '',
        name: form.elements['name'].value.trim(),
        whatsapp: form.elements['country_code'].value + form.elements['whatsapp'].value.trim().replace(/\D/g, '').replace(/^0+/, ''),
        location: form.elements['location'].value,
        remarks: form.elements['remarks'].value.trim()
      };

      MaidUI.setLoading(submitBtn, true);
      const result = await window.submitForm('user_lead', data);
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
