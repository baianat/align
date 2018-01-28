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

  get selection() {
    return window.getSelection();
  }

  static updateSelection(range) {
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

export default Selection;