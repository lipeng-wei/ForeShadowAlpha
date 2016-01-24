<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-22
 * Time: 上午5:04
 *
 * 挖掘页
 *
 */

require_once(dirname(__FILE__). '/Require.php');
require_once(MODULE_PATH . 'Page.class.php');

Class Sheet extends Page{

    //展示页面
    public static function show(){
        parent::show();

        $taskP = TASK_PATH. $_GET['task']. '/data/';
        $tableF = $taskP. $_GET['table'];
        $infoF = $taskP. $_GET['info'];

        $detail = array(ucfirst($_GET['task']), ucfirst($_GET['table']));
        //echo $tableF;
        $table = Task::ReadTable($tableF);
        //var_dump($table);
        $header = array();
        $footer = array();
        $i = 0;
        foreach ($table[0] as $k => $v){
            $header[] = $k;
            $footer[] = '$'. chr(65 + ($i++));
        }
        //echo $infoF;
        $info = BaseFile::getFileContent($infoF);
        $info = $info? explode("\r\n", $info) : array();



        self::setTitle($detail[1]. ' - '. $detail[0]);
        self::$smarty->assign('historyUrl', Url::getBasePhp('History'));
        self::$smarty->assign('favoriteUrl', Url::getBasePhp('Favorite'));
        self::$smarty->assign('detail', $detail);
        self::$smarty->assign('info', $info);
        self::$smarty->assign('header', $header);
        self::$smarty->assign('footer', $footer);
        self::$smarty->assign('table', $table);
        self::$smarty->display('Sheet.tpl');

    }
}
Sheet::show();





