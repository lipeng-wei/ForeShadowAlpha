<?php
/**
 * Created by PhpStorm.
 * User: lipeng_wei
 * Date: 15-11-23
 * Time: 下午4:19
 *
 *  脚本运行的 基础类
 *
 *  脚本运行的相关设置
 *
 */

class Script {

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


} 