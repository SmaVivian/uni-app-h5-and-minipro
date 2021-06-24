import Vue from 'vue';

// 省略号截断
Vue.filter('ellSplit', function(value, num) {
	if (!value) return '';
	value = value.toString();
	if (value.length > num) {
		return value.substring(0, num) + '...';
	} else {
		return value;
	}
});

//格式化时间   DateFormat('yyyy-MM-dd hh:mm')
Vue.filter('DateFormat', function(date, fmt) {
	if (date == undefined || date == null) return;
	if (typeof date === 'string') {
		// 解决ios 时间戳格式化出现 NaN
		date = date.replace(/-/g, '/');
	}
	date = new Date(date);
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(date.getFullYear() + '').substr(4 - RegExp.$1.length)
		);
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};

	function padLeftZero(str) {
		return ('00' + str).substr(str.length);
	}
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1 ? str : padLeftZero(str)
			);
		}
	}
	return fmt;
});
