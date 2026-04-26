// ============================================
// 联系表单(contact.html)
// ============================================
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('#btn-submit');
    const formCard = document.getElementById('form-card');
    const thankYou = document.getElementById('thank-you');

    function validate() {
      let ok = true;
      form.querySelectorAll('.form-group').forEach(g => MaidUI.clearError(g));
      const f = form.elements;

      if (!MaidValidate.nonEmpty(f['name'].value)) {
        MaidUI.showError(f['name'].closest('.form-group'), '请填写姓名'); ok = false;
      }
      if (!MaidValidate.email(f['email'].value)) {
        MaidUI.showError(f['email'].closest('.form-group'), '请填写有效的电邮'); ok = false;
      }
      if (!MaidValidate.nonEmpty(f['inquiry_type'].value)) {
        MaidUI.showError(f['inquiry_type'].closest('.form-group'), '请选择询问类型'); ok = false;
      }
      if (!MaidValidate.lengthRange(f['message'].value, 10, 1000)) {
        MaidUI.showError(f['message'].closest('.form-group'), '内容请填写 10–1000 字'); ok = false;
      }
      return ok;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) return;

      const f = form.elements;
      const data = {
        name: f['name'].value.trim(),
        email: f['email'].value.trim(),
        inquiry_type: f['inquiry_type'].value,
        message: f['message'].value.trim()
      };

      MaidUI.setLoading(submitBtn, true);
      const result = await window.submitForm('contact', data);
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
