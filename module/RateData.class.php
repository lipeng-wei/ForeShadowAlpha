<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-02
 * Time: 下午1:07
 *
 * 机构评级Rate  数据接口类
 *
 *
 */

require_once(MODULE_PATH. 'TableFilter.class.php');

class RateData extends TableFilter{

    protected $dataFile;
    protected $stockCode;
    protected $rateData;

    // 构建对象
    function __construct($code){
        $this->stockCode = $code;
        $this->dataFile = DATA_PATH. 'rate/'. $this->stockCode. '.txt';
    }

    // 准备数据 读取文件解压 类内部使用
    function _prepare(){
        if ($this->rateData) return $this->rateData;
        $this->rateData = $this->_getData($this->dataFile);
        return $this->rateData;
    }

    // 准备数据
    function prepareData(){
        if ($this->_prepare()) return true;
            else return false;
    }
    //获取个股的完整数据  return Array
    function getRateData(){
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

    public static function filterBuy($data){
        $ret = array();
        if ($data) {
           foreach($data as $d){
               if (strstr($d['rate'],"买入")!==false || strstr($d['rate'],"推荐")!==false) {
                   $ret[] = $d;
               }
           }
        }
        return $ret;
    }
}



