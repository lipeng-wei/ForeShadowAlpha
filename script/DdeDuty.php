<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-23
 * Time: 下午3:21
 *
 *
 * 每天运行 更新 爱股网DDE数据 的运行脚本
 *
 */

require_once(dirname(__FILE__). '/../Require.php');
require_once(MODULE_PATH . 'DdeData.class.php');
require_once(MODULE_PATH . 'DdeKeeper.class.php');


class DdeDuty extends Script{

    private static $log = null;
    private static $tmp = null;

    public static function run(){
        self::setNohup(false);

        self::updateGpcxwDde();

    }

    //每天更新数据
    public static function updateGpcxwDde(){
        //日志文件
        self::$log = new Log(LOG_PATH, __FILE__);
        //临时文件
        self::$tmp = new Tmp(TMP_PATH);

        self::$tmp->addTmp('dde.gpcxw.duty.cookie', false);
        self::$tmp->addTmp('dde.gpcxw.duty.failed', true);
        self::$tmp->addTmp('dde.gpcxw.duty.process', false);

        self::$log->debugLog("Begin Update Gpcxw Dde");

        $host = 'www.gpcxw.com';
        $referer = 'baidu.com';

        //首先获取cookie
        $url = 'http://www.gpcxw.com/ddx/000703.html';
        $content = DdeKeeper::curlSinglePage($url, $host, $referer, self::$tmp->getTmpFile('dde.gpcxw.duty.cookie'));

        $p = -1;

        $list = Refer::getStock();
        //得到进度
        $content = self::$tmp->getTmpContent('dde.gpcxw.duty.process');
        $content = explode('===', $content);
        $lastProcess = $content && $content[0]? $content[0]: -1;
        foreach($list as $item){
            $p++;
            //if ($p >= 3 ) break;
            if ($p < $lastProcess) continue;
            self::$tmp->putTmpContent('dde.gpcxw.duty.process', $p. '==='. $item['code']. ' '. $item['name']);

            $numCode = substr($item['code'], 2);
            $data = 0;

            $dde = new DdeData($item['code']);
            $last = $dde->getDdeData();


            //抓取页面
            while(! $data){

                if ($data !== 0) sleep(1);
                $data = false;

                //抓取最新的数据
                $ran = mt_rand();
                $ran = '0.' . $ran. $ran;
                $referer = 'http://www.gpcxw.com/ddx/data2/dde.htm?code='. $numCode;
                $url = 'http://www.gpcxw.com/ddx/data2/data2.htm?code='. $numCode. '&m='. $ran;
                self::$log->debugLog($item['name'], $item['code'], 'new', $url);
                $content = DdeKeeper::curlSinglePage($url, $host, $referer, self::$tmp->getTmpFile('dde.gpcxw.duty.cookie'));
                if (! $content) continue;
                $content = iconv('GB2312', 'UTF-8//IGNORE', $content);

                //处理停牌
                if (substr($content, 0, 7) == 'tingpai'){
                    $data = false;
                    break;
                }

                //读取最新的数据
                $cuts = explode('==', $content);
                if (sizeof($cuts) != 3) continue;
                $k =  explode('<=>', $cuts[1]);
                $k = end($k);
                $k =  explode(' ', $k);
                $new = $k[0];
                $k =  explode('<=>', $cuts[2]);
                $k = end($k);
                if (substr($k,strlen($k)-1) != '|') $k .='|';
                $new = $k . $new;


                //新增的个股 需要抓取历史数据
                if (! $last){
                    //抓取历史的数据
                    $k =  explode('<=>', $cuts[0]);
                    $lastfilemtime = end($k);
                    $ran = mt_rand();
                    $ran = '0.' . $ran. $ran;
                    $referer = $url;
                    $url = 'http://www.gpcxw.com/ddx/data2/data2.htm?code='. $numCode.
                        '&m='. $ran. '&lastfilemtime='. $lastfilemtime. '&getlsold=1';
                    self::$log->debugLog($item['name'], $item['code'], 'history', $url);
                    $content = DdeKeeper::curlSinglePage($url, $host, $referer, self::$tmp->getTmpFile('dde.gpcxw.duty.cookie'));
                    if (! $content) continue;
                    $content = iconv('GB2312', 'UTF-8//IGNORE', $content);
                    //读取历史数据
                    $cuts = explode('<=>', $content);
                    if (sizeof($cuts) != 2) continue;
                    $k = end($cuts);
                    if (substr($k,strlen($k)-1) != '|') $k .='|';
                    $new = $k . $new;
                }

                $data = DdeKeeper::parseGpcxwDde($new);

            }

            //print_r($data);
            //处理停牌
            if (! $data){
                self::$log->noticeLog($item['name'], $item['code'], "TingPai");
                continue;
            }

            if ($last){
                $updata = DdeKeeper::mergeUpdate($last, $data);
                DdeKeeper::addDde($dde->getDataFile(), $updata);
            } else {
                $updata = $data;
                DdeKeeper::putDde($dde->getDataFile(), $updata);
            }
            self::$log->noticeLog($item['name'], $item['code'], "Update Gpcxw Dde Success");

        }
        self::$log->debugLog("Finish Update Gpcxw Dde");
        self::$tmp->putTmpContent('dde.gpcxw.duty.process', '');

    }

}
DdeDuty::run();