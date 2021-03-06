<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-02
 * Time: 下午3:21
 *
 *
 * 每天运行 更新龙虎榜Lhb 的运行脚本
 *
 */

require_once(dirname(__FILE__). '/../Require.php');
require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH . 'LhbData.class.php');
require_once(MODULE_PATH. 'LhbKeeper.class.php');

class LhbDuty extends Script{

    public static $log = null;
    public static $tmp = null;
    public static $limit = null;

    public static function run(){
        //self::setNohup(false);

        self::$limit = 999999;
        self::updateLhb();
    }



    public static function updateLhb(){
        //日志文件
        self::$log = new Log(LOG_PATH, __FILE__);
        //临时文件
        self::$tmp = new Tmp(TMP_PATH);
        self::$tmp->addTmp('lhb.duty.time', false);
        self::$log->debugLog("Begin Update Lhb");

        //得到上次更新时间
        $lastTime = self::$tmp->getTmpContent('lhb.duty.time');
        //校验上次更新时间
        $pattern = "/[0-9]{4}-[0-9]{2}-[0-9]{2}/";
        preg_match($pattern, $lastTime, $k);
        $lastTime = $k[0];
        $thisTime = $lastTime;

        self::$log->debugLog("Update From : ", $lastTime);
        if ($lastTime){

            //echo $lastTime . '<br />';
            $szzs = Refer::getSH();
            $dd = new DayData($szzs['code']);
            if ($dd->prepareData()) {
                $ks = $dd->getDayPeriod($lastTime, true);
                $list = array();
                self::$log->debugLog("Update Till : ", end($ks)['time']);
                foreach($ks as $k){
                    $cTime = $k['time'];
                    if ($cTime > $lastTime){

                        //echo $cTime. '<br />';
//                        $url = "http://data.eastmoney.com/stock/lhb/". $cTime. ".html";
//                        self::$log->debugLog('Get Url', $url);
//                        $html = LhbKeeper::fetchSinglePage($url);
//                        self::$log->debugLog("Fetch Url Page Success");
//                        $updata = LhbKeeper::parseLhbHtml($html, $cTime);

                        //http://data.eastmoney.com/DataCenter_V3/stock2016/TradeDetail/pagesize=200,page=1,
                        //sortRule=-1,sortType=,startDate=2017-02-23,endDate=2017-02-23,gpfw=0,js=var%20data_tab_1.html?
                        //rt=24798706
                        $url = 'http://data.eastmoney.com/DataCenter_V3/stock2016/TradeDetail/pagesize=800,page=1,'.
                            'sortRule=-1,sortType=,startDate='. $cTime. ',endDate='. $cTime.
                            ',gpfw=0,js=var%20data_tab_1.html?rt='. ceil(time() / 60);
                        self::$log->debugLog($cTime, "Fetch Url: ", $url);
                        $json = LhbKeeper::fetchSingleJson($url);
                        self::$log->debugLog($cTime, "Fetch Url Page Success");

                        if ($json) {
                            $list = array_merge($list, $json);
                        }
                        $thisTime = $cTime;
                    }
                }
                //var_dump($list);
                if ($list) {
                    foreach($list as $new){
                        $ld = new LhbData($new[0]);
                        $data = $ld->getLhbData();
                        if (! $data) {
                            LhbKeeper::addLhb($ld->getDataFile(), array($new[1]));
                            self::$log->noticeLog("Update", $new[0], $new[1]['time'], $new[1]['reason'], "Success");
                            continue;
                        }
                        $t = end($data)['time'];
                        //echo $new[1]['time']. '>'. $t. '<br />';
                        if ($new[1]['time'] > $t){
                            LhbKeeper::addLhb($ld->getDataFile(), array($new[1]));
                            self::$log->noticeLog("Update", $new[0], $new[1]['time'], $new[1]['reason'], "Success");
                        }
                    }
                }else {
                    self::$log->errorLog("Parse Lhb Failed");
                }
                self::$tmp->newTmpFile('lhb.duty.time');
                self::$tmp->putTmpContent('lhb.duty.time', $thisTime);
                self::$log->debugLog("Finish Update Lhb");
            } else {
                self::$log->errorLog("Get Time List Failed");
            }

        } else {
            self::$log->errorLog("Get LastTime Failed");
        }
    }

}
LhbDuty::run();