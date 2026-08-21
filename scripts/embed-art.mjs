import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function dataUri(file, mime) {
  const bytes = readFileSync(join(root, 'assets', file))
  return `data:${mime};base64,${bytes.toString('base64')}`
}

const source = [
  '/** 内嵌皮肤图，构建时由 scripts/embed-art.mjs 生成。 */',
  `export const SURRENDER_PHOTO_2K = '${dataUri('nanjing-surrender-chen-jian-2k.jpg', 'image/jpeg')}';`,
  `export const SURRENDER_PHOTO_4K = '${dataUri('nanjing-surrender-chen-jian.jpg', 'image/jpeg')}';`,
  '',
].join('\n')

writeFileSync(join(root, 'src/client/art.generated.ts'), source)
console.log(`wrote src/client/art.generated.ts (${source.length} chars)`)
