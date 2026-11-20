# procedures inbox

- 2026-11-11 DSH 皮肤改动要在真实 GUI 验证时：仅改仓库 + `pnpm build` 不够，必须把 `lib/client.js`（及 map）拷到 `%USERPROFILE%\.dsh\profiles\desktop\node_modules\@lengduan\dsh-client-ui-skin-815\lib\` 再刷新页面；判据是两边 SHA256 一致。客户端 GUI 加载的是这个安装副本，不是仓库目录。
- 2026-11-11 DSH 客户端 GUI 的 browser_e2e 实例空闲约十来分钟会自行关闭，后续调用报「浏览器尚未启动」；重新 start + mkcookie 注入 cookie 后再导航即可，不需要重启客户端。
- 2026-11-20 要在真实 GUI 里定位 DSH 内置插件的面板（如「会话数据诊断」）：先在首页卡片点入口（`[data-sidebar-right-guide-entry="<某 id>"]`），面板根节点会带宿主手写的 `aria-label`（A 级锚点）；内置插件没有源文件可读，但它的 i18n 目录与 `window.__ModuleLoader__.load({id:...})` 都在 `app.asar` 里，用 `IndexOf` 全文搜中文文案比 glob/grep 快得多（grep 工具直接扫 200MB+`app.asar` 会卡死超时）。
- 2026-11-20 dsh-deep-ptc-mode 的 `.dpt-cc[data-archived]` 会把卡底设成 transparent（会话结束后卡片即进此态），奶油字直接压油画；补一层半透明橄榄底，别用 opacity 继续压。
- 2026-11-20 dsh-deep-ptc-mode 的 `.dpt-pv` / `.dpt-cc` 自带一层 `--cc-*` 调色板（按浅色宿主取值），皮肤重绑 `--dsw-alias-label-primary` 后会让主按钮「底取 --cc-ink、字取 --cc-surface」变成奶油底白字（1.14:1）。修法：在 `.dpt-pv` 根上重绑 `--cc-*` 到深墨档，不要逐条改 `.dpt-cc-btn`。
- 2026-11-14 用 `tools.write` 整文件覆写源码时踩了两次截断：`vj815.module.css` 从 1965 行变 964 行、`CHANGELOG.md` 从 489 行变 215 行。改既有文件一律用 `edit` 做定点替换；写入后必须核对行数（`git diff --stat`），提交前 `git show --numstat` 确认没有意外删除。
