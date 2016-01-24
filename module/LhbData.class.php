<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-02
 * Time: 下午1:07
 *
 * 龙虎榜Lhb  数据接口类
 *
 *
 */

require_once(MODULE_PATH. 'TableFilter.class.php');

class LhbData extends TableFilter{

    protected $dataFile;
    protected $stockCode;
    protected $lhbData;

    // 构建对象
    function __construct($code){
        $this->stockCode = $code;
        $this->dataFile = DATA_PATH. 'lhb/'. $this->stockCode. '.txt';
    }

    // 准备数据 读取文件解压 类内部使用
    function _prepare(){
        if ($this->lhbData) return $this->lhbData;
        $this->lhbData = $this->_getData($this->dataFile);
        return $this->lhbData;
    }

    // 准备数据
    function prepareData(){
        if ($this->_prepare()) return true;
            else return false;
    }
    //获取个股的完整数据  return Array
    function getLhbData(){
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



