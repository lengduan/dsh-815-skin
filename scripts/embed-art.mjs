import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function dataUri(file, mime) {
  const bytes = readFileSync(join(root, 'assets', file))
  return `data:${mime};base64,${bytes.toString('base64')}`
}

const source = [
  '/** 内嵌皮肤图（WebP，构建时由 scripts/embed-art.mjs 从 assets/ 生成）。 */',
  `export const SURRENDER_PHOTO_2K = '${dataUri('nanjing-surrender-chen-jian-2k.webp', 'image/webp')}';`,
  `export const SURRENDER_PHOTO_4K = '${dataUri('nanjing-surrender-chen-jian.webp', 'image/webp')}';`,
  '',
].join('\n')

writeFileSync(join(root, 'src/client/art.generated.ts'), source)
console.log(`wrote src/client/art.generated.ts (${source.length} chars)`)
