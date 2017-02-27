<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 17-02-27
 * Time: 上午0:21
 *
 * 量价配合和DDE
 *
 */


require_once(dirname(__FILE__). '/../../Require.php');
require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH . 'DdeData.class.php');
require_once(MODULE_PATH . 'LogicOperation.class.php');


class V2pDde extends Task {

    public static $thisTaskBasePath;
    public static $thisTaskDataPath;
    public static $thisTaskLogPath;
    public static $thisTaskTmpPath;
    public static $limiter;

    public static function run(){
        self::$thisTaskBasePath = dirname(__FILE__). '/';
        self::$thisTaskDataPath = self::$thisTaskBasePath. 'data/';
        self::$thisTaskLogPath  = self::$thisTaskBasePath. 'log/';
        self::$thisTaskTmpPath  = self::$thisTaskBasePath. 'tmp/';
        self::$limiter          = 9999;

        $period = 30;
        $end    = date('Y-m-d',strtotime('now -12 hour'));
        $start  = date('Y-m-d',strtotime('now -'. $period. ' day -12 hour'));

        $tableFile       = self::$thisTaskDataPath. $end. '_V2pDde.Table.txt';
        $summaryFile    = self::$thisTaskBasePath. 'SUMMARY.txt';
        self::calc($start, $end, $period, $tableFile);

        $ret = array(
            'aim'   => 'pick',
            'info'  => 'V2pDde.Table.Info.txt',
            'table' => $end. '_V2pDde.Table.txt'

        );
        $result = parent::ReadTable($summaryFile);
        if (empty($result)) {
            $result = array($ret);
        } else {
            array_unshift($result, $ret);
        }
        parent::putTable($summaryFile, $result);

    }

    public static function calc($start, $end, $period, $tableFile) {
        $l = 0;

        $stockList = Refer::getStock();
        $stockData = array();
        foreach($stockList as $stkL){

            if ($l++ > self::$limiter ) break;

            $stkT = array();

            $stkT['name'] = '<a target="_blank" href="/Chart.php?code=' . $stkL['code']. '">' .
                '<span class="fore-stock-name">' . $stkL['name'] . '</span>' .
                '<span class="fore-stock-spell displaynone">' . $stkL['spell'] . '</span></a>';
            $stkT['code'] =  '<span class="fore-stock-code">' . $stkL['code'] . '</span>';


            $dd = new DayData($stkL['code'], 'before');
            if (! $dd->prepareData()) continue;
            $day = $dd->getDayPeriod($start, $end, ceil($period / 2));
            if (! $day) continue;
            $dde = new DdeData($stkL['code']);
            if (! $dde->prepareData()) continue;
            $ddx = $dde->getDayPeriod($start, $end, ceil($period / 2));
            if (! $ddx) continue;

            // ===================== Vol2PriceNum =====================
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

            // ===================== Vol2Price =====================
            $s_day = 0;
            $s_V2P = 0;
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

                //处理量太小不值得计算
                $k1 = ($day[$i]["volume"] - $day[$i-1]["volume"]) / $day[$i-1]["volume"] * 100;
                $k2 = ($day[$i]["volume"] - $day[$i-2]["volume"]) / $day[$i-2]["volume"] * 100;
                if (abs($k1) < 20 && abs($k2) < 20) continue;

                //计算V2P公式

                //计算量相关
                $q2 = ($day[$i]["volume"] - $day[$i-1]["volume"]) / $day[$i-1]["volume"] * 100;
                if ($q2 < -100) $q2 = -100;
                if ($q2 > 100) $q2 = 100;

                //计算价格相关
                $perc = $day[$i]["percent"] * 10;
                $q1 = $perc;
                if ($perc > 60) $q1 = 16;
                if ($perc <= 60 && $perc > 30) $q1 = ($perc - 30) / 15 + 13;
                if ($perc <= 30 && $perc > 10) $q1 = ($perc - 10) / 7 + 10;

                if ($perc < -60) $q1 = -16;
                if ($perc >= -60 && $perc < -30) $q1 = ($perc + 30) / 15 - 13;
                if ($perc >= -30 && $perc < -10) $q1 = ($perc + 10) / 7 - 10;

                $q1 = $q1 > 0 ? ceil($q1 + 100) : ceil($q1 - 100);

                $V2P = $q1 * $q2;
                if ($perc <= 10 && $perc >= -10) $V2P = abs(110 * $q2);

                // 统计
                $s_day++;
                $s_V2P += $V2P;

            }

            $stkT['Vol2Price'] = $s_day ?  ceil($s_V2P / $s_day) : 0;
            $stkT['ValidDayNum'] = $s_day;

            // ===================== dde =====================

            $DdxNum = 0;
            foreach($ddx as $d){
                if ($d['ddx'] > 0) $DdxNum++;
            }
            $stkT['DdePercent'] = ceil($DdxNum / sizeof($ddx) * 10000) / 100 ;
            $stkT['TotalDayNum'] = sizeof($ddx);

            $stockData[] = $stkT;
        }

        parent::putTable($tableFile, $stockData);
    }


}
V2pDde::run();




