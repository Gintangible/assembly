/* 渲染的结构
 * <div class="citypop-firstchar"></div>
 * <div class="citypop-scity"></div>
 */
var PlaceAuto = function (el, options) {
    /*
        areaData                    {}                  城市列表
        isJump                      boolean             显示城市列表
        cityItemClass               string              单个城市类名
        cityClass                   string              城市容器类名
        firstCharClass              string              首字母容器类名
        userCityId                  string/number       用户城市ID
        defaultCityId               string/number       默认城市ID
        changeCityFunctionArray     [fn,fn]             城市切换后的回调函数 数组
    */
    this.el = el;

    var options = Object.assign({
        isJump: true,
        firstCharClass: 'citypop-firstchar',
        cityClass: 'citypop-scity',
        cityItemClass: 'auto-header-citypop-city',
        areaData: {},
        userCityId: null,
        defaultCityId: '110100',
        changeCityFunctionArray: [],
    }, options || {});

    this._init(options);
};
PlaceAuto.prototype = {
    contructor: PlaceAuto,
    // 解析options
    _analysisOptions: function (options) {
        for (let k in options) {
            this[k] = options[k];
        }
    },

    _init: function (options) {
        this._analysisOptions(options);
        this._getUserArea();
        this._initCityPop();
        this._bind();
        this._goto();
    },

    _initCityPop: function () {
        var listHtml = this._listHtml();
        this.el.innerHTML = listHtml;
    },

    _hide: function () {
        this.el.style.display = 'none';
    },

    _show: function () {
        this.el.style.display = 'block';
    },

    _getUserArea: function () {
        this.curCityId = this.userCityId ? this.userCityId : this.defaultCityId;
    },

    _bind: function () {
        var _this = this,
            citys = document.querySelectorAll('.' + this.cityItemClass);
        for (var i = 0; i < citys.length; i++) {
            citys[i].onclick = function () {
                _this._callback(this.getAttribute('data-info'));
                // _this._hide();
                window.location.reload();
            };
        }
    },

    _goto: function () {
        var chars = document.querySelectorAll('.auto-header-citypop-firstchar');
        for (var i = 0; i < chars.length; i++) {
            chars[i].onclick = function (e) {
                e = e || window.event;
                var target = e.srcElement || e.target,
                    char = target.getAttribute('data-key');
                if (!char) {
                    return;
                }
                var div = document.getElementById('auto-header-citypop-firstcharto' + char);
                document.getElementById('auto-header-citypop-citylist').scrollTop = div.offsetTop - 48;
            };
        }
    },

    _callback: function (cityInfo) {
        const that = this;
        cityInfo = eval(cityInfo);
        for (let i = 0,
                length = that.changeCityFunctionArray.length; i < length; i++) {
            if (typeof that.changeCityFunctionArray[i] == "function") {
                try {
                    that.changeCityFunctionArray[i](cityInfo);
                } catch (err) {}
            }
        }
        return;
    },

    _listHtml: function () {
        var firstChar = [],
            zxCity = [],
            zx = [110100, 310100, 120100, 500100];

        var defaultCityId = this.curCityId;

        var zxCityHtml = '',
            firstCharHtml = '',
            listHtml = '';

        //首字母
        for (var i = 0; i < this.areaData.ProvinceItems.length; i++) {
            if ((this.areaData.ProvinceItems[i].F != " " && firstChar.indexOf(this.areaData.ProvinceItems[
                    i].F) == -1)) {
                firstChar.push(this.areaData.ProvinceItems[i].F);
            }
        }

        // 首字母跳转
        if (this.isJump) {
            for (var i = 0; i < firstChar.length; i++) {
                firstCharHtml += '<a class="auto-header-citypop-firstchar" target="_self" href="javascript:void(0);" data-key="' + firstChar[i] + '">' + firstChar[i] + '</a>';
            }
            firstCharHtml = '<div class="' + this.firstCharClass + '" id="auto-header-citypop-firstchar">' + firstCharHtml + '</div>';
        }

        //直辖市
        for (var k = 0; k < this.areaData.CityItems.length; k++) {
            if (zx.indexOf(this.areaData.CityItems[k].I) > -1) {
                zxCity.push(this.areaData.CityItems[k]);
            }
        }

        // // 直辖市html
        for (var i = 0; i < zxCity.length; i++) {
            var cur = this.cityItemClass + (defaultCityId == zxCity[i].I ? ' cur' : '');
            zxCityHtml += '<a class="' + cur + '" target="_self" href="javascript:void(0);" data-key="' +
                zxCity[i].I + '" data-info="[' + zxCity[i].I + ', \'' + zxCity[i].N + '\', \'' + zxCity[
                    i].P + '\']">' + zxCity[i].N + '</a>';
        }

        listHtml += '<dl class="dlbg-top">' +
            '           <dt><span class="tx">直辖市：</span></dt>' +
            '           <dd>' + zxCityHtml + '</dd>' +
            '        </dl>';

        // 首字母HTML
        for (var i = 0; i < firstChar.length; i++) { //首字母
            var fcSpan = '<span id="auto-header-citypop-firstcharto' + firstChar[i] + '" class="nu">' +
                firstChar[i] + '</span>';
            var rowHtml = '';
            for (var j = 0; j < this.areaData.ProvinceItems.length; j++) {
                if (firstChar[i] != this.areaData.ProvinceItems[j].F) continue;
                var province = this.areaData.ProvinceItems[j].P; //首字母下的省份
                for (var p = 0; p < province.length; p++) {
                    var provinceItem = province[p];
                    rowHtml += '<dt><span class="tx">' + provinceItem.N + '：</span>' + fcSpan + '</dt>';
                    rowHtml += '<dd>';
                    var city = this.areaData.CityItems;
                    for (var k = 0; k < city.length; k++) {
                        if (city[k].S == provinceItem.I) {
                            var cur = this.cityItemClass + (defaultCityId == city[k].I ? ' cur' : '');
                            rowHtml +=
                                '<a class="' + cur + '" target="_self" href="javascript:void(0);" data-key="' +
                                city[k].I + '"  data-info="[' + city[k].I + ', \'' + city[k].N +
                                '\', \'' + city[k].P + '\']">' + city[k].N + '</a>';
                        }
                    }
                    rowHtml += '</dd>';
                    fcSpan = '';
                }
            }
            if (rowHtml != '') {
                listHtml += '<dl>';
                listHtml += rowHtml;
                listHtml += '</dl>';
            }
        }

        return firstCharHtml + '<div id="auto-header-citypop-citylist" class="' + this.cityClass + '">' + listHtml + '</div>';
    }
}

document.querySelector('.citypop-scity') && new placeFn.PlaceAuto(document.querySelector('.citypop-scity'), {
    areaData: CityItems,
    cityClassName: 'auto-header-citypop-city',
    userCityId: cookieFn.cookie.get('cookieCityId'),
    changeCityFunctionArray: [function (cityInfo) {
        cookieFn.cookie.set('cookieCityId', cityInfo[0])
    }]
})