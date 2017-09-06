export let styler = `
  <ul class="styler">
    <li>
      <select class="styler-select" id="size">
        <option selected>
          size
        </option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </select>
    </li>
    <li>
      <input class="styler-color" id="color" type="color"/>
    </li>
    <li>
      <button class="styler-button" id="bold">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-bold"></use>
        </svg>
      </button>
    </li>
    <li>
      <button class="styler-button" id="italic">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-italic"></use>
        </svg>
      </button>
    </li>
    <li>
      <button class="styler-button" id="underline">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-underline"></use>
        </svg>
      </button>
    </li>
    <li>
      <button class="styler-button" id="alignLeft">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-alignLeft"></use>
        </svg>
      </button>
    </li>
    <li>
      <button class="styler-button" id="alignCenter">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-alignCenter"></use>
        </svg>
      </button>
    </li>
    <li>
      <button class="styler-button" id="alignRight">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-alignRight"></use>
        </svg>
      </button>
    </li>
    <li>
      <button class="styler-button">
        <input class="styler-input" type="file" id="addImage">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-image"></use>
        </svg>
      </button>
    </li>
  </ul>
`