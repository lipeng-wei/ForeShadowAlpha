<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-27
 * Time: 上午3:04
 *
 * 挖掘页
 *
 */

require_once(dirname(__FILE__). '/Require.php');
require_once(MODULE_PATH . 'Page.class.php');

Class History extends Page{

    //展示页面
    public static function show(){
        parent::show();


        self::setTitle('History');
        self::$smarty->assign('historyUrl', Url::getBasePhp('History'));
        self::$smarty->assign('favoriteUrl', Url::getBasePhp('Favorite'));
        self::$smarty->display('History.tpl');

    }
}
History::show();





