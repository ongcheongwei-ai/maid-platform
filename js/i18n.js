// ============================================
// i18n — 中英文文案切换
// ============================================
(function () {
  const translations = {
    zh: {
      // Nav
      nav_home: '首页',
      nav_services: '服务',
      nav_how: '使用流程',
      nav_partner: '中心合作',
      nav_contact: '联系我们',

      // Common
      cta_inquiry: '立即填表咨询',
      cta_inquiry_short: '免费咨询',
      cta_learn_more: '了解服务',
      cta_back_home: '返回首页',
      cta_whatsapp_us: '立即 WhatsApp 我们',

      // Footer
      footer_about_title: '关于我们',
      footer_about_desc: '新山钟点女佣对接平台,专注于为家庭对接可靠的女佣中心。',
      footer_quick_title: '快速链接',
      footer_contact_title: '联系方式',
      footer_hours: '营业时间:周一至周日 9am – 9pm',
      footer_rights: '© 2026 新山钟点女佣对接平台. All rights reserved.',

      // Home
      hero_title: '新山钟点女佣对接平台',
      hero_subtitle: '一站式对接可靠女佣中心 · 免费咨询 · 1–24 小时内回复',
      hero_trust_1: '筛选过的合作中心',
      hero_trust_2: '完全免费使用',
      hero_trust_3: '隐私受保障',

      pain_eyebrow: '常见困扰',
      pain_title: '找钟点女佣,你是不是也遇到过这些?',
      pain_1_title: '找了几家中心都没回讯息?',
      pain_1_desc: '一家家私讯太花时间,等回复又焦虑。',
      pain_2_title: '报价差很大,不知道哪个合理?',
      pain_2_desc: '没有参考价格,担心被开高价。',
      pain_3_title: '网上看评论太多,选择困难?',
      pain_3_desc: '资讯太杂,反而不知道该信谁。',

      steps_eyebrow: '我们怎么帮你',
      steps_title: '3 步骤,搞定钟点女佣',
      step_1_title: '填写需求',
      step_1_desc: '在网站填一份简单表单(2 分钟),告诉我们你需要什么服务。',
      step_2_title: '我们对接合作中心',
      step_2_desc: '我们会根据你的需求,匹配 2–3 家筛选过的合作中心。',
      step_3_title: '中心直接报价上门',
      step_3_desc: '中心 WhatsApp 你比较报价,选最满意的一家直接安排。',

      services_eyebrow: '我们涵盖的服务',
      services_title: '从日常清洁到月嫂,一次对接',
      services_view_all: '查看完整服务列表',

      promise_eyebrow: '我们的承诺',
      promise_title: '为什么家庭都信任我们',
      promise_1_title: '筛选过的合作中心',
      promise_1_desc: '只对接有营业执照、口碑好的女佣中心。',
      promise_2_title: '免费使用',
      promise_2_desc: '用户完全免费,我们向中心收对接费,不让你多付。',
      promise_3_title: '隐私保障',
      promise_3_desc: '资料不会被乱发,只转给筛选过的合作伙伴。',
      promise_4_title: '持续跟进',
      promise_4_desc: '服务后我们会询问你的体验,有问题帮你协调。',

      faq_title: '常见问题',
      faq_eyebrow: '你想知道的我们都答',

      cta_band_title: '准备好让家务变简单了吗?',
      cta_band_desc: '只需 2 分钟填表,我们帮你对接合适的合作中心。',

      // Services page
      services_page_title: '我们的服务',
      services_page_desc: '从日常清洁到月嫂陪月,涵盖新山家庭主要钟点服务需求。所有价格仅供参考,实际由合作中心根据需求报价。',

      // How It Works
      how_page_title: '使用流程',
      how_page_desc: '从填表到上门,完整流程一次看清楚。',

      // Request page
      request_page_title: '免费咨询填表',
      request_page_desc: '填完后,我们会在 1–24 小时内对接合适的合作中心,中心会 WhatsApp 你。',

      step_label_1: '服务需求',
      step_label_2: '联系方式',

      label_service: '需要什么服务?',
      label_property: '你的住所类型?',
      label_size: '大概面积或房间数?',
      label_timing: '期望服务时间?',
      label_name: '你的姓名(称呼即可)',
      label_whatsapp: 'WhatsApp 号码',
      label_location: '服务地点 / 区域',
      label_remarks: '其他备注(选填)',
      ph_name: '例:陈太',
      ph_remarks: '告诉我们你的特殊需求,例如:有宠物、有过敏原、需要特定工具等',
      btn_next: '下一步',
      btn_back: '上一步',
      btn_submit: '提交咨询',
      btn_submitting: '提交中…',

      thank_title: '我们已收到你的需求',
      thank_desc: '我们会在 1–24 小时内联系你。同时,你可以加我们 WhatsApp 直接咨询。',

      // Partner page
      partner_page_title: '女佣中心合作申请',
      partner_page_desc: '让我们帮你带来精准客源,你专注做好服务。',
      partner_value_1: '精准 lead',
      partner_value_1_desc: '用户填表已说明需求,不浪费时间。',
      partner_value_2: '弹性收费',
      partner_value_2_desc: '按 lead 付费 / 成交分成,二选一。',
      partner_value_3: '共同成长',
      partner_value_3_desc: '一起把新山钟点女佣行业做得更专业。',
      partner_value_4: '简单透明',
      partner_value_4_desc: '每月对账,不做隐藏收费。',

      partner_req_title: '合作条件',
      partner_form_title: '申请合作',
      thank_partner_title: '我们已收到你的合作申请',
      thank_partner_desc: '我们会在 2–3 个工作天内联系你。',

      // Contact
      contact_page_title: '联系我们',
      contact_page_desc: '有任何问题、合作意向或反馈,都欢迎联系。',
      contact_whatsapp_title: 'WhatsApp',
      contact_email_title: '电邮',
      contact_hours_title: '营业时间',
      contact_form_title: '简单留言',

      thank_contact_title: '我们已收到你的留言',
      thank_contact_desc: '我们会尽快回复你。'
    },

    en: {
      // Nav
      nav_home: 'Home',
      nav_services: 'Services',
      nav_how: 'How It Works',
      nav_partner: 'Partner With Us',
      nav_contact: 'Contact',

      // Common
      cta_inquiry: 'Get a Free Quote',
      cta_inquiry_short: 'Get Started',
      cta_learn_more: 'View Services',
      cta_back_home: 'Back to Home',
      cta_whatsapp_us: 'Chat on WhatsApp',

      // Footer
      footer_about_title: 'About',
      footer_about_desc: 'JB Part-Time Maid Match — connecting families with trusted maid agencies in Johor Bahru.',
      footer_quick_title: 'Quick Links',
      footer_contact_title: 'Contact',
      footer_hours: 'Hours: Mon – Sun, 9am – 9pm',
      footer_rights: '© 2026 JB Part-Time Maid Match. All rights reserved.',

      // Home
      hero_title: 'JB Part-Time Maid Match',
      hero_subtitle: 'Connecting you with trusted maid agencies in Johor Bahru. Free, fast, no hassle.',
      hero_trust_1: 'Pre-screened agencies',
      hero_trust_2: 'Free for users',
      hero_trust_3: 'Privacy protected',

      pain_eyebrow: 'Common frustrations',
      pain_title: 'Sound familiar?',
      pain_1_title: 'Messaged 5 agencies, no replies?',
      pain_1_desc: 'Hunting one-by-one wastes time and patience.',
      pain_2_title: 'Quotes vary wildly. What is fair?',
      pain_2_desc: 'No reference, easy to overpay.',
      pain_3_title: 'Too many reviews online?',
      pain_3_desc: 'Mixed signals make picking impossible.',

      steps_eyebrow: 'How we help',
      steps_title: '3 simple steps',
      step_1_title: 'Tell us what you need',
      step_1_desc: 'Fill a 2-minute form on this site.',
      step_2_title: 'We match agencies',
      step_2_desc: 'We pick 2–3 vetted agencies that fit your needs.',
      step_3_title: 'They quote, you choose',
      step_3_desc: 'Agencies WhatsApp you with quotes — pick whichever you like.',

      services_eyebrow: 'Services we cover',
      services_title: 'From regular cleaning to confinement nannies',
      services_view_all: 'View full service list',

      promise_eyebrow: 'Our promise',
      promise_title: 'Why families trust us',
      promise_1_title: 'Vetted partners',
      promise_1_desc: 'Only agencies with valid licences and good track record.',
      promise_2_title: 'Free for users',
      promise_2_desc: 'You never pay extra. Agencies pay us a referral fee.',
      promise_3_title: 'Privacy first',
      promise_3_desc: 'Your details only go to vetted partners — never sold.',
      promise_4_title: 'Follow-up support',
      promise_4_desc: 'We check in after service and help resolve issues.',

      faq_title: 'Frequently Asked Questions',
      faq_eyebrow: 'Everything you want to know',

      cta_band_title: 'Ready to make housework simpler?',
      cta_band_desc: 'Two minutes to fill the form. We do the matching for you.',

      // Services page
      services_page_title: 'Our Services',
      services_page_desc: 'Covering the main needs of JB families — from weekly cleans to confinement care. Prices shown are reference; agencies quote based on your actual needs.',

      // How It Works
      how_page_title: 'How It Works',
      how_page_desc: 'From form to first visit — the full picture.',

      // Request page
      request_page_title: 'Free Inquiry Form',
      request_page_desc: 'After you submit, we will match you with the right agencies within 1–24 hours. They will contact you on WhatsApp.',

      step_label_1: 'Your needs',
      step_label_2: 'Contact info',

      label_service: 'What service do you need?',
      label_property: 'Property type',
      label_size: 'Size / number of rooms',
      label_timing: 'When do you need it?',
      label_name: 'Your name (how should we address you)',
      label_whatsapp: 'WhatsApp number',
      label_location: 'Service area',
      label_remarks: 'Anything else (optional)',
      ph_name: 'e.g. Mrs. Tan',
      ph_remarks: 'Tell us special needs — pets, allergies, specific tools, etc.',
      btn_next: 'Next',
      btn_back: 'Back',
      btn_submit: 'Submit Inquiry',
      btn_submitting: 'Submitting…',

      thank_title: 'We have received your request',
      thank_desc: 'We will get in touch within 1–24 hours. You can also reach us directly on WhatsApp.',

      // Partner page
      partner_page_title: 'Partner With Us',
      partner_page_desc: 'Let us bring you qualified leads. You focus on great service.',
      partner_value_1: 'Quality leads',
      partner_value_1_desc: 'Users tell us their needs — no time wasted.',
      partner_value_2: 'Flexible pricing',
      partner_value_2_desc: 'Pay-per-lead or revenue share — your choice.',
      partner_value_3: 'Grow together',
      partner_value_3_desc: 'Helping the JB part-time maid market level up.',
      partner_value_4: 'Transparent',
      partner_value_4_desc: 'Monthly settlement, no hidden fees.',

      partner_req_title: 'Partner Requirements',
      partner_form_title: 'Apply to Partner',
      thank_partner_title: 'Application received',
      thank_partner_desc: 'We will reach out within 2–3 working days.',

      // Contact
      contact_page_title: 'Contact Us',
      contact_page_desc: 'Questions, partnership, feedback — we listen.',
      contact_whatsapp_title: 'WhatsApp',
      contact_email_title: 'Email',
      contact_hours_title: 'Hours',
      contact_form_title: 'Quick Message',

      thank_contact_title: 'Message received',
      thank_contact_desc: 'We will get back to you shortly.'
    }
  };

  let currentLang = localStorage.getItem('lang') || 'zh';

  function applyTranslations() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-Hant' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = translations[currentLang][key];
      if (txt !== undefined) el.textContent = txt;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      const txt = translations[currentLang][key];
      if (txt !== undefined) el.placeholder = txt;
    });
    document.querySelectorAll('.lang-switch button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  function switchLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
  }

  window.MaidI18n = {
    apply: applyTranslations,
    switch: switchLang,
    get current() { return currentLang; },
    t: (key) => translations[currentLang][key] || key
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-switch button').forEach(btn => {
      btn.addEventListener('click', () => switchLang(btn.dataset.lang));
    });
    applyTranslations();
  });
})();
