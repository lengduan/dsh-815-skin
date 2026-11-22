# lockprobe

Windows 锁屏状态检测器。一次运行汇总四路独立探测，交叉验证后给出单一结论。

## 用法

```powershell
bin\lockprobe.exe             # 人类可读，带每路探测明细
bin\lockprobe.exe --json      # 机器可读，便于管道消费
bin\lockprobe.exe --selftest  # 只跑聚合逻辑的 7 条用例
```

退出码：`0` 未锁屏 / `1` 已锁屏 / `2` 无法判定（信号冲突或全部失效）。

## 四路探测

| 路线 | 权重 | 依据 |
|---|---|---|
| `input_desktop` | 3 | `OpenInputDesktop` 能否拿到 `Default` 桌面 |
| `wts_flags` | 3 | `WTSQuerySessionInformationW(WTSSessionInfoEx)` 的 `SessionFlags` |
| `foreground_window` | 2 | 前台窗口进程是否为 `LogonUI`（锁屏宿主） |
| `shell_window` | 1 | `explorer` 桌面 shell 是否仍在 |

强信号（权重 ≥ 2）全部一致 → 结论置信 `high`；不一致 → `UNKNOWN`，不猜。
全部强信号失效时退到弱信号，置信度降为 `low`。

## 构建

```powershell
pwsh tools/lockprobe/build.ps1
```

产物为单个 exe，无运行时依赖，冷启动约 60~70ms。

## 已知限制

- **`WTSINFOEXW` 的偏移**：因内部 `LARGE_INTEGER` 对齐，`Data` 实际起始于偏移 8 而非 4。
  `SessionId@8 / State@12 / Flags@16`。按偏移 4 读会得到错位数据。
- **`SessionFlags` 在本机曾读到 0（LOCK）但实际未锁**。该字段优先级低于 `input_desktop`；
  两者冲突时聚合器会返回 `UNKNOWN` 而非采信任一方。
- **进程枚举不可用**：`CreateToolhelp32Snapshot` 与 `EnumProcesses` 在 DSH 派生的子进程里
  被 Job Object 裁剪到仅可见后代进程（13 条 vs 真实 289 条），故本工具不使用进程快照，
  改用 `QueryFullProcessImageNameW` 由窗口句柄反查进程名。
- **服务化场景未验证**：Session 0 下 `OpenInputDesktop` 会失败，需显式传入目标 session id。
- 仅 Windows。
