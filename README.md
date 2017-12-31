# Align

ES6 Text editor

## key features

* Build using ES6 classes
* Customizing using arry of settings
* Built-in colorpicker to change font color

[example](https://baianat.github.io/editor/)

## How to use

### include necessary files

``` html
<head>
  <link rel="stylesheet" href="dist/css/align.css">
</head>
<body>
    ...
    <script type="text/javascript" src="dist/js/align.js"></script>
</body>
```

### HTML markup

you need an div to render editor in it.

``` html
<div class="editor"></div>

<script>
  let myEditor = new Align('.editor', {
    defaultText: 'Hello there I\'m Baianat\'s editor!'
  });
</script>
```

to customize editor's styler commands, you can pass to commands key as array of commands as value.

```js
let myEditor = new Align('.editor', {
  styler: {
    mode: 'default', // default or bubble
    commands: ['color', 'sperator', 'fontName', 'fontSize']
  }
});
```

list of all available commands

| Command     | Discription |
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
|pre          | Adds an HTML pre tag around the line containing the current selection and highlight it's script |
|addImage     | Upload image add inseart it |
|html         | Toggles HTML on/off for all text |
|sperator     | Use for decorate to sperate commands |

finally to get editor's content you can use `content` propertie

```js
saveToDatabase(myEditor.content);
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017 [Baianat](http://baianat.com)
