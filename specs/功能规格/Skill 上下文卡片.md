# Skill 上下文卡片（dsh-deep-ptc-mode）

- 状态：生效中（2026-11-14 建立）

## 目标

Deep PTC 会话每轮末尾的「当前上下文中的 Skill」卡片在皮肤下可读：标题、Skill 名、描述行、卡片页脚与「全部保留 / 全部关闭」按钮都不与底色糊在一起，开关与图标仍可辨认。

## 约束

- 优先改插件自带的 CSS 变量与主题 token（`--dpt-card-fill` 与 `--dsw-alias-*` 那一套），只在插件把底色写死在类名规则上时才补选择器；锚点按 `specs/项目规格/皮肤样式锚点.md` 分级。
- 插件按**浅色宿主主题**拼色（`lib/client.js` 的 `CARD_CSS`：`.dpt-card{--dpt-card-fill:var(--dsw-static-neutral-50)}`），并在「界面特效」开启时另有一段 `body[data-dpt-ui]` 的 token 覆盖带 `!important`。两段都要处理，只改其一会让特效开关两态表现不一致。
- 锚点用插件手写类名 `dpt-skills` / `dpt-btn`（C 级固定名，不参与构建 hash），外层叠 `body[data-dsh-815]`（B 级）收窄；不得为命中节点固化构建 hash 类名。
- 不改插件源码与节点结构，冲突一律注入式覆盖。

## 涉及文件

- `src/client/vj815.module.css`（「dsh-deep-ptc-mode 的 Skill 卡片」段）

## 验收

- 卡片内标题与 Skill 名对卡底 ≥ 4.5:1；描述行、副行与卡片页脚 ≥ 4.5:1。
- 「全部保留 / 全部关闭」按钮文字对按钮底 ≥ 4.5:1；卡片图标对图标底 ≥ 3:1。
- 「界面特效」开、关两态下上述数值都成立。
- `pnpm test` 通过；禁用皮肤后不残留节点。
