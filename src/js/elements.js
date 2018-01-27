let NAMING_PREFIX = ''

export function setElementsPrefix(prefix) {
  NAMING_PREFIX = prefix;
}
/**
  * Create button HTML element
  * @param {String} name
  */
export function button(name, icon) {
  const button = document.createElement('button');
  button.classList.add(`${NAMING_PREFIX}button`);
  button.id = name;
  button.insertAdjacentHTML('afterbegin', `
      <svg class="icon" viewBox="0 0 24 24">
        <path d="${icon}"/>
      </svg>
    `);
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
    optionElement.value = option.value;
    optionElement.innerText = option.text;
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
