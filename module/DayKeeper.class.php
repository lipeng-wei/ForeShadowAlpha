<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-23
 * Time: 下午3:19
 *
 * 维护 日线Day 的日常维护 静态类
 *
 * 日线更新的静态函数
 *
 *
 */

require_once(MODULE_PATH. 'TableFile.class.php');

class DayKeeper extends TableFile{

    public static function curlXueqiuJson($url, $cookieFile){

        //初始化
        $ch = curl_init();

        //设置选项参数
        $header = array();
        $header[]= 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8 ';
        $header[]= 'Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3 ';
        $header[]= 'Accept-Encoding: gzip, deflate ';
        $header[]= 'Cache-Control:	max-age=0 ';
        $header[]= 'Connection: Keep-Alive ';
        $header[]= 'Host: xueqiu.com ';
        $header[]= 'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0 ';

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//设置返回数据

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);   // 只信任CA颁布的证书
        //curl_setopt($ch, CURLOPT_CAINFO, DATA_PATH . 'xueqiu.com.cacert.pem'); // CA根证书（用来验证的网站证书是否是CA颁布）
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // 检查证书中是否设置域名，

        curl_setopt($ch, CURLOPT_HEADER, false);
        //curl_setopt($ch, CURLOPT_HTTPHEADER,$header);

        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile); //保存
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile); //读取

        $contents = curl_exec($ch);//执行
        //echo 'Curl error: ' . curl_error($ch);
        curl_close($ch);//释放curl句柄

        return $contents;
    }

    public static function parseXueqiuJson($contents){

        //var_dump($contents);
        if (! empty($contents)){
            $json = json_decode($contents, true);
            //var_dump($json);
            if ($json && $json['success']) {
                foreach($json['chartlist'] as $k => $v) {
                    $v = $json['chartlist'][$k]['time'];
                    $json['chartlist'][$k]['time'] = date("Y-m-d", strtotime($v));

                }
                return $json['chartlist'];

            } else
                return false;
        } else
            return false;
    }



    //合并更新数据 1，判断能否对接 2，计算指标 3，获取新增的数据
    public static function mergeUpdate($inData, $upData){
        $inEnd = end($inData)['time'];
        $inpos = sizeof($inData);
        $merData = array();

        //echo "loc1";
        //print_r(end($inData));

        //echo "<br/><br/><br/>";
        //print_r(end($upData));
        //echo "<br/>".sizeof($upData)."<br/>";

        //判断最后几行数据能否对接
        $j = 5;
        $k = sizeof($inData);
        for ($i = sizeof($upData) - 1 ; $i >= 0; $i-- ){
            //echo "<br/>".$upData[$i]['time'] . "><". $inEnd ."<br/>";
            if ($upData[$i]['time'] > $inEnd) {
                array_unshift($merData, $upData[$i]);

            } else{

                $k--;$j--;
                //echo $j;
                if ($j < 0 )break;
                if ($inData[$k]['close'] != $upData[$i]['close']) {
                    //print_r($inData[$k]);
                    //print_r($upData[$i]);
                    break;
                }

            }
        }
        if ($j >= 0) return false;
        if (empty($merData)) return $merData;

        //合并数据并计算指标数值
        $merData =array_merge($inData, $merData);
        $merData = DayKeeper::handleQuota($merData, $inpos);


        return array_slice($merData, $inpos);

    }

    public static function handleMA($list, $index, $interval){

        if ($index+1 < $interval) return null;
        $sum = 0;
        for($j=$index+1-$interval; $j<=$index; $j++){
            $sum += $list[$j]['close'];
        }
        return floor($sum/$interval*100)/100;



    }

    //处理指标数据
    public static function handleQuota($data, $from = 0){
        $renew = array_slice($data, 0, $from);
        for ($i = $from; $i < sizeof($data); $i++){
            $adata = $data[$i];

            //需要处理的指标数据
            $adata['ma60'] = DayKeeper::handleMA($data, $i, 60);

            $renew[] = $adata;

        }
        return $renew;
    }

    public static function addDay($file, $data){
        return parent::putSomeData($file, $data);

    }
    public static function putDay($file, $data){

        if (empty($data)) return false;
        return parent::putAllData($file, $data);


    }

} 