<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-20
 * Time: 上午10:35
 *
 * 静态类，读取配置文件conf.ini
 *
 */

class Config{

    private static $_setting = false;

    //加载配置文件
    static function load($file){
        if (self::$_setting) return true;
        if (file_exists($file) == false) return false;
        if (self::$_setting = parse_ini_file($file, true))
            return true;
        else
            return false;


    }

    //获取配置项 参数如： Log.Separator
    static function get($var) {
        $vars = explode('.', $var);
        $result = self::$_setting;
        foreach ($vars as $key) {
            if (!isset($result[$key])) { return false; }
            $result = $result[$key];
        }
        return $result;
    }

    //设置配置项 参数如： Log.Separator
    static function set($var, $val) {
        $vars = explode('.', $var);
        $result = &self::$_setting;
        foreach ($vars as $key) {
            if (!isset($result[$key])) { return false; }
            $result = &$result[$key];
        }
        $result = $val;
    }

}