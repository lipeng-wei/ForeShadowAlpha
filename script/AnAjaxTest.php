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
require_once(MODULE_PATH . 'ThsDoctorData.class.php');

class AnAjaxTest extends Script{

    public static function run(){
        self::setNohup(true);

        //self::testThsDoctorData();
        self::testReferData();

    }

    public static function testReferData(){

        $rows = Refer::getStock();
        $columns = array_keys($rows[0]);
        for($i = 0; $i<sizeof($columns); $i++){
            $t = str_replace('_', ' ', $columns[$i]);
            $columns[$i] = array('title' => $t, 'data' => $columns[$i]);
        }
        echo json_encode(array('columns' => $columns, 'rows' => $rows));
    }


    public static function testThsDoctorData(){
        $td = new ThsDoctorData('sz300313');
        $rows = $td->getThsDoctorData();
        $columns = array_keys($rows[0]);
        for($i = 0; $i<sizeof($columns); $i++){
            $t = str_replace('_', ' ', $columns[$i]);
            $columns[$i] = array('title' => $t, 'data' => $columns[$i]);
        }
        echo json_encode(array('columns' => $columns, 'rows' => $rows));
    }


}
AnAjaxTest::run();



