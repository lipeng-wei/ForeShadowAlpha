<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>{{$fe_title}}</title>
    <link rel="stylesheet" href="asset/css/layout.css" />
    <link rel="stylesheet" href="asset/css/iDialog.css"/>
    <link rel="stylesheet" href="asset/css/nanoscroller.css"/>
    <link rel="stylesheet" href="asset/css/chart.css" />

    <script type="text/javascript" src="asset/js/jquery-1.11.1.js"></script>
    <script type="text/javascript" src="asset/js/jquery.nicescroll.3.4.w.js"></script>
    <script type="text/javascript" src="asset/js/highstock.2.1.9.js"></script>
    <script type="text/javascript" src="asset/js/jquery.iDialog.w.js"></script>
    <script type="text/javascript" src="asset/js/jquery.nanoscroller.w.js"></script>
    <script type="text/javascript" src="asset/js/ForeShadow.ForeHistory.js"></script>
    <script type="text/javascript" src="asset/js/ForeShadow.ForeFavorite.js"></script>
    <script type="text/javascript" src="asset/js/ForeShadow.ForeChart.js"></script>

    <script type="text/javascript">
        ForeHistory.historyUrl = '{{$historyUrl}}';
        ForeFavorite.favoriteUrl = '{{$favoriteUrl}}';
        ForeChart.rawData = {{$rawData}};
    </script>
    <script type="text/javascript" src="asset/js/chart.js"></script>

</head>
<body>

<div class="chart chart-primary" >
</div>
<div class="chart chart-main" >
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