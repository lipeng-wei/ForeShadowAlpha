<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-20
 * Time: 下午1:13
 */


//定义路径常量
define('INDEX_PATH', dirname(__FILE__). '/');
define('SCRIPT_PATH', INDEX_PATH. 'script/');
define('DATA_PATH', INDEX_PATH. 'data/');
define('LIB_PATH', INDEX_PATH. 'lib/');
define('LOG_PATH', INDEX_PATH. 'logs/');
define('MODULE_PATH', INDEX_PATH. 'module/');
define('TASK_PATH', INDEX_PATH. 'task/');
define('TMP_PATH', INDEX_PATH. 'tmp/');
define('CONFIG_PATH', INDEX_PATH. 'conf/');


define('CONFIG_FILE', CONFIG_PATH. 'conf.ini');

define('SPLIT_EOL', "\r\n");




//定义通用信息 函数和变量
require_once(MODULE_PATH . 'CommonInfo.class.php');

//读取配置文件
require_once(MODULE_PATH . "Config.class.php");
if (Config::load(CONFIG_FILE) === false ) {
    echo "Config File Parse Failed";
    exit(0);
}

//引用相关类文件
require_once(MODULE_PATH. 'Log.class.php');
require_once(MODULE_PATH. 'Tmp.class.php');
require_once(MODULE_PATH. 'Url.class.php');
require_once(MODULE_PATH. 'Refer.class.php');

require_once(MODULE_PATH . 'Script.class.php');
require_once(MODULE_PATH . 'Task.class.php');
require_once(LIB_PATH. "smarty-3.1.27/libs/Smarty.class.php");



