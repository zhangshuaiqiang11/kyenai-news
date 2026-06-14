# KyenAI SEO 自动驾驶 Skill 设计

## 目标

创建可调用的中文 `$kyenai-seo-autopilot` Skill。默认服务 KyenAI，同时允许通过参数覆盖站点、项目和服务器。

## 能力

- 诊断关键词、页面意图、内容库存和关键词蚕食。
- 查询关键词排名并区分专业数据与浏览器抽样。
- 挖掘 AI coding 资讯和长尾机会。
- 更新旧文或创建 answer-first 新文。
- 执行事实、来源、信息增益、去 AI 味和拼写校验。
- 检查 SSR、meta、canonical、schema、robots、sitemap 和内链。
- 测试通过后自动部署并验证线上结果。

## 边界

- 不接入或授权 GSC。
- 可以分析用户提供的 GSC 导出数据。
- 不承诺排名第一。
- 不伪造作者经验、来源、外链或品牌合作。
- 密码和 token 不写入 Skill 或仓库。

## 默认生产参数

- 站点：`https://www.kyenai.com`
- 本地项目：由环境变量或 Skill 参数指定，不写入仓库
- 服务器：由 Skill 参数指定，不写入仓库
- 服务器项目：`/opt/seo/app`（默认路径，不含 IP 或账号）

## 验收

- Skill 结构通过官方 quick validator。
- 拼写脚本测试通过，并能发现/修复 Condex、Copolit、Cloude。 <!-- seo-spellcheck: ignore -->
- Skill 内无密码、OAuth token、client secret 或私钥。
- 默认部署流程排除生产环境和 secret 文件。
