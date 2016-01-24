<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-21
 * Time: 上午4:26
 *
 * 类 表 格式的 数据过滤类
 *
 *
 */

require_once(MODULE_PATH . 'TableFile.class.php');

class TableFilter{

    protected $_innerData;

    //读取 table格式 文件的数据
    public function _getData($file){
        $this->_innerData = TableFile::getAllData($file);
        return $this->_innerData;

    }


    //二分查找日期索引 返回 [ 日期日存在 true，日期的索引值 ] / [ 日期不存在 false，离日期最近的索引值 ]
    function _locateDayIndex($day){
        $s = 0;
        $e = sizeof($this->_innerData);
        while ($s + 1 < $e) {
            $i = intval ( ($s + $e) / 2 );
            //echo $this->stockData[$i]['time'];
            if ($this->_innerData[$i]['time'] == $day) return array(true, $i);
            if ($this->_innerData[$i]['time'] > $day){
                $e = $i;
            } else {
                $s = $i;
            }
        }
        return array(false, $s);
    }


    //获取某一天的数据
    //$day 为 日期 例如 2015-11-06
    function getDaySolo($day){

        $d = $this->_locateDayIndex($day);
        return $d[0] ? $this->_innerData[$d[1]]: false;
    }

    //获取最新某天数据
    //$pos  为 离最新的周期数 0：最新一个周期（最新一天）
    function getLastSolo($pos){
        return sizeof($this->_innerData) > $pos ?
            $this->_innerData[sizeof($this->_innerData) - $pos - 1] : false;
    }

    //获取某一段时间的数据
    //
    //$start 为 起始日期 true 则从头开始
    //$end 为 截止日期 true 则到结尾
    //$min 为 要求最短周期数
    function getDayPeriod($start, $end, $min = 1){
        $s = $start === true ? 0 : $this->_locateDayIndex($start)[1];
        $e = $end === true ? sizeof($this->_innerData) - 1 : $this->_locateDayIndex($end)[1];
        return $s + $min <= $e + 1? array_slice($this->_innerData, $s, $e - $s + 1) : false;
    }

    //获取最新若干周期的数据
    //
    //$pos 为 起始 距离 最新的周期数  true 则从头开始  0 则是最新一天
    //$num 为 读取周期数 true 则到结尾
    //$min 为 要求最短周期数
    function getLastPeriod($pos, $num, $min = 1){
        $s = $pos === true ? 0 : sizeof($this->_innerData)- $pos - 1;
        $n = $num === true ? null : $num;
        return $s >= 0 && $s + $min <= sizeof($this->_innerData) ? array_slice($this->_innerData, $s, $n) : false;

    }



} 