# API
[[toc]]

## Align

### content

To get `Align`'s current content

```js
saveToDatabase(alignInstance.content);
```

### title

To get `Align`'s post title

```js
const postTitle = alignInstance.title;
```

### extend(commandName, schema)

Extends `Align`'s [cmdsSchemas](https://github.com/baianat/align/blob/master/src/js/partial/cmdsSchema.js) object to add a new command or overwrite a current command behavior.

* `commandName` \<string\> command name you want to add/overwrite
* `schema` \<object\> new command schema

```js
Align.extend('commandName', {
  element: 'button',
  command: 'bold',
  tooltip: 'Bold',
  shortcut: {
    cmdKey: true,
    key: 'B'
  }
})
```

### extendIcons(name, path)

Extends `Align`'s [icons](https://github.com/baianat/align/blob/master/src/js/partial/icons.js) object to add a new icon or overwrite a current one.

* `name` \<string\> icon name you want to add/overwrite
* `path` \<string\> SVG icon path

```js
Align.extendIcons('bold', 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z');
```

### clearContent()

Removes all sections and its contents.

### update()

Updates all stylers status.

## Events Bus

Align has events bus(`$bus`), you can use to handle any resources uploading.

### on(event, callback)

* `event`
  * A case-sensitive string representing the event to listen for.
    * `imageAdded` fires when new image added.
    * `videoAdded` fires when new video added.
* `callback`
  * A function that will call each time the event fires, passing to it an object contains the `file` and `update` function
    * `file` the [File](https://developer.mozilla.org/en-US/docs/Web/API/File) object
    * `update` update the element with new url

```js
align.$bus.on('imageAdded', ({file, update}) => {
  // save the uploaded image
  // and get its new link
  const newLink = saveImageToStorage(file);

  // update the image src with
  // the new generated link
  update(newLink);
})
```

### once(event, callback)

coming soon...

### emit(event, args)

coming soon...
