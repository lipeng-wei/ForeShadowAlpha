<?php
/**
 * Created by PhpStorm.
 * User: wlp
 * Date: 2017/8/9
 * Time: 15:00
 *
 * 东方财富研报 数据接口类
 */


require_once(MODULE_PATH. 'TableFilter.class.php');

class DCReportData extends TableFilter{

    protected $dataFile;
    protected $stockCode;
    protected $dcReportData;

    // 构建对象
    function __construct($code){
        $this->stockCode = $code;
        $this->dataFile = DATA_PATH. 'dcreport/'. $this->stockCode. '.txt';
    }

    // 准备数据 读取文件解压 类内部使用
    function _prepare(){
        if ($this->dcReportData) return $this->dcReportData;
        $this->dcReportData = $this->_getData($this->dataFile);
        return $this->dcReportData;
    }

    // 准备数据
    function prepareData(){
        if ($this->_prepare()) return true;
        else return false;
    }
    //获取个股的完整数据  return Array
    function getDCReportData(){
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