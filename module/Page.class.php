<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-24
 * Time: 下午8:28
 *
 *
 * 前端页面 的基类
 *
 */

class Page {

    static $smarty;

    //准备
    public static function prepare(){
        self::$smarty = new Smarty();


        self::$smarty->setTemplateDir(INDEX_PATH . "/smarty/templates");
        self::$smarty->setCompileDir(INDEX_PATH . "/smarty/templates_c");
        self::$smarty->setCacheDir(INDEX_PATH . "/smarty/cache");
        self::$smarty->setConfigDir(INDEX_PATH . "/smarty/configs");

    }
    //展示页面
    public static function show(){
        self::prepare();
    }
    //设置title
    public static function setTitle($title){
        self::$smarty->assign('fe_title', $title);
    }


}