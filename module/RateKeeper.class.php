<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-02
 * Time: 下午3:19
 *
 * 维护 机构评级Rate 的日常维护 静态类
 *
 * 机构评级Rate 更新的静态函数
 *
 *
 */

require_once(MODULE_PATH. 'TableFile.class.php');
require_once(MODULE_PATH. 'Log.class.php');
require_once(LIB_PATH . 'simplehtmldom_1_5/simple_html_dom.php');

class RateKeeper extends TableFile{

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

    public static function fetchSinglePage($url){

        while (1){
            $c = self::curlSinglePage($url, 'yanbao.stock.hexun.com');
            $html = str_get_html($c);
            if ( $c && $html){
                $content = $html->find('div.z_content div.table table', 0);
                if ($content) return $html;
            }
            Log::nohupLog();
            sleep(1);
        }
    }

    public static function parseRateHtml($html){

        $rows = $html->find('div.table table tr');
        //echo $rows->plaintext;
        $ret = array();
        $pattern = "/[0-9]+/";
        foreach($rows as $row){
            $list = $row->find('td');

            if (sizeof($list) == 9 ){

                //code
                $reu = $list[0]->find('a', 0)->href;
                //echo $reu;
                preg_match($pattern, $reu, $k);
                $code = CommonInfo::Num2Code($k[0]);
                $res = array();

                //time
                $reu = trim($list[8]->plaintext);
                $res['time'] = $reu;

                //rate
                $reu = trim($list[5]->plaintext);
                $res['rate'] = $reu;

                //change
                $reu = trim($list[6]->plaintext);
                $res['change'] = $reu;

                //aim
                $reu = trim($list[7]->plaintext);
                $res['aim'] = $reu;

                //institute
                $reu = trim($list[3]->plaintext);
                $res['institute'] = $reu;

                //title
                $reu = trim($list[1]->plaintext);
                $res['title'] = $reu;

                //url
                $reu = $list[1]->find('a', 0)->href;
                $reu = 'http://yanbao.stock.hexun.com/' . $reu;
                $res['url'] = $reu;

                array_unshift($ret , array($code, $res));
            }

        }
        //var_dump($ret);
        return $ret;
    }



    //获取新增的数据
    public static function mergeUpdate($inData, $upData){

    }


    public static function addRate($file, $data){
        return parent::putSomeData($file, $data);

    }
    public static function putRate($file, $data){

        if (empty($data)) return false;
        return parent::putAllData($file, $data);


    }

} 