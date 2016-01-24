<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-23
 * Time: 下午3:19
 *
 * 维护 DDE数据 的日常维护 静态类
 *
 * DDE数据 更新的静态函数
 *
 *
 */

require_once(MODULE_PATH. 'TableFile.class.php');

class DdeKeeper extends TableFile{


    public static function curlSinglePage($url, $host, $referer, $cookieFile){

        //初始化
        $ch = curl_init();

        //设置选项参数
        $header[]= 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8 ';
        $header[]= 'Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3 ';
        //$header[]= 'Accept-Encoding: gzip, deflate ';
        $header[]= 'Cache-Control:	max-age=0 ';
        $header[]= 'Connection: Keep-Alive ';
        $header[]= 'Host: '. $host. ' ';
        $header[]= 'Referer: '. $referer.' ';
        $header[]= 'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0 ';

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT,10);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//设置返回数据

        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile); //保存
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile); //读取

        //curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER,$header);

        //执行
        $contents = curl_exec($ch);
        //释放curl句柄
        curl_close($ch);
        return $contents;
    }

    /*

    0                          3 ddy                     7dd   8tdd           10 ddx
    11.91, 16152.59, 129.22,   0.016,  1.026, 0.9, -1.7, -0.8, 1.6,   -0.58,  0.01,    0.018,0.008,-0.035,-
    0.601,11.8,11.91,11.51,2015-08-17|
    10.72, 18223.85, -346.25, -0.087,  0.888, 4.8, -2.9, 3,    -4.9,  -9.99,  -0.026,  0.02,-0.002,-0.029,-
    0.633,11.9,12,10.72,2015-08-18|
    10.81, 14276.65, -71.38,  -0.014,  0.978, 1.3, -0.8, 0.8,  -1.3,  0.84,  -0.006,   -0.023,-0.015,-0.069,-
    0.624,10.26,10.9,9.8,2015-08-19|

     */
    //解析数据
    public static function parseGpcxwDde($contents){

        $ret = array();
        if ($contents){
            $rows = explode('|', $contents);
            //去重
            $lastime = 0;
            foreach($rows as $row){
                if (!$row) continue;
                //echo $row. '<br/>';
                $list = explode(',', $row);

                if (trim(end($list)) == $lastime) continue;
                else $lastime = trim(end($list));

                $res = array(
                    'time' => trim(end($list)),
                    'ddx' => trim($list[10]),
                    'ddy' => trim($list[3]),
                    'ddz' => trim($list[7]),
                    'tddz' => trim($list[8])
                );
                $ret []= $res;
            }
        }
        return $ret;
    }



    //合并更新数据 1，判断能否对接 2，计算指标 3，获取新增的数据
    public static function mergeUpdate($inData, $upData){
        $inEnd = end($inData)['time'];
        $ret = array();

        for ($i = sizeof($upData) - 1 ; $i >= 0; $i-- ){
            //echo "<br/>".$upData[$i]['time'] . "><". $inEnd ."<br/>";
            if ($upData[$i]['time'] > $inEnd) {
                array_unshift($ret, $upData[$i]);

            } else break;
        }
        return $ret;

    }


    public static function addDde($file, $data){
        return parent::putSomeData($file, $data);

    }
    public static function putDde($file, $data){

        if (empty($data)) return false;
        return parent::putAllData($file, $data);


    }

} 