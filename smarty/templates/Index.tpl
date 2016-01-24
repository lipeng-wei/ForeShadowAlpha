<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>{{$fe_title}}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="asset/css/layout.css" />
    <link rel="stylesheet" href="asset/css/index.css" />
    <script type="text/javascript" src="asset/js/jquery-1.11.1.js"></script>
    <script type="text/javascript" src="asset/js/jquery.particleground.js"></script>
    <script type="text/javascript" src="asset/js/index.js"></script>


</head>
<body>

<div class="container">
    <div class="intro">
        <h1>ForeShadow</h1>
        <p>A Stocks Quantitative Analysis Platform</p>
        <p>


            {{foreach $button as $b}}
                <a class="enter" target="_self" href="{{$b[1]}}">
                    {{$b[0]}}
                </a>
            {{/foreach}}
        </p>
    </div>
</div>

</body>
</html>