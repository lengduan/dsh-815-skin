# 构建 lockprobe：单文件、零依赖、静态链接 Win32 导入表。
# 用法: pwsh tools/lockprobe/build.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $root 'src\main.rs'
$out  = Join-Path $root 'bin\lockprobe.exe'

if (-not (Get-Command rustc -ErrorAction SilentlyContinue)) {
    throw 'rustc 未找到，请先安装 Rust 工具链'
}

New-Item -ItemType Directory -Force -Path (Join-Path $root 'bin') | Out-Null

$sw = [System.Diagnostics.Stopwatch]::StartNew()
& rustc -O -C panic=abort -C strip=symbols -o $out $src
if ($LASTEXITCODE -ne 0) { throw "编译失败 (exit $LASTEXITCODE)" }
$sw.Stop()

$f = Get-Item $out
Write-Host ("构建完成: {0}  {1:N0} 字节  {2:N1}s" -f $f.FullName, $f.Length, $sw.Elapsed.TotalSeconds)
Write-Host ''
Write-Host '自测:'
& $out --selftest
if ($LASTEXITCODE -ne 0) { throw '自测未通过' }
