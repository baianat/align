# Align

A simple text editor with expandable commands.

## key features

* Built using vanilla ES6
* Customizable using an array of settings
* Built-in, fully-integrated colorpicker
* The ability to add more custom commands

[example](https://baianat.github.io/align/)

## How to use

### Installation

First step is to install it using `yarn` or `npm`:

```bash
npm install @baianat/align

# or use yarn
yarn add @baianat/align
```

### Include necessary files

``` html
<head>
  <link rel="stylesheet" href="dist/css/align.css">
</head>
<body>
    ...
    <script type="text/javascript" src="dist/js/align.js"></script>
</body>
```

### HTML Layout

You need a div to render `Align` in it.

``` html
<div class="align"></div>

<script>
  new Align('.align', {
    // settings
  });
</script>
```

You can also pass the element directly to the constructor

``` html
<div class="align"></div>

<script>
  const myAlign = document.querySelector('.align');
  new Align(myAlign, {
    // settings
  });
</script>
```

### Align

Align comes with two styling bars(stylers), the main toolbar (`toolbar`) and the pop-up toolbar (`bubble`) that pops when you select a text.

You can choose to work with either of the toolbars, or both of them, by passing the `toolbar` object and/or the `bubble` object to the `Align` settings object.

You can choose what commands you'd like both of the stylers to include, by passing the desired commands through the `commands` array.

```js
new Align('.editor', {
  toolbar: {
    commands: [
      {'fontSize': [false, 1, 2, 3, 4, 5, 6, 7]},
      {'font': ['Raleway', 'Roboto', 'Poppins']},
      'separator',
      'bold', 'italic', 'underline', 'strikeThrough',
      'separator',
      'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
      'separator',
      'h1', 'h2', 'p', 'blockquote', 'pre',
      'separator',
      'addImage', 'html',
      'separator',
      'color'
    ]
  },
  bubble: {
    commands: [
      'bold', 'italic', 'underline', 'strikeThrough',
      'separator',
      'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'
    ]
  }
});
```

List of all available commands

| COMMAND     | DESCRIPTION |
|-------------|-------------|
|font         | Surround selected text with an element, with class name same as selected font e.g. `align-font-roboto`|
|color        | Changes a font color for the selection or at the insertion point |
|fontSize     | Changes the font size for the selection or at the insertion point |
|bold         | Toggles bold on/off for the selection or at the insertion point |
|italic       | Toggles italics on/off for the selection or at the insertion point |
|underline    | Toggles underline on/off for the selection or at the insertion point |
|strikeThrough| Toggles strikethrough on/off for the selection or at the insertion point |
|removeFormat | Removes all formatting from the current selection |
|justifyLeft  | Justifies the selection or insertion point to the left |
|justifyCenter| Centers the selection or insertion point |
|justifyRight | Right-justifies the selection or the insertion point |
|justifyFull  | Justifies the selection or insertion point |
|h1           | Adds an HTML h1 tag around the line containing the current selection |
|h2           | Adds an HTML h2 tag around the line containing the current selection |
|blockquote   | Adds an HTML blockquote tag around the line containing the current selection |
|p            | Adds an HTML p tag around the line containing the current selection |
|pre          | Adds an HTML pre tag around the line containing the current selection so you can highlight its script |
|html         | Toggles HTML on/off for all text |
|sperator     | Used for decoration to separate commands |

### Adding new custom commands

To extend `Align`'s [cmdsSchemas](https://github.com/baianat/align/blob/master/src/js/cmdsSchemas.js) object to add a new command or overwrite a current command behavior, use `Align.extend('commandName', { //setting })`
> Note: you can overwrite the current commands behavior, if you used your `commandName` same as one of `Align`'s commands.

```javaScript
Align.extend('commandName', {
  element: 'custom',
  data() {
    // a function to store a reference to command elements
  },
  create() {
    // a function to render the command on execution
  },
  action() {
    // a function to define command actions
  }
})
```

A full working example on how to overwrite the current `addImage` command

```javaScript
Align.extend('addImage', {
  element: 'custom',
  data() {
    return {
      button: document.createElement('button'),
      input: document.createElement('input'),
      icon:
        `<svg class="icon" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
        </svg>`
    }
  },
  create() {
    this.$data = this.data;
    this.data = this.$data();
    const button = this.data.button;
    const input = this.data.input;
    const icon = this.data.icon;

    button.classList.add('styler-button');
    button.appendChild(input);
    button.insertAdjacentHTML('beforeend', icon);
    input.classList.add('styler-input');
    input.type = 'file';
    input.id = 'addImage';
    input.addEventListener('change', this.action.bind(this));

    return button;
  },
  action() {
    const file = this.data.input.files[0];
    const selectedPosition = window.getSelection().getRangeAt(0);
    if (!file || !window.getSelection().rangeCount) return;
    const imageURL = URL.createObjectURL(file);
    const img = document.createElement('img');

    img.src = imageURL;
    img.classList.add('align-image');
    selectedPosition.insertNode(img);
    this.data.input.value = null;

    // add your logic to save `imageURL` in the database
  }
});
```

### Adding new custom icon

If you want to change `Align`'s [icons](https://github.com/baianat/align/blob/master/src/js/icons.js) or add a new one, use `Align.extendIcon('iconName', 'svg path')`
> Note: your icon should be only one path SVG.

```js
// change bold command icon
Align.extendIcons('bold', 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z');
```

### Getting the content

Finally, to get `Align`'s content you can use `content` property

```js
saveToDatabase(myEditor.content);
```

### highlight 

We using [highlight.js](https://highlightjs.org/) plug-in to highlight pre tags.
To enable syntax highlighting you have to include `highlight.js` as external dependence before `Align`

```html
<head>
  <link rel="stylesheet" href="dist/css/align.css">
  <link rel="stylesheet" href="path-to/highlight.min.css">
</head>
<body>
    ...
  <script src="path-to/highlight.min.js"></script>
  <script src="dist/js/align.js"></script>
</body>

```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017 [Baianat](http://baianat.com)
