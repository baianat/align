# Customization

## Styler

To give more flexibility, Align comes with three styling bars (`styler`s), all of them can configure the same way, the difference between them is the use case each one is designed to use within.

* `toolbar`
  * **usage**: it uses for all commands you want to be available in your editor.
  * **active**: always active and sticky at the top.
* `bubble`
  * **usage**: it uses for frequently used commands for quick and easy access.
  * **active**: when you select a range of text, it pops up on top of text.
* `creator`
  * **usage**: it's dedicated only to adding new items like images, tables, etc...
  * **active**: when you enter a new empty line.

You can choose to work with one of the `styler`s, or all of them depends on your application needs and behavior.
Simply pass `toolbar`, `bubble` and/or `creator` object to the `Align` settings object.

## Settings

```js
new Align('.editor', {
  // enables post title, default (false)
  // uses the string for the placeholder
  postTitle: 'title placeholder',
  // enables toolbar styler
  toolbar: {
    // shows or hide commands tooltip, default (false)
    tooltip: true,
    // enables or disable keyboard shortcuts, default (false)
    shortcuts: true,
    // shows the styler theme (light/dark), default (light)
    theme: 'light',
    // array of commands to show in this styler
    commands: [
      {'fontSize': [false, 1, 2, 3, 4, 5, 6, 7]},
      {'fontName': ['Poppins', 'Raleway', 'Roboto']},
      'separator',
      'bold', 'italic', 'underline', 'strikeThrough',
      'separator',
      'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
      'separator',
      'h2', 'h3', 'h4', 'p', 'blockquote', 'pre', 'createLink',
      'separator',
      'orderedList', 'unorderedList', 'indent', 'outdent',
      'superscript', 'subscript',
      'separator',
      'color', 'backColor',
      'separator',
      'selectContent', 'removeFormat', 'undo', 'redo', 'fullscreen'
    ]
  },
  // enables bubble styler
  bubble: {
    ...
  },
  // enables creator styler
  creator: {
    ...
  }
});
```

## Available Styler Commands

| COMMAND       | SHORTCUT | DESCRIPTION |
|---------------|----------| ----------- |
| font          | | ***[dropdown]*** changes the font name for the selection or at the insertion point.|
| fontSize      | | ***[dropdown]*** changes the font size for the selection or at the insertion point. |
| color         | | changes a font color for the selection or at the insertion point. |
| backColor     | | changes the element background color. |
| bold          | Mac: ⌘ B <br/> Win: Ctrl B | toggles bold on/off for the selection or at the insertion point. |
| italic        | Mac: ⌘ I <br/> Win: Ctrl I | toggles italics on/off for the selection or at the insertion point. |
| underline     | Mac: ⌘ U <br/> Win: Ctrl U | toggles underline on/off for the selection or at the insertion point. |
| strikeThrough | | toggles strikethrough on/off for the selection or at the insertion point. |
| justifyLeft   | Mac: ⌘ L <br/> Win: Ctrl L | justifies the selection or insertion point to the left. |
| justifyCenter | Mac: ⌘ E <br/> Win: Ctrl E | centers the selection or insertion point.|
|justifyRight   | Mac: ⌘ R <br/> Win: Ctrl R | right-justifies the selection or the insertion point. |
| justifyFull   | Mac: ⌘ J <br/> Win: Ctrl J | justifies the selection or insertion point. |
| superscript   | Mac: ⌘ ⇧ = <br/> Win: Ctrl ⇧ = | toggles superscript on/off for the selection or at the insertion point. |
| subscript     | Mac: ⌘ = <br/> Win: Ctrl = | toggles subscript on/off for the selection or at the insertion point. |
| indent        | Mac: ⇥ <br/> Win: Tab | indents the line containing the selection or insertion point. |
| outdent       | Mac: ⇧ ⇥ <br/> Win: Shift Tab | outdents the line containing the selection or insertion point. |
| selectContent | Mac: ⌘ ⇧ A <br/> Win: Ctrl Shift A | selects all of the content of the editor region. |
| removeFormat  | Mac: ⌘ \ <br/> Win: Ctrl \ | removes all formatting from the current selection. |
| h1            | | adds an HTML h1 tag around the line containing the current selection. |
| h2            | | adds an HTML h2 tag around the line containing the current selection. |
| blockquote    | | adds an HTML blockquote tag around the line containing the current selection. |
| p             | | adds an HTML p tag around the line containing the current selection. |
| pre           | | adds an HTML pre tag around the line containing the current selection so you can highlight its script. |
| orderedList   | | creates a numbered ordered list for the selection or at the insertion point. |
| unorderedList | | creates a bulleted unordered list for the selection or at the insertion point. |
| createLink    | | creates an anchor link from the selection text. |
| html          | | toggles HTML on/off for all text. |
| sperator      | | used for decoration to separate commands. |
| createFigure  | | uploads an image figure and inseart it at insert at the start of the selected range |
| createVideo   | | embed a video for youtube/vimeo url at insert at the start of the selected range |
| createPost    | | embed a facebook post from url at insert at the start of the selected range |
| createEmbed   | | embed any embed iframe script at insert at the start of the selected range |
| createTable   | | inserts a table at insert at the start of the selected range |
| createLine    | | inserts a selected horizontal line at insert at the start of the selected range |

## Custom Command

To extend `Align`'s [cmdsSchemas](https://github.com/baianat/align/blob/master/src/js/partial/cmdsSchema.js) object to add a new command or overwrite a current command behavior, use `Align.extend('commandName', { //setting })`

::: tip
you can overwrite the current commands behavior, if you used your `commandName` same as one of `Align`'s commands.
:::

```js
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

A full working example on how to add `addImage` command

```js
Align.extend('addImage', {
  element: 'custom',
  data() {
    return {
      button: document.createElement('div'),
      input: document.createElement('input'),
      icon:
        `<svg class="icon" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
        </svg>`
    }
  },
  create() {
    this.$data = this.data();
    const button = this.$data.button;
    const input = this.$data.input;
    const icon = this.$data.icon;

    button.classList.add('styler-button');
    button.appendChild(input);
    button.insertAdjacentHTML('beforeend', icon);
    input.classList.add('styler-input');
    input.type = 'file';
    input.addEventListener('change', this.action.bind(this));

    return button;
  },
  action() {
    const file = this.$data.input.files[0];
    const selectedPosition = window.getSelection().getRangeAt(0);
    if (!file || !window.getSelection().rangeCount) return;
    const imageURL = URL.createObjectURL(file);
    const img = document.createElement('img');

    img.src = imageURL;
    img.classList.add('align-image');
    selectedPosition.insertNode(img);
    this.$data.input.value = null;

    // add your logic to save `imageURL` in the database
  }
});
```

### Custom Icon

If you want to change `Align`'s [icons](https://github.com/baianat/align/blob/master/src/js/partial/icons.js) or add a new one, use `Align.extendIcon('iconName', 'svg path')`

```js
// change bold command icon
Align.extendIcons('bold', 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z');
```

::: warning
Icons should be only an `SVG` icon and contains just one path.
:::

### highlight

We using [highlight.js](https://highlightjs.org/) plug-in to highlight pre tags.
To enable syntax highlighting you have to include `highlight.js` as external dependence before `Align`

```html{3,7}
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
