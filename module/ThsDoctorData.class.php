<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-10
 * Time: 下午1:07
 *
 * 同花顺牛叉诊股数据  数据接口类
 *
 *
 */

require_once(MODULE_PATH. 'TableFilter.class.php');

class ThsDoctorData extends TableFilter{

    protected $dataFile;
    protected $stockCode;
    protected $thsDoctorData;

    // 构建对象
    function __construct($code){
        $this->stockCode = $code;
        $this->dataFile = DATA_PATH. 'thsdoctor/'. $this->stockCode. '.txt';
    }

    // 准备数据 读取文件解压 类内部使用
    function _prepare(){
        if ($this->thsDoctorData) return $this->thsDoctorData;
        $this->thsDoctorData = $this->_getData($this->dataFile);
        return $this->thsDoctorData;
    }

    // 准备数据
    function prepareData(){
        if ($this->_prepare()) return true;
            else return false;
    }
    //获取个股的完整数据  return Array
    function getThsDoctorData(){
        $res = $this->_prepare();
        $ret = array();
        if (! $res) return $ret;
        $tt = 0;
        $hh = 0;
        $rr = null;
        foreach($res as $a){
            $t = $a['time'];
            $h = $a['hour'];

            //获取同一天的最后一个数据
            if ($t > $tt) {
                if ($tt && $rr) $ret[] = $rr;
                $tt = $t;
                $hh = $h;
                $rr = $a;
            }
            if ($t == $tt && $h > $hh) {
                $tt = $t;
                $hh = $h;
                $rr = $a;
            }

        }
        $ret[] = $rr;
        return $ret;
    }


    // 获取文件路径
    function getDataFile(){
        return $this->dataFile;
    }
    //获取个股的代码
    function getStockCode(){
        return $this->stockCode;
    }
}



