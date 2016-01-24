<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-10
 * Time: 下午1:07
 *
 * 日线Day  数据接口类
 *
 * 1, 数据接口通识
 * Day -> 以日期读取数据 例如：2015-11-06
 * Last -> 以最新周期读取数据 例如 1 2 3
 *
 * Data -> 完整数据
 * Period -> 一段时间的数据
 * Solo -> 某一天的数据
 *
 * 2，过滤接口说明
 *
 *
 *
 */

require_once(MODULE_PATH. 'TableFilter.class.php');

class DayData extends TableFilter{

    protected $rightType;
    protected $dataVersion;
    protected $dataFile;
    protected $stockCode;
    protected $stockData;

    // 构建对象
    function __construct($code, $type = 'after'){
        $this->stockCode = $code;
        $this->rightType = Refer::isSockCode($code) ? $type : 'normal';
        $this->dataVersion = Config::get('Day.Version');
        $this->dataFile = DATA_PATH. 'day/'. $this->dataVersion. '/'.
            $this->rightType. '/'. $this->stockCode. '.txt';
    }

    // 准备数据 读取文件解压 类内部使用
    function _prepare(){
        if ($this->stockData) return $this->stockData;
        $this->stockData = $this->_getData($this->dataFile);
        return $this->stockData;
    }

    // 准备数据
    function prepareData(){
        if ($this->_prepare()) return true;
            else return false;
    }
    // 获取文件路径
    function getDataFile(){
        return $this->dataFile;
    }


    //获取个股的代码
    function getStockCode(){
        return $this->stockCode;
    }

    //获取个股的完整数据  return Array
    function getStockData(){
        return $this->_prepare();
    }

}



