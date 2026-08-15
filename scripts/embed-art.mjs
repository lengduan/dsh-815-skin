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
  `export const SURRENDER_PHOTO = '${dataUri('nanjing-surrender-chen-jian.png', 'image/png')}';`,
  `export const IMPERIAL_RESCRIPT = '${dataUri('imperial-rescript.jpg', 'image/jpeg')}';`,
  '',
].join('\n')

writeFileSync(join(root, 'src/client/art.generated.ts'), source)
console.log(`wrote src/client/art.generated.ts (${source.length} chars)`)
