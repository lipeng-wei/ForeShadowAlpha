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

class AnCurlTest extends Script{

    public static function run(){
        self::setNohup(false);

        self::testGpcxwDdx();
        //self::testHeaderRequest();
    }

    public static function curlSingle($url, $refer, $cookieFile){

        //初始化
        $ch = curl_init();

        //设置选项参数
        $header[]= 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8 ';
        $header[]= 'Accept-Language: zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3 ';
        //$header[]= 'Accept-Encoding: gzip, deflate ';
        $header[]= 'Cache-Control:	max-age=0 ';
        $header[]= 'Connection: Keep-Alive ';
        $header[]= 'Host: www.gpcxw.com ';
        $header[]= 'Referer: '. $refer.' ';
        $header[]= 'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0 ';

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//设置返回数据

        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile); //保存
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile); //读取

        //curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER,$header);



        $contents = curl_exec($ch);//执行
        curl_close($ch);//释放curl句柄

        return $contents;
    }

    public static function testGpcxwDdx(){



        $tmp = new Tmp(TMP_PATH);
        $tmp->addTmp('test.cookie', false);





        $url1 = 'http://www.gpcxw.com/ddx/000703.html';

        /*
        $url = 'http://localhost/ForeShadowAlpha/script/AnCommonTest.php';
        $content = self::curlSingle($url, $url1, $tmp->getTmpFile('test.cookie'));
        echo $url . '<br>';
        echo $content;

        */


        $content = self::curlSingle($url1, null, $tmp->getTmpFile('test.cookie'));
        $tmp->addTmp('test.con1', true);
        $tmp->putTmpContent('test.con1', $content);

        //sleep(1);

        $url2 = 'http://www.gpcxw.com/ddx/data2/day.htm?code=000703';
        $content = self::curlSingle($url2, $url1, $tmp->getTmpFile('test.cookie'));
        $tmp->addTmp('test.con2', true);
        $tmp->putTmpContent('test.con2', $content);

        $url3 = 'http://www.gpcxw.com/ddx/data2/dde.htm?code=000703';
        $content = self::curlSingle($url3, $url2, $tmp->getTmpFile('test.cookie'));
        $tmp->addTmp('test.con3', true);
        $tmp->putTmpContent('test.con3', $content);

        $ran = mt_rand();
        $ran = '0.' . $ran. $ran;
        $url4 = 'http://www.gpcxw.com/ddx/data2/data2.htm?code=000703&m=' . $ran;
        $content = self::curlSingle($url4, $url3, $tmp->getTmpFile('test.cookie'));
        $content = iconv('GB2312', 'UTF-8//IGNORE', $content);
        $tmp->addTmp('test.con4', true);
        $tmp->putTmpContent('test.con4', $content);



        //http://www.gpcxw.com/ddx/data2/data2.htm?code=000703&m=0.7461922855298886&lastfilemtime=1448859721&getlsold=1

        $k=substr($content, 0, 39);
        $k = explode('=', $k);
        $k = $k[1];
        $k = substr($k, 0, 1) == '>' ? substr($k, 1) : $k;
        $ran = mt_rand();
        $ran = '0.' . $ran. $ran;
        $url5 = 'http://www.gpcxw.com/ddx/data2/data2.htm?code=000703&m='. $ran. '&lastfilemtime='.
            $k. '&getlsold=1';
        $content = self::curlSingle($url5, $url4, $tmp->getTmpFile('test.cookie'));
        $content = iconv('GB2312', 'UTF-8//IGNORE', $content);
        $tmp->addTmp('test.con5', true);
        $tmp->putTmpContent('test.con5', $content);

        echo $url5;
    }


    public static function testHeaderRequest(){


        $tmp = new Tmp(TMP_PATH);
        $tmp->addTmp('test.common.cookie', false);

        $url = 'http://localhost/ForeShadowAlpha/script/AnCommonTest.php';
        $content = self::curlSingle($url, null, $tmp->getTmpFile('test.common.cookie'));

        echo $url . '<br>';
        echo $content;
    }


}
AnCurlTest::run();



