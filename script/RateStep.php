<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-02
 * Time: 下午3:21
 *
 *
 * 每天运行 更新机构评级Rate 的运行脚本
 *
 */

require_once(dirname(__FILE__). '/../Require.php');
require_once(MODULE_PATH . 'RateData.class.php');
require_once(MODULE_PATH. 'RateKeeper.class.php');

class RateStep extends Script{

    public static $log = null;
    public static $tmp = null;
    public static $limit = null;

    public static function run(){
        //self::setNohup(false);
        self::$limit = 8888;
        self::updateRate();
    }



    public static function updateRate(){
        //日志文件
        self::$log = new Log(LOG_PATH, __FILE__);
        //临时文件
        self::$tmp = new Tmp(TMP_PATH);
        self::$tmp->addTmp('rate.step.time', false);
        self::$log->debugLog("Begin Update Rate");

        $lastTime = self::$tmp->getTmpContent('rate.step.time');
        //校验上次更新时间
        $pattern = "/[0-9]{4}-[0-9]{2}-[0-9]{2}/";
        preg_match($pattern, $lastTime, $k);
        $lastTime = $k[0];
        if (! $lastTime){
            self::$log->errorLog("Get LastTime Failed");
            return 0;
        }
        $thisTime = date("Y-m-d", strtotime('-1 day'));

        $page = 0;
        $list = array();
        while($page < self::$limit) {

            $page++;

            if ($page == 1)
                $url = "http://yanbao.stock.hexun.com/xgq/gsyj.aspx?";
            else
                $url = "http://yanbao.stock.hexun.com/xgq/gsyj.aspx?1=1&page=" . $page;
            self::$log->debugLog('Get Url', $url);
            $html = RateKeeper::fetchSinglePage($url);
//            $content = $html->find('div.z_content div.table table', 0);
//            var_dump($content->plaintext);
            self::$log->debugLog("Fetch Url Page Success");
            $updata = RateKeeper::parseRateHtml($html);

            if ($updata) {
                $list = array_merge($updata, $list);
            }
            if ($list[0][1]['time'] <= $lastTime) break;
        }
        if ($list) {
            //var_dump($list);
            foreach($list as $new){
                $rd = new RateData($new[0]);

                $data = $rd->getRateData();
                if (! $data) {
                    RateKeeper::addRate($rd->getDataFile(), array($new[1]));
                    self::$log->noticeLog("Update", $new[0], $new[1]['time'], $new[1]['title'], "Success");
                    continue;
                }
                //echo $new[1]['time']. '>'. $t. '<br />';
                if ($new[1]['time'] > $lastTime && $new[1]['time'] <= $thisTime ){
                    RateKeeper::addRate($rd->getDataFile(), array($new[1]));
                    self::$log->noticeLog("Update", $new[0], $new[1]['time'], $new[1]['title'], "Success");
                }
            }
        }else {
            self::$log->errorLog("Parse Rate Failed");
        }
        self::$tmp->newTmpFile('rate.step.time');
        self::$tmp->putTmpContent('rate.step.time', $thisTime);
        self::$log->debugLog("Finish Update Rate");
    }

}
RateStep::run();