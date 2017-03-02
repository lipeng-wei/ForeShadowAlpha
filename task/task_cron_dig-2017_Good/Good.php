<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 17-03-02
 * Time: 下午15:47
 *
 * 最近五日又好又快统计
 *
 */


require_once(dirname(__FILE__). '/../../Require.php');
require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH . 'DdeData.class.php');
require_once(MODULE_PATH . 'LogicOperation.class.php');


class Good extends Task
{

    public static $thisTaskBasePath;
    public static $thisTaskDataPath;
    public static $thisTaskLogPath;
    public static $thisTaskTmpPath;
    public static $limiter;

    public static function run()
    {
        self::$thisTaskBasePath = dirname(__FILE__) . '/';
        self::$thisTaskDataPath = self::$thisTaskBasePath . 'data/';
        self::$thisTaskLogPath = self::$thisTaskBasePath . 'log/';
        self::$thisTaskTmpPath = self::$thisTaskBasePath . 'tmp/';
        self::$limiter = 99999;

        $period     = 5;
        $range      = 30;
        $comment    = $period . 'D' . $range . 'PCT';
        $szzs = Refer::getSH();
        $dd = new DayData($szzs['code']);
        if ($dd->prepareData()) {

            // ---------- 补数据 ----------
            for ($i = 388; $i >=4 ; $i--){
                $ks = $dd->getLastPeriod($i, $period, $period);
                $start = $ks[0]['time'];
                $pre = $ks[$period - 2]['time'];
                $end = $ks[$period - 1]['time'];
                //echo "$start ~ $end  \n";

                $preTableFile = self::$thisTaskDataPath . $pre . '_' . $comment . '_Good.Table.txt';
                $tableFile = self::$thisTaskDataPath . $end . '_' . $comment . '_Good.Table.txt';
                $totalTableFile = self::$thisTaskDataPath . 'All_' . $comment . '_GoodTotal.Table.txt';
                $summaryFile = self::$thisTaskBasePath . 'SUMMARY.txt';

                self::calc($start, $end, $period, $range, $preTableFile, $tableFile, $totalTableFile);

                $ret_0 = array(
                    'aim' => 'pick',
                    'info' => 'Good.Table.Info.txt',
                    'table' => 'All_' . $comment . '_GoodTotal.Table.txt'

                );
                $ret_1 = array(
                    'aim' => 'pick',
                    'info' => 'Good.Table.Info.txt',
                    'table' => $end . '_' . $comment . '_Good.Table.txt'

                );
                $result = parent::ReadTable($summaryFile);
                if (empty($result)) {
                    $result = array($ret_0, $ret_1);
                } else {
                    $result[0] = $ret_1;
                    array_unshift($result, $ret_0);
                }
                parent::putTable($summaryFile, $result);

            }

            // ---------- 补数据 ----------


            /*$ks = $dd->getLastPeriod($period - 1, $period, $period);

            $start = $ks[0]['time'];
            $pre = $ks[$period - 2]['time'];
            $end = $ks[$period - 1]['time'];
            //echo "$start ~ $end  \n";

            $preTableFile = self::$thisTaskDataPath . $pre . '_' . $comment . '_Good.Table.txt';
            $tableFile = self::$thisTaskDataPath . $end . '_' . $comment . '_Good.Table.txt';
            $totalTableFile = self::$thisTaskDataPath . 'All_' . $comment . '_GoodTotal.Table.txt';
            $summaryFile = self::$thisTaskBasePath . 'SUMMARY.txt';

            self::calc($start, $end, $period, $range, $preTableFile, $tableFile, $totalTableFile);

            $ret_0 = array(
                'aim' => 'pick',
                'info' => 'Good.Table.Info.txt',
                'table' => 'All_' . $comment . '_GoodTotal.Table.txt'

            );
            $ret_1 = array(
                'aim' => 'pick',
                'info' => 'Good.Table.Info.txt',
                'table' => $end . '_' . $comment . '_Good.Table.txt'

            );
            $result = parent::ReadTable($summaryFile);
            if (empty($result)) {
                $result = array($ret_0, $ret_1);
            } else {
                $result[0] = $ret_1;
                array_unshift($result, $ret_0);
            }
            parent::putTable($summaryFile, $result);*/

        }

    }

    public static function calc($start, $end, $period, $range, $preTableFile, $tableFile, $totalTableFile) {

        $old_list = parent::ReadList($preTableFile);
        if (empty($old_list)) {
            $old_list = array();
        } else {
            $old_list = array_column($old_list, 'code');
        }


        $l = 0;

        $stockList = Refer::getStock();
        $stockData = array();
        $s = 0;
        $n = 0;
        foreach($stockList as $stkL){

            if ($l++ > self::$limiter ) break;

            $stkT = array(
                'name'  => '',
                'code'  => '',
                'range' => 0,
                'new'   => 1
            );

            $stkT['name'] = '<a target="_blank" href="/Chart.php?code=' . $stkL['code']. '">' .
                '<span class="fore-stock-name">' . $stkL['name'] . '</span>' .
                '<span class="fore-stock-spell displaynone">' . $stkL['spell'] . '</span></a>';
            $stkT['code'] =  $stkL['code'];



            $dd = new DayData($stkL['code'], 'before');
            if (! $dd->prepareData()) continue;
            $day = $dd->getDayPeriod($start, $end, $period);
            //var_dump($day);
            if (! $day) continue;

            $dMax = LogicOperation::highValue($day, 'close');
            $dMin = LogicOperation::lowValue($day, 'ma5');

            $MaxRange = round(($dMax - $dMin) / $dMin * 10000) / 100;
            if ($MaxRange < $range) continue;

            $stkT['range'] = $MaxRange;

            if (in_array($stkL['code'], $old_list)){
                $stkT['new'] = 0;
            } else {
                $stkT['new'] = 1;
                $n ++;
            }
            $s ++;

            //var_dump($stkT);
            $stockData[] = $stkT;
        }
        parent::putTable($tableFile, $stockData);

        // 更新统计
        $total = array(
            'no'    => 'W',
            'time'  => $end,
            'total_sum' => $s,
            'new_sum'   => $n
        );
        $result = parent::ReadTable($totalTableFile);
        if (empty($result)) {
            $result = array($total);
        } else {
            array_unshift($result, $total);
        }
        parent::putTable($totalTableFile, $result);

    }

}

Good::run();