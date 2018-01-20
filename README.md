# Align

A simple text editor with expandable commands.

## key features

* Built using vanilla ES6
* Customizable using an array of settings
* Built-in, fully-integrated colorpicker
* The ability to add more custom commands

[example](https://baianat.github.io/editor/)

## How to use

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
    //settings
  });
</script>
```

You can also pass the element directly to the constructor

``` html
<div class="align"></div>

<script>
  const myAlign = document.querySelector('.align');
  new Align(myAlign, {
    //settings
  });
</script>
```

### Customizing Align

To customize editor's styler, through `styler` key in the settings object.

```js
new Align('.editor', {
  styler: {
    mode: 'default', // default or bubble
    commands: ['color', 'sperator', 'fontName', 'fontSize']
  }
});
```

List of all available commands

| COMMAND     | DESCRIPTION |
|-------------|-------------|
|color        | Changes a font color for the selection or at the insertion point |
|fontName     | Changes the font name for the selection or at the insertion point |
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
|pre          | Adds an HTML pre tag around the line containing the current selection and highlight its script |
|html         | Toggles HTML on/off for all text |
|sperator     | Used for decoration to separate commands |

### Adding your new custom commands

To add a new command you use `Align.extend()`

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

A full working example on how to add a custom image input command

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
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    const img = document.createElement('img');
    const p = document.createElement('p');
    let selectedPosition;

    img.src = imageURL;
    img.classList.add('align-image');
    if (!window.getSelection().rangeCount) return;
    selectedPosition = window.getSelection().getRangeAt(0);
    p.appendChild(img);
    selectedPosition.insertNode(p);
    this.data.input.value = null;

    // add your logic to save image in database
  }
});
```

### Getting the content

Finally, to get `Align`'s content you can use `content` property

```js
saveToDatabase(myEditor.content);
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017 [Baianat](http://baianat.com)
