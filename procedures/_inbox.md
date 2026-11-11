# procedures inbox

- 2026-11-11 DSH 皮肤改动要在真实 GUI 验证时：仅改仓库 + `pnpm build` 不够，必须把 `lib/client.js`（及 map）拷到 `%USERPROFILE%\.dsh\profiles\desktop\node_modules\@lengduan\dsh-client-ui-skin-815\lib\` 再刷新页面；判据是两边 SHA256 一致。客户端 GUI 加载的是这个安装副本，不是仓库目录。
- 2026-11-11 DSH 客户端 GUI 的 browser_e2e 实例空闲约十来分钟会自行关闭，后续调用报「浏览器尚未启动」；重新 start + mkcookie 注入 cookie 后再导航即可，不需要重启客户端。
