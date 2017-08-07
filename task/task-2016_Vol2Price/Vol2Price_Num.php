<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 16-09-18
 * Time: 上午0:02
 *
 * 在一段时间内 量价配合分析（天数）
 *
 */


require_once(dirname(__FILE__). '/../../Require.php');
require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH . 'ThsDoctorData.class.php');
require_once(MODULE_PATH . 'LogicOperation.class.php');


class Vol2Price extends Task{

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
        //self::calcV2P('2016-09-01', '2016-09-17');
        //self::calcV2P('2016-10-10', '2016-10-31');
        //self::calcV2P('2016-11-01', '2016-11-14');
        //self::calcV2P('2016-12-01', '2016-12-16');
        //self::calcV2P('2017-01-25', '2017-07-03');
        //self::calcV2P('2017-04-05', '2017-07-09');
        //self::calcV2P('2017-05-20', '2017-07-20');
        //self::calcV2P('2017-03-20', '2017-07-20');
        //self::calcV2P('2017-02-20', '2017-07-20');
        self::calcV2P('2017-04-30', '2017-07-30');

    }

    //开始时间$start 结束时间$end
    public static function calcV2P($start, $end){
        $resultFile = self::$thisTaskDataPath. $start. '_'. $end. '_Vol2Price_Num.Table.txt';

        $limiter = 5;

        $stockList = Refer::getStock();
        $stockData = array();
        foreach($stockList as $stkL){

            //if (--$limiter < 0 ) break;

            $stkT = array();

            $stkT['name'] = '<a target="_blank" href="/Chart.php?code=' . $stkL['code']. '">' .
                '<span class="fore-stock-name">' . $stkL['name'] . '</span>' .
                '<span class="fore-stock-spell displaynone">' . $stkL['spell'] . '</span></a>';
            $stkT['code'] =  '<span class="fore-stock-code">' . $stkL['code'] . '</span>';


            $dd = new DayData($stkL['code'], 'before');
            if (! $dd->prepareData()) continue;
            $day = $dd->getDayPeriod($start, $end, 3);
            if (! $day) continue;
            //var_dump($day);

            $s_day = 0;
            $s_num = 0;
            for ($i = 2; $i < count($day); $i++) {

                //处理当日涨跌停
                $is_zt = ($day[$i]["high"] - $day[$i-1]["close"]) / $day[$i-1]["close"];
                $is_dt = ($day[$i-1]["close"] - $day[$i]["low"]) / $day[$i-1]["close"];
                $valid_vol = $day[$i]["volume"] / $day[$i-1]["volume"];
                //涨跌停 并且 量小于0.3 不参与计算
                if (($is_zt >1.09 || $is_dt < 0.9) && $valid_vol < 0.3) continue;

                //处理前日涨跌停
                $is_zt = ($day[$i-1]["high"] - $day[$i-2]["close"]) / $day[$i-2]["close"];
                $is_dt = ($day[$i-2]["close"] - $day[$i-1]["low"]) / $day[$i-2]["close"];
                $valid_vol = $day[$i-1]["volume"] / $day[$i-2]["volume"];
                //涨跌停 并且 量小于0.3 不参与计算
                if (($is_zt >1.09 || $is_dt < 0.9) && $valid_vol < 0.3) continue;

                //计算量的比例
                $q2 = ($day[$i]["volume"] - $day[$i-1]["volume"]) / $day[$i-1]["volume"] * 100;

                //计算价格相关
                $q1 = $day[$i]["percent"] * 10;

                // 统计
                $s_day++;
                if ($q1*$q2 > 0)$s_num ++;

            }

            $stkT['Vol2PriceNum'] = $s_num;
            $stkT['ValidDayNum'] = $s_day;
            $stkT['TotalDayNum'] = count($day);


            $stockData[] = $stkT;
        }
        parent::putTable($resultFile, $stockData);

    }


}
Vol2Price::run();

/* for test
 for ($chg = -100 ; $chg < 110; $chg=$chg+5) {
    $q1 = $chg;
    if ($chg > 60) $q1 = 16;
    if ($chg <= 60 && $chg > 30) $q1 = ($chg - 30) / 15 + 13;
    if ($chg <= 30 && $chg > 10) $q1 = ($chg - 10) / 7 + 10;

    if ($chg < -60) $q1 = -16;
    if ($chg >= -60 && $chg < -30) $q1 = ($chg + 30) / 15 - 13;
    if ($chg >= -30 && $chg < -10) $q1 = ($chg + 10) / 7 - 10;

    $q1 = $q1 > 0 ? ceil($q1 + 100) : ceil($q1 - 100);

    echo $chg. " - ". $q1. "<br/>";
}*/




