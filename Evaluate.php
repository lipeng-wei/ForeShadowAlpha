<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-22
 * Time: 上午6:04
 *
 * 回测评估页
 *
 */

require_once(dirname(__FILE__). '/Require.php');
require_once(MODULE_PATH . 'Purpose.class.php');

Class Evaluate extends Purpose{

    //展示页面
    public static function show(){
        parent::setAim('evaluate');
        parent::show();
    }
}
Evaluate::show();





