# Getting Data

## Get Content or Title

To get `Align`'s content you can use `content` property
To get `Align`'s post title you can use `title` property

```js
saveToDatabase(myEditor.content);
```

## Handle Resources Uploading

Align has events bus(`$bus`), you can listen for `imageAdded` and `videoAdded` to handle any resources uploading

```js
myEditor.$bus.on('imageAdded', ({file, update}) => {
  // save the uploaded image
  // and get its new link
  const newLink = saveImageToStorage(file);

  // update the image src with
  // the new generated link
  update(newLink);
})
```
