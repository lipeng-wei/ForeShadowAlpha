<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-23
 * Time: 下午3:21
 *
 *
 * 每天运行 更新同花顺牛叉诊股数据 的运行脚本
 *
 * 抓取页面 并处理两拨数据
 * 一：牛叉诊股的数据
 * 二，消息列表的数据
 *
 */

require_once(dirname(__FILE__). '/../Require.php');
require_once(MODULE_PATH . 'ThsDoctorData.class.php');
require_once(MODULE_PATH . 'ThsDoctorMesData.class.php');
require_once(MODULE_PATH . 'ThsDoctorKeeper.class.php');
require_once(MODULE_PATH. 'TableFile.class.php');


class ThsDoctorDuty extends Script{

    private static $log = null;
    private static $tmp = null;

    public static function run(){
        self::setNohup(false);

        //日志文件
        self::$log = new Log(LOG_PATH, __FILE__);
        //临时文件
        self::$tmp = new Tmp(TMP_PATH);
        self::$tmp->addTmp('thsdoctor.duty.failed', true);

        self::updateDoctor();

    }

    //每天更新数据
    public static function updateDoctor(){

        self::$log->debugLog("Begin Update Ths Doctor");


        //$i = 2;

        $list = Refer::getStock();
        foreach($list as $item){

            //if (--$i < 0 ) break;
            if ('sz300033' == $item['code']) continue;

            $numCode = substr($item['code'], 2);
            $url = "http://doctor.10jqka.com.cn/" . $numCode . '/';
            self::$log->debugLog($item['name'], $item['code'], $url);
            $html = ThsDoctorKeeper::fetchSingleThsDoctor($url, $numCode);

            if ($html) {
                self::$log->debugLog($item['name'], $item['code'], "Fetch ThsDoctor Success");


                $now = ThsDoctorKeeper::parseThsDoctorHtml($html);
                if ($now) {
                    $tdd = new ThsDoctorData($item['code']);
                    $last = $tdd->getThsDoctorData();
                    //print_r($last);
                    if ($last){
                        $updata = ThsDoctorKeeper::mergeThsDoctorUpdate($last, $now);
                        ThsDoctorKeeper::addThsDoctor($tdd->getDataFile(), $updata);
                    } else {
                        $updata = $now;
                        ThsDoctorKeeper::putThsDoctor($tdd->getDataFile(), $updata);
                    }
                    self::$log->noticeLog($item['name'], $item['code'], "Update ThsDoctor Success");
                }else {
                    self::$log->errorLog($item['name'], $item['code'], "Parse ThsDoctor Failed");
                    self::$tmp->putTmpContent('thsdoctor.duty.failed', join(":", $item) . "|", FILE_APPEND);
                }


                $now = ThsDoctorKeeper::parseThsDoctorMesHtml($html);
                if ($now) {
                    $tdmd = new ThsDoctorMesData($item['code']);
                    $last = $tdmd->getThsDoctorMesData();
                    //print_r($last);
                    if ($last){
                        $updata = ThsDoctorKeeper::mergeThsDoctorMesUpdate($last, $now);
                        ThsDoctorKeeper::addThsDoctor($tdmd->getDataFile(), $updata);
                    } else {
                        $updata = $now;
                        ThsDoctorKeeper::putThsDoctor($tdmd->getDataFile(), $updata);
                    }
                    self::$log->noticeLog($item['name'], $item['code'], "Update ThsDoctorMes Success");
                }else {
                    self::$log->errorLog($item['name'], $item['code'], "Parse ThsDoctorMes Failed");
                }

            } else {
                self::$log->errorLog($item['name'], $item['code'], "Fetch ThsDoctor Failed");
                self::$tmp->putTmpContent('thsdoctor.duty.failed', join(":", $item) . "|", FILE_APPEND);
            }


        }
        self::$log->debugLog("Finish Update Ths Doctor");

    }










    //从ZF6000导数据过来 只执行一次
    public static function importOnce(){

        $dir = dir('D:\wamp\www\ForeShadowAlpha\data\tmp');
        $filelist = array();
        while (($file = $dir->read()) !== false)
        {
            if (substr($file, 0 ,3) == 'ths') {
                //echo "filename: " . $file . "<br />";
                $filelist[] = $file;
            }
        }
        $dir->close();
        sort($filelist);
        //print_r($filelist);

        //echo '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title></title></head><body>';
        //$i = 1;
        foreach($filelist as $file){
            //if ( --$i < 0 ) exit(0);
            //echo "filename: " . $file . "<br />";
            $content = DataFile::getFileContent('D:\wamp\www\ForeShadowAlpha\data\tmp/'. $file);
            //echo $content;
            $rows = explode("\n\r", $content);
            if (! $file) continue;
            foreach($rows as $row){
                if (! $row) continue;
                $lie = explode('|', $row);

                //get Code
                $r = "/[0-9]{6}/";
                preg_match($r, $lie[0], $code);
                //echo $lie[0] . $code[0];
                $c = $code[0];
                $r = substr($code[0],0,1);
                if ($r == '6') $code = 'sh' . $c;
                else if ($r == '0') $code = 'sz' . $c;
                else if ($r == '3') $code = 'sz' . $c;
                //echo $code . "<br />";

                $thsPath = 'D:\wamp\www\ForeShadowAlpha\data\thsdoctor/';
                $thsFile = $thsPath . $code . '.txt';
                echo $thsFile . "<br />";

                $thsRow = array();

                //time
                $r = "/[0-9.]+/";
                preg_match_all($r, $lie[3], $k);
                //if (sizeof($k) < 5 ) continue;
                $t = $k[0][0]. '-'. $k[0][1]. '-'. $k[0][2];
                //echo $t. "<br />";
                //echo $k[0][3]. "<br />";
                $thsRow['time'] = $t;
                $thsRow['hour'] = $k[0][3].':'.$k[0][4];

                //total
                $r = "/([0-9.]+)分/";
                preg_match($r, $lie[2], $k);
                //echo $k[0].'--'.$k[1]."<br />";
                $thsRow['total_score'] = $k[1];
                $thsRow['total_text'] = $lie[13];


                //shot_trend
                $thsRow['shot_trend'] = $lie[5];
                //mid_trend
                $thsRow['mid_trend'] = $lie[6];
                //long_trend
                $thsRow['long_trend'] = $lie[7];

                //technical
                $r = "/([0-9.]+)/";
                preg_match($r, $lie[8], $k);
                $thsRow['technical_score'] = $k[0];
                //echo $k[0]."<br />";
                $k = trim($lie[8]);
                $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
                $thsRow['technical_text'] = end($kk);

                //funds
                $r = "/([0-9.]+)/";
                preg_match($r, $lie[9], $k);
                $thsRow['funds_score'] = $k[0];
                //echo $k[0]."<br />";
                $k = trim($lie[9]);
                $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
                $thsRow['funds_text'] = end($kk);

                //message
                $r = "/([0-9.]+)/";
                preg_match($r, $lie[10], $k);
                $thsRow['message_score'] = $k[0];
                //echo $k[0]."<br />";
                $k = trim($lie[10]);
                $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
                $thsRow['message_text'] = end($kk);

                //trade
                $r = "/([0-9.]+)/";
                preg_match($r, $lie[11], $k);
                $thsRow['trade_score'] = $k[0];
                //echo $k[0]."<br />";
                $k = trim($lie[11]);
                $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
                $thsRow['trade_text'] = end($kk);

                //basic
                $r = "/([0-9.]+)/";
                preg_match($r, $lie[12], $k);
                $thsRow['basic_score'] = $k[0];
                //echo $k[0]."<br />";
                $k = trim($lie[12]);
                $kk = preg_split('/\s/', $k, -1, PREG_SPLIT_NO_EMPTY);
                $thsRow['basic_text'] = end($kk);

                //print_r($thsRow);
                //echo "<br />";

                TableFile::putSomeData($thsFile, array($thsRow));
            }
        }
    }
}
ThsDoctorDuty::run();