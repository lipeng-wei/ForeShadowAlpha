<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-20
 * Time: 上午8:29
 *
 * 日志打印 管理类
 *
 */

class Log {

    const L_ERROR = 1;
    const L_NOTICE = 2;
    const L_DEBUG = 3;

    protected $dir = null;
    protected $name = null;
    protected $file = null;
    protected $level = null;
    protected $separator = null;

    //构造函数
    function Log($logdir, $filename, $level = null){
        $this->dir = rtrim($logdir, '/.'). '/';

        $f = explode('/', $filename);
        $f = end($f);
        $f = explode("\\", $f);
        $f = end($f);
        $f = explode('.', $f);
        $this->name = ucfirst($f[0]);

        $this->file = $this->dir. $this->name. ".Log.". date('Y-m-d-H-i',time()). ".txt";
        $this->level = Log::getLevel($level, Config::get('Log.Level'));
        $this->separator = Config::get('Log.Separator') ? Config::get('Log.Separator') : ' | ';
    }



    //字符串的Level转为数字 $level 等级数字 ; $levstr 等级字符串
    protected  static function getLevel($level, $levelStr){
        if ($level) return $level;
        $list = array("ERROR" => 1, "NOTICE" => 2, "DEBUG" => 3);
        if (!isset($list[$levelStr]))
            return Log::L_ERROR;
        else
            return $list[$levelStr];
    }


    //写入日志
    protected function _writeLog($level, $info, $levelStr){

        //通过日志 确定是否后台执行
        if (! Config::get('nohup.nohup')) echo Config::get('nohup.signal');
        //echo $this->level;
        if ($level <= $this->level) {
            if ($info && is_array($info)) $info = join($this->separator, $info);
            else return;
            $row = date('Ymd:H:i:s',time()). $this->separator. $levelStr.
                $this->separator. $info. PHP_EOL;
            //echo $this->file;
            file_put_contents($this->file, $row, FILE_APPEND);

        }

    }
    //info 为字符串或者数组
    public function debugLog(){
        $this->_writeLog(Log::L_DEBUG, func_get_args(), 'Debug ');
    }
    public function noticeLog(){
        $this->_writeLog(Log::L_NOTICE, func_get_args(), 'Notice');
    }
    public function errorLog(){
        $this->_writeLog(Log::L_ERROR, func_get_args(), 'Error ');
    }

    public static function nohupLog(){
        //通过日志 确定是否后台执行
        if (! Config::get('nohup.nohup')) echo Config::get('nohup.signal');
    }

} 