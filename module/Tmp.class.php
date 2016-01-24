<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-20
 * Time: 下午2:06
 *
 * 脚本或任务在运行中的临时数据 管理类
 * 比如：
 *  进度标示
 *  产生的中间结果
 *  抓取的Cookie文件
 *  等等
 *
 */

require_once(MODULE_PATH . 'BaseFile.class.php');

class Tmp extends BaseFile{


    protected $dir = null;
    protected $time = null;

    //多个Tmp文件的列表 供操作使用
    //label:filename
    protected $file = null;

    //构造函数
    function Tmp($dir){
        $this->dir = rtrim($dir, '/.'). '/';
        $this->file = array();
    }

    //添加一个Tmp的临时数据文件
    public function addTmp($label, $needNew = false){
        $label = ucfirst($label);
        $this->file[$label] = $this->dir. $label. ".Tmp.txt";
        if ($needNew){
            //备份并新建（新建为延迟新建）
            //  如果源文件存在，备份该文件,修改文件名
            $this->newTmpFile($label);
        }

    }

    //重新创建临时数据文件
    public function newTmpFile($label){
        $label = ucfirst($label);
        //备份并新建（新建为延迟新建）
        //  如果源文件存在，备份该文件,修改文件名
        $newF = $this->getTmpFile($label);
        if (file_exists($newF)) {
            $l = filemtime($newF);
            $l = Date("Y-m-d-H-i-s", $l);
            $oldF = $this->dir. $label. ".Tmp.". $l. ".txt";
            rename($newF, $oldF);
        }
    }

    //判断文件是否存在
    public function existTmp($label){
        $label = ucfirst($label);
        if (!isset($this->file[$label]))
            return false;
        else
            return true;
    }

    //获取文件路径
    public function getTmpFile($label){
        $label = ucfirst($label);
        if ($this->existTmp($label))
            return $this->file[$label];
        else
            return false;
    }

    //获取文件内容 访问父类方法
    public function getTmpContent($label){
        $file = $this->getTmpFile($label);
        if ($file)
            return parent::getFileContent($file);
        else
            return false;

    }

    //写入文件内容
    public function putTmpContent($label, $content, $flags = null){
        $file = $this->getTmpFile($label);
        if ($file)
            return file_put_contents($file, $content, $flags);
        else
            return false;

    }


} 