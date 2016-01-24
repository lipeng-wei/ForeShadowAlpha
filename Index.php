<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-7-11
 * Time: 下午1:35
 *
 * 首页
 *
 */

require_once(dirname(__FILE__). '/Require.php');
require_once(MODULE_PATH . 'Page.class.php');

Class Index extends Page{

    //展示页面
    public static function show(){
        parent::show();

        $button = array(
            array('Search'),
            array('Pick'),
            array('Dig'),
            array('Prove'),
            array('Evaluate')
        );

        for($i = 0; $i < sizeof($button); $i++){
            $button[$i][] =Url::getBasePhp($button[$i][0]);
        }

        self::setTitle('ForeShadow (Alpha)');
        self::$smarty->assign('button', $button);
        self::$smarty->display('Index.tpl');
    }
}
Index::show();





