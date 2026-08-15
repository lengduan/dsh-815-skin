// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { Context, type Fiber } from '@deepseek-ai/cordis'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { apply } from '../src/client/index.ts'

let fiber: Fiber | undefined

async function mount(): Promise<Fiber> {
  const f = new Context().plugin({ apply })
  await f.await()
  return f
}

afterEach(async () => {
  await fiber?.dispose()
  fiber = undefined
  document.body.innerHTML = ''
  document.title = ''
})

describe('815 skin apply', () => {
  it('declares only the public client manifest', () => {
    const manifest = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'))
    expect(manifest.dsh.client).toEqual({ inject: [], platform: 'web' })
    expect(manifest.peerDependencies).toHaveProperty('@deepseek-ai/cordis', '^4.0.1')
  })

  it('sets the body attribute and retracts it on dispose', async () => {
    fiber = await mount()
    expect(document.body.hasAttribute('data-dsh-815')).toBe(true)
    await fiber.dispose()
    expect(document.body.hasAttribute('data-dsh-815')).toBe(false)
  })

  it('installs the photograph backdrop and restores prior body styles', async () => {
    document.body.style.setProperty('background-position', 'left bottom')
    fiber = await mount()
    expect(document.body.style.backgroundImage).toContain('data:image/png;base64,')
    expect(document.body.style.backgroundPosition).toBe('center 42%')
    await fiber.dispose()
    expect(document.body.style.backgroundImage).toBe('')
    expect(document.body.style.backgroundPosition).toBe('left bottom')
  })

  it('injects chrome and retracts every owned element on dispose', async () => {
    fiber = await mount()
    expect(document.body.querySelectorAll('[data-skin-owner="815"]').length).toBeGreaterThan(0)
    await fiber.dispose()
    expect(document.body.querySelectorAll('[data-skin-owner="815"]').length).toBe(0)
  })
})
