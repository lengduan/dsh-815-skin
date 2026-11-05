# AGENTS.md — dsh-815-skin

DeepSeek Harness Web GUI 的史料皮肤：宿主 `apply()` 为空，效果全在 client bundle（油画底图、主题 token 覆盖、标题栏品牌、选中会话标记）。

## 规格（需求改动前必读）

需求落手前，先读规格，再动代码：

1. `specs/项目规格/` —— 目录内全部文件，项目级长期约束（视觉风格、锚点规则等）；逐文件读，不挑。
2. `specs/功能规格/` —— 单个功能或界面区域的规格，写目标、约束、涉及文件、验收；找与本需求对应的文件，没有时先按该目录 README 的口径补一份或说明为何不补。

目录内容以磁盘为准：新增或删除规格文件不修改本文件，也不在此维护文件清单。

规格约束的是做法，不是当前实现：代码与其冲突时改代码；需求必须越过规格时，先改规格再改代码，不在代码里静默破例。

## 项目事实

- 皮肤样式集中在 `src/client/vj815.module.css`，宿主 DOM 随 DSH 版本漂移，选择器需要按版本适配。
- `pnpm build` 会先跑 `scripts/embed-art.mjs` 重新生成 `src/client/art.generated.ts`（gitignore，勿手改）；`lib/` 是构建产物，也不手改。
- CSS 命中没有自动化覆盖：`pnpm test`（jsdom）只验证 JS 侧 DOM 行为与卸载撤回，改动样式后必须在真实 GUI 里数命中并目视，按规格里的验证清单执行。
- 卸载必须能全量撤回：DOM 写入走 `ctx.effect` 销毁器，节点带 `data-skin-owner="815"`，body 属性为 `data-dsh-815`。
- 不访问网络、不读凭据与会话；底图在构建期以 data URL 内嵌。
- `docs/` 下是历史交接与审计记录，只作参考，口径以代码与规格为准。
