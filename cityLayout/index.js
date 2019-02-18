var PlaceAuto = function (el, options) {
    this.el = el;
    /*
        isJump          字母跳转
        isListHtml      显示城市列表
    */
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
        this._initCityPop();
        // this._goto();
    },
    _getUserArea: function () {

    },
    _listHtml: function () {
        if (!this.isListHtml) return;
        var firstChar = [],
            zxCity = [],
            zx = [110100, 310100, 120100, 500100];

        var zxCityHtml = '',
            listHtml = '';

        //首字母
        for (var i = 0; i < this.areaData.ProvinceItems.length; i++) {
            if ((this.areaData.ProvinceItems[i].F != " " && firstChar.indexOf(this.areaData.ProvinceItems[
                    i].F) == -1)) {
                firstChar.push(this.areaData.ProvinceItems[i].F);
            }
        }

        //直辖市
        for (var k = 0; k < this.areaData.CityItems.length; k++) {
            if (zx.indexOf(this.areaData.CityItems[k].I) > -1) {
                zxCity.push(this.areaData.CityItems[k]);
            }
        }

        // 直辖市html
        for (var i = 0; i < zxCity.length; i++) {
            zxCityHtml +=
                '<a id="auto-header-citypop-city" name="auto-header-citypop-city" target="_self" href="javascript:void(0);" data-key="' +
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
                            rowHtml +=
                                '<a name="auto-header-citypop-city" target="_self" href="javascript:void(0);" data-key="' +
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
                lastChar = firstChar[i];
            }
        }

        return listHtml;
    },
    _initCityPop: function () {
        var listHtml = this._listHtml();
        this.el.innerHTML = listHtml;
    },
    _goto: function () {
        if (!this.isJump) return;
        for (var i = 0; i < this.obj.goTo.length; i++) {
            this.obj.goTo[i].onclick = function (e) {
                e = e || window.event;
                var _this = e.srcElement || e.target;
                var isIe = !!(window.attachEvent && !window.opera);
                if (!_this.getAttribute('data-key') || _this.getAttribute('data-key') == null) {
                    return false;
                }
                var div = document.getElementById('auto-header-citypop-firstcharto' + _this.getAttribute(
                    'data-key'));
                if (isIe) {
                    var top = div.offsetTop;
                    if (top < 50) {
                        var parent = div.parentNode;
                        var i = 0;
                        while (parent != null && parent != document.body) {
                            if (i > 2) break;
                            top += (parent.tagName != "div" && parent.tagName != "undefined") ?
                                parent.offsetTop : 0;
                            parent = parent.parentNode;
                            i++;
                        }
                    }
                    document.getElementById('auto-header-citypop-citylist').scrollTop = top - 82;
                } else {
                    document.getElementById('auto-header-citypop-citylist').scrollTop = div.offsetTop -
                        82;
                }
            };
        }
    },
}

document.querySelector('.citypop-scity') && new PlaceAuto(document.querySelector('.citypop-scity'), {
    isListHtml: true,
    areaData: CityItems,
    cookieCityId: '350100'
})