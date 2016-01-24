<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <title>{{$fe_title}} -- ForeShadow (Alpha)</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="asset/css/layout.css"/>
    <link rel="stylesheet" href="asset/css/datatables.css"/>
    <link rel="stylesheet" href="asset/css/iDialog.css"/>
    <link rel="stylesheet" href="asset/css/nanoscroller.css"/>
    <link rel="stylesheet" href="asset/css/ResponsiveTabs.css"/>
    <link rel="stylesheet" href="asset/css/sheet.css"/>

    <script type="text/javascript" src="asset/js/jquery-1.11.1.js"></script>
    <script type="text/javascript" src="asset/js/jquery.nicescroll.3.4.w.js"></script>
    <script type="text/javascript" src="asset/js/datatables.w.js"></script>
    <script type="text/javascript" src="asset/js/jquery.iDialog.w.js"></script>
    <script type="text/javascript" src="asset/js/jquery.nanoscroller.w.js"></script>
    <script type="text/javascript" src="asset/js/jquery.ResponsiveTabs.w.js"></script>
    <script type="text/javascript" src="asset/js/jquery.base64.utf8.js"></script>
    <script type="text/javascript" src="asset/js/jquery.hashchange.js"></script>
    <script type="text/javascript" src="asset/js/ForeShadow.ForeHistory.js"></script>
    <script type="text/javascript" src="asset/js/ForeShadow.ForeFavorite.js"></script>

    <script type="text/javascript">
        ForeHistory.historyUrl = '{{$historyUrl}}';
        ForeFavorite.favoriteUrl = '{{$favoriteUrl}}';
    </script>

    <script type="text/javascript" src="asset/js/history.js"></script>


</head>
<body>

<div class="intro">
    <h1 id="timeline"></h1>
    <h2>{{$fe_title}}</h2>
</div>

<div class="container">
</div>

<div id="favoritelet" style="display: none">
    <div class="nano"><div id="favoritelet-box">
        </div></div>
    <div class="favoritelet-pane">
        <input type="text" id="favoritelet-name">
        <a id="favoritelet-add">Add</a>
    </div>
</div>

</body>

</html>