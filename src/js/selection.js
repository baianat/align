let SELECTED_RANGE = null;

class Selection {
  constructor() {

  }

  set selectedRange(range) {
    console.log(range);
    if (!range) return;
    SELECTED_RANGE = range;
  }

  get selectedRange() {
    return SELECTED_RANGE;
  }

  static updateSelection(range) {
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

export default Selection;