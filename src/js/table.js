import Styler from './styler';

export default class Table {
  constructor (table) {
    if (!table) return;
    this._init(table);
    this._initEvents();
    this.activeCell = this.el.rows[0].cells[0];
  }

  static config(align, settings) {
    const config = Object.assign({
      mode: 'bubble',
      hideWhenClickOut: true,
      commands: [
        '_tableRowTop', '_tableRowBottom', '_tableColumnBefore', '_tableColumnAfter',
        'separator',
        '_tableDeleteRow', '_tableDeleteColumn',
        'separator',
        '_remove'
      ],
      tooltip: true,
      theme: 'dark'
    }, settings);
    this.$align = align;
    this.$optionsBar = new Styler(align, config);
  }

  _init (table) {
    if (table.nodeName === 'TABLE') {
      this.el = table;
      this.el.classList.add('align-table')
      return;
    }
    const rows = Number(table.rows);
    const columns = Number(table.columns);
    if (isNaN(rows) || isNaN(columns)) {
      return;
    }
    this.el = document.createElement('table');
    this.el.classList.add('align-table')
    this.el.insertAdjacentHTML('afterbegin', `
        <tr>
          ${'<td><br></td>'.repeat(columns)}
        </tr>
      `.repeat(rows))
  }

  _initEvents () {
    this.el.addEventListener('click', event => {
      this.activeCell = event.target;
      Table.$optionsBar.show(this);
    })
  }

  remove () {
    this.el.remove();
  }

  insertRow ($styler, $schema) {
    const position = $schema.args[0];
    const columnsLength = this.el.rows[0].cells.length;
    const newIndex = + this.activeCell.parentNode.rowIndex + (position === 'after' ? 1 : 0);
    const row = this.el.insertRow(newIndex);
    for (let i = 0; i < columnsLength; i++) {
      const cell = row.insertCell(i);
      cell.insertAdjacentHTML('afterbegin', '<br>');
    }
  }

  deleteRow () {
    this.el.deleteRow(this.activeCell.parentNode.rowIndex)
  }

  insertColumn ($styler, $schema) {
    const position = $schema.args[0];
    const rowsLength = this.el.rows.length;
    const columnIndex = this.activeCell.cellIndex + (position === 'after' ? 1 : 0);
    for (let i = 0; i < rowsLength; i++) {
      const cell = this.el.rows[i].insertCell(columnIndex);
      cell.insertAdjacentHTML('afterbegin', '<br>');
    }
  }

  deleteColumn () {
    const rowsLength = this.el.rows.length;
    const columnIndex = this.activeCell.cellIndex;
    for (let i = 0; i < rowsLength; i++) {
      this.el.rows[i].deleteCell(columnIndex);
    }
  }
}