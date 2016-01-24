<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-10
 * Time: 下午6:47
 *
 * 逻辑和运算的静态类
 *
 * Moving -> 移动数据 返回为一个数列
 * Value -> 单个数据 返回为一个数值
 * Place -> 单个位置 返回为一个索引值
 *
 */

class LogicOperation {

    //针对一个指标求数列的 总值
    public static function sumValue($list, $key){
        return array_sum(self::keyArray($list, $key));

    }

    //针对一个指标求数列的 平均值
    public static function averageValue($list, $key){
        return sizeof($list) > 0 ? self::sumValue($list, $key) / sizeof($list) : false;

    }

    //针对一个指标求数列的 最大值的位置
    public static function highPlace($list, $key){

    }

    //针对一个指标求数列的 最小值的位置
    public static function lowplace($list, $key){

    }

    //针对一个指标求数列的 最大值
    public static function highValue($list, $key){
        return max(self::keyArray($list, $key));
    }

    //针对一个指标求数列的 最小值
    public static function lowValue($list, $key){
        return min(self::keyArray($list, $key));
    }

    //讲key单独取出来组成数组
    public static function keyArray($list, $key){
        $ret = array();
        foreach($list as $l)
            $ret[] = floatval($l[$key]);
        return $ret;
    }

} 