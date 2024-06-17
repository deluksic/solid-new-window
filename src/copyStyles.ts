/**
 * Copies CSS style sheets from source window's document
 * to target's document, using `adoptedStyleSheets`.
 * @param source
 * @param targetWindow
 */
export function copyStyles(source: Window, targetWindow: Window) {
  const targetSheets = targetWindow.document.adoptedStyleSheets
  // @ts-expect-error
  const CSSStyleSheet: new () => CSSStyleSheet = targetWindow.CSSStyleSheet
  for (const sheet of source.document.styleSheets) {
    const newSheet = new CSSStyleSheet()
    for (const rule of sheet.cssRules) {
      newSheet.insertRule(
        rule.cssText,
        // index necessary, otherwise they are inserted in reverse order
        // due to `insertRule(..., 0)` being default (!!)
        newSheet.cssRules.length
      )
    }
    targetSheets.push(newSheet)
  }
}
