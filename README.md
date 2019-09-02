# jQuery Height Harmony
A simple jQuery plugin for applying equal height to elements.

## Usage
Include jQuery and the Height Harmony script:
```
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js"></script>
<script src="height-harmony-min.js"></script>
```

Initialize the heightHarmony() function on as many elements as needed. Each instance will apply a unique height to the elements selected.
```
$(document).ready(function(){
    heightHarmony('.element-one');
    heightHarmony('.element-two');
});
```

The plugin will also apply equal height when using $(window).resize().
```
$(window).resize(function(){
    heightHarmony('.element-one');
    heightHarmony('.element-two');
});
```

## Demo
[Click here to view the demo](https://htmlpreview.github.io/?https://github.com/byronjohnson/height-harmony/blob/master/demo/demo.html).