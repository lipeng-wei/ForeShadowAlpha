<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 16-09-16
 * Time: 上午2:15
 *
 * 消息面利好放出
 *
 */


require_once(dirname(__FILE__). '/../../Require.php');
require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH . 'ThsDoctorData.class.php');
require_once(MODULE_PATH . 'LogicOperation.class.php');


class MessJump extends Task{

    public static $thisTaskBasePath;
    public static $thisTaskDataPath;
    public static $thisTaskLogPath;
    public static $thisTaskTmpPath;

    public static function run(){
        self::$thisTaskBasePath = dirname(__FILE__). '/';
        self::$thisTaskDataPath = self::$thisTaskBasePath. 'data/';
        self::$thisTaskLogPath = self::$thisTaskBasePath. 'log/';
        self::$thisTaskTmpPath = self::$thisTaskBasePath. 'tmp/';

        self::setNohup(false);
        //以上为设置

        //以下为具体的函数调用
        self::calcMessJump();

    }

    public static function calcMessJump(){
        $resultFile = self::$thisTaskDataPath. 'Pick_MessJump.Table.txt';

        $limiter = 10;

        $stockList = Refer::getStock();
        $stockData = array();
        foreach($stockList as $stkL){

            //if (--$limiter < 0 ) break;

            $stkT = array();

            $tdd = new ThsDoctorData($stkL['code']);
            if (! $tdd->prepareData()) continue;

            $ths_2 = $tdd->getLastPeriod(1, true, 2);
            if (! $ths_2) continue;
            //var_dump($ths_2);

            $ths_x = $tdd->getLastPeriod(40, true, 10);
            if (! $ths_x) continue;
            //var_dump($ths_x);

            if ($ths_2[1]['message_score'] - $ths_2[0]['message_score'] <=0) continue;

            $stkT['name'] = '<a target="_blank" href="'.Url::getBasePhp('Chart') . '?code=' . $stkL['code']. '">' .
                '<span class="fore-stock-name">' . $stkL['name'] . '</span>' .
                '<span class="fore-stock-spell displaynone">' . $stkL['spell'] . '</span></a>';
            $stkT['code'] =  '<span class="fore-stock-code">' . $stkL['code'] . '</span>';

            //message_score in yesterday and today
            $stkT['mess_score_yesterday']   = $ths_2[0]['message_score'];
            $stkT['mess_score_today']       = $ths_2[1]['message_score'];
            $stkT['mess_score_change']      = $ths_2[1]['message_score'] - $ths_2[0]['message_score'];

            //message_score in 40 days
            $stkT['mess_score_max_40d'] = LogicOperation::highValue($ths_x, 'message_score');
            $stkT['mess_score_min_40d'] = LogicOperation::lowValue($ths_x, 'message_score');

            $stockData[] = $stkT;
        }
        parent::putTable($resultFile, $stockData);

    }


}
MessJump::run();






