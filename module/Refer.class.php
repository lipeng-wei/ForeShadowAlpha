<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-21
 * Time: 上午1:23
 *
 *
 *  大盘指数 | 版块指数  |  股票价格    的索引管理  静态类
 *  market  | section  |  stock
 *
 */

require_once(MODULE_PATH. 'TableFile.class.php');

class Refer extends TableFile{

    private static $_path = null;
    private static $_market = null;
    private static $_section = null;
    private static $_stock = null;
    private static $_indexRefer = null;
    private static $_marketRefer = null;
    private static $_sectionRefer = null;
    private static $_stockRefer = null;


    //加载
    public static function load($path = null){
        self::$_path = $path ? $path : DATA_PATH . 'refer/';
        self::$_market = self::$_path . 'Market-Refer.txt';
        self::$_section = self::$_path . 'Section-Refer.txt';
        self::$_stock = self::$_path . 'Stock-Refer.txt';
    }

    //获取大盘指数 的索引
    public static function getMarket(){
        if (! self::$_path) self::load();
        if (! self::$_marketRefer)
            self::$_marketRefer = self::_getRefer(self::$_market);
        return self::$_marketRefer;
    }

    //暂时不提供服务
    //获取版块指数 的索引
    public static function getSection(){
        if (! self::$_path) self::load();
        if (! self::$_sectionRefer)
            self::$_sectionRefer = self::_getRefer(self::$_section);
        return self::$_sectionRefer;
    }

    //判断股票代码是否为个股
    public static function isSockCode($code){
        if (! self::$_indexRefer) self::$_indexRefer = array_merge(self::getMarket(), self::getSection());
        foreach(self::$_indexRefer as $v){
            if ($v['code'] == $code){
                return false;
            }
        }
        return true;
    }

    //获取个股股价 的索引
    public static function getStock($from = 0){
        if (! self::$_path) self::load();
        if (! self::$_stockRefer)
            self::$_stockRefer = self::_getRefer(self::$_stock);
        return self::$_stockRefer;
    }

    //获取所有索引
    public static function getAll(){
        return array_merge(self::getMarket(), self::getSection(), self::getStock());
    }

    //检索所有索引
    public static function searchCode($code){
        $all = array_merge(self::getMarket(), self::getSection(), self::getStock());
        foreach($all as $v){
            if ($v['code'] == $code){
                return $v;
            }
        }
        return false;
    }

    //获取上证指数的 索引信息
    public static function getSH(){
        return self::getMarket()[0];
    }



    //内部使用 从文件中读取索引
    public static function _getRefer($file){

        $refer = array();
        if (! file_exists($file))return $refer;
        $refer = parent::getAllData($file);
        return $refer;
    }



    //从 文件 中获取索引 (给外部使用)
    public static function getFromFile($file){
        return self::_getRefer($file);
    }
} 