/**
 * 1945 终战皮肤。客户端入口只做展示层：南京受降油画背景、
 * 《终战诏书》侧栏牌、token 覆盖。effect 销毁器还原全部 CSS/DOM 写入。
 */
import type { Context } from '@deepseek-ai/cordis'
import { IMPERIAL_RESCRIPT, SURRENDER_PHOTO } from './art.generated.ts'
import { MAID_ATELIER_TITLEBAR_BRAND } from './titlebar-brand.ts'
import './vj815.module.css'

const SKIN_TITLE = '一九四五年八月十五日 · DeepSeek Harness'
const SKIN_OWNER = '815'
const SKIN_SYSTEM_CHROME_COLOR = '#1a1c14'
const SIDEBAR_COLUMN_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])"

const BACKDROP_PROPERTIES = [
  'background-image',
  'background-position',
  'background-size',
  'background-attachment',
  'background-repeat',
  '--vj-photo',
  '--vj-rescript',
  '--vj-sidebar-width',
  '--vj-titlebar-height',
] as const

function decorateTitlebarBrand(ownedNodes: Set<Element>): void {
  const titlebar = document.querySelector<HTMLElement>("[class*='titlebar']")
  if (!titlebar) return
  if (titlebar.querySelector("[data-skin-chrome='titlebar-brand']")) return
  const brand = document.createElement('span')
  brand.dataset.skinChrome = 'titlebar-brand'
  brand.dataset.skinOwner = SKIN_OWNER
  brand.setAttribute('aria-hidden', 'true')
  brand.innerHTML = MAID_ATELIER_TITLEBAR_BRAND
  ownedNodes.add(brand)
  titlebar.prepend(brand)
}

function decorateSidebarPlaque(ownedNodes: Set<Element>): void {
  const sidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
  const sidebarRoot = sidebar?.querySelector<HTMLElement>(':scope > div')
  if (!sidebar || !sidebarRoot) return
  if (sidebarRoot.querySelector("[data-skin-chrome='rescript-plaque']")) return
  const plaque = document.createElement('img')
  plaque.dataset.skinChrome = 'rescript-plaque'
  plaque.dataset.skinOwner = SKIN_OWNER
  plaque.alt = ''
  plaque.setAttribute('aria-hidden', 'true')
  plaque.src = IMPERIAL_RESCRIPT
  ownedNodes.add(plaque)
  sidebarRoot.prepend(plaque)
}

/**
 * 写入皮肤背景与史料牌，并由 effect 在卸载时整份撤回。
 * @param ctx - 拥有效果生命周期的 Cordis 上下文
 */
export function apply(ctx: Context): void {
  const body = document.body
  const originalTitle = document.title
  const previous = new Map<string, string>()
  for (const property of BACKDROP_PROPERTIES) {
    previous.set(property, body.style.getPropertyValue(property))
  }

  const ownedNodes = new Set<Element>()
  let themeColorMeta: HTMLMetaElement | null = null
  let previousThemeColor: string | undefined
  let themeColorObserver: MutationObserver | undefined
  let observer: MutationObserver | undefined
  let titlebarOverlay: WindowControlsOverlay | undefined
  let syncTitlebarHeight: (() => void) | undefined
  let observedSidebar: HTMLElement | undefined
  let resizeObserver: ResizeObserver | undefined

  ctx.effect(() => () => {
    body.removeAttribute('data-dsh-815')
    observer?.disconnect()
    themeColorObserver?.disconnect()
    resizeObserver?.disconnect()
    if (titlebarOverlay !== undefined && syncTitlebarHeight !== undefined) {
      titlebarOverlay.removeEventListener('geometrychange', syncTitlebarHeight)
    }
    for (const [property, value] of previous) {
      body.style.setProperty(property, value)
    }
    ownedNodes.forEach(element => element.remove())
    if (themeColorMeta?.isConnected && themeColorMeta.content === SKIN_SYSTEM_CHROME_COLOR) {
      themeColorMeta.content = previousThemeColor ?? ''
    }
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }, 'ui-skin-815: surrender photograph backdrop')

  const syncSystemChrome = (): void => {
    const meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta === null) return
    if (meta !== themeColorMeta) {
      themeColorMeta = meta
      previousThemeColor = meta.content
    }
    if (meta.content !== SKIN_SYSTEM_CHROME_COLOR) meta.content = SKIN_SYSTEM_CHROME_COLOR
  }
  themeColorObserver = new MutationObserver(syncSystemChrome)
  themeColorObserver.observe(document.head, {
    attributes: true,
    attributeFilter: ['content'],
    childList: true,
    subtree: true,
  })
  syncSystemChrome()

  body.setAttribute('data-dsh-815', '')
  body.style.setProperty('--vj-photo', `url(${SURRENDER_PHOTO})`)
  body.style.setProperty('--vj-rescript', `url(${IMPERIAL_RESCRIPT})`)
  body.style.setProperty('background-image', `url(${SURRENDER_PHOTO})`)
  body.style.setProperty('background-position', 'center 42%')
  body.style.setProperty('background-size', 'cover')
  body.style.setProperty('background-attachment', 'fixed')
  body.style.setProperty('background-repeat', 'no-repeat')

  const widthSheet = document.createElement('style')
  widthSheet.dataset.skinChrome = 'sidebar-width-rule'
  widthSheet.dataset.skinOwner = SKIN_OWNER
  ownedNodes.add(widthSheet)
  document.head.append(widthSheet)
  widthSheet.sheet!.insertRule('body { --vj-sidebar-width: 280px; --vj-titlebar-height: 0px; }')
  const appendRule = (rule: string): void => {
    widthSheet.sheet!.insertRule(rule, widthSheet.sheet!.cssRules.length)
  }
  appendRule('body[data-dsh-815] [class*="frame"][data-wco] { grid-template-rows: env(titlebar-area-height, 40px) 1fr; }')
  appendRule('body[data-dsh-815] [class*="frame"][data-desktop] { grid-template-rows: 32px 1fr; }')
  const widthRule = widthSheet.sheet!.cssRules[0] as CSSStyleRule

  syncTitlebarHeight = (): void => {
    const columns = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
    if (columns !== null) {
      const top = columns.getBoundingClientRect().top
      if (top > 0) {
        widthRule.style.setProperty('--vj-titlebar-height', `${top}px`)
        return
      }
    }
    if (document.querySelector("[class*='frame'][data-desktop]") !== null) {
      widthRule.style.setProperty('--vj-titlebar-height', '32px')
      return
    }
    widthRule.style.setProperty('--vj-titlebar-height', '0px')
  }
  titlebarOverlay = navigator.windowControlsOverlay
  titlebarOverlay?.addEventListener('geometrychange', syncTitlebarHeight)
  syncTitlebarHeight()

  const applySidebarWidth = (width: number): void => {
    if (width <= 0) return
    widthRule.style.setProperty('--vj-sidebar-width', `${Math.round(width * 100) / 100}px`)
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.at(-1)
      if (!entry) return
      applySidebarWidth(entry.contentRect.width)
    })
  }

  const ensureSidebarObserved = (): void => {
    const sidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
    if (!resizeObserver || sidebar === observedSidebar) return
    if (!sidebar) {
      if (observedSidebar) resizeObserver.unobserve(observedSidebar)
      observedSidebar = undefined
      return
    }
    if (observedSidebar) resizeObserver.unobserve(observedSidebar)
    observedSidebar = sidebar
    resizeObserver.observe(sidebar)
  }

  decorateTitlebarBrand(ownedNodes)
  decorateSidebarPlaque(ownedNodes)
  ensureSidebarObserved()
  const initialSidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
  if (initialSidebar) applySidebarWidth(initialSidebar.getBoundingClientRect().width)

  observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes') continue
      const appNodes = [...record.addedNodes].filter(node => node instanceof Element)
      if (appNodes.some(node =>
        node instanceof Element
        && (node.matches(SIDEBAR_COLUMN_SELECTOR)
          || node.querySelector(SIDEBAR_COLUMN_SELECTOR) !== null
          || node.matches("[class*='titlebar']")
          || node.querySelector("[class*='titlebar']") !== null))) {
        decorateTitlebarBrand(ownedNodes)
        decorateSidebarPlaque(ownedNodes)
        ensureSidebarObserved()
        syncTitlebarHeight?.()
      }
    }
  })
  observer.observe(body, { childList: true, subtree: true })

  const caption = document.createElement('div')
  caption.dataset.skinChrome = 'caption'
  caption.dataset.skinOwner = SKIN_OWNER
  caption.textContent = '1945.9.9 南京 · 陈坚《公元一千九百四十五年九月九日九时》'
  ownedNodes.add(caption)
  body.append(caption)

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.type = 'image/png'
  favicon.href = SURRENDER_PHOTO
  favicon.dataset.skinChrome = 'favicon'
  favicon.dataset.skinOwner = SKIN_OWNER
  ownedNodes.add(favicon)
  document.head.append(favicon)

  document.title = SKIN_TITLE
}
