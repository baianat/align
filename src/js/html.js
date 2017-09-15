export let styler = `
  <ul class="styler">
    <li>
      <select class="styler-select" id="formating">
        <option selected>formatting</option>
        <option value="h1">Title 1</option>
        <option value="h2">Title 2</option>
        <option value="h3">Title 3</option>
        <option value="h4">Title 4</option>
        <option value="h5">Title 5</option>
        <option value="h6">Title 6</option>
        <option value="p">Paragraph</option>
        <option value="pre">Preformatted</option>
      </select>
    </li>
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
    <li class="styler-separator"></li>
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
      <button class="styler-button" id="strikeThrough">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-strikeThrough"></use>
        </svg>
      </button>
    </li>
    <li class="styler-separator"></li>
    <li>
      <button class="styler-button" id="justifyLeft">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-justifyLeft"></use>
        </svg>
      </button>
    </li>
    <li>
      <button class="styler-button" id="justifyCenter">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-justifyCenter"></use>
        </svg>
      </button>
    </li>
    <li>
      <button class="styler-button" id="justifyRight">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-justifyRight"></use>
        </svg>
      </button>
    </li>
    <li>
      <button class="styler-button" id="justifyFull">
        <svg class="icon">
          <use xlink:href="dist/svg/symbols.svg#icon-justifyFull"></use>
        </svg>
      </button>
    </li>
    <li class="styler-separator"></li>    
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