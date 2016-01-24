<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-23
 * Time: 下午3:19
 *
 * 维护 股本变迁Gbbq 的日常维护 静态类
 *
 * 股本变迁更新的静态函数
 *
 *
 */

require_once(MODULE_PATH. 'TableFile.class.php');
require_once(LIB_PATH . 'simplehtmldom_1_5/simple_html_dom.php');

class GbbqKeeper extends TableFile{

    public static function fetchSingleGbbq($url, $numCode){

        $html = file_get_html($url);
        while (! $html){
            sleep(1);
            $html = file_get_html($url);
        }

        $res = $html->find('div#stocktitle a',1);
        $res = iconv('GB2312', 'UTF-8//IGNORE', $res->plaintext);
        if ($res != $numCode) {
            return false;
        } else {
            return $html;
        }


    }

    public static function parseGbbqHtml($html){

        $rows = $html->find('div#zaiyaocontent tr');
        $ret = array();
        foreach($rows as $row){
            //echo $row->plaintext;
            $pattern = "/^[0-9]{4}/";
            $list = $row->find('td');
            if ($list && preg_match($pattern, $list[0]->plaintext)){
                //echo "--: " . $list[0]->plaintext . "<br />";
                //1 2 3 6
                $res = array();
                $reu = trim($list[6]->plaintext);
                $res['time'] = $reu;
                $reu = $list[1]->plaintext * 10 ;
                $res['bonus'] = $reu;
                $reu = $list[2]->plaintext * 10 ;
                $res['distribution'] = $reu;
                $reu = $list[3]->plaintext * 10 ;
                $res['transfer'] = $reu;
                array_unshift($ret, $res);
            }

        }
        //var_dump($ret);
        return $ret;
    }



    //获取新增的数据
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


    public static function addGbbq($file, $data){
        return parent::putSomeData($file, $data);

    }
    public static function putGbbq($file, $data){

        if (empty($data)) return false;
        return parent::putAllData($file, $data);


    }

} 