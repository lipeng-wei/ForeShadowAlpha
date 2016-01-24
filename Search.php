<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-7-11
 * Time: 下午1:35
 *
 * 检索页
 *
 */


require_once(dirname(__FILE__). '/Require.php');
require_once(MODULE_PATH . 'Page.class.php');

Class Search extends Page{

    //展示页面
    public static function show(){
        parent::show();

        $allRefer = Refer::getAll();
        for($i = 0; $i < sizeof($allRefer); $i++){
            $allRefer[$i]['url'] = Url::getBasePhp('Stock') . '?code=' . $allRefer[$i]["code"];
        }

        self::setTitle('Stock List -- ForeShadow (Alpha)');
        self::$smarty->assign('refer', $allRefer);
        self::$smarty->display('Search.tpl');
    }
}
Search::show();
