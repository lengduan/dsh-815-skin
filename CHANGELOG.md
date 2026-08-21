# 更新日志

## 0.1.8 — 2026-08-21

适配 DSH 新版 Composer 输入区：草稿文字改在 `backdrop` 层渲染，输入框文字不再偏浅/被遮挡。

- DSH 更新后输入区改为「透明 `textarea` + `backdrop` 层画字」，草稿正文字符由 `[data-input-backdrop]` 绘制，颜色取 `--dsw-alias-label-primary`（暗色主题解析为浅色）
- 皮肤原先只给 `textarea/input` 设深色，且把 textarea 背景写死成宣纸浅色 `#f3ead4`，形成不透明层盖住 backdrop 里的草稿字
- 本次修复：textarea 背景改回透明（只留深墨 `caret`）；给 `[data-composer-card] [data-input-backdrop]` 显式压回墨色 `#1c1a14`；slash 命令 token 与引用 chip 在浅纸底压成暗金/深橄榄

## 0.1.7 — 2026-08-21

为了减少侧边栏对工作区历史空间占用，决定移除这一块图片的显示。

## 0.1.6 — 2026-08-16

斜杠引 skills 的候选菜单换回深色不透明底 + 浅色文字，浮层文字不再糊在油画底上。

- 输入座 overlay 浮层（`role='listbox'` 斜杠菜单与 popupSelect 卡片）重绑 token：`--dsw-specific-menu` 改为不透明 `#2c2e24`，文字换回奶白/铜灰浅色
- 浮层边框收一道铜色细线，与对话框、普通菜单取一致外表

## 0.1.5 — 2026-08-15

Cordis 底栏插件面板不再透出油画。

- `[data-slot='sidebar.footer.action']` 内 `--dsw-alias-bg-base` 改为实色 `#24261c`

## 0.1.4 — 2026-08-15

中文年份按位读，不当大数。

- 展签与文案：`公元一千九百四十五年` 改为 `公元一九四五年`
- 同步 `NOTICE` / README / `skin.json` / `package.json` 画名读法

## 0.1.3 — 2026-08-15

史料展签、标题栏铜金收边与宣纸输入框展示层强化。

## 0.1.2 — 2026-08-15

npm README 预览图改用 GitHub 绝对地址。

## 0.1.1 — 2026-08-15

展签分行；npm 包带 README 预览图。

## 0.1.0 — 2026-08-15

首发：`@lengduan/dsh-client-ui-skin-815`，Web GUI 1945 终战史料皮。
