/**
 * Created by lipeng_wei on 15-12-28.
 */
/**
 * Created by lipeng_wei on 15-12-28.
 */
var ForeFavorite = {

    indexID         :   'ForeShadow-Favorite',
    favoriteUrl     :   'Favorite.php',
    operateData     :   [],

    //得到分类列表
    getIndex     :   function(){
        var local = this.getLocalJson(this.indexID);
        if (local) return local;
        this.putLocalJson(this.indexID, []);
        return [];
    },
    //根据索引得到分类名字
    getCategory     :   function(idx){
        var local = this.getIndex();
        return local[idx];
    },
    //添加一个分类
    addCategory     :   function(category){
        var local = this.getIndex();
        for(var i in local){
            if (local[i] == category) return false;
        }
        local.unshift(category);
        this.putLocalJson(this.indexID, local);
        this.putLocalJson(this.indexID + '_' + category, []);

    },
    //删除一个分类及分类中所有个股
    delCategory     :   function(category){
        var local = this.getIndex();
        var all = [];
        for(var i in local){
            if (local[i] != category) all.push(local[i]);
        }
        this.delLocalJson(this.indexID + '_' + category);
        this.putLocalJson(this.indexID, all);
    },
    //分类 修改名称
    updateCategory   :   function(oldCategory, newCategory){
        var local = this.getIndex();
        var j = true;
        for(var i in local){
            if (local[i] == newCategory) return false;
            if (local[i] == oldCategory) j = false;
        }
        if (j) return false;
        var all = [];
        for(var i in local){
            if (local[i] != oldCategory) all.push(local[i]);
        }
        all.unshift(newCategory);
        this.putLocalJson(this.indexID, all);
        var favor = this.getLocalJson(this.indexID + '_' + oldCategory);
        this.delLocalJson(this.indexID + '_' + oldCategory);
        this.putLocalJson(this.indexID + '_' + newCategory, favor);
    },
    //根据个股 得到所属的分类信息
    getFavoriteCategory     :   function(favorite){
        var local = this.getIndex();
        var cat = [];
        for(var i in local){
            var favor = this.getFavorite(local[i]);
            if(! favor) continue;
            for(var j in favor){
                if (favor[j].code == favorite.code) {
                    cat.push(local[i]);
                    break;
                }
            }
        }
        return cat;
    },
    //得到分类中的所有个股
    getFavorite     :   function(category){
        return this.getLocalJson(this.indexID + '_' + category) || [];
    },
    //获取分类中所有个股的html格式
    getFavoriteHtml     :   function(category){
        var local = this.getLocalJson(this.indexID + '_' + category);
        var need = [];
        for(var i=0; i < local.length; i ++) {

            need.push({
                name: '<a target="_blank" href="http://localhost/ForeShadowAlpha/Stock.php?code=' + local[i].code + '">' +
                    '<span class="fore-stock-name">' + local[i].name + '</span>' +
                    '<span class="fore-stock-spell displaynone">' + local[i].spell + '</span></a>',

                code: ' <span class="fore-stock-code">' + local[i].code + '</span>',
                time: (new Date(local[i].time)).Format("yyyy-MM-dd hh:mm:ss")
            });
        }
        return need;
    },
    //将一个自选股添加到一个分类中
    addFavorite     :   function(favorite, category){
        var local = this.getIndex();
        if (local.indexOf(category) == -1){
            this.addCategory(category);
        }
        var favor = this.getFavorite(category);
        var isNone = true;
        for(var j in favor){
            if (favor[j].code == favorite.code) {
                isNone = false;
                break;
            }
        }
        if (isNone) {
            favor.unshift({
                'name': favorite['name'],
                'code': favorite['code'],
                'spell': favorite['spell'],
                'time': (new Date()).getTime()
            });
            this.putLocalJson(this.indexID + '_' +category, favor);
        }
    },
    //从一个分类中删除一个个股
    delFavorite     :   function(favorite, category){
        var local = this.getFavorite(category);
        var favor = [];
        for(var i in local){
            if (local[i].code != favorite.code) favor.push(local[i])
        }
        this.putLocalJson(this.indexID + '_' +category, favor);
    },
    //自选股页面的column信息
    getColmnFavorite :   function(){
        return [{
            title:'name',
            data: 'name'
        },{
            title:'code',
            data: 'code'
        },{
            title:'time',
            data: 'time'
        }];
    },
    //左侧accordion中的html代码
    getIndexHtml    :   function(){
        var local = this.getIndex();
        var html = [];
        for(var i = 0; i < local.length; i ++){
            html.push('<a target="sheetiframe" href="' + this.favoriteUrl + '#' +
                i + '">' + local[i] + '</a>');
        }
        return html.join('');

    },



    delLocalJson    :   function (id) {
        try {
            return localStorage.removeItem(id);
        } catch (e) {}
    },
    getLocalJson    :   function (id) {
        try {
            return JSON.parse(localStorage.getItem(id));
        } catch (e) {}
    },
    putLocalJson    :   function (id, data) {
        try {
            localStorage.setItem(id, JSON.stringify(data));
        } catch (e) {}
    }

}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}