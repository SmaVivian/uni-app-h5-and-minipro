// todo dele  多余的文件

// #ifdef H5
// const baseUrl = '/api'   
const baseUrl = 'https://unidemo.dcloud.net.cn/api'
// const baseUrl = 'http://192.168.5.107:9003/api'
// const baseUrl = 'https://wxa.tj720.com/api'
// #endif

// #ifndef H5
// const baseUrl = 'http://bjmuseum.org.cn/admin'
const baseUrl = 'https://unidemo.dcloud.net.cn/api'
// const baseUrl = 'http://192.168.5.107:9003/api'
// const baseUrl = 'https://wxa.tj720.com/api'
// #endif
// MP-WEIXIN 微信端

const request = {
	base: config => {
		return new Promise((resolve, reject) => {
			uni.request(config)
			.then((response) => {
				// setTimeout(function() {
				// 	uni.hideLoading();
				// }, 200);
				let [error, res] = response;        
				resolve(res.data);
			}).catch(error => {
				let [err, res] = error;
				reject(err)
			})
		});
	},
	get: (url, params) => {
		return new Promise((resolve, reject) => {
			uni.request({
				method: 'GET',
				url: baseUrl + url,
				data: params,
				// header: header,
				// dataType: 'json',         
			}).then((response) => {
				// setTimeout(function() {
				// 	uni.hideLoading();
				// }, 200);
				let [error, res] = response;        
				resolve(res.data);
			}).catch(error => {
				let [err, res] = error;
				reject(err)
			})
		});
	},
	post: (url, params) => {
		return new Promise((resolve, reject) => {
			uni.request({
				method: 'POST',
				url: baseUrl + url,
				data: params,
				// header: header,
				// dataType: 'json',         
			}).then((response) => {
				// setTimeout(function() {
				// 	uni.hideLoading();
				// }, 200);
				let [error, res] = response;        
				resolve(res.data);
			}).catch(error => {
				let [err, res] = error;
				reject(err)
			})
		});
	}
	// return new Promise((resolve, reject) => {
	// 	uni.request({
	// 		method: methord,
	// 		url: baseUrl + url,
	// 		data: params,
	// 		header: header,
	// 		dataType: 'json',         
	// 	}).then((response) => {
	// 		setTimeout(function() {
	// 			uni.hideLoading();
	// 		}, 200);
	// 		let [error, res] = response;        
	// 		resolve(res.data);
	// 	}).catch(error => {
	// 		let [err, res] = error;
	// 		reject(err)
	// 	})
	// });
}
export default request