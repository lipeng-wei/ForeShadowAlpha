<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-23
 * Time: 下午3:19
 *
 * 维护 同花顺牛叉诊股数据 的日常维护 静态类
 *
 * 同花顺牛叉诊股数据更新的静态函数
 *
 *
 */

require_once(MODULE_PATH. 'TableFile.class.php');
require_once(LIB_PATH . 'simplehtmldom_1_5/simple_html_dom.php');

class ThsDoctorKeeper extends TableFile{


    public static function fetchSingleThsDoctor($url, $numCode){

        $codeGet = false;
        $sleep_arr = array(0, 0, 1, 1, 1, 1, 2, 2, 2, 8, 8, 50, 100, 200, 600, -1, -1, -1);
        $sleep_idx = -1;
        while ($codeGet != $numCode){
            $sleep_idx ++;
            if ($sleep_arr[$sleep_idx] == -1) $sleep_idx = 0;
            sleep($sleep_arr[$sleep_idx]);

            $html = file_get_html($url);
            if ($html){


                if (! $html->find('div.stocktotal',0)) continue;
                if (! $html->find('div#nav_technical div.result',0)) continue;
                if (! $html->find('div#nav_message div.result',0)) continue;
                if (! $html->find('li.short',0)) continue;
                if (! $html->find('div#nav_message div.table_scroll_wrap table.m_table',0)) continue;


                $codeGet = $html->find('div.stockname',0);
                $codeGet = iconv('GB2312', 'UTF-8//IGNORE', $codeGet->plaintext);
                $r = "/([0-9]+)/";
                preg_match($r, $codeGet, $k);
                $codeGet = $k[0];

            } else $codeGet = false;



        }
        return $html;
    }

    public static function parseThsDoctorHtml($html){

        $thsRow = array();


        //time
        $res = iconv('GB2312', 'UTF-8//IGNORE', $html->find('span.date',0)->plaintext);
        $r = "/[0-9.]+/";
        preg_match_all($r, $res, $k);
        //if (sizeof($k) < 5 ) continue;
        $t = $k[0][0]. '-'. $k[0][1]. '-'. $k[0][2];
        //echo $t. "<br />";
        //echo $k[0][3]. "<br />";
        $thsRow['time'] = $t;
        $thsRow['hour'] = $k[0][3].':'.$k[0][4];


        //total
        $res = $html->find('div.stocktotal',0);
        $res = iconv('GB2312', 'UTF-8//IGNORE', $res->plaintext);
        $r = "/([0-9.]+)分/";
        preg_match($r, $res, $k);
        //echo $k[0].'--'.$k[1]."<br />";
        $thsRow['total_score'] = $k[1];
        $res = iconv('GB2312', 'UTF-8//IGNORE', $html->find('div.stockintro p.cnt',0)->plaintext);
        $thsRow['total_text'] = trim($res);

        //shot_trend
        $thsRow['shot_trend'] = trim(iconv('GB2312', 'UTF-8//IGNORE', $html->find('li.short',0)->plaintext));
        //mid_trend
        $thsRow['mid_trend'] = trim(iconv('GB2312', 'UTF-8//IGNORE', $html->find('li.mid',0)->plaintext));
        //long_trend
        $thsRow['long_trend'] = trim(iconv('GB2312', 'UTF-8//IGNORE', $html->find('li.long',0)->plaintext));

        //technical
        $res = iconv('GB2312', 'UTF-8//IGNORE', $html->find('div#nav_technical div.result',0)->plaintext);
        $r = "/([0-9.]+)/";
        preg_match($r, $res, $k);
        $thsRow['technical_score'] = $k[0];
        //echo $k[0]."<br />";
        $k = trim($res);
        $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
        $thsRow['technical_text'] = end($kk);

        //funds
        $res = iconv('GB2312', 'UTF-8//IGNORE', $html->find('div#nav_funds div.result',0)->plaintext);
        $r = "/([0-9.]+)/";
        preg_match($r, $res, $k);
        $thsRow['funds_score'] = $k[0];
        //echo $k[0]."<br />";
        $k = trim($res);
        $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
        $thsRow['funds_text'] = end($kk);

        //message
        $res = iconv('GB2312', 'UTF-8//IGNORE', $html->find('div#nav_message div.result',0)->plaintext);
        $r = "/([0-9.]+)/";
        preg_match($r, $res, $k);
        $thsRow['message_score'] = $k[0];
        //echo $k[0]."<br />";
        $k = trim($res);
        $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
        $thsRow['message_text'] = end($kk);

        //trade
        $res = iconv('GB2312', 'UTF-8//IGNORE', $html->find('div#nav_trade div.result',0)->plaintext);
        $r = "/([0-9.]+)/";
        preg_match($r, $res, $k);
        $thsRow['trade_score'] = $k[0];
        //echo $k[0]."<br />";
        $k = trim($res);
        $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
        $thsRow['trade_text'] = end($kk);

        //basic
        $res = iconv('GB2312', 'UTF-8//IGNORE', $html->find('div#nav_basic div.result',0)->plaintext);
        $r = "/([0-9.]+)/";
        preg_match($r, $res, $k);
        $thsRow['basic_score'] = $k[0];
        //echo $k[0]."<br />";
        $k = trim($res);
        $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
        $thsRow['basic_text'] = end($kk);


        //var_dump($thsRow);
        return array($thsRow);
    }

    public static function parseThsDoctorMesHtml($html){
        $ret = array();
        $res = $html->find('div#nav_message div.table_scroll_wrap table.m_table',0);
        if (! $res) return $ret;
        $rows = $res->find('tr');
        if (! $rows) return $ret;
        foreach($rows as $row){
            $list = $row->find('td');
                $res = array();
                $reu = trim($list[3]->plaintext);
                $res['time'] = trim($reu);
                $reu = $list[0]->plaintext;
                $res['rank'] = trim($reu);
                $reu = $list[1]->plaintext;
                $res['type'] = trim($reu);
                $reu = $list[2]->plaintext;
                $res['content'] = trim($reu);
                array_unshift($ret, $res);
        }
        //var_dump($ret);
        return $ret;

    }

    //获取新增的数据
    public static function mergeThsDoctorUpdate($inData, $upData){
        $inEnd = end($inData)['time'].end($inData)['hour'];
        $ret = array();
        $upEnd = end($upData)['time'].end($upData)['hour'];
        if ($upEnd > $inEnd) return $upData;
        else return false;
    }
    //获取新增Mes的数据
    public static function mergeThsDoctorMesUpdate($inData, $upData){
        $inEnd = end($inData)['time'];
        $conEnd =array();

        for ($i = sizeof($inData) - 1 ; $i >= 0; $i-- ){
            if ($inData[$i]['time'] == $inEnd){
                $conEnd[]= $inData[$i]['content'];
            } else break;
        }

        $ret = array();

        for ($i = sizeof($upData) - 1 ; $i >= 0; $i-- ){
            //echo "<br/>".$upData[$i]['time'] . "><". $inEnd ."<br/>";
            if ($upData[$i]['time'] > $inEnd) {
                array_unshift($ret, $upData[$i]);

            } if ($upData[$i]['time'] == $inEnd ){
                if (! in_array($upData[$i]['content'], $conEnd)){
                    array_unshift($ret, $upData[$i]);
                }

            }else break;
        }
        return $ret;
    }


    public static function addThsDoctor($file, $data){
        return parent::putSomeData($file, $data);

    }
    public static function putThsDoctor($file, $data){

        if (empty($data)) return false;
        return parent::putAllData($file, $data);


    }

} 