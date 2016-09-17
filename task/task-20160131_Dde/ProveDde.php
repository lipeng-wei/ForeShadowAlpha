<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 16-01-31
 * Time: 上午3:38
 *
 * DDE的指标研究 1，飘红数量 2，绝对值的量化
 *
 */


require_once(dirname(__FILE__). '/../../Require.php');
require_once(MODULE_PATH . 'DdeData.class.php');


class ProveDde extends Task{

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

        //self::calcDdeNum('2016-01-04', '2016-01-29');
        //self::calcDdeNum('2016-01-25', '2016-01-29');
        //self::calcDdeNum('2016-02-03', '2016-02-18');
        //self::calcDdeNum('2016-04-27', '2016-05-04');
        self::calcDdeNum('2016-09-07', '2016-09-14');

    }


    //统计DDX数量 形成信息表Table
    public static function calcDdeNum($start, $end){
        $resultFile = self::$thisTaskDataPath. $start. '_'. $end. '_DdeNum.Table.txt';

        $i = 2;

        $stockList = Refer::getStock();
        $stockData = array();
        foreach($stockList as $stkL){

            //if (--$i < 0 ) break;

            $stkT = array(
                'name' => '',
                'code' => '',
                'DdxNum' => 0,
                'DdxPer' => 0,
                'DdzNum' => 0,
                'DdzPer' => 0,
                'TddzNum' => 0,
                'TddzPer' => 0,
                'TotalNum' => 0,
                'TotalPer' => 0,
                'DayNum' => 0
            );

            $stkT['name'] = '<a target="_blank" href="'.Url::getPhpUri('Chart') . '?code=' . $stkL['code']. '">' .
                '<span class="fore-stock-name">' . $stkL['name'] . '</span>' .
                '<span class="fore-stock-spell displaynone">' . $stkL['spell'] . '</span></a>';
            $stkT['code'] =  '<span class="fore-stock-code">' . $stkL['code'] . '</span>';

            $dd = new DdeData($stkL['code']);
            if (! $dd->prepareData()) continue;
            $dde = $dd->getDayPeriod($start, $end, 1);
            //var_dump($dde);
            if (! $dde) continue;

            foreach($dde as $d){
                //echo $d['ddx']. '(';
                //echo ($d['ddx'] > 0). ')';
                if ($d['ddx'] > 0) $stkT['DdxNum']++;
                if ($d['ddz'] > 0) $stkT['DdzNum']++;
                if ($d['tddz'] > 0) $stkT['TddzNum']++;
            }
            $stkT['DayNum'] = sizeof($dde);
            $stkT['DdxPer'] = ceil($stkT['DdxNum'] / $stkT['DayNum'] * 10000) / 10000 ;
            $stkT['DdzPer'] = ceil($stkT['DdzNum'] / $stkT['DayNum'] * 10000) / 10000 ;
            $stkT['TddzPer'] = ceil($stkT['TddzNum'] / $stkT['DayNum'] * 10000) / 10000 ;

            $stkT['TotalNum'] = $stkT['DdxNum'] + $stkT['TddzNum'] + $stkT['TddzNum'];
            $stkT['TotalPer'] = ceil($stkT['TotalNum'] / $stkT['DayNum'] / 3 * 10000) / 10000 ;

            //var_dump($stkT);
            $stockData[] = $stkT;
        }
        parent::putTable($resultFile, $stockData);

    }


}
ProveDde::run();



