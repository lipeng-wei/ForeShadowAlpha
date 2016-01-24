<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-21
 * Time: 上午4:26
 *
 * 类 表 格式的 数据文件类
 *
 * 包含表头和数据
 * 列数据以 "|" 分割
 * 行数据以 "\r\n" 分割
 *
 *
 */

require_once(MODULE_PATH . 'BaseFile.class.php');

class TableFile extends BaseFile{


    //读取文件的数据，并按照表头来组合成数组
    public static function getAllData($file){
        if ($content = parent::getFileContent($file)){
            $rows = explode("\r\n", $content);
            $title = false;
            $data = array();
            foreach($rows as $row){
                if (! $row) continue;
                $items = explode("|", $row);
                $adata = array();
                if (! $title){
                    //处理表头
                    $title = $items;
                    continue;
                } else {
                    //处理数据
                    for($i = 0; $i<sizeof($items); $i++){
                        $adata[$title[$i]] = $items[$i];
                    }
                }
                $data[] = $adata;
            }
            return $data;
        } else return false;

    }


    //写入数据，并生成表头
    public static function putAllData($file, $data){
        $rows = array();
        $title = false;
        $special = array("|", "\r\n");
        foreach($data as $adata){
            if (! $adata) continue;
            if (! $title){
                //处理表头
                $title = array_keys($adata);
                $rows[] = join("|", $title);
            }
            $row = array();
            foreach($title as $item){
                $row[] = str_replace($special, " ", $adata[$item]);
            }
            $rows[] = join("|", $row);

        }
        $content = join("\r\n", $rows);
        return parent::putFileContent($file, $content);

    }


    //增加若干条数据，并按照表头顺序写入
    public static function putSomeData($file, $data){

        if (empty($data)) return true;
        if (! file_exists($file)) return self::putAllData($file, $data);
        if ($content = parent::getFileContent($file)){

            //得到表头数据
            $rows = explode("\r\n", $content);
            $title = explode("|", $rows[0]);

            $rows = array();
            $special = array("|", "\r\n");

            //按照表头数据 来整合新数据
            foreach($data as $adata){
                if (! $adata) continue;
                $row = array();
                foreach($title as $item){
                    $row[] = str_replace($special, " ", $adata[$item]);
                }
                $rows[] = join("|", $row);

            }
            $content = "\r\n" . join("\r\n", $rows);
            return parent::putFileContent($file, $content, FILE_APPEND);
        } else{
            return false;
        }
    }
} 