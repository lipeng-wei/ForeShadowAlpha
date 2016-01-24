<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-26
 * Time: 下午8:05
 *
 *
 * 生成url
 *
 */

class Url {

    public static function getBaseUrl(){
        return 'http://' . $_SERVER['HTTP_HOST'] . '/' . PROJECT_DIR . '/';
    }
    public static function getScriptUrl(){
        return self::getBaseUrl() . 'script' . '/';
    }
    public static function getTaskUrl(){
        return self::getBaseUrl() . 'task' . '/';
    }

    public static function getBasePhp($name){
        return self::getBaseUrl() . $name . '.php';

    }
} 