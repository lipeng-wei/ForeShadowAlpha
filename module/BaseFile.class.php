<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-20
 * Time: 下午5:44
 *
 *
 * 数据文件的基类
 *
 * 数据的读写
 *
 */

class BaseFile {

    //读取文件内容，如果是UTF-8编码，去除BOM
    //(BOM)的文件标记，用来指出这个文件是UTF-8编码
    public static function getFileContent($file){
        if (!file_exists($file) || !is_file($file)) return false;
        $dataContent = file_get_contents($file);

        if(preg_match('/^\xEF\xBB\xBF/', $dataContent))
        {
            $dataContent = substr($dataContent, 3);
        }
        $encode = mb_detect_encoding($dataContent, array('UTF-8', 'GB2312', 'GBK', 'ASCII'));
        if ($encode != 'UTF-8'){
            $dataContent = iconv($encode, 'UTF-8', $dataContent);
        }
        return $dataContent;
    }

    //写入文件内容
    public static function putFileContent($file, $content, $flags = null){
        return file_put_contents($file, $content, $flags);
    }

} 