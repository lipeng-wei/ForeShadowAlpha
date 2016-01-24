<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-7-13
 * Time: 上午3:28
 *
 * 标准股票K线图
 *
 */



require_once(dirname(__FILE__). '/Require.php');
require_once(MODULE_PATH . 'Page.class.php');
require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH . 'GbbqData.class.php');

Class Stock extends Page{
    //展示页面
    public static function show(){
        parent::show();

        $stockInfo = array();
        $stockInfo["code"] = $_GET["code"];
        $i = Refer::searchCode($stockInfo["code"]);
        if (! $i) exit(0);
        $stockInfo["name"] = $i['name'];
        $stockInfo["spell"] = $i['spell'];
        $stockInfo["period"] = null;
        /*
        $stockInfo["period"] = array('start'=>strtotime("Thu May 28 00:00:00 +0800 2015")*1000,
            'end'=>strtotime("Mon Dec 23 00:00:00 +0800 2015")*1000);
        */
        $stockInfo["right"] = "before";

        $gd = new GbbqData($stockInfo["code"]);
        $gbbq = $gd->getGbbqLabel();
        $stockInfo['gbbq'] = $gbbq;

        $stockInfo['rawdata'] = array();
        $typeRight = array("normal", "before", "after");
        foreach($typeRight as $aTypeRight){
            $dd = new DayData($stockInfo["code"], $aTypeRight);
            if ($dd->prepareData()) {
                $stockInfo['rawdata'][$aTypeRight] = $dd->getStockData();
            } else {
                $stockInfo['rawdata'][$aTypeRight] = null;
            }
        }

        self::setTitle($stockInfo['name']. '('. $stockInfo['code']. ') - Stock -- ForeShadow (Alpha)');
        self::$smarty->assign('historyUrl', Url::getBasePhp('History'));
        self::$smarty->assign('favoriteUrl', Url::getBasePhp('Favorite'));
        self::$smarty->assign('stock', json_encode($stockInfo));
        self::$smarty->display('Stock.tpl');
    }
}
Stock::show();





