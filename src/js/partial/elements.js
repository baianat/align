import icons from './icons';

let NAMING_PREFIX = ''

export function setElementsPrefix(prefix) {
  NAMING_PREFIX = prefix;
}
/**
  * Create button HTML element
  * @param {String} name
  */
export function button(name, tooltip) {
  const button = document.createElement('button');
  button.classList.add(`${NAMING_PREFIX}button`);
  button.id = name;
  if (tooltip) {
    button.dataset.tooltip = tooltip;
  }
  button.insertAdjacentHTML('afterbegin', icons(name));
  return button;
}

/**
 * Create select options HTML element
 * @param {String} name
 * @param {Object} options
 */
export function select(name, options) {
  const selectWrapper = document.createElement('div');
  const select = document.createElement('select');
  const icon = `
    <svg viewBox="0 0 24 24">
      <polygon points="8,15 12,19 16,15 "/>
      <polygon points="8,9 12,5 16,9 "/>
    </svg>`;

  selectWrapper.classList.add(`${NAMING_PREFIX}select`);
  select.id = name;
  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.innerText = option === false ? name : option;
    select.appendChild(optionElement);
  })
  selectWrapper.appendChild(select);
  selectWrapper.insertAdjacentHTML('beforeend', icon);
  return selectWrapper;
}

/**
 * Create input HTML element
 * @param {String} name
 * @param {String} type
 */
export function input(name, type) {
  const input = document.createElement('input');
  input.classList.add(`${NAMING_PREFIX}${name}`);
  input.id = name;
  input.type = type;
  return input;
}

/**
 * Create input HTML element
 * @param {String} name
 * @param {String} type
 */
export function fileButton(name) {
  const wrapper = document.createElement('div');
  const input = document.createElement('input');

  wrapper.classList.add(`${NAMING_PREFIX}button`);
  wrapper.id = name;
  wrapper.appendChild(input);
  wrapper.insertAdjacentHTML('afterbegin', icons(name));
  input.classList.add(`${NAMING_PREFIX}input`);
  input.id = name;
  input.type = 'file';
  return { input: input, el: wrapper };
}

export function menuButton(name, func) {
  const menuItem = document.createElement('li');
  const currentButton = button(name);
  currentButton.addEventListener('click', func);
  menuItem.appendChild(currentButton);
  return menuItem;
}
