let SELECTED_RANGE = null;

class Selection {
  constructor() {

  }

  set selectedRange(range) {
    if (!range) return;
    SELECTED_RANGE = range;
  }

  get selectedRange() {
    return SELECTED_RANGE;
  }

  static updateSelection(range = Selection.selectedRange) {
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  static updateSelectedRange() {
    const sel = window.getSelection();
    if (sel.rangeCount && sel.anchorNode.nodeType === 3) {
      Selection.selectedRange = sel.getRangeAt(0);
    }
  }
}

export default Selection;