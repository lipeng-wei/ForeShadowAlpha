<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-23
 * Time: 下午3:21
 *
 *
 * 每天运行 更新日线数据 的运行脚本
 *
 * 分两次处理
 * 一：更新可对接的数据，如果不能对接，列表放在tmp文件，可能发生了除权
 * 二，更新tmp文件对 个股数据全部读取和写入
 *
 */

require_once(dirname(__FILE__). '/../Require.php');
require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH. 'DayKeeper.class.php');

class DayDuty extends Script{

    private static $log = null;
    private static $tmp = null;
    private static $endDay = null;

    public static function run(){
        self::setNohup(false);



        self::allTmp();
        //self::onlyTmp();

    }

    //只处理有除权情况的tmp文件中的列表，重新写入
    public static function onlyTmp(){

        self::$tmp = new Tmp(TMP_PATH);
        self::$tmp->addTmp('day.duty.cookie', false);
        self::$tmp->addTmp('day.duty.failed', false);

        //访问xueqiu.com 生成cookie
        $url = 'http://xueqiu.com/';
        DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        $url = 'https://xueqiu.com/';
        DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));

        /*$url = 'https://xueqiu.com/stock/forchartk/stocklist.json?symbol=sh000001&period=1day&type=normal&begin=1458748800000&end=1462240877000';
        $url = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        var_dump($url);*/

        self::$log = new Log(LOG_PATH, __FILE__);
        self::updateTmpDay();
    }


    //全部处理。包括更新和除权的重写入
    public static function allTmp(){

        //日志文件
        self::$log = new Log(LOG_PATH, __FILE__);

        //临时文件
        self::$tmp = new Tmp(TMP_PATH);
        self::$tmp->addTmp('day.duty.cookie', false);

        //访问xueqiu.com 生成cookie
        $url = 'http://xueqiu.com/';
        DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        $url = 'https://xueqiu.com/';
        DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));

        /*$url = 'https://xueqiu.com/stock/forchartk/stocklist.json?symbol=sh000001&period=1day&type=normal&begin=1458748800000&end=1462240877000';
        $url = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        var_dump($url);*/

        self::updataAllDay();

        self::$log = new Log(LOG_PATH, __FILE__);
        self::updateTmpDay();

    }

    public static function updateSingleDay($item, $type){

        $dd = new DayData($item['code'], $type);
        $last = $dd->getStockData();
        if (! $last){
            self::$log->errorLog($item['name'], $item['code'], $type, "Get Exist Data Failed");
            self::$tmp->putTmpContent('day.duty.failed', join(":", $item) . "|", FILE_APPEND);
        }
        if (end($last)["time"] == self::$endDay){
            self::$log->noticeLog($item['name'], $item['code'], $type, "Already Updated");
            return true;
        }

        //多读取10天的数据来对比 确认能否接上
        $begin = strtotime($last[sizeof($last)-10]['time'])*1000;
        $end = strtotime("now")*1000;
        $url = 'https://xueqiu.com/stock/forchartk/stocklist.json?symbol=' .
            $item['code'] . '&period=1day&type=' . $type . '&begin=' .
            $begin . '&end=' . $end;

        self::$log->debugLog($item['name'], $item['code'], $type, $url);
        $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        while(! ($json = DayKeeper::parseXueqiuJson($json))){
            $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
            sleep(1);
        }
        self::$log->debugLog($item['name'], $item['code'], $type, "Curl and Parse success");

        if ($item['code'] == Config::get('Stock.SH')) self::$endDay = end($json)['time'];

        //var_dump($json);
        //echo "<br/><br/><br/>";
        //var_dump(end($json));

        //整合数据
        $updata = DayKeeper::mergeUpdate($last, $json);
        //var_dump($updata);
        if ($updata !== false){
            self::$log->debugLog($item['name'], $item['code'], $type, "Merge OK");
            DayKeeper::addDay($dd->getDataFile(), $updata);
            self::$log->noticeLog($item['name'], $item['code'], $type, "Update " . sizeof($updata). " OK");
        } else {
            self::$log->errorLog($item['name'], $item['code'], $type, "Merge Failed");
            self::$tmp->putTmpContent('day.duty.failed', join(":", $item) . "|", FILE_APPEND);
        }

    }

    public static function resetSingleDay($item, $type){

        $end = strtotime("now -7 day") * 1000;
        $url = 'https://xueqiu.com/stock/forchartk/stocklist.json?symbol='.
            $item['code']. '&period=1day&type='. $type. '&end='. $end;

        self::$log->debugLog($item['name'], $item['code'], $type, $url);

        $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        while(! ($json = DayKeeper::parseXueqiuJson($json))){
            $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
            sleep(1);
        }

        self::$log->debugLog($item['name'], $item['code'], $type, "Curl and Parse success");

        //var_dump($json);
        //echo "<br/><br/><br/>";
        //var_dump(end($json));

        $json = DayKeeper::handleQuota($json);
        $dd = new DayData($item['code'], $type);
        if (DayKeeper::putDay($dd->getDataFile(), $json)) {
            self::$log->noticeLog($item['name'], $item['code'], $type, "Reset  OK");
        } else {
            self::$log->errorLog($item['name'], $item['code'], $type, "Reset Failed");
            self::$tmp->putTmpContent('day.duty.failed', join(":", $item) . "|", FILE_APPEND);
        }


    }


    public static function updataAllDay(){
        self::$log->debugLog("Begin Update All Day");
        /*
        $url = "https://xueqiu.com/stock/forchartk/stocklist.json?symbol=SH000001&period=1day&type=normal&begin=1416728848774&end=1448264848774";
        $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        $json = DayKeeper::parseXueqiuJson($json);
        var_dump($json);
        */

        self::$tmp->addTmp('day.duty.failed', true);
        //更新大盘指数的日线数据 normal
        $list = Refer::getMarket();

        //$limit = 1;
        foreach($list as $item){

            //if ($limit-- <= 0) break;
            self::updateSingleDay($item, 'normal');
        }

        //更新个股的日线数据
        $list = Refer::getStock();
        $rights = array('before', 'normal', 'after');
        foreach($list as $item){
            foreach($rights as $type){

                self::updateSingleDay($item, $type);
            }

        }
        self::$log->debugLog("Finish Update All Day");

    }


    public static function updateTmpDay(){
        self::$log->debugLog("Begin Update Tmp Day");

        //读取Tmp文件中股票信息
        $list = self::$tmp->getTmpContent('day.duty.failed');
        $list = explode('|', $list);

        //print_r($list);
        //echo self::$tmp->getTmpContent('day.duty.failed');

        self::$tmp->newTmpFile('day.duty.failed');
        $rights = array('before', 'normal', 'after');

        foreach($list as $itemS){
            //echo $item['code'];
            $tt = explode(':', $itemS);
            if (empty($tt) || empty($tt[0])) continue;
            $item = array('code'=>$tt[0],'name'=>$tt[1],'spell'=>$tt[2]);
            if (Refer::isSockCode($item['code'])){
                foreach($rights as $type){

                    self::resetSingleDay($item, $type);
                }
            } else {
                self::resetSingleDay($item, 'normal');
            }


        }
        self::$log->debugLog("Finish Update Tmp Day");

    }


}
DayDuty::run();