<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-10
 * Time: 下午1:07
 *
 * DDE数据  数据接口类
 *
 *
 */

require_once(MODULE_PATH. 'TableFilter.class.php');

class DdeData extends TableFilter{

    protected $dataFile;
    protected $stockCode;
    protected $ddeData;

    // 构建对象
    function __construct($code){
        $this->stockCode = $code;
        $this->dataFile = DATA_PATH. 'dde/'. $this->stockCode. '.txt';
    }

    // 准备数据 读取文件解压 类内部使用
    function _prepare(){
        if ($this->ddeData) return $this->ddeData;
        $this->ddeData = $this->_getData($this->dataFile);
        return $this->ddeData;
    }

    // 准备数据
    function prepareData(){
        if ($this->_prepare()) return true;
            else return false;
    }
    //获取个股的完整数据  return Array
    function getDdeData(){
        return $this->_prepare();
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



