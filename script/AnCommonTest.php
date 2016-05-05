<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-14
 * Time: 上午3:52
 *
 * 测试某些函数
 *
 */


require_once(dirname(__FILE__). '/../Require.php');
require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH . 'DdeData.class.php');
require_once(MODULE_PATH . 'BaseFile.class.php');

class AnCommonTest extends Script{

    public static function run(){
        self::setNohup(false);

        //self::testDayData();
        //self::testDdeData();
        //self::testXueqiuUrlTime();


        //self::testTmp();
        //self::testRefer();
        //self::testLog();
        self::testFunc();
        //self::testRGB();

        //self::testUrl();
        //self::testHeaderResponse();
    }

    public static function testRGB(){

        $contents = BaseFile::getFileContent(TMP_PATH. 'datatables.txt.css');
        $pattern = "/#[0-9a-fA-F]{3,}/";
        preg_match_all($pattern, $contents, $k);
        $tongji = array_count_values($k[0]);
        ksort($tongji);
        $pa = array();
        $re = array();
        echo '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title></title></head><body>';
        foreach($tongji as $k => $v){
            $s = '0123456789abcdef';
            $t = array();
            for($i=0; $i<strlen($s); $i++){
                $t[$s[$i]] = $s[strlen($s)-$i-1];
            }
            $s = strtolower($k);
            $n = '#';
            for($i=1; $i<strlen($s); $i++){
                $n .= $t[$s[$i]];
            }
            echo '<p><div style="background-color: '.$k.'; width: 500px; float:left;">'.$k.'</div>'. $v;
            echo '<div style="background-color: '.$n.'; width: 500px; float:left;">'.$n.'</div></p>';

            //$pa[] = '/'.$k.'/';
            //$re[] = $n;

        }
        //echo preg_replace($pa, $re, $contents);
    }

    public static function testHeaderResponse(){

        foreach (getallheaders() as $name => $value) {
            echo "$name: $value<br/>";
        }
        print_r($_COOKIE);
    }


    public static function testUrl(){
        echo 'http://'.$_SERVER['HTTP_HOST'].'<br />'.$_SERVER['REQUEST_URI'];
    }

    public static function testDayData(){


        $dd = new DayData('sh600010', 'normal');
        if ($dd->prepareData()) {
            //var_dump($dd->getStockData());
            //var_dump($dd->getDaySolo('2015-11-06')['time']);
            //var_dump($dd->getLastSolo(0)['time']);
            var_dump($dd->getDayPeriod('2015-10-01', '2015-11-06', 7));
            //var_dump($dd->getDayPeriod('2015-11-01', true, 7));
            //var_dump($dd->getLastPeriod(true, true));
            //var_dump($dd->getLastPeriod(5, true));
            //var_dump($dd->getLastPeriod(7, true, 6));

        }
    }
    public static function testDdeData(){


        $dd = new DdeData('sh600010');
        if ($dd->prepareData()) {
            //var_dump($dd->getStockData());
            //var_dump($dd->getDaySolo('2015-11-06')['time']);
            //var_dump($dd->getLastSolo(0)['time']);
            var_dump($dd->getDayPeriod('2015-10-01', '2015-11-06', 7));
            //var_dump($dd->getDayPeriod('2015-11-01', true, 7));
            //var_dump($dd->getLastPeriod(true, true));
            //var_dump($dd->getLastPeriod(5, true));
            //var_dump($dd->getLastPeriod(7, true, 6));

        }
    }

    public static function testXueqiuUrlTime(){

        //http://xueqiu.com/stock/forchartk/stocklist.json?symbol=SH000001&period=1day&type=normal&begin=1416728848774&end=1448264848774&_=1448264848778
        //http://xueqiu.com/stock/forchartk/stocklist.json?symbol=SZ300276&period=1day&type=before&begin=1416729001775&end=1448265001775&_=1448265001778

        //http://xueqiu.com/stock/forchartk/stocklist.json?symbol=SZ002024&period=1day&type=before&end=1415171542842&_=1446707542844
        //http://xueqiu.com/stock/forchartk/stocklist.json?symbol=SZ000001&period=1day&type=before&end=1415171542842&_=1446707542844
        //http://xueqiu.com/stock/forchartk/stocklist.json?symbol=SZ002024&period=1day&type=before&begin=1415302750214&end=1446838750214&_=1446838750217

        echo date("Y-m-d H:i", 1416728848774/1000);
        echo "|";
        echo date("Y-m-d H:i", 1448264848774/1000);
        echo "|";
        echo date("Y-m-d H:i", 1448264848778/1000);
        echo "|";
        echo date("Y-m-d H:i", 1448264849346/1000);
        echo "<br>";

        echo date("Y-m-d H:i", 1416729001775/1000);
        echo "|";
        echo date("Y-m-d H:i", 1416729001775/1000);
        echo "|";
        echo date("Y-m-d H:i", 1448265001778/1000);
        echo "|";
        echo date("Y-m-d H:i", 1448265002192/1000);
        echo "<br>";

        //http://www.gpcxw.com/ddx/data2/data2.htm?code=000703&m=0.9340496518038277&lastfilemtime=1448852700&getlsold=1
        //http://www.gpcxw.com/ddx/data2/data2.htm?code=000703&m=0.25553255679956444&lastfilemtime=1448853060&getlsold=1
        //http://www.gpcxw.com/ddx/data2/data2.htm?code=000703&m=0.32220025403844754&lastfilemtime=1448853781&getlsold=1
        echo date("Y-m-d H:i",  1448854220);


        /*
        echo time();

        echo strtotime("2015-11-07");
        echo "<br>";
        echo strtotime("1 month ago")*1000;
        echo date("Y-m-d H:i", strtotime("Fri Nov 06 00:00:00 +0800 2015"));

        echo "<br>". basename(__FILE__);

        $a = 0;
        echo $a+0.52;
        */

    }

    public static function testTmp(){
        $t = new Tmp(TMP_PATH);
        $p = CommonInfo::GetFileName(__FILE__);
        $t->addTmp($p, false);
        //$t->newTmpFile($p);
        $t->putTmpContent($p, "null", FILE_APPEND);
        echo $t->getTmpContent($p);
    }

    public static function testRefer(){
        echo '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title></title></head><body>';

        $b = Refer::getStock();
        var_dump($b);

    }
    public static function testLog(){
        $l = new Log(LOG_PATH, __FILE__, Log::L_DEBUG);
        $l->debugLog("1", "2");
        $l->noticeLog("3", "4", "5");
        $l->errorLog("6");
    }

    public static function testFunc(){

        /*
        echo Config::get('Log.Level');
        Config::set('Log.Level', "++");
        echo Config::get('Log.Level');

        /*
        $i = array("a" => array("b" =>"c"));
        print_r($i);
        $j = &$i['a'];
        $j['b'] = 'd';
        echo "<br />";
        print_r($i);


        //echo DIRECTORY_SEPARATOR; //根据操作系统特性输出目录分隔符
        //echo  PHP_EOL; //根据操作系统输出换行符，可以通过写入文件试试

        //print_r(array_slice(array(1,2,3), 0, 0));

        /*
        $a = filemtime(dirname(__FILE__). '/../Require.php');
        echo Date("Y-m-d H:i:s", $a);

        /*
        $a = "/12/3.4/../";
        echo rtrim($a,'/.');


        if (array()) echo "true";
        */
        //echo floatval('-8.85%');
        //echo date("Y-m-d", strtotime('-1 day'));

        $a=array("a"=>"red","g"=>"green","6"=>"blue","3"=>"yellow","h"=>"brown");
        //print_r(array_slice($a,2,5));
        $b = json_encode($a);
        echo $b. '<br/>';
        $c = json_decode($b);
        print_r($c);
        echo '<br/>'.$c->h.'<br/>';
    }



}
AnCommonTest::run();



