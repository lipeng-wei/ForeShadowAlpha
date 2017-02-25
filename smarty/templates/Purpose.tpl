<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <title>{{$fe_title}} -- ForeShadow (Alpha)</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="asset/css/layout.css" />
    <link rel="stylesheet" href="asset/css/purpose.css" />

    <script type="text/javascript" src="asset/js/jquery-1.11.1.js"></script>
    <script type="text/javascript" src="asset/js/MaterialMenu.js"></script>
    <script type="text/javascript" src="asset/js/jquery.nicescroll.3.4.w.js"></script>
    <script type="text/javascript" src="asset/js/ForeShadow.ForeHistory.js"></script>
    <script type="text/javascript" src="asset/js/ForeShadow.ForeFavorite.js"></script>

    <script type="text/javascript">
        ForeHistory.historyUrl = '{{$historyUrl}}';
        ForeFavorite.favoriteUrl = '{{$favoriteUrl}}';
    </script>

    <script type="text/javascript" src="asset/js/purpose.js"></script>


</head>
<body>

<div id="wrapper" class="wrapper">
    <iframe id="sheetiframe" name="sheetiframe">

    </iframe>

</div><!-- /wrapper -->

<div class="logo">ForeShadow</div>
<button id="mm-menu-toggle" class="mm-menu-toggle">挖掘 Dig</button>
<nav id="mm-menu" class="mm-menu">
    <div class="mm-menu__header">
        <h2 class="mm-menu__title">{{$fe_title}}</h2>
    </div>
    <ul class="mm-menu__items">
        <li class="mm-menu__item">
            <a class="mm-menu__link" id="a-favorite"  href="javascript:void(0)">
                <span class="mm-menu__link-text">Favorite</span>
            </a>
            <div class="content">
                <p>自选股 Favorite</p>
                <p>1，支持各种管理功能，并和“通达信”自选股通过EBK格式文件“导入导出”互通。</p>
                <p>2，数据仅保留在客户端（此电脑的此浏览器），切换客户端通过“迁入迁出”完成。</p>
                <p>Category ：<a target="sheetiframe" href="{{$favoriteUrl}}">Manage</a></p>
            </div>

        </li>
        <li class="mm-menu__item">
            <a class="mm-menu__link" id="a-history"  href="javascript:void(0)">
                <span class="mm-menu__link-text">History</span>
            </a>
            <div class="content">
                <p>已浏览 Visited</p>
            </div>

        </li>
        <li class="mm-menu__item">
				<span class="mm-menu__separator">
					<hr class="mm-menu__separator-hr" size = 1>
				</span>
        </li>
        {{foreach $purpose as $name => $info}}
        <li class="mm-menu__item">
            <a class="mm-menu__link" href="javascript:void(0)">
                <span class="mm-menu__link-text">{{$name}}</span>
            </a>
            <div class="content">
                {{foreach $info["readme"] as $item}}
                <p>{{$item}}</p>
                {{/foreach}}
                {{foreach $info["list"] as $item}}
                <a target="sheetiframe" href="{{$item['url']}}">{{$item['table']}}</a>
                {{/foreach}}
            </div>
        </li>
        {{/foreach}}
        <!-- <li class="mm-menu__item">
            <a class="mm-menu__link" href="javascript:void(0)">
                <span class="mm-menu__link-text">Task-fwefwedwe20151201_20151221_Good</span>
            </a>
            <div class="content">

                <p>比较 2015年12月1日 至 2015年12月21日 Good个股 分析</p>

                <p>使用TDX选股公式选出面空两个字的距离，不要再使用空格了，
                    用CSS实现段落首缩进两个字符。应该使用首行缩进text-indent。
                    text-indent可以使得容器内首行缩进一定单位。比如中文段落一般每段前空两个汉字。</p>
                <p>使用TDX选股公式选出面空两个字的距离，不要再使用空格了，
                    用CSS实现段落首缩进两个字符。应该使用首行缩进text-indent。
                    text-indent可以使得容器内首行缩进一定单位。比如中文段落一般每段前空两个汉字。</p>
                <p>使用TDX选股公式选出面空两个字的距离，不要再使用空格了，
                    用CSS实现段落首缩进两个字符。应该使用首行缩进text-indent。
                    text-indent可以使得容器内首行缩进一定单位。比如中文段落一般每段前空两个汉字。</p>


                <a target="sheetiframe" href="http://localhost/ForeShadowAlpha/sheet.php?task=task-20151201_20151221_Good&table=20151200-21Good.Table.txt&info=20151200-21Good.Table.Info.txt#test1">20151200-21Good.20151201_20151221_Good.Table.txt</a>
                <a target="sheetiframe" href="http://localhost/ForeShadowAlpha/sheet.php?task=task-20151201_20151221_Good&table=20151200-21Good.Table.txt&info=20151200-21Good.Table.Info.txt#test2">20151200-21Good.20151201_20151221_Good.Table.txt</a>
                <a target="sheetiframe" href="http://localhost/ForeShadowAlpha/sheet.php?task=task-20151201_20151221_Good&table=20151200-21Good.Table.txt&info=20151200-21Good.Table.Info.txt#test3">20151200-21Good.20151201_20151221_Good.Table.txt</a>

            </div>

        </li>-->

    </ul>
</nav>

</body>
</html>