<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{$fe_title}}</title>
    <link rel="stylesheet" href="asset/css/layout.css" />
    <link rel="stylesheet" href="asset/css/search.css" />
    <script type="text/javascript" src="asset/js/jquery-1.11.1.js"></script>
    <script type="text/javascript" src="asset/js/searchFilter.js"></script>
    <script type="text/javascript" src="asset/js/jquery.nicescroll.3.4.w.js"></script>
    <script type="text/javascript" src="asset/js/search.js"></script>

</head>
<body>


<div class="container">
    <div class="nav">
        <div class="logo">ForeShadow</div>
        <input id="search_input" placeholder="查找：直接输入拼音或代码  Esc：取消">
    </div>

    <div id="search_list">
        {{foreach $refer as $stock}}
            <a target="_blank" class= "search-a-select" href="{{$stock['url']}}">
                <span class="fore-stock-name">{{$stock['name']}}</span>
                <span class="fore-stock-code">({{$stock['code']}})</span>
                <span class="fore-stock-spell displaynone">{{$stock['spell']}}</span>
            </a>

        {{/foreach}}
    </div>
</div>



</body>
</html>