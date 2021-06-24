import Vue from 'vue'
import Vuex from 'vuex'
// import app from './modules/app'
// import user from './modules/user'
// import getters from './getters'
import {
	getQueryString
} from '@/common/util.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		// app,
		// user
	},
	// getters,
	state: {
		hasLogin: false,
		userId: '',
		token: '',
		userInfo: {},
	},
	mutations: {
		login(state, provider) {
			// state.hasLogin = true
			state.hasLogin = provider.auth   // false 代表未授权
			state.userId = provider.userId
			state.token = provider.token // 登录状态
			state.userInfo = provider
			uni.setStorageSync('userInfo', provider)
		},
		logout(state) {
			state.hasLogin = false
			state.userId = ''
			state.token = ''
			state.userInfo = {}
			uni.removeStorageSync('userInfo')
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
	},
	// getters: {},
	actions: {
		// 授权
		getLoginAuth: async function({ commit, state}, authType) {
			// #ifndef H5
			return await new Promise((resolve, reject) => {
				if (state.hasLogin) {
					resolve()
					// resolve(state.openid)
				} else {
					// #ifdef MP-ALIPAY
					console.log('授权', authType)
					my.getAuthCode({
						scopes: authType || 'auth_base',
						// scopes: 'auth_base', // 静默授权
						// scopes: 'auth_user', // 用户授权
						success: ({
							authCode
						}) => {
							// console.log(uni.getStorageSync('userInfo'))
							// commit('login', {userId: '2334', token: '3245124', nickName: '晓晓', navator: ''})
							// resolve({userId: '2334', token: '3245124', nickName: '晓晓', navator: ''})
							
							this._vm.$u
								.post('/login', {
									code: authCode,
									userId: authType === 'auth_user' ? state.userId : '',
									token: authType === 'auth_user' ? state.token : ''
								})
								.then(res => {
									if(res.success) {
										console.log('授权data', res.data)
										commit('login', res.data)
										resolve(res.data)
									} else {
										this._vm.$u.toast(res.msg)
									}
								})
						},
						fail: (res) => {
							// 调用失败的回调函数
							reject(res)
						}
					});
					// #endif
					
					// #ifdef MP-WEIXIN
					// 微信获取用户登录凭证
					// wx.login({
					// 	success: (res) => {
					// 		if (res.code) {
					// 			console.log('用户登录凭证', res)
					// 			commit('login', {userId: '2334', token: '3245124', nickName: '晓晓', navator: ''})
								
					// 			//发起网络请求
					// 			// wx.request({
					// 			//   url: 'https://test.com/onLogin',
					// 			//   data: {
					// 			//     code: res.code
					// 			//   }
					// 			// })
					// 		} else {
					// 			console.log('登录失败！' + res.errMsg)
					// 		}
					// 	}
					// })
					// #endif
				}
			})
			// #endif

			// H5端
			// #ifdef H5
			// return await new Promise((resolve, reject) => {
			// 	console.log(888, getQueryString('islogin'))
			// 	// todo dele
			// 	let data = {
			// 		userId: '34545',
			// 		name: 'vivi'
			// 	}
			// 	commit('login', data)
			// 	resolve(data)

			// 	// todo open
			// 	// if (state.hasLogin) {
			// 	// 	resolve()
			// 	// } else if(getQueryString('islogin')){
			// 	// 	this._vm.$http.get('/wx/wxIsLogin.do', {
			// 	// 		key: getQueryString('islogin')
			// 	// 	})
			// 	// 	.then(res => {
			// 	// 		// todo 判断登录成功
			// 	// 		// if (res.success === 1) {
			// 	// 		if (res.success === 0) {
			// 	// 			res.data = {userId: '34545', name: 'vivi'}
			// 	// 			commit('login', res.data)

			// 	// 			resolve(res.data)
			// 	// 		} else {
			// 	// 			reject(res.error.message)
			// 	// 		}
			// 	// 	})
			// 	// } else {
			// 	// 	// todo 回调地址
			// 	// 	window.location.href =
			// 	// 		apiUrl +
			// 	// 		'/admin/wx/m/wxLogin.do?redirect_uri=' + encodeURIComponent(window.location.href)
			// 	// 	// window.location.href =
			// 	// 	// 	apiUrl +
			// 	// 	// 	'/admin/wx/m/wxLogin.do?redirect_uri=' +
			// 	// 	// 	encodeURIComponent(
			// 	// 	// 		apiUrl + '/appoint/#/home/order-pre?id=' + this.$route.query.id
			// 	// 	// 	)
			// 	// }
			// })
			// #endif
		},
		
		
		// todo dele
		// 微信登录授权
		loginWechatAuth: async function({
			commit,
			state
		}) {
			// console.log(22222222, commit, state)
			// #ifndef H5
			return await new Promise((resolve, reject) => {
				if (state.hasLogin) {
					resolve()
					// resolve(state.openid)
				} else {
					uni.login({
						provider: 'weixin',
						success: (res) => {
							console.log('login success:', res);
							let code = res.code
							console.warn(
								'如需获取openid请参考uni-id: https://uniapp.dcloud.net.cn/uniCloud/uni-id'
								)

							// todo dele
							res.data = {
								userId: '34545',
								name: 'vivi'
							}
							commit('login', res.data)
							resolve(res.data)

							// todo open
							// this._vm.$http.get('/wx/wxIsLogin.do', {
							// 	key: code
							// })
							// .then(res => {
							// 	// todo 判断登录成功
							// 	// if (res.success === 1) {
							// 	if (res.success === 0) {
							// 		res.data = {userId: '34545', name: 'vivi'}
							// 		commit('login', res.data)

							// 		resolve(res.data)
							// 	} else {
							// 		reject(res.error.message)
							// 	}
							// })

							// todo dele
							// 获取用户信息
							// uni.getUserInfo({
							// 	provider: 'weixin',
							// 	success: function (infoRes) {
							// 		console.log('用户信息为：' + infoRes);
							// 	}
							// });
						},
						fail: (err) => {
							console.log('login fail:', err);
						}
					});
				}
			})
			// #endif

			// H5端
			// #ifdef H5
			return await new Promise((resolve, reject) => {
				console.log(888, getQueryString('islogin'))
				// todo dele
				let data = {
					userId: '34545',
					name: 'vivi'
				}
				commit('login', data)
				resolve(data)

				// todo open
				// if (state.hasLogin) {
				// 	resolve()
				// } else if(getQueryString('islogin')){
				// 	this._vm.$http.get('/wx/wxIsLogin.do', {
				// 		key: getQueryString('islogin')
				// 	})
				// 	.then(res => {
				// 		// todo 判断登录成功
				// 		// if (res.success === 1) {
				// 		if (res.success === 0) {
				// 			res.data = {userId: '34545', name: 'vivi'}
				// 			commit('login', res.data)

				// 			resolve(res.data)
				// 		} else {
				// 			reject(res.error.message)
				// 		}
				// 	})
				// } else {
				// 	// todo 回调地址
				// 	window.location.href =
				// 		apiUrl +
				// 		'/admin/wx/m/wxLogin.do?redirect_uri=' + encodeURIComponent(window.location.href)
				// 	// window.location.href =
				// 	// 	apiUrl +
				// 	// 	'/admin/wx/m/wxLogin.do?redirect_uri=' +
				// 	// 	encodeURIComponent(
				// 	// 		apiUrl + '/appoint/#/home/order-pre?id=' + this.$route.query.id
				// 	// 	)
				// }
			})
			// #endif
		},
		// tode dele:  lazy loading openid 
		getUserOpenId: async function({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				if (state.openid) {
					resolve(state.openid)
				} else {
					uni.login({
						success: (data) => {
							commit('login')
							setTimeout(function() { //模拟异步请求服务器获取 openid
								const openid = '123456789'
								console.log('uni.request mock openid[' +
									openid + ']');
								commit('setOpenid', openid)
								resolve(openid)
							}, 1000)
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
							reject(err)
						}
					})
				}
			})
		}
	}
})

export default store
