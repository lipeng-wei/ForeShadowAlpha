<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-02
 * Time: 下午3:19
 *
 * 维护 龙虎榜Lhb 的日常维护 静态类
 *
 * 龙虎榜Lhb 更新的静态函数
 *
 *
 */

require_once(MODULE_PATH. 'TableFile.class.php');
require_once(MODULE_PATH. 'Log.class.php');
require_once(LIB_PATH . 'simplehtmldom_1_5/simple_html_dom.php');

class LhbKeeper extends TableFile{

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
        curl_setopt($ch, CURLOPT_TIMEOUT,60);   //只需要设置一个秒的数量就可以

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

    public static function fetchSingleJson($url){
        $sleep_idx = 0;
        while (CommonInfo::GetSleepTime($sleep_idx) != -1){
            $content = self::curlSinglePage($url, 'data.eastmoney.com', 'http://data.eastmoney.com/stock/lhb.html');
            $encode = mb_detect_encoding($content, array('ASCII', 'UTF-8', 'GB2312', 'GBK', 'BIG5'));
            if ($encode == 'EUC-CN' || $encode == 'GB2312' || $encode == 'GBK') {
                $content = iconv('GBK', 'UTF-8', $content);
            }
            $content = substr($content, 15);
            //var_dump($content);
            $ret    = json_decode($content, true);
            //var_dump(json_last_error());
            //var_dump($ret['pages']);

            if ($ret && $ret["success"]) {
                $json   = array();
                $rows   = $ret["data"];
                foreach($rows as $row){
                    $res = array();
                    $res['time']        = $row['Tdate'];
                    $res['change']      = $row['Chgradio'];
                    $res['buy_wan']     = ceil($row['Bmoney'] / 10000);
                    $res['buy_percent'] = ceil($row['Bmoney'] / $row['Turnover'] * 100) / 100;
                    $res['sell_wan']    = ceil($row['Smoney'] / 10000);
                    $res['sell_percent']= ceil($row['Smoney'] / $row['Turnover'] * 100) / 100;
                    $res['reason']      = $row['Ctypedes'];
                    $code = $row['SCode'];
                    $code = CommonInfo::Num2Code($code);
                    array_unshift($json , array($code, $res));
                }
                return $json;
            }

            sleep(CommonInfo::GetSleepTime($sleep_idx));
            $sleep_idx ++;
        }
        return array();
    }
    // 之前的接口暂时不使用了
    public static function fetchSinglePage($url){

        while (1){
            $c = self::curlSinglePage($url, 'data.eastmoney.com', 'http://data.eastmoney.com/stock/lhb.html');
            $html = str_get_html($c);
            if ( $c && $html){
                $content = $html->find('table#dt_1 th', 0);
                if (trim($content->plaintext) == '序号') return $html;
            }
            Log::nohupLog();
            sleep(1);
        }
    }

    public static function parseLhbHtml($html, $time){

        $rows = $html->find('table#dt_1 tbody tr.all');
        //echo $rows->plaintext;
        $ret = array();
        $lcode = null;
        $lchage = null;
        foreach($rows as $row) {
            $list = $row->find('td');
            $res = array();
            $res['time'] = $time;
            $code = null;
            if (sizeof($list) == 11 ){
                //code
                $reu = trim($list[1]->plaintext);
                $code = CommonInfo::Num2Code($reu);

                //change
                $reu = trim($list[4]->plaintext);
                $res['change'] = $reu;

                $lcode = $code;
                $lchage = $res['change'];
                $i = 0;


            } else if (sizeof($list) == 6 ){
                $code = $lcode;
                $res['change'] = $lchage;
                $i = 5;

            } else continue;
            if (! $code) continue;

            //buy_wan
            $reu = trim($list[6 - $i]->plaintext);
            $res['buy_wan'] = $reu;

            //buy_percent
            $reu = trim($list[7 - $i]->plaintext);
            $res['buy_percent'] = $reu;

            //sell_wan
            $reu = trim($list[8 - $i]->plaintext);
            $res['sell_wan'] = $reu;

            //sell_percent
            $reu = trim($list[9 - $i]->plaintext);
            $res['sell_percent'] = $reu;

            //reason
            $reu = trim($list[10 - $i]->plaintext);
            $res['reason'] = $reu;

            array_unshift($ret , array($code, $res));
        }
        //var_dump($ret);
        return $ret;
    }



    //获取新增的数据
    public static function mergeUpdate($inData, $upData){

    }


    public static function addLhb($file, $data){
        return parent::putSomeData($file, $data);

    }
    public static function putLhb($file, $data){

        if (empty($data)) return false;
        return parent::putAllData($file, $data);


    }

} 