# 一九四五年八月十五日 · dsh-815-skin

DeepSeek Harness Web GUI 史料皮肤。对话区底图是陈坚油画《公元一千九百四十五年九月九日九时》：1945-09-09 南京受降，日军代表弯腰递交投降书。侧栏挂《终战诏书》印刷件。

加载即生效，卸载即还原。`wiring.id` 为 `ui-skin-815`。

## 安装

```sh
dsh plugin --profile web add C:/lengduan/githubs/dsh-815-skin
```

或在 `%USERPROFILE%/.dsh/profiles/web/package.json` 用 `link:` 指向本目录，并把 `@dsh-external/dsh-client-ui-skin-815` 写入 `dsh.profile.bundles`。

## 素材

见 `NOTICE`。油画著作权归原作者；本仓只作本机皮肤底图。底图嵌入 client bundle。

## 开发

```sh
pnpm install
pnpm build
```
