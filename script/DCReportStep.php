<?php
/**
 * Created by PhpStorm.
 * User: wlp
 * Date: 2017/8/8
 * Time: 18:17
 *
 * 每天运行 更新 东方财富 研报的运行脚本
 *
 *  Report.dc.step.time.Tmp.txt 2017-08-09
 */

require_once(dirname(__FILE__). '/../Require.php');
require_once(MODULE_PATH . 'DCReportData.class.php');

require_once(MODULE_PATH. 'TableFile.class.php');
require_once(MODULE_PATH. 'Log.class.php');

class DCReportStep extends Script{

    public static $log = null;
    public static $tmp = null;
    public static $limit = null;

    public static function run(){
        //self::setNohup(false);
        self::$limit = 800;
        self::updateReport();
    }

    public static function updateReport(){
        //日志文件
        self::$log = new Log(LOG_PATH, __FILE__);
        //临时文件
        self::$tmp = new Tmp(TMP_PATH);
        self::$tmp->addTmp('report.dc.step.time', false);

        //访问data.eastmoney.com 生成cookie
        $url = 'http://data.eastmoney.com/report/';
        $ret = self::curlSinglePage($url, 'data.eastmoney.com', 'baidu.com', self::$tmp->getTmpFile('report.dc.step.cookie'));
        //var_dump($ret);

        self::$log->debugLog("Begin Update report");

        $lastTime = self::$tmp->getTmpContent('report.dc.step.time');
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

            $t_rt = 50072929 + $page;
            $t_var = "pUXlYkcE";
            $t_page = $page;
            $url = "http://datainterface.eastmoney.com//EM_DataCenter/js.aspx?type=SR&sty=GGSR&js=var%20".$t_var.
                "={%22data%22:[(x)],%22pages%22:%22(pc)%22,%22update%22:%22(ud)%22,%22count%22:%22(count)%22}&".
                "ps=50&p=".$t_page."&mkt=0&stat=0&cmd=4&code=&rt=".$t_rt;

            self::$log->debugLog('Get page', $t_page);
            self::$log->debugLog('Get Url', $url);
            $ret = self::fetchSinglePage($url, 'datainterface.eastmoney.com', 'http://data.eastmoney.com/report/', self::$tmp->getTmpFile('report.dc.step.cookie'));
            $updata = self::parseReport($ret['data']);

            if ($updata) {
                $list = array_merge($updata, $list);
            }
            if ($list[0][1]['time'] <= $lastTime) break;
        }
        if ($list) {
            //var_dump($list);
            foreach($list as $new){

                if ($new[0]) {
                    $rd = new DCReportData($new[0]);
                    $data = $rd->getDCReportData();
                    if (! $data) {
                        TableFile::putSomeData($rd->getDataFile(), array($new[1]));
                        self::$log->noticeLog("Update", $new[0], $new[1]['time'], $new[1]['title'], "Success");
                        continue;
                    }
                    //echo $new[1]['time']. '>'. $t. '<br />';
                    if ($new[1]['time'] > $lastTime && $new[1]['time'] <= $thisTime ){
                        TableFile::putSomeData($rd->getDataFile(), array($new[1]));
                        self::$log->noticeLog("Update", $new[0], $new[1]['time'], $new[1]['title'], "Success");
                    }
                }
            }
        }else {
            self::$log->errorLog("Parse DCReport Failed");
        }
        self::$tmp->newTmpFile('report.dc.step.time');
        self::$tmp->putTmpContent('report.dc.step.time', $thisTime);
        self::$log->debugLog("Finish Update DCReport");

        return 1;
    }

    public static function parseReport($json){

        $ret = array();

        foreach($json as $row){

            //code
            $reu = $row['secuFullCode'];
            $reu = substr($reu,0,6);
            $code = CommonInfo::Num2Code($reu);


            //time
            $reu = $row['datetime'];
            $reu = substr($reu,0,10);
            $res['time'] = $reu;

            //rate
            $reu = $row['sratingName'];
            $res['rate'] = $reu;

            //change
            $reu = $row['change'];
            $res['change'] = $reu;

            //aim
            $res['aim'] = 0;

            //institute
            $reu = $row['insName'];
            $res['institute'] = $reu;

            //title
            $reu = $row['title'];
            $res['title'] = $reu;

            //url
            $reu = $res['time'];
            $reu = str_replace("-", "", $reu);
            $reu = 'http://data.eastmoney.com/report/'.$reu.'/'.$row['infoCode'].'.html';
            $res['url'] = $reu;

            array_unshift($ret , array($code, $res));

        }
        //var_dump($ret);
        return $ret;
    }

    public static function curlSinglePage($url, $host, $referer = null, $cookieFile = null){

        //初始化
        $ch = curl_init();

        //设置选项参数
        $header[]= 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8 ';
        $header[]= 'Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3 ';
        //$header[]= 'Accept-Encoding: gzip, deflate ';
        $header[]= 'Cache-Control:	max-age=0 ';
        $header[]= 'Connection: Keep-Alive ';
        if ($host) $header[]= 'Host: '. $host. ' ';
        if ($referer) $header[]= 'Referer: '. $referer.' ';
        $header[]= 'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0 ';

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//设置返回数据

        if ($cookieFile) {
            curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile); //保存
            curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile); //读取
        }


        //curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER,$header);

        //执行
        $contents = curl_exec($ch);
        //释放curl句柄
        curl_close($ch);
        return $contents;
    }

    public static function fetchSinglePage($url, $host, $referer = null, $cookieFile = null){
        $sleep_idx = -1;
        while (1){
            $ret = self::curlSinglePage($url, $host, $referer, $cookieFile);
            if ( $ret ){

                $t = strpos($ret, '=');
                $content = substr($ret, $t + 1);
                $json = json_decode($content, true);
                if ($json) return $json;

            }
            $sleep_idx ++;
            if (CommonInfo::GetSleepTime($sleep_idx) == -1) $sleep_idx = 0;
            self::$log && self::$log->debugLog("sleep " . CommonInfo::GetSleepTime($sleep_idx). "s then retry");
            sleep(CommonInfo::GetSleepTime($sleep_idx));
        }
        return false;
    }

}
DCReportStep::run();