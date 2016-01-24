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
    <script type="text/javascript" src="asset/js/favorite.js"></script>




</head>
<body>

<div class="intro">
    <h1 id="category"></h1>
    <h2>{{$fe_title}} [<a id="favor">manage</a>]</h2>
</div>

<div class="container">
</div>

<div id="favor-manage" style="display: none">
    <ul class="resp-tabs-list favor-manage-tab-id">
        <li>Favorite</li>
        <li>Category</li>
    </ul>
    <div class="resp-tabs-container favor-manage-tab-id">
        <div>
            <div class="nano"><div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nibh urna, euismod ut ornare non,
                    volutpat vel tortor. Integer laoreet placerat suscipit. Sed sodales scelerisque commodo. Nam porta
                    cursus lectus. Proin nunc erat, gravida a facilisis quis, ornare id lectus. Proin consectetur nibh quis
                    urna gravida mollis.</p>
                <a id="favor-manage-moveout">MoveOut</a>
                <a id="favor-manage-movein">MoveIn</a>
                <p>To Do</p>
            </div></div>
        </div>
        <div>
            <div class="nano"><div id="favor-manage-checkbox">
            </div></div>
            <div class="favor-manage-pane">
                <input type="text" id="favor-manage-name">
                <a id="favor-manage-add">Add</a>
                <a id="favor-manage-del">Delete</a>
                <a id="favor-manage-rename">Rename</a>
            </div>
        </div>
    </div>
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