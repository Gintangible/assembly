// 前端给接口给 客户端

export var Client = function () {
	var callbacks = {};
	var win = window;
	var support = function () {
		return win.external && win.external.CB_Call_Gamecenter;
	};
	var call = function (name, data, callback) {
		if (!support()) return;
		callback = callback || function () { };
		var handle = function (data) {
			off(name, handle);
			callback(data);
		};
		on(name, handle);
		win.external.CB_Call_Gamecenter(name, JSON.stringify(data));
	};
	var on = function (name, callback) {
		if (typeof callback !== 'function') return;
		var cbs = callbacks[name];
		if (!cbs) {
			cbs = callbacks[name] = [];
		}
		cbs.push(callback);
	};
	var off = function (name, callback) {
		var cbs = callbacks[name],
			i, l;
		if (typeof callback === 'function') {
			callbacks[name] = [];
			for (i = 0, l = cbs.length; i < l; i++) {
				if (cbs[i] !== callback) {
					callbacks[name].push(cbs[i]);
				}
			}
		} else {
			delete callbacks[name];
		}
	};
	if (support()) {
		win.CB_Call_JS = function (name, data) {
			var cbs = callbacks[name],
				i, l;
			if (cbs) {
				for (i = 0, l = cbs.length; i < l; i++) {
					var ret = null;
					try {
						ret = JSON.parse(data)
					} catch (e) { }
					cbs[i].call(Client, ret);
				}
			}
		};
	}

	return {
		support: support,
		call: call,
		on: on,
		off: off
	};
} ();


window.CB_Call_JS = function (name, json, callback) {
    alert(name + json);
};


