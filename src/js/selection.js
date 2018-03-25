let CURRENT_SELECTION = null;
let TEXT_RANGE = null;
let RANGE = null;

export default class Selection {
  static set textRange(range) {
    if (!range) return;
    TEXT_RANGE = range;
  }

  static get textRange() {
    return TEXT_RANGE;
  }

  static set range(range) {
    if (!range) return;
    RANGE = range;
  }

  static get range() {
    return RANGE;
  }

  static set current(selection) {
    CURRENT_SELECTION = selection;
  }

  static get current() {
    return CURRENT_SELECTION;
  }

  static selectTextRange(range = Selection.textRange) {
    if (!range) return;
    console.log(range)
    const sel = Selection.current = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  static updateSelectedRange() {
    const sel = Selection.current = window.getSelection();
    if (sel.rangeCount && sel.anchorNode.nodeType === 3) {
      Selection.textRange = sel.getRangeAt(0);
    }
    if (sel.rangeCount) {
      Selection.range = sel.getRangeAt(0);
    }
  }
}
