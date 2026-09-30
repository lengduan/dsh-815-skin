# 更新日志

## 0.1.36 — 2026-09-30

修侧栏 mneme「记忆」按钮右上角冲突计数徽章的文字与底色过近（用户报），按用户要求把底色换成更鲜艳的红、文字换成高对比色。成因是插件用两个宿主 token 拼配色，而皮肤改写了其中一个。

- 插件自绘便携样式（`@modusensus/dsh-mneme/lib/client.js:1416`）：`.mneme-entrybadge{…;background:var(--dsw-alias-state-error,#c33);color:var(--dsw-alias-bg-layer-1,#fff);…}` —— 底走宿主 `state-error`，字走皮肤已改写的 `--dsw-alias-bg-layer-1`（深橄榄 `rgba(28, 30, 22, 0.78)`，`vj815.module.css:23`），深橄榄字压在暗红底上
- 本机 `:3080` 实测修前：底 `rgb(204, 51, 51)`（`#cc3333`）、字合成 `rgb(67, 35, 28)`，对比度 **2.73:1**（10.5px / 600 的小字）
- 修法：皮肤在徽章自身把这两条钉死 —— 底 `#dc2626`（比 `#cc3333` 更饱和、更亮）、字 `#ffffff`；插件在同一元素上的 2px 外环（`box-shadow` 取 `bg-layer-1`，深橄榄）保持不动，仍把徽章从按钮底上托开
- 修后实测：底 `rgb(220, 38, 38)`、字 `rgb(255, 255, 255)` = **4.83:1**；几何未变（`x244 y118 w24 h16`，与 0.1.34 实测一致），两位数完整显示
- `pnpm test` 5 passed（`tests/apply.spec.ts`）

## 0.1.35 — 2026-09-30

修设置弹框左侧 tab 的选中态（用户报）：选中的那一项底为近白、字为奶油，几乎读不出来。根因是皮肤给这两个 token 定的锚点已不在弹框的祖先链上，不是配色取值问题。

- 宿主消费点：`ui-settings-general/src/client/SettingsRoot.module.css:163` 的 `.navCell.active` 取 `--dsw-specific-sidebar-nav-item-active`（hover 走 `:159` 的 `--dsw-specific-sidebar-nav-item-hover`），文字取 `--dsw-alias-label-primary`（皮肤值 `#f4ead6` 奶油）
- 皮肤旧锚点 `body[data-dsh-815] [data-slot='sidebar.settings'] [role='dialog'][aria-modal='true']` 在本机 `:3080` 实测命中 **0** 个 —— 弹框由 `SettingsRoot.tsx:67` 的 `createPortal(..., document.body)` 挂到 body 下，而 `[data-slot='sidebar.settings']` 只是侧栏底部的设置按钮行（全页该 slot 存在 1 个，但不在弹框祖先链上），token 因此一直回落到宿主的浅色主题值 `#ebeef2`
- 修法：锚点改为弹框自身的语义属性 `[role='dialog'][aria-modal='true'][data-shortcut-modal='settings']`（`data-shortcut-modal` 由 `SettingsRoot.tsx:70` 写死），不引用 CSS Module 的构建期 hash 前缀，宿主升级换 hash 也不会再失配；实测新锚点命中 1 个、旧锚点 0 个
- 修前实测（同一 active 节点，把 token 临时换回宿主浅色值做受控对照）：底 `rgb(235,238,242)` + 字 `rgb(244,234,214)` = **1.03:1**；修后底 `rgba(196,163,90,.32)` 合成 `rgb(87,78,48)` = **6.93:1**（hover token 口径合成 `rgb(58,56,37)` = 9.97:1；临时挂 `data-ds-dark-theme` 复测同为 6.93:1）
- `pnpm test` 5 passed（`tests/apply.spec.ts`）
- 同弹框内另有一处低对比**未改**：各模型卡的「删除」按钮 `#ec1313` on `rgb(36,38,28)` = 3.41:1（宿主写死的红色），本轮未动

## 0.1.34 — 2026-09-29

修侧栏 mneme「记忆」按钮两处（用户报）：图标与文案贴在一起没有间隔、右上角冲突计数的两位数字被裁掉一半。两条都来自插件自绘 DOM 与宿主类名拼接后的样式缺口，皮肤按值钉死，不改插件源码。

- 间隔：插件只给 `.mneme-topentry-native` 一句 `display:flex`（`@modusensus/dsh-mneme/lib/client.js:1315` 的 `.mneme-topentry{display:flex;flex-direction:column;position:relative}` 管的是外层容器），按钮自身没有 `gap`。本机 `:3080` 实测修前 `gap: 0px`，图标 `svg` 右边界与文案 `.mneme-topentry-label` 左边界同为 `133.5px`；同一行的宿主「新会话」按钮实测图标右 `123px` / 文案左 `129px`，即 **6px**。修法：皮肤给按钮补 `gap: 6px` 对齐宿主。修后实测图标右 `130.5px` / 文案左 `136.5px`，间隔 **6px**，内容组仍居中（中心 140px = 按钮中心）
- 徽章被裁：插件把冲突计数 `.mneme-entrybadge` 绝对定位成 `top:-3px; right:-3px`（`lib/client.js:1399`，`min-width:16px`，两位数即 24px 宽），而该按钮借了宿主的 `.newSession` 类名，连带继承 `overflow: hidden`。徽章越出按钮的部分因此被裁：修前实测按钮 `right 266 / top 120`，徽章 `right 268 / top 118`（rect `x244 y118 w24 h16`），右 2px 与上 2px 落进裁剪区，两位数只显示左半
- 修法：皮肤把该按钮的 `overflow` 放成 `visible`，徽章按插件原设计凸在角上完整显示。按钮内只有图标、文案与徽章，没有宿主 `.newSession` 用来做宽度动画的 `newSessionLabelMask`，所以放成可见没有副作用；徽章最远到 `x=269`，仍在 280px 侧栏内
- 修后实测：徽章右缘区间（`x=266`，此前被裁的 2px）`document.elementFromPoint` 命中徽章本体；展开态徽章与上方「新会话」按钮不重叠（徽章顶 118 > 新会话底 108）
- 收起态一并实测：按钮 36×36（`x10-46`），徽章 `x24-48`，徽章右缘 48 < 侧栏宽 56（`.sidebarCol` 为 `overflow:hidden`），同样不被裁；此态下徽章会盖住图标右上角约三分之一，是 36px 图标位放 24px 徽章的结构性结果（插件原设计如此），本轮未改
- `pnpm test` 5 passed（`tests/apply.spec.ts`）；仓库与 profile 两侧 `lib/client.js` sha256 一致（`3C9A59D8…`，本机验证态，`dsh plugin update` 会盖回）

## 0.1.33 — 2026-09-29

修任务看板卡片「删除」确认框整层透明、与背后执行 Prompt 文字重叠看不清（用户报）。根因是**弹层兜底规则漏了 `role='alertdialog'`**，不是宿主回归。

- 宿主 `._7D6uKa_modal { background: var(--dsw-alias-bg-base); … }`（任务看板删除确认框，`role='alertdialog'`）；皮肤 `:22` 把 `--dsw-alias-bg-base` 设为 `transparent` 好露油画，于是整层透出背后的详情正文
- 皮肤弹层实色兜底规则 `body[data-dsh-815] :is([role='dialog'], [role='menu'], …)` 里没有 `alertdialog`，对本框命中 0 条；同一插件里「未保存改动」确认框（`dsh-taskboard-discard-dialog`）同样是 `alertdialog`，一并漏掉
- 修法：把 `[role='alertdialog']` 补进该 `:is` 列表，其余取值不变
- 修前实测（本机 `:3080`，`getComputedStyle`）：`_7D6uKa_modal` 的 `background-color` = `rgba(0, 0, 0, 0)`，与背后正文同层叠加
- 修后实测：`background-color` = `rgb(36, 38, 28)`（不透明深橄榄），框内文字对底色 WCAG 对比度（自算，sRGB 线性化）—— 标题「删除任务」12.85:1、正文「确定删除…」9.54:1、「取消」12.85:1、「删除」15.34:1
- `pnpm test` 5 passed（`tests/apply.spec.ts`）

## 0.1.32 — 2026-09-29

接 0.1.31 的横向审计，修同批新增 token 的其余漏配：运行中蓝色文字与共享文字扫光、两张宿主浅底卡。

- A1–A3 运行中（「深度求索中，用时 …」）与共享文字扫光：宿主新增 `--dsw-alias-label-deep-diving` / `--dsw-alias-label-deep-diving-shimmer` / `--dsw-alias-label-shimmer`（`ui-theme/src/styles/design-platform.css:215/216/224` 浅色 = `color-mix(deepseek-500 70%, blue-950)`、`color-mix(deepseek-500 30%, blue-950)`、30% 透明黑扫光；`:330/331/339` 深色 = `color-mix(deepseek-450 55%, bluish-400)`、`color-mix(blue-300 65%, deepseek-400)`、45% 透明白），消费处 `ui-chat/src/client/chat/ChatView.module.css:121-122`（`.running` 把 shimmer 重绑成 deep-diving-shimmer 并把文字色取 deep-diving）与 `ui-primitives/src/TextShimmer.module.css:38`
  - 修前实测（本机 `:3080`，真实运行中行）：文字 `color(srgb .205 .367 .730)` = `rgb(52,94,186)`，同一行截图底色主色 `rgb(22,19,12)` → 按 WCAG 相对亮度 **≈3.1:1**；扫光 `rgba(0,0,0,.3)` 落在深底上不可见
  - 修法：皮肤 token 块直接取宿主**深色主题那套值** —— `--dsw-alias-label-deep-diving: #7d9ade`、`--dsw-alias-label-deep-diving-shimmer: #8abcfe`、`--dsw-alias-label-shimmer: rgba(255,255,255,.45)`
  - 修后实测：文字 `rgb(125,154,222)`，同一行底 `rgb(22,19,12)` → **6.67:1**；扫光计算值 `rgba(255,255,255,0.45)`
- A4 `schedule_create` 工具卡（`ui-schedule/src/client/ScheduleCreateCard.module.css:7/19/20`）：卡底写死 `--card-fill: var(--dsw-static-neutral-50)`（近白静态色），深色改写只挂 `body[data-ds-dark-theme]`（`:24-27`），皮肤跑浅色宿主主题下不命中 → 近白卡底配皮肤奶油 `label-primary`
  - 修法：按卡上宿主手写属性 `data-tool='schedule_create'`（`ScheduleCreateCard.tsx:53`）把 `--card-fill` / `--card-hover` 换成皮肤深橄榄 `#24261c` / `#2c2e24`；皮肤规则特异性 `(0,2,1)` 高于宿主 `.card` 的 `(0,1,0)` 与 `:global(body[data-ds-dark-theme]) .card` 的 `(0,2,0)`
- A5 桌面端引导卡（`ui-settings-account/src/client/DesktopOnboarding.module.css` 卡底取 `--dsw-alias-onboarding-card-fill`）：浅色那档是 80% 近白，深色那档才换深灰（`ui-theme/src/styles/onboarding.css:7` 与 `:13`），皮肤下同样是近白卡底配奶油字
  - 修法：皮肤 token 块按自己的玻璃面板取值 —— `--dsw-alias-onboarding-card-fill: rgba(36,38,28,.88)`、`--dsw-alias-onboarding-secondary-fill: #2c2e24`、`--dsw-alias-onboarding-checkbox-border: rgba(196,163,90,.5)`
- `pnpm test` 5 passed；仓库与 profile 两侧 `lib/client.js` sha256 一致（`CE59070A…`）
- **本轮未实测**：A4 需要会话里存在 `schedule_create` 工具卡（本机侧栏当前只列得出本工作区的两条会话，没翻到带该卡的会话）；A5 需要进桌面端引导页（本机 `:3080` 的设置面板实测只有「通用设置 / 模型 / 内置插件 / Agent 预设 / 已归档会话 / Web 插件 / 宠物 / 创意工坊 / 打开配置文件」，没有账户页入口）。两条目前只有「宿主源码 + token 字面值 + 特异性对照」这一档证据，待真实页面出现时复核

## 0.1.31 — 2026-09-29

修 DSH 0.2.0-rc.1 下 composer 弹层变浅灰玻璃底（用户报的模型 / 推理等级 / 访问模式三个菜单），以及这些菜单里图标仍是暗色。两处都是**升级新增的 token 皮肤没覆盖**，与上一版皮肤改动无关。

- 现象：点开「模型 / 推理等级」或「访问模式」，弹层是一块浅灰面板，皮肤的奶油字压在上面几乎读不出来；文字修好后前置图标与 `›` 箭头仍是近黑
- 根因 ①（弹层变灰）：0.2.0-rc.1 新增 `MenuSurface` 组件（`packages/client/ui-primitives/src/MenuSurface.tsx`、`MenuSurface.module.css:21`），菜单材质改由它的 `.material` 子层绘制 —— `background: var(--dsw-menu-surface-fill)` + `backdrop-filter: var(--dsw-menu-backdrop-filter)`，`z-index:-1` 画在表面自身底色之上。浅色主题该 token 是 `rgba(248,249,250,.58)`（`ui-theme/src/styles/design-platform.css:269`），皮肤只覆盖过旧的 `--dsw-specific-menu`（材质在旧构建里就是这个 token：`git show 2d3fd3971a:packages/client/ui-theme/src/styles/design-platform.css` 只有 `--dsw-specific-menu: rgba(248,249,250,.58)`，`MenuSurface.*` 在旧构建里不存在）→ 浅色玻璃盖在弹层暗橄榄底上
- 根因 ②（图标仍是暗色）：同版新增 `--dsw-alias-menu-icon`（`design-platform.css:226` 浅色取 `--dsw-static-neutral-bluish-800` = rgb(53,54,56)，`:341` 深色取 `label-primary-dimmed`），`ui-primitives/src/Menu.module.css:175` 的 `.itemIcon` 由旧版的 `color: var(--dsw-alias-label-tertiary)`（`git show 2d3fd3971a:...Menu.module.css`）改挂到它；`ModelSelect.module.css:285` 的箭头、`ui-input-trigger/MenuView.module.css:95/184/273`、`ui-settings-account/AccountMenu.module.css:31` 同源
- 修法：`body[data-dsh-815]` 的 token 块补 `--dsw-menu-surface-fill: #2c2e24` + `--dsw-menu-backdrop-filter: none`（实色之下模糊不可见），弹层规则内再按弹层自身底色定 `--dsw-menu-surface-fill: #24261c`；同一 token 块补 `--dsw-alias-menu-icon: #f4ead6`（与菜单文字同色）
- 实测（本机 `:3080`，DSH `0.2.0-rc.1-7bb30cd-dirty`，计算样式合成 + 截图像素复核）：材质层 `rgba(248,249,250,.58)` on `rgb(36,38,28)` → 合成 `rgb(159,160,157)`、行文字 `#f4ead6` **2.2:1**；修后材质层 `rgb(36,38,28)`、`backdrop-filter: none`，模型菜单两行 **12.85:1**（值列 5.25:1），推理等级四项均 **12.85:1**，模型列表 21 行最低 **5.25:1**（分组标题），斜杠菜单最低 **4.72:1**
- 图标实测：`span[class*='_itemIcon_']` 及其 `svg/path` 由 `rgb(53,54,56)` 变 `rgb(244,234,214)` = **12.85:1**，与文字同色；模型菜单两个 `›` 箭头同为 12.85:1；截图像素复核面板主体 `36,38,28`（修前同区域 `159,161,155`）
- `pnpm test` 5 passed；仓库与 profile 两侧 `lib/client.js` sha256 一致（本机验证态，`dsh plugin update` 会盖回）
- 同轮横向排查（只读取证，**本轮未修**）：升级新增且皮肤未覆盖、另会造成低对比的还有 —— `--dsw-alias-label-deep-diving` / `--dsw-alias-label-deep-diving-shimmer` / `--dsw-alias-label-shimmer`（`design-platform.css:215/216/224`；消费 `ChatView.module.css:121/122`、`TextShimmer.module.css:38`）。本机 `:3080` 正在运行的会话行实测：文字 `color(srgb .205 .367 .730)` = `rgb(52,94,186)`，截图像素主色 `rgb(22,19,12)` / `rgb(35,35,29)`，按 WCAG 相对亮度算 ≈ **3.1:1 / 2.6:1**；shimmer 扫光色为 `rgba(0,0,0,.3)`，落在深底上等于不可见。反向同类两条：`ui-schedule` 新建日程卡（`ScheduleCreateCard.module.css:7/19/20`，近白卡底）与 onboarding 卡（`DesktopOnboarding.module.css:7/156/159`）配皮肤奶油字。明细与逐条证据见 `docs/审计-2026-09-29-DSH-0.2.0-未覆盖token.md`
- 未验证项：上述横向排查的 5 条只有前三条在本机复现到真实节点（运行中行），两条反向条目仅有源码与 token 字面值证据，未在浏览器实测

## 0.1.30 — 2026-09-28

修 diff 视图在 DSH 0.2.0-rc.1 下重新出现的低对比（右栏「本轮改动」面板 + 改动卡片悬停弹框）——上一版修复挂的是 CSS Module 构建期 hash 前缀，升级后整体失配。

- 现象：改动卡片（「已编辑 xxx.md」）悬停弹出的预览卡、右栏「本轮改动」面板里，新增行是一片浅绿底 + 浅奶油字，几乎读不出来
- 根因：2026-09-24 那轮把规则挂在 `[class*='DoHURa_add']` 等 **hash 前缀**上；DSH 升到 `0.2.0-rc.1-7bb30cd` 后同一 CSS Module（`FileDiff.module.css`）的前缀变成 `N9Zj0W_`，六条选择器在本机 `:3080` 逐条实测命中 `0` 个，修复整体失效。**与 `dsh-better-sidebar` 被禁用无关** —— 该组件属宿主 `ui-deliverables`，不由那个插件提供
- 修法：按用户要求**只用固定类名**匹配，不含任何哈希整串。锚点取两样、各自独立可用：① 固定类名后缀 `[class*='_add']` / `[class*='_del']`（CSS Module 只在 localName 前拼构建期哈希，后缀由源码写定、不变），并加 `:not([class*='_added'])` / `:not([class*='_deleted'])` 挡开改动卡片的计数 span，外层再用容器钩子 `:is([data-changes-review], [data-changes-hover-preview])` 收窄作用域；② 宿主手写属性 `[data-diff-line='add'|'del']`（`ui-deliverables/src/client/FileDiff.tsx`）作为并列锚点。行号与 `+/-` 号不单独选择，而是在该行重设 `--diff-marker`（宿主 `.add .number / .add .sign` 取 `var(--diff-marker)`，本条特异性更高）；shiki 走 css-variables 主题（span 内联 `color:var(--shiki-token-*)`），故只需在行上重设 `--shiki-*`，无需 `!important`
- 实测（本机 `:3080`，同构探针 + 真实注入 CSS + 真实宿主类名，合成背景 + opacity 累乘）：新增行正文 **1.05:1 → 15.29:1**；shiki 字符串 **1.54 → 5.74:1**；shiki 标点 **1.31 → 8.3:1**；行号 **3.06 → 6.05:1**；`+` 号 **2.96 → 5.84:1**。暗底一侧未被误伤：hunk 头 / 弹框路径 / note 6.04:1、context 行 9.68:1
- 选择器自检（同一页探针，四组）：**类名后缀路径**（容器属性在、行只给固定类名）15.29 / 6.05 / 5.84 / 5.74 全达标；**属性路径**（本轮之前规则只挂 `data-diff-line` 时的实测）同为 15.29 / 6.05 / 5.84 / 5.74；**作用域对照**（同样的类名但不在两个容器内）保持修前的 `#f4ead6` on `#e6f4e7` = 1.05:1，说明收窄生效、不误伤别处；**近邻反例**（`z90sEq_added`）未被压墨（仍 `#22c55e`）
- 源码自检：`grep -n "\[class[*^$]?=['\"][A-Za-z0-9]{4,8}_"` 在该 CSS 里只命中注释里那句「禁止哈希整串」的说明，已无任何哈希整串选择器
- 未实测：删除行的浅红底（宿主 `#fce6e2`；其上 marker `#ba2723` 本身 5.39:1 达标故不动）沿用同一结构；**真实节点复测**待有 diff 卡片的会话（本次手头会话均无可复现卡片，本会话的改动卡片要等回合结束才渲染）
- 同页顺带实测、本轮**未改**：右栏 markdown 文档预览（`data-document-markdown`）在浅色与暗色两种方案下各扫 255 个文本叶子，**低于 4.5:1 的为 0**（最差 6.24:1 / 8.06:1）

修「选中态填充」这一族 token 漏配导致的低对比（用户报的团队成员筛选胶囊「全部」）。

- 现象：dsh-better-sidebar 团队任务板里 `lead` 左边的筛选胶囊是**空框**，鼠标移入才浮出「全部」两字
- 根因：胶囊是宿主 `ui-primitives` 的 `Pill`，`.active` 取 `color: var(--dsw-alias-label-primary)` + `background: var(--dsw-alias-button-ghost-active-fill)`。上游只在浅色主题给这套 token 赋值（`design-platform.css` 浅色块 198-200 行：`ghost-active-fill` = bluish-100、`ghost-active-border` = bluish-500），皮肤此前没接管 → 底解析为近白 `#ebeef2`，而皮肤全局把 `label-primary` 换成奶油 `#f4ead6`，实测 **1.03:1**；`.interactive:hover` 的背景换成皮肤那档暗金 `interactive-bg-hover`，字才显形 —— 正是「移入才显示」
- 修法：在 `body[data-dsh-815]` 的 token 块补齐 `--dsw-alias-button-ghost-active-fill: rgba(196,163,90,.28)`（与皮肤既有 `--dsw-alias-interactive-bg-active` 同值）、`--dsw-alias-button-ghost-active-border: rgba(196,163,90,.7)`（与 `border-l3` 同档）
- 实测（本机 `:3080`，DSH `0.2.0-rc.1-7bb30cd-dirty`，真实 CSS 规则 + 真实 token 的受控探针）：修前 `color rgb(244,234,214)` on `bg rgb(235,238,242)` = **1.03:1**；修后背景 `rgba(196,163,90,.28)`，截图像素复核底 `72,64,38`、字 `244,234,214` = **8.63:1**。用户截图同区域独立采样：底 `233,236,242`、字 `242,232,214` ≈ 1.03:1，与计算样式闭环
- 同一 token 还有三个消费点一并受益（未逐个实测）：`ui-trajectory` 回合头、`ui-schedule` 的 `DatePicker/ClockPicker .selected`（字同为 label-primary）、`extensions/ui-cordis` 的 `CordisRunRow .message`（字是 label-tertiary `#9e9780`，按合成底算 2.54:1 → 3.41:1，仍偏低，本轮未动它的字色）
- 未验证项：报障面板本身当前**不可复现** —— `dsh-better-sidebar` 0.22.1 的 peer 兼容门禁在 DSH 0.2.0-rc.1 下拒绝装载，profile 已 `disabled: true`，页面 `[data-team-board]` 计数 0；本次验证走的是同构探针，不是原面板
- 同页顺带实测到、本轮**未改**：`--dsw-alias-fill-l2` 在 `body` 层仍为空（皮肤只在 `sm-priorityBadge` 作用域覆盖过），`ui-jobs` 的 `.rowLineLive` 与 `.kind` 仍取上游浅色值

## 0.1.29 — 2026-09-28

修 composer 上方那条「进行中的目标 …」（宿主 `ui-goal` 组件）的文字与图标对比度。

- 根因：宿主 `GoalBar.module.css` 的 `.bar::before` 底取 `var(--dsw-specific-menu)`，皮肤把它定成深橄榄 `#2c2e24`（本机实测该值不透明、computed `rgb(44,46,36)`；`backdrop-filter: blur(40px) saturate(1.5)` 不改变成色）。而皮肤里那条 `[data-goal-bar]` 规则是按**上一版「条底是主题浅色 `#f5f6f7`」**写的，把 label-primary / secondary / tertiary 一律压成墨色系 —— 墨字落深底，方向正好相反；它同时漏了目标正文走的 `--dsw-alias-label-primary-dimmed`（皮肤未定义 → 落到浅色主题近黑 `#151517`）
- 修前实测（`:3080` 真实节点，ds-harness 工作区会话「检查项目和插件有没有更新」；计算样式 + 合成背景 + opacity 累乘）：标签「进行中的目标」**1.26:1**、目标正文 **1.32:1**、目标图标与暂停 / 编辑 / 清除三个操作按钮 **1.83:1** —— 与用户截图里「整条糊进底色」一致
- 修法：条内改为深底提亮，与 todo 面板 / 排队坞同族，并补上 dimmed 档 —— `label-primary #f4ead6`、`label-primary-dimmed #d4ccb0`、`label-secondary #d4ccb0`、`label-tertiary #c8c0a4`、`label-caption #9e9780`；修后依次 **11.54:1 / 8.58:1 / 7.57:1**（三个操作按钮 opacity 1），编辑态输入框文字 11.54:1、hover 态按钮字 8.58:1
- 截图像素口径复核：条区域（rect `478,327,717,36`）底主色 `44,46,36`、前景亮色主色 `210,202,174`（≈`#d4ccb0`），与计算样式一致
- 暗色主题复核（宿主把条底换成 `rgba(48,49,54,.5)`，合成 `rgb(35,35,39)`）：标签 13.11:1 / 正文 9.74:1 / 图标 8.6:1，故该规则去掉 `:not([data-ds-dark-theme])` 未造成劣化
- `pnpm test` 5 passed；仓库与 profile 两侧 `lib/client.js` sha256 一致
- 明细见 `docs/交接-2026-09-24-低对比修复.md` 第九节

## 0.1.28 — 2026-09-24

修一处行内 code 胶囊内的文件引用对比度。根因是 0.1.26 起「气泡里的 fileMention 改用亮铜」那条规则越界命中了浅纸底的胶囊。

- `pkg/package.json` 这种「目录 + 文件名」写法里，后半截是宿主渲染的 `button[class*='fileMention']`（带 `</>` 图标，图标取 `currentColor`），而 0.1.26 给气泡内文件引用设的亮铜 `#e2c98a` 是按深橄榄底选的 —— 落进行内 code 的宣纸底 `#f3ead4` 只剩 **1.33:1**（计算样式 1.35:1）。用户截图里表现为文件名几乎与纸面融成一片，而前半截 `pkg/` 是普通 code 文本、走胶囊墨色，看着正常。新增规则把胶囊内的文件引用收窄到浅纸底那一档暗铜 `#6b4e16`，**6.43:1**（设计色 6.29:1），图标随 `currentColor` 一起变深
- 作用域靠 `:not(pre) > code` 限定，特异性 `(0,4,4)` > 原亮铜规则的 `(0,4,2)`，无需 `!important`；深底气泡上的文件引用仍走亮铜。独立复核用注入探针验证：markdown 内非 code 的 `fileMention` 仍 `rgb(226,201,138)` 且不匹配新选择器，`code` 内为 `rgb(107,78,22)`
- 复核：仓库 `lib/client.js` 与 profile 侧同名文件 sha256 一致；`pnpm test` 5 passed
- 未实测项：真实指针悬停（宿主 `:hover / :focus` 只加下划线、不改 color，已从规则层面核对）；非 code 场景的 `fileMention` 当前页面无实例，靠探针验证
- 同页顺带实测到、本轮**未改**：改动卡片 `-N` 计数（浅 header 4.31:1 / 深卡片 3.92:1）、工具调用行文字 4.51:1、加载态骨架 1.00:1，明细见 `docs/交接-2026-09-24-低对比修复.md`

## 0.1.27 — 2026-09-24

适配 DSH **0.1.7-rc.1**（本机 `:3080` 实测构建 `f867838-dirty`）。三处都是同一族根因：宿主换了底 / 换了 DOM 钩子，皮肤按旧假设压出来的层级反向。全部为注入式覆盖、不改插件源码。

- 思考块正文（`[data-variant='think'] [class*='thinkBody'] [class*='markdown']`，宿主走 `--dsw-alias-label-tertiary`）：正文直接浮在暗油画底上（合成背景实测 `#080a06`），**6.81:1**，比同页助手正文（`#f4ead6`，16.65:1）暗一整档 → 提到深底次要档 `#d4ccb0`，**12.37:1**；折叠态那一行预览（`_3kTACG_summaryText`）一并提亮
- 思考块内的行内 code：宿主给的是近白胶囊（浅色主题 `--dsw-alias-markdown-inline-code` = `#fafafa`），字色却跟着思考正文走，实测 **2.80:1**（比正文更糟）→ 并进既有的「宣纸底墨字」规则，**14.52:1**
- 「在本地打开」分裂按钮图标：新版把 `img` 的 src 从绝对路径 `/open-in-app/icon/...` 改成相对路径 `open-in-app/icon/explorer`，旧选择器 `[src*='/open-in-app/icon']`（带前导斜杠）命中 **0** 个元素，整段规则落空 —— 官方彩色 PNG 于是露出。改用宿主语义钩子 `div[data-open-target]:has(> button > img[class*='appIcon'])`（语义属性 + 类名子串 + 直系结构，都不随 CSS Module hash 变），换成 13×13 mask 线性文件夹、跟随 `currentColor`；**像素复核：图标区蓝像素 23 → 0**，同时出现奶油色 mask 描边。尺寸 / 圆角 / 内边距不再干预（宿主 compact 态自身 43×24、圆角 9px，边框与分裂分隔线已取皮肤的 `--dsw-alias-border-l4`）
- diff 视图（组件 `DoHURa_*`；两个容器：右栏「本轮改动」面板 `[data-changes-review='true']` 与对话区改动卡片上悬停弹出的预览卡 `_preview_178vx_*`，后者没有那个语义钩子，只挂钩子的规则会漏掉它）：新增行浅绿底 `#e6f4e7` 上是奶油字 **1.05:1**、shiki 亮色 token **1.31~1.54:1**、行号 `#01a241` **3.06:1**、表头 `-N` **4.42:1** → 浅底行压墨 + 行内换一套深色 shiki token（正文 15.3:1、字符串 5.74:1、关键字 6.3:1、注释 6.6:1、函数 6.8:1、常量 7.0:1、参数 6.0:1、标点 8.3:1）。规则不挂容器钩子、直接落在行类上，故**任何容器**里的该组件都被覆盖；复测两个容器**低于 4.5:1 的条目均为 0**（最低 5.74:1）
- `pnpm test` 5 passed
- 未实测项：删除侧 `[class*='DoHURa_del']` 的浅底值（手头 diff 为纯新增 `+27/-0`），规则按同一结构写了但值未实测

## 0.1.26 — 2026-09-24

适配 DSH 0.1.7-rc.1 的两类破坏性变化：一批原浅色面板改成深底、一批原深色面板写死近白，皮肤按旧假设压出的文字层级全部反向；另有一条 DOM 钩子改名，让「时间/用量常显」规则整条失效。

- 消息尾部时间与「用量 N tok」：宿主把悬停揭示容器换成新属性（`[data-time-hover-root]` 查询返回 null），原规则落空，`div[data-clock]` 实测 opacity 0、整块不可见（用户截图里那行「用量 1M tok 11:52」像素实测约 1.5:1，等于 `#9e9780` 以约 25% 不透明度叠在 `#23231d` 上）。改按 `[data-clock]` 常显；用户消息行的 opacity 由内联样式控制，需 `!important`。修后 6 个时间容器 opacity 全为 1，时间戳与用量标签 6.81:1
- 排队坞 `[data-queue-dock]`：坞面在新版变成透明（旧版取 `--dsw-specific-tip` 的浅色 `#f5f6f7`），坞内那条「压墨色」覆盖于是把墨字直接搁在暗油画上——标题「2 条排队消息」1.14:1、队列图标 2.64:1；展开后的条目正文还走 `--dsw-alias-label-primary-dimmed`（浅色主题下是近黑 `#151517`，1.09:1），每行右侧操作按钮被宿主设成 opacity .45（图标实际 2.21:1）。坞内恢复浅色层级、补上该 token、操作按钮改常显。标题 16.65:1、图标 6.81:1
- todo 面板 `[data-testid='todo-panel']`：面板底在新版是深橄榄 `#2c2e24`（旧版为主题浅色），皮肤压的墨色标题「任务」1.26:1。面板内恢复浅色：标题 11.54:1、条目 8.58:1、进度与图标 4.72:1
- 本轮改动卡片 `[data-changed-files='true']`：卡面是皮肤深橄榄，但宿主把 header 按钮的底写死成近白 `#fafafa`，而 header 文字取 label-primary（皮肤奶油 `#f4ead6`）——「已编辑 N 个文件」1.14:1、+N 计数 2.18:1。header 内压回墨色，标题 16.67:1、+N 改深绿 4.81:1
- present 文件卡 `[data-presented-file]` 的说明文字走 label-tertiary，白卡上 2.80:1 → 补齐墨色层级 7.23:1
- 对话气泡里的 fileMention：原 `#6b4e16` 暗铜是按浅纸底选的，气泡底实测 `#1c1e15` 深橄榄，2.19:1 → 改亮铜 `#e2c98a`，10.42:1
- 侧栏选中行（铜金高亮 `#897442`）：时长 1.03:1、行内操作图标 1.55:1 → 分别提到 `#f2e6c6` / `#fff8e8`（规则已加，未取得修后实测值）
- 全部为注入式覆盖、不改插件源码；`pnpm test` 5 passed

## 0.1.25 — 2026-09-23

两处第三方插件的浅底浅字，压成皮肤深底：产出「在文件夹中显示」按钮与会话优先级徽章。

- 产出按钮（dsh-better-sidebar 0.19.1 的 `css.producedMore`，即「本次产出」行右侧那一枚，单轮产出超过 6 个文件时才渲染）：插件只声明 font 与 label-tertiary，没重置按钮的 UA 外观，于是自带 buttonface 灰底与 2px outset 白边，皮肤米灰字 `#9e9780` 压上去只有 1.83:1（实测按钮底 `rgb(107,107,107)`）。覆盖：选择器末段限定 `button`（同类的「+N」计数是 span，不受影响）、`appearance: none` 清 UA 外观、底与边换成产出 chip 同族 token（`bg-layer-2` / `border-l2` / 圆角 999px）、字色提到奶油 `#e8dcc0`，并用 `text-decoration: none !important` 压掉插件写在内联 style 上的下划线
- 优先级徽章（dsh-session-manager 0.5.1 的 `.sm-priorityBadge`，即「标签/备注」按钮里的 P3）：插件走 `var(--dsw-alias-fill-l2, #eee)` 与 `var(--dsw-alias-label-secondary)`；815 皮肤没有定义 fill-l2，底落到回退值 `#eee`，字则是皮肤的米色 `#c8c0a4` —— 1.57:1（P1/P2 走插件写死的橙/黄，不受影响）。在徽章自身重设这两个 token 为橄榄深底加米字
- 两条都沿用既有做法：注入式覆盖、不改插件源码；必须用属性选择器，本表是 CSS Module，类选择器会被 hash 成 `.xxxx_sm-priorityBadge` 而失配
- 实测（1600x900，:3080 真实 GUI，刷新页面即生效、无需重启 `dsh web`）：按钮 `rgb(232,220,192)` 压 `rgba(36,38,28,.88)` 为 11.27:1、徽章 8.42:1
- 测试：`pnpm test` 5 passed

## 0.1.24 — 2026-09-19

侧栏底部三个插件的入口在收起态竖排，两态统一成纯白 16px 图标。

- 现象：侧栏收起（rail 56px 宽）后，左下角那排入口仍横排、整行溢出栏外，「会话管理」的文字被挤成竖排四行；性能监控（lag-trace-pro）图标比兄弟偏高 4px、会话管理（dsh-session-manager）图标颜色比兄弟淡一档
- 根因：宿主 `packages/client/ui-sidebar` 的 `SidebarRoot.module.css` 在收起态只给 `.footerActions` 加 `justify-content: center` + `width: auto`，`flex-direction` 仍为 `row`；三个插件入口横排总宽 `36+48+28=112px`，在 56px 宽的 rail 里居中后整体溢出（x=-28），`dsh-session-manager` 的按钮被压到 48px 宽，文字换行成四行把该行撑到 78px。偏高则是 `lag-trace-pro` 自带 28px 圆钮、与 36px 按钮顶对齐所致
- 覆盖：`src/client/vj815.module.css` 新增 73 行（注入式，不改插件源码）——收起态 `[class*='footerActions']` 改 `flex-direction: column`，四个入口统一 36x36、水平居中于 rail、间距 4px，`dsh-session-manager` 收起后只留图标（`aria-label` 保留）；两态通用前景统一 `#fff`（含 hover），图标尺寸由 18/14/18px 统一为 16px，容器统一 36px 高并垂直居中，`lag-trace-pro` 的 28px 圆钮拉成 36x36
- 坑：`lag-trace-pro` 的角标类名 `.ltp-btnBadge` 含 `ltp-btn` 子串，`[class*='ltp-btn']` 会连角标一起命中、把它拉成 36x36 红块盖住波形图标；该族 5 处选择器改用属性词匹配 `[class~='ltp-btn']`
- 实测（1600x900，真实 GUI；刷新页面即可生效，无需重启 `dsh web`）：收起态 `footerActions` 由 `[-28,762,112,78]` 变为 `[10,684,36,156]`、四入口 x=10 且均 36x36；展开态四图标中心同为 y=826、`color` 均 `rgb(255,255,255)`，`.ltp-btnBadge` 恢复 14x14 停在按钮右上（与图标重叠 2x2px）
- 测试：`pnpm test` 5 passed

## 0.1.23 — 2026-09-16

皮肤底图换成 WebP，发布包体积从 5.23 MB 压到 0.73 MB。

- `assets/` 新增两张 WebP（quality 80 / effort 6）：4K `3840x1351` 0.51 MB（原 JPEG 2.16 MB）、2K `2560x901` 0.20 MB（原 0.89 MB）；像素尺寸不变，JPEG 原图保留作源，可随时回退或换档
- `scripts/embed-art.mjs` 改读 `.webp` 并把内联 MIME 换成 `image/webp`；`tests/apply.spec.ts` 里硬编码的 `data:image/jpeg` 背景图断言同步更新
- 体积：`lib/client.js` 4.31 MB → 1.04 MB，发布包 8 个文件 5.23 MB → 0.73 MB（相对最初的 8.7 MB 已降到 8.4%）
- 兼容性：WebP 全局支持率 96.09%（caniuse）；Chrome 32+ / Firefox 65+ / Edge 18+ / Safari 16+ 完整支持（Safari 14.0–15.6 需 macOS 11 Big Sur 及以上），仅 IE 11 不支持
- 验证：WebP q80 与原图在铺满与 3x 放大下无可见差异；隔离 profile 起 `:3099` 实例，下发的 client bundle 内 `data:image/webp` 2 处、`data:image/jpeg` 0 处；`pnpm test` 5 passed

## 0.1.22 — 2026-09-16

发布链路改用 npm 可信发布（Trusted Publishing / OIDC），不再使用 NPM_TOKEN。

- 新增 `.github/workflows/publish.yml`：推纯版本号 tag（如 `0.1.22`）或手动 dispatch 触发；`id-token: write` 让 npm CLI 在 publish 时自动用 OIDC 换取短期凭据，发布步骤不注入任何 token
- 步骤为 `pnpm install --frozen-lockfile` → tag 与 package.json 版本一致性校验 → `pnpm build` → `pnpm test` → `npm publish --access public`；provenance 由 npm 在 OIDC 下自动生成，无需 `--provenance`
- 工具链固定 pnpm 12.4.1（与 lockfileVersion 9.0 配套）与 Node 24（npm CLI ≥ 11.5.1 才支持 OIDC），并按发布构建要求关闭依赖缓存
- `package.json` 补 `repository` 字段：npm 要求它与 GitHub 仓库一致，此前缺失会导致 provenance 生成失败
- 验证：干净副本复跑 install / build / test（5 passed）与 `npm pack --dry-run`（16 个文件）全绿；真实链路由 0.1.22 的 tag 触发首次运行

## 0.1.21 — 2026-09-16

`@linxin666/dsh-client-ui-task-board` 的侧栏「任务看板」按钮，改成与上方「新会话 / 记忆」两枚按钮同款。

- 侧栏「任务看板」入口（该插件注入的 `[data-dsh-taskboard-entry]`，即它 `board.module.css` 的 `.entry`）原本是 36px 高 / 8px 圆角 / 左对齐 / 13px 次要色文字的透明导航行 —— 与它上方宿主「新会话」按钮、mneme「记忆」按钮（38px 高 / 12px 圆角 / 铜边 / elevated 底 / 内容居中）并排时明显不是一套观感
- 按本文件里已有的 `[data-dsh-timeragent-entry]` 段同款写法，把该按钮覆盖成兄弟按钮的盒模型（38px 高 / 12px 圆角 / `0.5px` 铜边 / `--dsw-alias-button-elevated-fill` 底 / 内容居中 / 14px 500 文字），仍是不改插件源码的注入式覆盖
- hover 走 `--dsw-alias-button-floating-hover`；看板打开时插件在行上打的 `data-active` 高亮会被新底色盖掉，按同档补回（`--dsw-alias-interactive-bg-active` + `font-weight: 600`）
- 收起态对齐宿主 `.collapsed .newSession`：36x36 图标按钮、透明底、12px 圆角（插件自带的 50% 圆形在此收正）
- 实测展开态三枚按钮 252x38 / x=14 / 12px 圆角 / 1px 铜边 / `rgba(52,54,40,.9)` 底完全一致，收起态同为 36x36 / x=10；`pnpm test` 5 passed

## 0.1.20 — 2026-09-16

底部工作台终端（dsh-better-sidebar 的 xterm）白底浅字，压成皮肤暗底。

- 现象：头部工具条「展开底部面板」打开的终端底色纯白、文字奶油色，几乎看不见
- 根因：插件的 `xtermTheme()` 按 `isDarkScheme()` 选主题，surface 取 body 上的 `--dsw-alias-bg-base`，透明时回退 `dark ? #111114 : #ffffff`。皮肤为露油画把该 token 设成 `transparent`，宿主又是浅色方案（`html` 内联 `color-scheme: light`、body 无 `data-ds-dark-theme`），回退于是落到 `#ffffff`；而前景取皮肤的 `label-primary #f4ead6`（不透明，正常通过）—— 白底奶油字 1.10:1。ANSI 16 色同样按 light 档取了 one-light。白底不是加载错误，是该回退链的合规结果
- 修复在皮肤侧覆盖 xterm 渲染面，不动插件源码：`.xterm-viewport` 底 `#141610 !important` 压掉内联白底；16 组 `.xterm-fg-N` / `.xterm-bg-N` 换成与暗底匹配的 one-dark 系（0 号 `#5c6370`、8 号 `#7f8694` 提亮到可读档，15 号 `#ffffff`）；选区走铜金 `rgba(196,163,90,.32)`；光标块内文字压回墨色 `#1c1a14`（插件把它填成 `#ffffff`，白字落在奶油块上同样看不见）；`dim` 语义改用 `opacity .7` 保留
- 外部类名必须包 `:global()`：本文件是 CSS Modules，直接写 `.xterm-viewport` 会被哈希成 `.xxxx_xterm-viewport` 而匹配不到（首轮规则就是这么静默失效的）
- 作用域限 `:not([data-ds-dark-theme])`：暗色方案下插件本就用深底 + ANSI_DARK，避免反向回归
- 实测：viewport 计算背景 `rgb(20,22,16)`、默认文本 `rgb(244,234,214)`（15.2:1），ANSI 0–7 与光标块按新配色渲染；`pnpm test` 5 passed

## 0.1.19 — 2026-09-14

提问卡（ui-user-questions）的作答框字色与底色过近，压成深底。

- 提问卡是输入座的兄弟（`data-question-key`），不在输入卡内，拿不到输入卡那层墨色 token；卡内自由作答框（`.customBlock`）的底取宿主 `--dsw-alias-bg-module-platform`，皮肤没接管该 token，浅色主题下是近白 `#f5f6f7`，而框内文字是皮肤全局的奶油 `label-primary #f4ead6` —— 只有 1.10:1，输入值与占位符一起糊在白底上；输入框还成了块白斑，与深橄榄卡面断裂
- 在提问卡子树内把该 token 压成卡面同色 `#24261c`：输入值 12.85:1；占位符（`.fieldInput::placeholder`）原值 `label-caption` 对深底只有 3.48:1，另提一档到 `label-tertiary #9e9780`（5.25:1）
- 作用域限 `:not([data-ds-dark-theme])`（暗色主题下该 token 本身就是深色）；plan review 卡走 `data-plan-review-key`、底取 `--dsw-specific-input-major`，不受影响；卡外任何使用该 token 的表面实测仍是 `#f5f6f7`

## 0.1.18 — 2026-09-13

右栏 tab 图标与字色、排队坞、轮次导航轨、设置卡片边框与弹框文字的一批对比度修复。

- 右栏 tab 的文件类型图标原本是宿主下发的彩色实心方块（markdown 蓝、文件夹琥珀），改成皮肤那套线性描边：新画一枚 `--vj-file-icon`（纸张 + 右上折角），目录类型仍走 `--vj-folder-icon`；颜色走 `currentColor`，跟随 tab 文字色
- 选中 tab hover 时底会从浅灰胶囊换成半透明的交互底（`rgba(196,163,90,.14)`，叠在油画上就是暗底），上面刚压好的墨字会沉进去（1.1:1），hover 态把字换回奶油
- 上一版的 tab 墨色规则写成了全局 `[role='tab'][class*='tabActive']`，把会话页头那排视图 tab（对话 / 轨迹 / 用量统计）一起压黑了 —— 它们的选中底是透明的（叠暗色油画），墨字只有 1.1:1；规则收窄到右栏/浮窗容器
- 排队坞（`data-queue-dock`）挂在 composer 栈里、输入卡之外，拿不到输入卡那层墨色 token：「N 条排队消息」走 label-primary 奶油（1.05:1）、队列图标与箭头走 label-tertiary（2.6:1）；坞内文字层级压回墨色 16.08:1 / 6.97:1
- 轮次导航轨（ui-chat TurnNavigator）的普通刻度取 `--dsw-alias-border-l4`，皮肤没定义该 token，浅色主题回落成半透明黑（实测刻度 `rgba(0,0,0,.16)` × 未加载态 `.6`），暗底上等于没有；刻度容器内把该 token 换成皮肤铜金
- 补齐 `--dsw-alias-border-l4`（`rgba(196,163,90,.5)`）：宿主那档最细描边全站都在用（设置里的预设卡 / 插件卡 / 外观方块、输入框、标签、轨迹单元格、右栏引导卡……），原先 1.1~1.4:1 等于没有边框
- `dsh-session-manager` 的「会话管理」弹框底是插件写死的白 / `#f5f5f5`，文字取宿主 `label-*`（皮肤已换成奶油系），于是标题、过滤按钮、行内「打开 / 归档 / 移动至工作区 / 迁移预设」、元信息全糊在白底上（1.1~2.7:1）；弹框内文字层级压回墨色，行内按钮 hover（插件换成 label-primary + `fill-l2` 底）一并覆盖。注意该表是 CSS Module，插件类名必须用 `[class*=...]` 属性选择器，写 `.sm-*` 会被 hash 成 `.xxxx_sm-*` 而匹配不到
- 侧栏「记忆」按钮（mneme `mneme-topentry-native`）自带的底取 `bg-layer-1`（比兄弟按钮暗一档）、边取 `l2`（比兄弟淡），与宿主 `.newSession` 同特异性 —— 谁的样式表后加载谁赢，插件更新后它会漂移；由皮肤把这三条钉成兄弟按钮的值（含收起态）
- `dsh-update-checker` 的「检查更新」页把描边写在内联 style 里（无类名可挂）：分组卡 `rgba(128,128,128,.3)`、行内按钮 `.5`，暗底上 1.5~2:1；按 style 属性文本精确命中并 `!important` 换成铜金

## 0.1.17 — 2026-09-13

撤回 0.1.16：文件名与行内 code 看不清是文字颜色问题，不是底色问题。

- 0.1.16 把右栏面板压成实色底 `#1c1e16` 遮蔽了油画，方向错了。这些容器的底本来就由宿主按浅色主题给：选中 tab 的胶囊取 `--dsw-alias-markdown-tag`（实测 `#f1f3f5`）、正文行内 code 取 `--dsw-alias-markdown-inline-code`（实测 `#fafafa`），而皮肤全局的 `label-primary` 是奶油色 `#f4ead6` —— 落上去只有 1.07:1 / 1.14:1，看着就是「字没了」
- 实底规则撤回（选择器回到改右栏之前的写法），改为只压字色：右栏与浮窗文档预览里的行内 code、以及 dockkit 选中 tab 的文字压回墨色 `#1c1a14`，背景一律不动
- 实测：选中 tab 上打开的文件名 1.07:1 → 15.64:1，正文行内 code 1.14:1 → 16.67:1
- 两条规则都是 `:not([data-ds-dark-theme])` 作用域：暗色主题下这两个容器的底本身是深色（`static-neutral-800` / `bluish-850`），奶油字正确

## 0.1.16 — 2026-09-13（已由 0.1.17 撤回）

打开文件时右侧展开的文件查看区域（右栏）文件名看不清，恢复实色底。

- 右栏面板（宿主 `ui-sidebar-right` 的 `rightbarCol`）底色取 `var(--dsw-alias-bg-base)`，而皮肤为了让对话列露油画把该 token 在 `body` 上设成 `transparent`，于是整块右栏跟着透明，油画直接透上来；文件名走 `label-primary` 奶油色 `#f4ead6`，落在受降场景的亮部只剩约 2:1，看着就是「字融进画里」
- 皮肤原本有一条给「详情列」的实底规则（`[data-pane='details']` / `[class*='detailsCol']`），宿主把这一列换成 `rightbarCol` / `data-rightbar-col` 后规则失效，这正是回归点；选择器改指右栏后恢复 `#1c1e16` 实底
- 实测：文件名 `#f4ead6` 对 `#1c1e16` 为 14.11:1，路径里的目录灰 `#9e9780` 为 5.77:1；全屏文件查看（面板 `position: fixed` 铺满视口）仍是该容器的后代，一并生效

## 0.1.15 — 2026-09-12

浅色主题下目标条（GoalBar）的「进行中的目标」标签看不见，压回墨色。

- 目标条底取宿主浅色 `--dsw-specific-tip`（实测 `#f5f6f7`）；0.1.9 压暗的是 `brand-primary`，宿主后来让这个标签改走 `label-primary`，皮肤全局的奶油色 `#f4ead6` 于是重新落到浅底上，只有 1.1:1，标签整条融进条底
- 目标正文走 `label-primary-dimmed`（浅色主题下是近黑），所以看上去只有标签失踪
- 现按标记属性 `[data-goal-bar]` 在条内把文字层级压回墨色：标签 `label-primary` `#1c1a14`（16.1:1）、hover 态 `label-secondary` `#4a4638`（8.73:1）、图标 `label-tertiary` `#5a5443`（6.97:1）
- 规则同样是 `:not([data-ds-dark-theme])` 作用域，暗色主题下的深底浅字不受影响

## 0.1.14 — 2026-09-12

浅色主题下 todo 面板条目文字过淡，压回墨色。

- 面板底取宿主浅色 `--dsw-specific-tip`（实测 `#f5f6f7`），而皮肤全局的 `label-secondary` 是奶油色 `#c8c0a4`，条目文字只有 1.67:1，几乎糊在底上；现把面板内条目压回深橄榄 `#4a4638`（8.73:1）
- 同时把状态计数 `label-tertiary` 由 `#6a6454` 压到 `#5a5443`（6.97:1），pending 图标 `label-caption` 由 `#7e7866` 压到 `#6a6454`（5.45:1），面板内层级依次为 标题 16.1:1 / 条目 8.73:1 / 计数 6.97:1 / 图标 5.45:1
- 该规则仍是 `:not([data-ds-dark-theme])` 作用域，暗色主题下的深底浅字不受影响

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
