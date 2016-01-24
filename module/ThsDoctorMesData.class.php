<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-10
 * Time: 下午1:07
 *
 * 同花顺牛叉诊股消息列表的数据  数据接口类
 *
 *
 */

require_once(MODULE_PATH. 'TableFilter.class.php');

class ThsDoctorMesData extends TableFilter{

    protected $dataFile;
    protected $stockCode;
    protected $thsDoctorMesData;

    // 构建对象
    function __construct($code){
        $this->stockCode = $code;
        $this->dataFile = DATA_PATH. 'thsdoctormes/'. $this->stockCode. '.txt';
    }

    // 准备数据 读取文件解压 类内部使用
    function _prepare(){
        if ($this->thsDoctorMesData) return $this->thsDoctorMesData;
        $this->thsDoctorMesData = $this->_getData($this->dataFile);
        return $this->thsDoctorMesData;
    }

    // 准备数据
    function prepareData(){
        if ($this->_prepare()) return true;
            else return false;
    }
    //获取个股的完整数据  return Array
    function getThsDoctorMesData(){
        return $this->_prepare();
    }
    function getThsDoctorMesLabel(){
        $res = $this->_prepare();
        $ret = array();
        $tt = 0;
        $labels = null;
        if (! $res) return $ret;
        for($i = 0; $i < sizeof($res); $i++){
            $t = $res[$i]['time'];
            $l = $res[$i]['rank'].'|'.$res[$i]['type'].'|'.$res[$i]['content'];
            //将同一天的数据串联起来
            if ($t > $tt) {

                if ($tt && $labels){
                    $ret[] = array(
                        'time' => $tt,
                        'label' => join("<br/>",$labels)
                    );
                }


                $tt = $t;
                $labels = array($l);
            } else {
                $labels[]= $l ;
            }

            $ret[] = array(
                'time' => $tt,
                'label' => join("<br/>",$labels)
            );
        }
        return $ret;
    }


    // 获取文件路径
    function getDataFile(){
        return $this->dataFile;
    }
    //获取个股的代码
    function getStockCode(){
        return $this->stockCode;
    }
}



