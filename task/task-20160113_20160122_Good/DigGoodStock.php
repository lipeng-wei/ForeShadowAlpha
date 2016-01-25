<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-14
 * Time: 上午3:52
 *
 * 读取EBK中Good个股 形成 标准list列表
 *
 */


require_once(dirname(__FILE__). '/../../Require.php');
require_once(MODULE_PATH . 'RateData.class.php');
require_once(MODULE_PATH . 'LhbData.class.php');
require_once(MODULE_PATH . 'ThsDoctorData.class.php');
require_once(MODULE_PATH . 'LogicOperation.class.php');


class DigGoodStock extends Task{

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
        //self::getList();
        //self::getList_1();
        self::addInfo();

    }

    //读取原始的数据生成List
    public static function getList(){
        $importFile = self::$thisTaskDataPath. '2016-1-13_2016-1-22_Good.EBK';
        $exportFile = self::$thisTaskDataPath. '2016-1-13_2016-1-22Good.List.txt';

        parent::EBK2List($importFile, $exportFile);


    }
    public static function getList_1(){
        $importFile = self::$thisTaskDataPath. '20151200-21Good.Vague.txt';
        $exportFile = self::$thisTaskDataPath. '20151200-21Good-1.List.txt';

        parent::Vague2List($importFile, $exportFile);


    }

    //添加相关信息 形成信息表Table
    public static function addInfo(){
        $importFile = self::$thisTaskDataPath. '2016-1-13_2016-1-22Good.List.txt';
        $exportFile = self::$thisTaskDataPath. '2016-1-13_2016-1-22Good.Table.txt';


        $stockList = parent::ReadList($importFile);
        $stockList = CommonInfo::CodeArray2ReferArray($stockList);
        $stockTable = array();
        $pre = '2015-11-00';
        $start = '2015-12-00';
        $end = '2015-12-21';
        foreach($stockList as $stkL){
            $stkT = array();
            $stkT['name'] = '<a target="_blank" href="'.Url::getBasePhp('Chart') . '?code=' . $stkL['code']. '">' .
                '<span class="fore-stock-name">' . $stkL['name'] . '</span>' .
                '<span class="fore-stock-spell displaynone">' . $stkL['spell'] . '</span></a>';
            $stkT['code'] =  '<span class="fore-stock-code">' . $stkL['code'] . '</span>';

            //以上为标准的  索引

            $tdd = new ThsDoctorData($stkL['code']);
            $t =  $tdd->prepareData()? $tdd->getDayPeriod($start, $end): array();

            //total_score
            $stkT['total_score_max'] = LogicOperation::highValue($t, 'total_score');
            $stkT['total_score_min'] = LogicOperation::lowValue($t, 'total_score');

            //message_score
            $stkT['message_score_max'] = LogicOperation::highValue($t, 'message_score');
            $stkT['message_score_min'] = LogicOperation::lowValue($t, 'message_score');

            //trade_score
            $stkT['trade_score_max'] = LogicOperation::highValue($t, 'trade_score');
            $stkT['trade_score_min'] = LogicOperation::lowValue($t, 'trade_score');

            //basic_score
            $stkT['basic_score_max'] = LogicOperation::highValue($t, 'basic_score');
            $stkT['basic_score_min'] = LogicOperation::lowValue($t, 'basic_score');


            //评级买入次数
            $rd = new RateData($stkL['code']);
            $t = $rd->prepareData()? $rd->getDayPeriod($pre, $end): array();
            $t = $rd->filterBuy($t);
            $stkT['rate_buy_num'] = $t ? sizeof($t) : 0;


            //龙虎榜次数
            $ld = new LhbData($stkL['code']);
            $t = $ld->prepareData()? $ld->getDayPeriod($start, $end): array();
            $stkT['lhb_num'] = $t ? sizeof($t) : 0;

            $stockTable[] = $stkT;
        }
        parent::putTable($exportFile, $stockTable);

    }


}
DigGoodStock::run();



