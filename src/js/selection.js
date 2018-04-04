export default class Selection {
  static current = null;
  static textRange = null;
  static range = null;


  static selectTextRange(range = Selection.textRange) {
    if (!range) return;
    const sel = Selection.current = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  static selectElement(el) {
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = Selection.current = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  static update() {
    const sel = Selection.current = window.getSelection();
    if (sel.rangeCount && sel.anchorNode.nodeType === 3) {
      Selection.textRange = sel.getRangeAt(0);
    }
    if (sel.rangeCount) {
      Selection.range = sel.getRangeAt(0);
    }
  }
}
