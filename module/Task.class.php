<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-12-13
 * Time: 下午4:19
 *
 *  任务运行的 基础类
 *
 *  任务运行的相关设置
 *
 */

require_once(MODULE_PATH . 'BaseFile.class.php');

class Task {

    public static function run(){
        //脚本执行
    }

    //设置是否忽略浏览器断开连接 true：后台一直执行 false：后台即刻停止
    public static function setNohup($nohup = true){
        if ($nohup){
            //浏览器断开，后台一直执行
            //ignore_user_abort(true);
            Config::set('nohup.nohup', true);
        }else{
            //浏览器断开，后台即刻停止
            ignore_user_abort(false);
            ob_end_flush();  //或ob_end_clean();（停止缓存）
            ob_implicit_flush(true); // 把缓存输出到浏览器
            Config::set('nohup.nohup', false);
        }
    }

    //读取原始的数据EBK形成基础列表List
    public static function EBK2List($importFile, $exportFile){
        if ($content = BaseFile::getFileContent($importFile)){
            $rows = explode("\r\n", $content);
            $codeArr = array();
            foreach($rows as $row){
                if (! $row) continue;
                $r = "/[0-9.]{7}/";
                preg_match($r, $row, $k);
                $t = CommonInfo::EBK2Code($k[0]);
                if ($t) $codeArr[] = array('code' => $t);
            }
        } else return false;

        $refer = Refer::getAll();
        $codeNameArray = CommonInfo::CodeArray2CodeNameArray($codeArr, $refer);

        self::putList($exportFile, $codeNameArray);
    }

    //读取原始的数据Vague形成基础列表List
    public static function Vague2List($importFile, $exportFile){
        if ($content = BaseFile::getFileContent($importFile)){
            $codeArr = array();
            $r = "/[0-9.]{6}/";
            preg_match_all($r, $content, $k);
            foreach($k[0] as $t){
                $tt = CommonInfo::Num2Code($t);
                if ($tt) $codeArr[] = array('code' => $tt);
            }
        } else return false;

        $codeNameArray = CommonInfo::CodeArray2CodeNameArray($codeArr);

        self::putList($exportFile, $codeNameArray);
    }


    //读取基本列表List 信息表Table
    public static function ReadTable($file){
        return TableFile::getAllData($file);
    }
    public static function ReadList($file){
        return self::ReadTable($file);
    }

    //写入基本列表List 信息表Table
    public static function putTable($file, $data){
        if (file_exists($file)) {
            $l = filemtime($file);
            $l = Date("ymdHis", $l);
            if (substr($file, strlen($file)-4) == ".txt"){
                $bakF = substr($file, 0, strlen($file)-3). $l. ".txt";
            } else {
                $bakF = $file. ".". $l. ".txt";
            }
            rename($file, $bakF);
        }
        if ($data)
            return TableFile::putAllData($file, $data);
        else
            return false;
    }
    public static function putList($file, $data){
        return self::putTable($file, $data);
    }

    //添加基本列表List 信息表Table
    public static function appendTable($file, $data){
        if (file_exists($file)) {
            $l = filemtime($file);
            $l = Date("ymdHis", $l);
            if (substr($file, strlen($file)-4) == ".txt"){
                $bakF = substr($file, 0, strlen($file)-3). $l. ".txt";
            } else {
                $bakF = $file. ".". $l. ".txt";
            }
            rename($file, $bakF);
            copy($bakF, $file);
        }
        return TableFile::putSomeData($file, $data);
    }
    public static function appendList($file, $data){
        return self::appendTable($file, $data);
    }


} 