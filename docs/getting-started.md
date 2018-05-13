# Getting Started

## Installation

First step is to install it using `yarn` or `npm`:

```bash
npm install @baianat/align

# or use yarn
yarn add @baianat/align
```

## Include necessary files

``` html{2,5}
<head>
  <link rel="stylesheet" href="dist/css/align.css">
  <!-- use editor's theme -->
  <!-- or create your own -->
  <link rel="stylesheet" href="dist/css/default-theme.css">
  <!-- @baianat/colorpicker stylesheet -->
  <link rel="stylesheet" href="path-to-colorpicker/css/colorpicker.css">
</head>
<body>
    ...
    <!-- @baianat/colorpicker script file -->
    <script type="text/javascript" src="path-to-colorpicker/js/colorpicker.js"></script>
    <script type="text/javascript" src="dist/js/align.js"></script>
</body>
```

## HTML Layout

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