<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-20
 * Time: 上午11:15
 *
 * 通用信息
 *
 * 内部需要的一些函数，变量等
 *
 * code : sh6XXXXX sz0XXXXX sz3XXXXX
 * num : 6XXXXX  0XXXXX 3XXXXX
 *
 */



class CommonInfo {

    //获取访问页面脚本文件的文件名 去除后缀
    public static function RequestFileName(){

        $f = explode('/', $_SERVER['SCRIPT_FILENAME']);
        $f = end($f);
        $f = explode("\\", $f);
        $f = end($f);
        $f = explode('.', $f);
        return ucfirst($f[0]);
    }

    //获取文件的文件名 去除后缀
    public static function GetFileName($filename){

        $f = explode('/', $filename);
        $f = end($f);
        $f = explode("\\", $f);
        $f = end($f);
        $f = explode('.', $f);
        return ucfirst($f[0]);
    }

    public static function Code2Num($code){
        $s = substr($code, 0 ,2);
        $s = strtolower($s);
        if ($s == 'sh' || $s == 'sz')
            return substr($code, 2);
        else
            return false;
    }
    public static function Num2Code($num){
        if (strlen($num) != 6 ) return false;
        $s = substr($num, 0 ,1);
        if ($s == '6')
            return 'sh' . $num;
        else if ($s == '0')
            return 'sz' . $num;
        else if ($s == '3')
            return 'sz' . $num;
        else
            return false;
    }
    public static function EBK2Code($ebk){
        $t = substr($ebk, 0, 2);
        $tt = substr($ebk, 1);
        if ($t == '16') {
            return 'sh'. $tt;
        } else if ($t == '00') {
            return 'sz'. $tt;
        } else if ($t == '03') {
            return 'sz'. $tt;
        }
        return false;
    }

    public static function CodeArray2CodeNameArray($codeArray, $refer = null){
        if (! $refer) $refer = Refer::getAll();
        $codeRefer = array();
        foreach($refer as $a) {
            $codeRefer[$a['code']] = array('name' => $a['name'], 'code' => $a['code']);
        }
        $codeNameArray = array();
        foreach($codeArray as $a) {
            if (array_key_exists($a['code'], $codeRefer)){
                $codeNameArray[] = $codeRefer[$a['code']];
            }
        }
        return $codeNameArray;
    }
    public static function CodeArray2ReferArray($codeArray, $refer = null){
        if (! $refer) $refer = Refer::getAll();
        $codeRefer = array();
        foreach($refer as $a) {
            $codeRefer[$a['code']] = $a;
        }
        $codeNameArray = array();
        foreach($codeArray as $a) {
            if (array_key_exists($a['code'], $codeRefer)){
                $codeNameArray[] = $codeRefer[$a['code']];
            }
        }
        return $codeNameArray;
    }

    public static function GetSleepTime($idx) {
        static $sleep_arr = array(0, 0, 0, 1, 1, 2, 2,
            10, 1, 1, 1, 2, 2, 30, 1, 1, 1, 2, 2,
            60, 1, 1, 1, 2, 2, 200, 1, 1, 1, 2, 2,
            600, 1, 1, 1, 2, 2, 2, -1, -1, -1);
        return $sleep_arr[$idx];
    }

} 