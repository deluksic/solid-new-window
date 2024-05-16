/**
 * Copies CSS style sheets from source window's document
 * to target's document, using `adoptedStyleSheets`.
 * @param source
 * @param targetWindow
 */
export function copyStyles(source: Window, targetWindow: Window) {
  const { document } = targetWindow
  // @ts-expect-error
  const CSSStyleSheet: new () => CSSStyleSheet = targetWindow.CSSStyleSheet
  for (const sheet of source.document.styleSheets) {
    const newSheet = new CSSStyleSheet()
    for (const rule of sheet.cssRules) {
      newSheet.insertRule(rule.cssText)
    }
    document.adoptedStyleSheets.push(newSheet)
  }
}
