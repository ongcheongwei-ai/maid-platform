# 新山钟点女佣对接平台 — MVP

> Lead aggregator MVP。纯静态前端 + Google Apps Script 后端 + GitHub Pages 部署。
>
> 目标:用最低成本验证商业模式,先上线收集真实询问 + 合作中心。

---

## 文件结构

```
.
├── index.html              首页
├── services.html           服务介绍
├── how-it-works.html       使用流程
├── request.html            用户填表(核心转化)
├── partner.html            女佣中心合作申请
├── contact.html            联系我们
├── css/
│   └── style.css           主样式(温暖橙 + 深绿)
├── js/
│   ├── main.js             共用:导航、WhatsApp 链接、提交工具、验证
│   ├── i18n.js             中英文切换
│   ├── form-request.js     用户填表逻辑
│   ├── form-partner.js     合作申请逻辑
│   └── form-contact.js     联系表单逻辑
├── apps-script/
│   └── code.gs             后端 API(Google Apps Script)
├── .nojekyll               让 GitHub Pages 不忽略 _ 前缀文件
└── README.md
```

---

## 部署清单(总耗时约 25 分钟)

### 第一步:Google Sheet + Apps Script(15 分钟)

1. **创建 Google Sheet**
   - 到 [sheets.new](https://sheets.new) 创建新表格
   - 命名为「Maid Platform Database」
   - 从 URL 复制 Sheet ID:
     `https://docs.google.com/spreadsheets/d/【这一串就是 SHEET_ID】/edit`

2. **配置 Apps Script**
   - 在 Sheet 中点 [扩展 / Extensions] → [Apps Script]
   - 删除默认 `myFunction()` 代码
   - 复制 `apps-script/code.gs` 全部内容贴上去
   - 替换文件第一行的 `SHEET_ID = 'YOUR_SHEET_ID_HERE'` 为实际 Sheet ID
   - (选填)填入 `NOTIFY_EMAIL` 接收新 lead 邮件提醒
   - 点 [Save] 保存

3. **初始化 sheet(自动建 3 个表 + 表头)**
   - 在 Apps Script 编辑器顶部下拉选 `setupSheets`
   - 点 [Run]
   - 第一次会要求授权,允许即可
   - 跑完回到 Sheet,3 个 tab 已自动建好

4. **部署 Web app**
   - 右上角 [Deploy] → [New deployment]
   - 齿轮图标选 [Web app]
   - 设置:
     - Description: `Maid Platform API`
     - Execute as: **Me**(你的 Google 账户)
     - Who has access: **Anyone**(必须,前端才能匿名 POST)
   - 点 [Deploy] → 复制 Web app URL(以 `https://script.google.com/macros/s/.../exec` 结尾)

> **改了代码要重新部署?**
> 修改后:[Deploy] → [Manage deployments] → 编辑现有部署 → version 选 New version → Deploy。

### 第二步:配置前端(5 分钟)

打开 `js/main.js`,改这三行:

```javascript
window.APPS_SCRIPT_URL = 'YOUR_DEPLOYED_APPS_SCRIPT_URL';   // ← 第一步拿到的 Web app URL
window.WHATSAPP_NUMBER = '60123456789';                      // ← 真实号码,纯数字带国码
window.CONTACT_EMAIL = 'hello@example.com';                  // ← 你的运营邮箱
```

可选:在 6 个 HTML 文件里搜 `hello@example.com` 替换为真实邮箱(footer 显示用)。

### 第三步:推送到 GitHub Pages(5 分钟)

```bash
cd maid-platform
git init
git add .
git commit -m "init: maid platform MVP"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<repo-name>.git
git push -u origin main
```

到 GitHub repo:
- [Settings] → [Pages]
- Source: Deploy from a branch
- Branch: `main`,目录 `/` (root)
- Save

等 1–2 分钟,访问 `https://<用户名>.github.io/<repo-name>` 即可。

### (选)第四步:绑定自定义域名

1. 在 Namecheap / Cloudflare 买域名(`.com` 约 RM 50/年)
2. DNS 设置:
   - A 记录指向 GitHub Pages IP:
     `185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153`
   - 或 CNAME `www` 指向 `<用户名>.github.io`
3. GitHub Pages → Custom domain 填入域名 → Save
4. 勾选 Enforce HTTPS(等证书签发,通常 < 30 分钟)

---

## 测试清单

部署后用真实手机走一遍:

- [ ] 首页加载顺畅,所有图片/SVG 显示
- [ ] 点 logo / 导航菜单跳转正确
- [ ] 中英文切换可用,刷新后语言保持
- [ ] 移动端汉堡菜单可开关
- [ ] FAQ 折叠展开可用
- [ ] 服务页 [咨询此服务] 跳到填表页且预选服务类型
- [ ] 用户填表:第一步必选项校验、下一步可走、第二步号码校验
- [ ] 用户填表:故意填假资料提交,Sheet 收到记录
- [ ] 合作申请:必填校验、多选保存为逗号分隔
- [ ] 联系表单:邮箱格式校验、内容长度校验
- [ ] 三个表单提交后都跳转感谢页(不刷新)
- [ ] WhatsApp 浮动按钮在 6 页都显示且能点开
- [ ] Footer 联系方式显示真实邮箱

---

## 数据维护

进 Google Sheet 处理 lead:

- **User_Leads**:每天检查,改 `status` 栏(未联系 → 已派 → 成交 / 流失);`assigned_partner` 写分配给哪个中心;`follow_up_notes` 写跟进记录
- **Partner_Applications**:审核 SSM、电访,改 `status` 栏(待审核 → 已合作 / 已拒绝)
- **Contact_Forms**:每天回 1–2 次

---

## 下一步迭代(MVP 上线后)

- [ ] Google Analytics(GA4)埋点
- [ ] Facebook Pixel(投广告时需要)
- [ ] Tawk.to 在线聊天(免费)
- [ ] 增加客户案例 / 评价展示区块
- [ ] 写一篇 blog,SEO 长尾词:「新山大扫除推荐」「JB 月嫂哪家好」
- [ ] 把 SHEET_ID 拆到 Apps Script 的 PropertiesService,避免代码 hard-code
- [ ] 用 reCAPTCHA v3 防 spam(非紧急)

---

**记住:这是 MVP,目标是上线收集真实数据,不是完美。**
