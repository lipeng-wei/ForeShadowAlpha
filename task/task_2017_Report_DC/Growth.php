<?php
/**
 * Created by PhpStorm.
 * User: wlp
 * Date: 2017/8/9
 * Time: 17:14
 *
 * 挖掘有基本面利好
 */

require_once(dirname(__FILE__). '/../../Require.php');
require_once(MODULE_PATH . 'DCReportData.class.php');
require_once(MODULE_PATH . 'LogicOperation.class.php');


class Growth extends Task{

    public static $thisTaskBasePath;
    public static $thisTaskDataPath;
    public static $thisTaskLogPath;
    public static $thisTaskTmpPath;

    public static function run(){
        self::$thisTaskBasePath = dirname(__FILE__). '/';
        self::$thisTaskDataPath = self::$thisTaskBasePath. 'data/';
        self::$thisTaskLogPath = self::$thisTaskBasePath. 'log/';
        self::$thisTaskTmpPath = self::$thisTaskBasePath. 'tmp/';

        //self::setNohup(false);
        //以上为设置

        //以下为具体的函数调用
        //self::filterReport('2016-12-30', '2016-04-01', '2015-11-01');
        //self::filterReport('2017-08-09', '2017-04-01', '2016-11-01');
        self::filterReport('2017-08-09', '2017-07-09', '2017-03-09');

    }

    //开始时间$start 结束时间$end
    public static function filterReport($end, $start, $show){
        $pattern = "/(不可限量|高景气|翻倍|翻番|加速|超预期|大幅增长|高速增长|高增长|爆发|迅猛增长|暴增|收获期|放量|快速增长)/";
        $replacement = "<span class='sp'>$1</span>";
        $resultFile = self::$thisTaskDataPath. $end. '_'. $start. '_DCReport_Growth.html';
        $title_content = 'DC_Report 研报筛选 ('. $start. '~'. $end. ')';
        $caption_content = $start. '至'. $end. '研报筛选结果';
        $resultContent = '

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>%%title%%</title>
<style type="text/css">
<!--
    th,td {padding:6px;}
    .thead_tr {background-color:#666; color:#fff;}
    .tr_0 {background-color:#CCCCFF; color:#000; padding:18px;}
    .tr_1 {background-color:#CCFFCC; color:#000; padding:18px;}
    .tr_2 {background-color:#99CCCC; color:#000; padding:18px;}
    .tr_3 {background-color:#FFFFCC; color:#000; padding:18px;}
    .tr_tr {background-color:#F5F5F5; color:#000; padding:18px; font-weight:lighter}
    .sp {font-weight:bold; color:#FF0000}
-->
</style>
</head>
<body>
<table cellspacing="1" cellpadding="2">
<caption>%%caption%%</caption>
<thead>
<tr class="thead_tr">
<th>代码</th>
<th>名称</th>
<th>日期</th>
<th>机构</th>
<th>标题</th>
<th>详情</th>
<th>更多</th>
</tr>
</thead>
<tbody>

%%table%%

</tbody>
</table>
</body>
</html>

        ';

        $limiter = 5;

        $stockList = Refer::getStock();
        $stockData = array();
        foreach($stockList as $stkL){

            //if (--$limiter < 0 ) break;

            $stkBlock = array();

            $rd = new DCReportData($stkL['code']);
            if (! $rd->prepareData()) continue;
            $rdd = $rd->getDayPeriod($show, $end);
            if (! $rdd) continue;

            $is_select = false;
            foreach ($rdd as $rddr) {
                $stkRow = array();
                $stkRow[] = $stkL['code'];
                $stkRow[] = $stkL['name'];
                $stkRow[] = $rddr['time'];
                $stkRow[] = $rddr['institute'];
                if ($rddr['time'] >= $start && $rddr['time'] <= $end) {
                    if (preg_match($pattern, $rddr['title'])){
                        $is_select = true;
                        $stkRow[] = preg_replace($pattern, $replacement, $rddr['title']);
                    } else {
                        $stkRow[] = $rddr['title'];
                    }

                } else {
                    $stkRow[] = $rddr['title'];
                }
                $stkRow[] = '<a target="_blank" href="' . $rddr['url']. '">打开</a>';
                $stkRow[] = '<a target="_blank" href="http://stock.jrj.com.cn/share,'.
                    CommonInfo::Code2Num($stkL['code']).',stockyanbao.shtml">金融界</a>&nbsp;'.
                    '<a target="_blank" href="http://vip.stock.finance.sina.com.cn/q/go.php/vReport_List/kind/search/index.phtml?t1=2&symbol='.
                    $stkL['code'].'">新浪</a>&nbsp;'.'<a target="_blank" href="http://yanbao.stock.hexun.com/yb_'.
                    CommonInfo::Code2Num($stkL['code']).'.shtml">和讯</a>&nbsp;'.
                    '<a target="_blank" href="http://www.iwencai.com/search?typed=0&preParams=&ts=1&f=1&qs=result_tab&tid=report&w='.
                    $stkL['name'].'">i问财</a>';
                array_unshift($stkBlock, $stkRow);
            }
            if ($is_select) {
                $stockData = array_merge($stockData, $stkBlock);
            }

        }

        $i = 0;
        $l_code = '';
        $table_content = '';
        foreach($stockData as $stockRow) {
            if ($stockRow['0'] != $l_code) {
                $i = ($i + 1) % 4;
                $l_code = $stockRow['0'];
            }
            if ($stockRow[2]  >= $start) {
                $table_content .= '<tr class="tr_'. $i. '">';
            } else {
                $table_content .= '<tr class="tr_tr">';
            }
            foreach ($stockRow as $item) {
                $table_content .= '<td>'. $item. '</td>';
            }
            $table_content .= '</'. 'tr>';
        }
        $resultContent = str_replace("%%title%%", $title_content, $resultContent);
        $resultContent = str_replace("%%caption%%", $caption_content, $resultContent);
        $resultContent = str_replace("%%table%%", $table_content, $resultContent);
        file_put_contents($resultFile, $resultContent);

    }

}
Growth::run();