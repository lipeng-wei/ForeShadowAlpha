<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 16-02-21
 * Time: 上午3:02
 *
 * 在一段时间内找到 Good个股 并分析
 *
 */


require_once(dirname(__FILE__). '/../../Require.php');
require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH . 'ThsDoctorData.class.php');
require_once(MODULE_PATH . 'LogicOperation.class.php');


class FindGoodStock extends Task{

    public static $thisTaskBasePath;
    public static $thisTaskDataPath;
    public static $thisTaskLogPath;
    public static $thisTaskTmpPath;

    public static function run(){
        self::$thisTaskBasePath = dirname(__FILE__). '/';
        self::$thisTaskDataPath = self::$thisTaskBasePath. 'data/';
        self::$thisTaskLogPath = self::$thisTaskBasePath. 'log/';
        self::$thisTaskTmpPath = self::$thisTaskBasePath. 'tmp/';

        self::setNohup(true);
        //以上为设置

        //以下为具体的函数调用

        /*
         *
         *
         *
            09-28 ~ 10-13 5天

            10-13 ~ 10-20 5天

            10-20 ~ 10-27 5天

            8-10 ~ 8-17

            11-11 ~ 11-20

         */
        //self::calcRange('2015-09-28', '2015-10-13', 5);
        //self::calcRange('2015-10-13', '2015-10-20', 5);
        //self::calcRange('2015-10-20', '2015-10-27', 5);

        self::calcRange('2015-08-10', '2015-08-17', 5);

    }

    //开始时间$start 结束时间$end 存在$n天内 最大涨幅$x
    //最大涨幅$x 此处不做处理 在前端通过js脚本筛选
    public static function calcRange($start, $end, $n){
        $resultFile = self::$thisTaskDataPath. $start. '_'. $end. '_'. $n. '_Good.Table.txt';

        $limiter = 2;

        $stockList = Refer::getStock();
        $stockData = array();
        foreach($stockList as $stkL){

            //if (--$limiter < 0 ) break;

            $stkT = array(
                'name' => '',
                'code' => '',
                'MaxRange' => 0,
                'DayNum' => 0
            );

            $stkT['name'] = '<a target="_blank" href="/Chart.php?code=' . $stkL['code']. '">' .
                '<span class="fore-stock-name">' . $stkL['name'] . '</span>' .
                '<span class="fore-stock-spell displaynone">' . $stkL['spell'] . '</span></a>';
            $stkT['code'] =  '<span class="fore-stock-code">' . $stkL['code'] . '</span>';



            $dd = new DayData($stkL['code'], 'before');
            if (! $dd->prepareData()) continue;
            $day = $dd->getDayPeriod($start, $end, $n - 1);
            //var_dump($day);
            if (! $day) continue;

            $MaxRange = -2;
            for ($i = 0; $i < $n / 2; $i++){
                $daySlice = array_slice($day, $i, $n);
                if (! $daySlice) continue;
                $dMax = LogicOperation::highValue($daySlice, 'close');
                $dMin= $daySlice[0]['close'];
                $dR = ceil(($dMax - $dMin) / $dMin * 100) / 100;
                $MaxRange = $MaxRange < $dR ? $dR : $MaxRange;
            }

            $stkT['MaxRange'] = $MaxRange;
            $stkT['DayNum'] = sizeof($day);


            $tdd = new ThsDoctorData($stkL['code']);
            $t =  $tdd->prepareData()? $tdd->getDayPeriod($start, $end): array();

            //message_score
            $stkT['message_score_max'] = LogicOperation::highValue($t, 'message_score');
            $stkT['message_score_min'] = LogicOperation::lowValue($t, 'message_score');
            $stkT['message_score_dis'] = $stkT['message_score_max'] - $stkT['message_score_min'];

            //basic_score
            $stkT['basic_score_max'] = LogicOperation::highValue($t, 'basic_score');
            $stkT['basic_score_min'] = LogicOperation::lowValue($t, 'basic_score');

            //total_score
            $stkT['total_score_max'] = LogicOperation::highValue($t, 'total_score');
            $stkT['total_score_min'] = LogicOperation::lowValue($t, 'total_score');

            //var_dump($stkT);
            $stockData[] = $stkT;
        }
        parent::putTable($resultFile, $stockData);

    }


}
FindGoodStock::run();



