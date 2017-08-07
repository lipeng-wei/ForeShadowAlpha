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

    public static $log = null;
    public static $tmp = null;
    public static $endDay = null;
    public static $limit = null;

    public static function run(){
        //self::setNohup(false);

        self::$endDay = date("Y-m-d");
        self::$limit = 999999;
        $ret = self::updateFromRefer();
        if ($ret == true) return true;
        $sleep_arr = array(50, 50, 600, 1000, 1200, 2000);
        for($i = 0; $i < sizeof($sleep_arr); $i++) {
            $ret = self::updateFromTmp();
            if ($ret == true) break;
            sleep($sleep_arr[$i]);
        }
        return $ret;
    }

    //全部处理。包括更新和除权的重写入
    public static function updateFromRefer(){

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

        //日志文件
        self::$log = new Log(LOG_PATH, __FILE__);
        self::$log->debugLog("Begin Update All Day");

        //新建错误记录
        self::$tmp->addTmp('day.duty.failed', true);
        //更新大盘指数的日线数据 normal
        $list = Refer::getMarket();

        $l = 0;
        $result = true;
        foreach($list as $item){

            if ($l++ > self::$limit) break;
            $aItem = array(
                'code'      => $item['code'],
                'name'      => $item['name'],
                'spell'     => $item['spell'],
                'type'      => 'normal',
                'action'    => 'merge'
            );
            $ret = self::updateSingleDay($aItem);
            if ($ret === false) $result = false;
        }

        //更新个股的日线数据
        $list = Refer::getStock();
        //$rights = array('before', 'normal', 'after');
        $rights = array('before', 'normal');
        $l = 0;
        foreach($list as $item){
            if ($l++ > self::$limit) break;
            foreach($rights as $type){
                $aItem = array(
                    'code'      => $item['code'],
                    'name'      => $item['name'],
                    'spell'     => $item['spell'],
                    'type'      => $type,
                    'action'    => 'merge'
                );
                $ret = self::updateSingleDay($aItem);
                if ($ret === false) $result = false;
            }

        }
        if ($result === false) {
            self::$log->errorLog("Finish Apart Update All Day");
        } else {
            self::$log->debugLog("Finish All Update All Day");
        }
        return $result;
    }

    //只处理有除权情况的tmp文件中的列表，重新写入
    public static function updateFromTmp(){

        self::$tmp = new Tmp(TMP_PATH);
        self::$tmp->addTmp('day.duty.cookie', true);

        //访问xueqiu.com 生成cookie
        $url = 'http://xueqiu.com/';
        DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        $url = 'https://xueqiu.com/';
        DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));

        /*$url = 'https://xueqiu.com/stock/forchartk/stocklist.json?symbol=sh000001&period=1day&type=normal&begin=1458748800000&end=1462240877000';
        $url = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        var_dump($url);*/

        self::$log = new Log(LOG_PATH, __FILE__);
        self::$log->debugLog("Begin Update Tmp Day");

        //读取Tmp文件中股票信息
        self::$tmp->addTmp('day.duty.failed', false);
        $list = self::$tmp->getTmpContent('day.duty.failed');
        $list = explode('|', $list);

        self::$tmp->newTmpFile('day.duty.failed');

        $l = 0;
        $result = true;
        foreach($list as $item){
            if ($l++ > self::$limit) break;
            $tt = explode(':', $item);
            if (empty($tt) || empty($tt[0])) continue;
            $aItem = array(
                'code'      => $tt[0],
                'name'      => $tt[1],
                'spell'     => $tt[2],
                'type'      => $tt[3],
                'action'    => $tt[4]
            );
            if ($aItem['action'] == 'reset') {
                $ret = self::resetSingleDay($aItem);
            } else {
                $ret = self::updateSingleDay($aItem);
            }
            if ($ret === false) $result = false;
        }
        if ($result === false) {
            self::$log->errorLog("Finish Apart Update All Tmp");
        } else {
            self::$log->debugLog("Finish All Update All Tmp");
        }
        return $result;
    }

    public static function updateSingleDay($item){

        $dd = new DayData($item['code'], $item['type']);
        $last = $dd->getStockData();
        if (! $last){
            self::$log->errorLog($item['name'], $item['code'], $item['type'], $item['action'], "Get Exist Data Failed");
            $item['action'] = 'reset';
            self::$tmp->putTmpContent('day.duty.failed', join(":", $item) . "|", FILE_APPEND);
            return false;
        }
        if (end($last)["time"] == self::$endDay){
            self::$log->noticeLog($item['name'], $item['code'], $item['type'], $item['action'], "Already Updated");
            return true;
        }

        //多读取10天的数据来对比 确认能否接上
        $begin = strtotime($last[sizeof($last)-10]['time'])*1000;
        $end = strtotime("now")*1000;
        $url = 'https://xueqiu.com/stock/forchartk/stocklist.json?symbol=' .
            $item['code'] . '&period=1day&type=' . $item['type'] . '&begin=' .
            $begin . '&end=' . $end;
        self::$log->debugLog($item['name'], $item['code'], $item['type'], $item['action'], $url);


        $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        $sleep_idx = -1;
        while(! ($json = DayKeeper::parseXueqiuJson($json))){
            $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
            $sleep_idx ++;
            if (CommonInfo::GetSleepTime($sleep_idx) == -1) break;
            sleep(CommonInfo::GetSleepTime($sleep_idx));
        }
        // 抓取解析失败
        if ($sleep_idx !=-1 && CommonInfo::GetSleepTime($sleep_idx) == -1) {
            self::$log->errorLog($item['name'], $item['code'], $item['type'], $item['action'], "Curl and Parse Failed");
            $item['action'] = 'merge';
            self::$tmp->putTmpContent('day.duty.failed', join(":", $item) . "|", FILE_APPEND);
            return false;
        }
        self::$log->debugLog($item['name'], $item['code'], $item['type'], $item['action'], "Curl and Parse Success");

        if ($item['code'] == Config::get('Stock.SH')) self::$endDay = end($json)['time'];

        //var_dump($json);
        //echo "<br/><br/><br/>";
        //var_dump(end($json));

        //整合数据
        $upData = DayKeeper::mergeUpdate($last, $json);
        //var_dump($upData);
        if ($upData !== false){
            self::$log->debugLog($item['name'], $item['code'], $item['type'], $item['action'], "Merge OK");
            DayKeeper::addDay($dd->getDataFile(), $upData);
            self::$log->noticeLog($item['name'], $item['code'], $item['type'], $item['action'], "Update " . sizeof($upData). " OK");
        } else {
            self::$log->errorLog($item['name'], $item['code'], $item['type'], $item['action'], "Merge Failed");
            $item['action'] = 'reset';
            self::$tmp->putTmpContent('day.duty.failed', join(":", $item) . "|", FILE_APPEND);
            return false;
        }
        return true;

    }

    public static function resetSingleDay($item) {

        $end = strtotime("now") * 1000;
        $url = 'https://xueqiu.com/stock/forchartk/stocklist.json?symbol='.
            $item['code']. '&period=1day&type='. $item['type']. '&end='. $end;

        self::$log->debugLog($item['name'], $item['code'], $item['type'], $item['action'], $url);

        $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        $sleep_idx = -1;
        while(! ($json = DayKeeper::parseXueqiuJson($json))){
            $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
            $sleep_idx ++;
            if (CommonInfo::GetSleepTime($sleep_idx) == -1) break;
            sleep(CommonInfo::GetSleepTime($sleep_idx));
        }
        if ($sleep_idx !=-1 && CommonInfo::GetSleepTime($sleep_idx) == -1) {
            self::$log->errorLog($item['name'], $item['code'], $item['type'], $item['action'], "Curl and Parse Failed");
            $item['action'] = 'reset';
            self::$tmp->putTmpContent('day.duty.failed', join(":", $item) . "|", FILE_APPEND);
            return false;
        }
        self::$log->debugLog($item['name'], $item['code'], $item['type'], $item['action'], "Curl and Parse success");

        //var_dump($json);
        //echo "<br/><br/><br/>";
        //var_dump(end($json));

        $json = DayKeeper::handleQuota($json);
        $dd = new DayData($item['code'], $item['type']);
        if (DayKeeper::putDay($dd->getDataFile(), $json)) {
            self::$log->noticeLog($item['name'], $item['code'], $item['type'], $item['action'], "Reset  OK");
        } else {
            self::$log->errorLog($item['name'], $item['code'], $item['type'], $item['action'], "Reset Failed");
            $item['action'] = 'reset';
            self::$tmp->putTmpContent('day.duty.failed', join(":", $item) . "|", FILE_APPEND);
            return false;
        }
        return true;
    }

}
DayDuty::run();