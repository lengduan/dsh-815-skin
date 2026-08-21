/**
 * 1945 终战皮肤。客户端入口只做展示层：南京受降油画背景、token 覆盖。
 * effect 销毁器还原全部 CSS/DOM 写入。
 */
import type { Context } from '@deepseek-ai/cordis'
import { SURRENDER_PHOTO_2K, SURRENDER_PHOTO_4K } from './art.generated.ts'
import { MAID_ATELIER_TITLEBAR_BRAND } from './titlebar-brand.ts'
import './vj815.module.css'

const SKIN_TITLE = '一九四五年八月十五日 · DeepSeek Harness'
const SKIN_OWNER = '815'
const SKIN_SYSTEM_CHROME_COLOR = '#080a06'
const SIDEBAR_COLUMN_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])"

const BACKDROP_PROPERTIES = [
  'background-image',
  'background-position',
  'background-size',
  'background-attachment',
  'background-repeat',
  'background-color',
  '--vj-photo',
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

/**
 * 从女仆皮 copy：给侧栏 treeitem 打会话标记，选中行才能挂青天白日小旗。
 * @param decoratedElements - 卸载时清除 data-* 的节点集合
 */
function decorateWorkspaceTree(decoratedElements: Set<HTMLElement>): void {
  const sidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
  if (!sidebar) return

  sidebar.querySelectorAll<HTMLElement>(
    '[data-vj-session], [data-vj-session-flat]',
  ).forEach((element) => {
    delete element.dataset.vjSession
    delete element.dataset.vjSessionFlat
  })

  sidebar.querySelectorAll<HTMLElement>("[role='tree']").forEach((tree) => {
    const rows = [...tree.querySelectorAll<HTMLElement>("[role='treeitem']")]
    if (tree.matches("[class*='flatList']") && !rows.some(row => row.hasAttribute('aria-expanded'))) {
      rows.filter(row => row.hasAttribute('aria-selected')).forEach((sessionRow) => {
        sessionRow.dataset.vjSession = ''
        sessionRow.dataset.vjSessionFlat = ''
        decoratedElements.add(sessionRow)
      })
      return
    }

    let workspaceRow: HTMLElement | undefined
    let sessionRows: HTMLElement[] = []
    const decorateGroup = (): void => {
      if (!workspaceRow) return
      sessionRows.forEach((sessionRow) => {
        sessionRow.dataset.vjSession = ''
        decoratedElements.add(sessionRow)
      })
    }

    rows.forEach((row) => {
      if (row.hasAttribute('aria-expanded')) {
        decorateGroup()
        workspaceRow = row
        sessionRows = []
      } else if (workspaceRow && row.hasAttribute('aria-selected')) {
        sessionRows.push(row)
      }
    })
    decorateGroup()
  })
}

/**
 * 写入皮肤背景，并由 effect 在卸载时整份撤回。
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
  const decoratedElements = new Set<HTMLElement>()
  let themeColorMeta: HTMLMetaElement | null = null
  let previousThemeColor: string | undefined
  let themeColorObserver: MutationObserver | undefined
  let observer: MutationObserver | undefined
  let titlebarOverlay: WindowControlsOverlay | undefined
  let syncTitlebarHeight: (() => void) | undefined
  let observedSidebar: HTMLElement | undefined
  let resizeObserver: ResizeObserver | undefined
  let syncBackdrop: (() => void) | undefined

  ctx.effect(() => () => {
    body.removeAttribute('data-dsh-815')
    observer?.disconnect()
    themeColorObserver?.disconnect()
    resizeObserver?.disconnect()
    if (syncBackdrop !== undefined) {
      window.removeEventListener('resize', syncBackdrop)
    }
    if (titlebarOverlay !== undefined && syncTitlebarHeight !== undefined) {
      titlebarOverlay.removeEventListener('geometrychange', syncTitlebarHeight)
    }
    for (const [property, value] of previous) {
      body.style.setProperty(property, value)
    }
    ownedNodes.forEach(element => element.remove())
    decoratedElements.forEach((element) => {
      delete element.dataset.vjSession
      delete element.dataset.vjSessionFlat
    })
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
  body.style.setProperty('background-position', 'center 42%')
  body.style.setProperty('background-size', 'cover')
  body.style.setProperty('background-attachment', 'fixed')
  body.style.setProperty('background-repeat', 'no-repeat')
  body.style.setProperty('background-color', '#080a06')

  /** 设备像素宽 >= 2560 用 4K，否则 2K。 */
  syncBackdrop = (): void => {
    const deviceWidth = window.innerWidth * (window.devicePixelRatio || 1)
    const photo = deviceWidth >= 2560 ? SURRENDER_PHOTO_4K : SURRENDER_PHOTO_2K
    const url = `url(${photo})`
    body.style.setProperty('--vj-photo', url)
    body.style.setProperty('background-image', url)
  }
  window.addEventListener('resize', syncBackdrop)
  syncBackdrop()

  const widthSheet = document.createElement('style')
  widthSheet.dataset.skinChrome = 'sidebar-width-rule'
  widthSheet.dataset.skinOwner = SKIN_OWNER
  ownedNodes.add(widthSheet)
  document.head.append(widthSheet)
  widthSheet.sheet!.insertRule('html, body { background-color: #080a06; --vj-sidebar-width: 280px; --vj-titlebar-height: 0px; }')
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
  decorateWorkspaceTree(decoratedElements)
  ensureSidebarObserved()
  const initialSidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
  if (initialSidebar) applySidebarWidth(initialSidebar.getBoundingClientRect().width)

  observer = new MutationObserver((records) => {
    let sidebarStructureChanged = false
    let workspaceStateChanged = false
    for (const record of records) {
      if (record.type === 'attributes') {
        const target = record.target instanceof Element ? record.target : undefined
        if ((record.attributeName === 'aria-expanded' || record.attributeName === 'aria-selected')
          && target !== undefined && target.closest(SIDEBAR_COLUMN_SELECTOR) !== null) {
          workspaceStateChanged = true
        }
        continue
      }
      const appNodes = [...record.addedNodes].filter(node => node instanceof Element)
      if (appNodes.some(node =>
        node instanceof Element
        && (node.matches(SIDEBAR_COLUMN_SELECTOR)
          || node.querySelector(SIDEBAR_COLUMN_SELECTOR) !== null
          || node.matches("[class*='titlebar']")
          || node.querySelector("[class*='titlebar']") !== null))) {
        sidebarStructureChanged = true
      }
    }
    if (sidebarStructureChanged) {
      decorateTitlebarBrand(ownedNodes)
      decorateWorkspaceTree(decoratedElements)
      ensureSidebarObserved()
      syncTitlebarHeight?.()
    } else if (workspaceStateChanged) {
      decorateWorkspaceTree(decoratedElements)
    }
  })
  observer.observe(body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-expanded', 'aria-selected'],
  })

  const caption = document.createElement('div')
  caption.dataset.skinChrome = 'caption'
  caption.dataset.skinOwner = SKIN_OWNER
  /* 展签两行：主行画名，副行时间地点事件。 */
  const captionTitle = document.createElement('span')
  captionTitle.dataset.skinChrome = 'caption-title'
  captionTitle.textContent = '陈坚《公元一九四五年九月九日九时》'
  const captionSub = document.createElement('span')
  captionSub.dataset.skinChrome = 'caption-sub'
  captionSub.textContent = '1945.9.9 九时 · 南京 中国战区日军投降签字'
  caption.append(captionTitle, captionSub)
  ownedNodes.add(caption)
  body.append(caption)

  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.type = 'image/jpeg'
  favicon.href = SURRENDER_PHOTO_2K
  favicon.dataset.skinChrome = 'favicon'
  favicon.dataset.skinOwner = SKIN_OWNER
  ownedNodes.add(favicon)
  document.head.append(favicon)

  document.title = SKIN_TITLE
}
