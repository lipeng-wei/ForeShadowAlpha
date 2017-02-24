<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-23
 * Time: 下午3:21
 *
 *
 * 每天运行 更新股本变迁Gbbq 的运行脚本
 *
 */

require_once(dirname(__FILE__). '/../Require.php');
require_once(MODULE_PATH . 'GbbqData.class.php');
require_once(MODULE_PATH. 'GbbqKeeper.class.php');

class GbbqStep extends Script{

    public static $log = null;
    public static $tmp = null;
    public static $limit = null;

    public static function run(){
        //self::setNohup(false);

        //日志文件
        self::$log = new Log(LOG_PATH, __FILE__);
        //临时文件
        self::$tmp = new Tmp(TMP_PATH);
        self::$tmp->addTmp('gbbq.step.success', true);
        self::$tmp->addTmp('gbbq.step.failed', true);
        self::$tmp->addTmp('gbbq.step.process', false);

        self::$limit = 999999;
        self::updateGbbq();
    }



    public static function updateGbbq(){
        self::$log->debugLog("Begin Update Gbbq");
        /*
        $url = "http://stockdata.stock.hexun.com/2009_fhzzgb_000001.shtml";
        $json = DayKeeper::curlXueqiuJson($url, self::$tmp->getTmpFile('day.duty.cookie'));
        $json = DayKeeper::parseXueqiuJson($json);
        var_dump($json);
        */

        $l = -1;
        $list = Refer::getStock();
        //得到进度
        $content = self::$tmp->getTmpContent('gbbq.step.process');
        $content = explode('===', $content);
        $lastProcess = $content && $content[0]? $content[0]: -1;
        foreach($list as $item){
            if ($l++ > self::$limit) break;
            if ($l < $lastProcess) continue;
            self::$tmp->putTmpContent('gbbq.step.process', $l. '==='. $item['code']. ' '. $item['name']);

            $numCode = substr($item['code'], 2);
            $url = "http://stockdata.stock.hexun.com/2009_fhzzgb_" . $numCode . ".shtml";
            self::$log->debugLog($item['name'], $item['code'], $url);

            $html = GbbqKeeper::fetchSingleGbbq($url, $numCode);

            if ($html) {
                self::$log->debugLog($item['name'], $item['code'], "Fetch Gbbq Success");
                $now = GbbqKeeper::parseGbbqHtml($html);
                if ($now) {
                    $gd = new GbbqData($item['code']);
                    $last = $gd->getGbbqData();
                    if ($last){
                        $updata = GbbqKeeper::mergeUpdate($last, $now);
                        GbbqKeeper::addGbbq($gd->getDataFile(), $updata);
                    } else {
                        $updata = $now;
                        GbbqKeeper::putGbbq($gd->getDataFile(), $updata);
                    }
                    self::$log->noticeLog($item['name'], $item['code'], "Update Gbbq Success");
                    self::$tmp->putTmpContent('gbbq.step.success', join(":", $item) . "|", FILE_APPEND);
                }else {
                    self::$log->errorLog($item['name'], $item['code'], "Parse Gbbq Failed");
                    self::$tmp->putTmpContent('gbbq.step.failed', join(":", $item) . "|", FILE_APPEND);
                }
            } else {
                self::$log->errorLog($item['name'], $item['code'], "Fetch Gbbq Failed");
                self::$tmp->putTmpContent('gbbq.step.failed', join(":", $item) . "|", FILE_APPEND);
            }


        }
        self::$log->debugLog("Finish Update Gbbq");
        self::$tmp->putTmpContent('gbbq.step.process', '');
    }

}
GbbqStep::run();