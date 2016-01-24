<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-31
 * Time: 上午11:28
 *
 * 可定制的 股票信息 图
 *
 */



require_once(dirname(__FILE__). '/Require.php');
require_once(MODULE_PATH . 'Page.class.php');

require_once(MODULE_PATH . 'DayData.class.php');
require_once(MODULE_PATH . 'GbbqData.class.php');
require_once(MODULE_PATH . 'DdeData.class.php');
require_once(MODULE_PATH . 'RateData.class.php');
require_once(MODULE_PATH . 'LhbData.class.php');
require_once(MODULE_PATH . 'ThsDoctorData.class.php');

Class Chart extends Page{
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
         *
        $stockInfo["period"] = array('start'=>strtotime("Thu May 28 00:00:00 +0800 2015")*1000,
            'end'=>strtotime("Mon Dec 23 00:00:00 +0800 2015")*1000);
        */
        $stockInfo["right"] = "before";

        $gd = new GbbqData($stockInfo["code"]);
        $gbbq = $gd->getGbbqLabel();
        $stockInfo['gbbq'] = $gbbq;

        $dd = new DdeData($stockInfo["code"]);
        $dde = $dd->getDdeData();
        $stockInfo['dde'] = $dde;

        $tdd = new ThsDoctorData($stockInfo["code"]);
        $ths = $tdd->getThsDoctorData();
        $stockInfo['ths'] = $ths;

        $ld = new LhbData($stockInfo["code"]);
        $lhb = $ld->getLhbData();
        $stockInfo['lhb'] = $lhb;

        $rd = new RateData($stockInfo["code"]);
        $rate = RateData::filterBuy($rd->getRateData());
        $stockInfo['rate'] = $rate;

        $stockInfo['day'] = array();
        $typeRight = array("normal", "before", "after");
        foreach($typeRight as $aTypeRight){
            $dd = new DayData($stockInfo["code"], $aTypeRight);
            if ($dd->prepareData()) {
                $stockInfo['day'][$aTypeRight] = $dd->getStockData();
            } else {
                $stockInfo['day'][$aTypeRight] = null;
            }
        }

        self::setTitle($stockInfo['name']. '('. $stockInfo['code']. ') - Stock -- ForeShadow (Alpha)');
        self::$smarty->assign('historyUrl', Url::getBasePhp('History'));
        self::$smarty->assign('favoriteUrl', Url::getBasePhp('Favorite'));
        self::$smarty->assign('rawData', json_encode($stockInfo));
        self::$smarty->display('Chart.tpl');
    }
}
Chart::show();





