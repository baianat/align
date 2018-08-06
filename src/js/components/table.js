import Component from './component';
import Prompt from '../prompt';
import Styler from '../styler';

export default class Table extends Component {
  constructor (align, table) {
    if (!table) return;
    this.$align = align;
    this._init(table);
    this._initEvents();
    this.activeCell = this.el.rows[0].cells[0];
  }

  static add (align) {
    const prompt = new Prompt(align, {
      message: 'Enter post link:',
      inputsCount: 2,
      inputsPlaceholders: ['rows', 'columns']
    });

    return new Promise((resolve, reject) => {
      prompt.onSubmit(() => {
        const table = new Table(align, {
          rows: prompt.inputs[0].value,
          columns: prompt.inputs[1].value
        });
        resolve(table);
      });
    });
  }

  _init (table) {
    this.toolbar = new Styler(this.$align, Table.toolbar);
    if (table.nodeName === 'TABLE') {
      this.el = table;
      this.el.classList.add('align-table');
      return;
    }
    const rows = Number(table.rows);
    const columns = Number(table.columns);
    if (isNaN(rows) || isNaN(columns)) {
      return;
    }
    this.el = document.createElement('table');
    this.el.classList.add('align-table');
    this.el.insertAdjacentHTML('afterbegin', `
        <tr>
          ${'<td><br></td>'.repeat(columns)}
        </tr>
      `.repeat(rows));
  }

  _initEvents () {
    this.el.addEventListener('click', event => {
      this.activeCell = event.target;
      this.toolbar.update(this);
    });
  }

  insertRow (args) {
    const position = args[0];
    const columnsLength = this.el.rows[0].cells.length;
    const newIndex = this.activeCell.parentNode.rowIndex + (position === 'after' ? 1 : 0);
    const row = this.el.insertRow(newIndex);
    for (let i = 0; i < columnsLength; i++) {
      const cell = row.insertCell(i);
      cell.insertAdjacentHTML('afterbegin', '<br>');
    }
  }

  deleteRow () {
    this.el.deleteRow(this.activeCell.parentNode.rowIndex);
  }

  insertColumn (args) {
    const position = args[0];
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

  remove () {
    this.toolbar.remove();
    this.el.remove();
  }

  static toolbar = {
    mode: 'bubble',
    hideWhenClickOut: true,
    addActiveClass: true,
    commands: [
      {
        element: 'button',
        func: 'insertRow',
        args: ['before'],
        icon: 'tableRowTop'
      }, {
        element: 'button',
        func: 'insertRow',
        args: ['after'],
        icon: 'tableRowBottom'
      }, {
        element: 'button',
        func: 'insertColumn',
        args: ['before'],
        icon: 'tableColumnBefore'
      }, {
        element: 'button',
        func: 'insertColumn',
        args: ['after'],
        icon: 'tableColumnAfter'
      },
      'separator',
      {
        element: 'button',
        func: 'deleteRow',
        icon: 'tableDeleteRow'
      }, {
        element: 'button',
        func: 'deleteColumn',
        icon: 'tableDeleteColumn'
      },
      'separator',
      'remove'
    ],
    tooltip: true
  }

  static schema = {
    icon: 'table',
    tooltip: 'Add Table'
  }
}
