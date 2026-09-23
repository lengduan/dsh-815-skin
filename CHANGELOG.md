# 更新日志

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
