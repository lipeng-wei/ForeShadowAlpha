<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-28
 * Time: 上午5:55
 *
 * 自选股管理页
 *
 */

require_once(dirname(__FILE__). '/Require.php');
require_once(MODULE_PATH . 'Page.class.php');

Class Favorite extends Page{

    //展示页面
    public static function show(){
        parent::show();

        self::setTitle('Favorite');
        self::$smarty->assign('historyUrl', Url::getBasePhp('History'));
        self::$smarty->assign('favoriteUrl', Url::getBasePhp('Favorite'));
        self::$smarty->display('Favorite.tpl');

    }
}
Favorite::show();





