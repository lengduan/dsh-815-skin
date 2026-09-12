# 更新日志

## 0.1.13 — 2026-09-12

「定时任务」侧栏入口对齐宿主按钮样式，并修正浅底卡片上的分裂按钮文字色。

- dsh-timer-agent 的侧栏入口是插件自绘 DOM（透明导航行），插在「新会话」与 mneme portal 的「记忆」按钮之间，后两者都是宿主 `.newSession` 观感，只有它观感断裂；现按其标记属性 `data-dsh-timeragent-entry` 注入同款盒模型（38px 高 / 12px 圆角 / 0.5px 铜边 / elevated 底 / 内容居中 / 14px 字），hover 与 `data-active` 各补一条，收起态对齐宿主 rail 的 36×36 图标位并隐藏文案
- 该覆盖用属性选择器而非插件的 hash 类名，不修改插件源码；皮肤停用即整体失效
- 浅色主题下交付文件卡（`present`）里的「打开 / 展开」分裂按钮底色取皮肤全局 `button-floating-fill`（深橄榄），文字却被 `label-primary` 压成墨色，深底墨字只有 1.8:1；现把两段按钮文字单独拿回奶油色，箭头段 disabled 态仍交给宿主

## 0.1.12 — 2026-09-12

页头「在本地打开」分裂按钮对齐页头样式。

- 官方 ui-open-in-app 的边框与分裂分隔线都取 `--dsw-alias-border-l4`，皮肤没定义该 token（浅色主题下回落到浅灰 hairline），在暗底上完全看不见；现把 l4 指向 `l2`，与「对话管理 / 删除本对话」同款铜金边，分隔线随 chevron 自身的 `border-left` 一同显形
- 胶囊高度 28px → 32px、圆角 14px → 18px，与旁边按钮等高同圆角；主段与箭头段的左右内边距各放宽 4px
- 宿主按应用下发的 PNG 图标换成皮肤自绘的线性文件夹图标（`::before` + mask 描出，颜色跟随按钮文字，hover / 报错态一起变）

## 0.1.11 — 2026-09-12

浅色主题下的文字对比度与宽表格横向溢出。

- 交付文件卡（`present`）与 todo 面板的底色取自宿主浅色主题（`--dsw-static-neutral-50` / `--dsw-specific-tip`），皮肤全局的奶油色 `label-primary` 落在浅底上几乎不可见；改在 `body[data-dsh-815]:not([data-ds-dark-theme])` 下把这两类容器的文字压回墨色，暗色主题不受影响
- 宽表格（渲染器的 `md-table-wide` 钩子）宿主让它 breakout 到整个对话列宽、且非 hover/focus 时 `overflow-x: hidden`，皮肤的气泡边框被穿透、右侧被对话列裁掉；现收回气泡内容盒内并常驻横向滚动
- 该表格规则必须写成 `:global(.md-table-wide)`：CSS Modules 会把裸类名改写成 hash 名，与宿主全局类名对不上会静默失效

## 0.1.10 — 2026-09-04

右下角展签层级下调，不再遮挡输入座等应用 UI。

- 展签 `z-index` 由 30 降到 0，置于应用外壳（`#root` z-index 1）之下、背景遮罩（`body::before` z-index 0）之上
- 输入框等不透明 UI 可正常盖住展签；应用透明间隙处展签仍可见
- 展签本就有 `pointer-events: none`，此次主要消除视觉遮挡

## 0.1.9 — 2026-08-22

浅底/弹层对比与主题色对齐：目标条、对话管理、插件推荐、设置下拉不再糊在错误底色上。

- 输入座「进行中的目标」浅纸底压成暗铜；深色斜杠浮层仍用浅铜
- 对话管理弹层与右侧详情列改为不透明橄榄底，不再透出后面的字
- 插件推荐面板覆盖 GitHub 冷色，改暖橄榄底 + 铜金链
- 设置页原生 select：闭合条橄榄奶油字，option 宣纸墨色；菜单 token / listbox 实色

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
