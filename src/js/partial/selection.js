export default class Selection {
  /* eslint-disable */
  static _current = null;
  static textRange = null;
  static range = null;
  /* eslint-enable */

  static get current () {
    return Selection._current || window.getSelection();
  }
  static selectRange (range = Selection.textRange) {
    if (!range) return;
    const sel = Selection.current;
    sel.removeAllRanges();
    sel.addRange(range);
  }

  static selectElement (el) {
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = Selection.current;
    sel.removeAllRanges();
    sel.addRange(range);
  }

  static clear () {
    const sel = Selection.current;
    sel.empty();
  }

  static update () {
    const sel = Selection.current;
    // check if the range is inside a section
    if (
      sel.anchorNode &&
      !sel.anchorNode.parentNode.closest('.align-content')
    ) {
      return;
    }
    if (sel.rangeCount && sel.anchorNode.nodeType === 3) {
      Selection.textRange = sel.getRangeAt(0);
    }
    if (sel.rangeCount) {
      Selection.range = sel.getRangeAt(0);
    }
  }
}
