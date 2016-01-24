<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-19
 * Time: 下午1:35
 *
 * 任务索引页面  的基类
 * 挖掘 验证 等索引页面
 *
 */

require_once(MODULE_PATH . 'Page.class.php');

Class Purpose extends Page{

    protected static $aim;

    public static function setAim($aim){
        self::$aim = $aim;
    }

    //展示页面
    public static function show(){
        parent::show();

        $title = array(
            'dig' => '挖掘',
            'prove' => '验证',
            'evaluate' => '回测',
            'pick' => '选股'
        );
        $purposeTitle = $title[self::$aim]. ' '. ucfirst(self::$aim);

        $purposeList = self::getPurposeList();

        //var_dump($purposeList);


        self::setTitle($purposeTitle);
        self::$smarty->assign('purpose', $purposeList);
        self::$smarty->assign('historyUrl', Url::getBasePhp('History'));
        self::$smarty->assign('favoriteUrl', Url::getBasePhp('Favorite'));
        self::$smarty->display('Purpose.tpl');
    }

    public static function getPurposeList(){
        $purpose = array();
        if (($d1 = opendir(TASK_PATH)) == false) return $purpose;
        while (($d2 = readdir($d1)) !== false){
            if((!is_dir(TASK_PATH. $d2)) || $d2 == "." || $d2 == "..") continue;

            $p = TASK_PATH. $d2. "/";
            $f = $p. "SUMMARY.txt";
            if (! file_exists($f)) continue;

            $sd = TableFile::getAllData($f);
            if (! $sd) continue;

            $l = array();
            foreach($sd as $d){
                if($d['aim'] != self::$aim) continue;

                $f = $p . 'data/'. $d['table'];
                if (file_exists($f)){
                    $l[] = array('table' => $d['table'],
                        'info' => $d['info'],
                        'url' => Url::getBasePhp('Sheet'). '?task='. $d2.
                            '&table='. $d['table']. '&info='. $d['info']

                    );
                }
            }
            if ($l) {
                $f = $p. "README.txt";
                $re = array();
                if (file_exists($f)){
                    $re = BaseFile::getFileContent($f);
                    $re = explode("\r\n", $re);

                }
                $purpose[ucfirst($d2)] = array('readme' => $re, 'list' => $l);
            }
        }
        return $purpose;
    }
}





