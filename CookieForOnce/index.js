//一段时间内只可执行一次 或者定点时间清除

// DoOnce.set('showOnce',2);


var Cookie = function () {
    var Class = {},
        prefix = "timeDown_";
    /**
     * set cookie
     * @param {String} name    [name]
     * @param {String} val    [value]
     * @param {number} days   [days]
     */
    Class.set = function (name, value, days) {
        var exdata = new Date();
        exdata.setDate(exdata.getDate() + (days ? days : 30));//默认一个月
        // exdata.setTime( exdata.getTime() + (expiredays * 24*60*60*1000) )
        //encodeURI 代替 escape
        document.cookie = (prefix + name) + '=' + encodeURI(value) + ';expires=' + exdata.toGMTString();
    };

    /**
     * get cookie
     * @param  {String} name  [name]
     */
    Class.get = function (name) {
        if (document.cookie.length > 0) {
            var name = prefix + name;
            offset = document.cookie.indexOf(name + '=');
            if (offset != -1) {
                offset += name.length + 1;
                end = document.cookie.indexOf(';', offset);
                if (end == -1) end = document.cookie.length;
                //decodeURI 代替 unescape
                return decodeURI(document.cookie.substring(offset, end))
            }
            return '';
        }

        //方法二
        /*var arr,reg=new RegExp("(^| )"+ name + "=([^;]*)(;|$)");
        if( arr = document.cookie.match(reg) ){
            return decodeURI(arr[2]);
        }
         return null;*/
    };

    /**
     * del cookie
     * @param  {String} name  [name]
     */
    Class.del = function (name) {
        this.set(prefix + name, "", -1);
    };

    return Class;
} ();

/*
*	@param {String} name    [name]
* 	@param {String} time    [time] (s)
*/
var DoOnce = function (name,time) {
    var nowTime = Math.round(new Date().getTime());//获取当前时间时间戳

    // 定点时间
    /*var date = new Date();
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    var expiryTime = Math.round(date.getTime());
	*/

	if(time) expiryTime = nowTime + time;

    leftTime = expiryTime - nowTime;

	Cookie.set(name, "1", leftTime);
};

export function(name,time){
	DoOnce(name,time);
};
