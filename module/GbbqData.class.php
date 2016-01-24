<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-10
 * Time: 下午1:07
 *
 * 股本变迁Gbbq  数据接口类
 *
 *
 */

require_once(MODULE_PATH. 'TableFilter.class.php');

class GbbqData extends TableFilter{

    protected $dataFile;
    protected $stockCode;
    protected $gbbqData;

    // 构建对象
    function __construct($code){
        $this->stockCode = $code;
        $this->dataFile = DATA_PATH. 'gbbq/'. $this->stockCode. '.txt';
    }

    // 准备数据 读取文件解压 类内部使用
    function _prepare(){
        if ($this->gbbqData) return $this->gbbqData;
        $this->gbbqData = $this->_getData($this->dataFile);
        return $this->gbbqData;
    }

    // 准备数据
    function prepareData(){
        if ($this->_prepare()) return true;
            else return false;
    }
    //获取个股的完整数据  return Array
    function getGbbqData(){
        return $this->_prepare();
    }
    function getGbbqLabel(){
        $res = $this->_prepare();
        $ret = array();
        if (! $res) return $ret;
        for($i = 0; $i < sizeof($res); $i++){
            $st = '10股';
            if ($res[$i]['bonus']) $st .= '派'. $res[$i]['bonus']. '元';
            if ($res[$i]['distribution']) $st .= '送'. $res[$i]['distribution']. '股';
            if ($res[$i]['transfer']) $st .= '转'. $res[$i]['transfer']. '股';
            $ret[] = array(
                'time' => trim($res[$i]['time']),
                'label' => $st
            );
        }
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



