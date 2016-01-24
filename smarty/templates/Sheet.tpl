<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <title>{{$fe_title}} -- ForeShadow (Alpha)</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script type="text/javascript" src="asset/code/lib/codemirror.js"></script>
    <script type="text/javascript" src="asset/code/mode/javascript/javascript.js"></script>
    <script type="text/javascript" src="asset/code/addon/comment/comment.js"></script>
    <script type="text/javascript" src="asset/code/addon/comment/continuecomment.js"></script>
    <script type="text/javascript" src="asset/code/addon/display/fullscreen.js"></script>
    <script type="text/javascript" src="asset/code/addon/edit/closebrackets.js"></script>
    <script type="text/javascript" src="asset/code/addon/edit/matchbrackets.js"></script>
    <script type="text/javascript" src="asset/code/addon/hint/show-hint.js"></script>
    <script type="text/javascript" src="asset/code/addon/hint/javascript-hint.js"></script>
    <script type="text/javascript" src="asset/code/addon/scroll/simplescrollbars.js"></script>
    <script type="text/javascript" src="asset/code/addon/runmode/runmode.js"></script>

    <link rel="stylesheet" href="asset/code/lib/codemirror.css">
    <link rel="stylesheet" href="asset/code/theme/wlpstyle.css">
    <link rel="stylesheet" href="asset/code/addon/display/fullscreen.css">
    <link rel="stylesheet" href="asset/code/addon/hint/show-hint.css">
    <link rel="stylesheet" href="asset/code/addon/scroll/simplescrollbars.css">


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
    <script type="text/javascript" src="asset/js/ForeShadow.ForeHistory.js"></script>
    <script type="text/javascript" src="asset/js/ForeShadow.ForeFavorite.js"></script>

    <script type="text/javascript">
        ForeHistory.historyUrl = '{{$historyUrl}}';
        ForeFavorite.favoriteUrl = '{{$favoriteUrl}}';
    </script>
    <script type="text/javascript" src="asset/js/sheet.js"></script>




</head>
<body>

<div class="intro">
    <h1><a>{{$detail[1]}}</a></h1>

    <h2><a>{{$detail[0]}}</a></h2>
</div>

<div class="container">
    <table id="sheet" class="display compact cell-border" cellspacing="0" width="100%">
        <thead><tr>
            {{foreach $header as $k => $v}}
            <th>{{$v}}</th>
            {{/foreach}}
        </tr></thead>
        <tbody>
            {{foreach $table as $row}}
            <tr>
                {{foreach $row as $k => $v}}
                <td>{{$v}}</td>
                {{/foreach}}
            </tr>
            {{/foreach}}
        </tbody>
        <tfoot>
        <tr>
            {{foreach $footer as $k => $v}}
            <td>{{$v}}</td>
            {{/foreach}}
        </tr>
        </tfoot>
    </table>
</div>

<div id="intro-detail" style="display: none">
    <div class= "nano"><div>
        {{foreach $info as $item}}
        <p>{{$item}}</p>
        {{/foreach}}
    </div></div>
</div>


<div id="filter-tab" style="display:none">
    <ul class="resp-tabs-list filter-tab-id">
        <li>Introduction</li>
        <li>Search</li>
        <li>Example</li>
    </ul>
    <div class="resp-tabs-container filter-tab-id">
        <div><div class="nano"><div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nibh urna, euismod ut ornare non,
                volutpat vel tortor. Integer laoreet placerat suscipit. Sed sodales scelerisque commodo. Nam porta
                cursus lectus. Proin nunc erat, gravida a facilisis quis, ornare id lectus. Proin consectetur nibh quis
                urna gravida mollis.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nibh urna, euismod ut ornare non,
                volutpat vel tortor. Integer laoreet placerat suscipit. Sed sodales scelerisque commodo. Nam porta
                cursus lectus. Proin nunc erat, gravida a facilisis quis, ornare id lectus. Proin consectetur nibh quis
                urna gravida mollis.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nibh urna, euismod ut ornare non,
                volutpat vel tortor. Integer laoreet placerat suscipit. Sed sodales scelerisque commodo. Nam porta
                cursus lectus. Proin nunc erat, gravida a facilisis quis, ornare id lectus. Proin consectetur nibh quis
                urna gravida mollis.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nibh urna, euismod ut ornare non,
                volutpat vel tortor. Integer laoreet placerat suscipit. Sed sodales scelerisque commodo. Nam porta
                cursus lectus. Proin nunc erat, gravida a facilisis quis, ornare id lectus. Proin consectetur nibh quis
                urna gravida mollis.</p>
        </div></div></div>
        <div>
            <textarea id="program" name="program"></textarea>
            <div class="exedebug"></div>

        </div>
        <div><div class="nano">
            <pre id="example-output" name="example-output" class="CodeMirror cm-s-wlpstyle" style="background:#000"></pre>
            <textarea id="example-input" name="example-input" style="display:none">
function findSequence(goal) {
    function find(start, history) {
        if (start == goal)

        return history;

        else if (start > goal)

        return null;

        else


        return find(start + 5, "(" + history + " + 5)") ||
                find(start * 3, "(" + history + " * 3)");
    }
    return find(1, "1");
}
            </textarea>
        </div></div>
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


<script type="text/javascript" src="asset/js/activate-power-mode.js"></script>


</body>

</html>