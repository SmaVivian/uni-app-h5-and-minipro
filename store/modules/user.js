import Cookies from 'js-cookie'
const user = {
	namespaced: true,
	state: {
		userId: '',
		token: '', // 登录状态
		// userId: 'd0409cc9ee1b49a09a75edaaf38e048b',
		// token:
		//   '59845C6D911F6BA183173A60955A482CDE2346A96B56AB6B8573527428625AB709EF336A1348B709A0CC9D015D843ED4', // 登录状态
		// userId: 'd0409cc9ee1b49a09a75edaaf38e048b',
		// token:
		//   '59845C6D911F6BA183173A60955A482CDE2346A96B56AB6B8573527428625AB71F91197B0E72E255C7A3BFC58FC5C434',
		userInfo: {} // 用户登录信息
	},
	mutations: {
		SET_USERINFO: (state, userInfo) => {
			state.userInfo = userInfo
		},
		SET_LOGIN_STATUS: (state, loginStatus) => {
			state.loginStatus = loginStatus
		},
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_USERID: (state, userId) => {
			state.userId = userId
		}
	},
	actions: {
		// tododele
		// 登录相关，通过code获取token和用户信息
		loginWechatAuth({
			commit
		}, code) {
			// const data = {
			//   code: code
			// }
			return new Promise((resolve, reject) => {
				this._vm.$http
					.get('/wx/wxIsLogin.do', {
						key: code
					})
					.then(
						res => {
							if (res.success === 1) {
								//  存用户信息，token
								// commit('SET_USERINFO', saveUserInfo(res.data.user))
								// commit('SET_TOKEN', saveToken(res.data.token))

								let data = res.data

								commit('SET_USERID', data.id)
								commit('SET_TOKEN', data.token)
								commit('SET_USERINFO', {
									nickName: data.nickName
								})

								Cookies.set('userId', data.id, {
									expires: 7
								})
								Cookies.set('token', data.token, {
									expires: 7
								})
								Cookies.set(
									'userInfo', {
										nickName: data.nickName
									}, {
										expires: 7
									}
								)
								resolve(res.data)
							} else {
								reject(res.error.message)
							}
						}
						// error => {
						//   this._vm.$message.error(error.msg || '服务器异常')
						// }
					)
				// loginByCode(data)
				//   .then(res => {
				//     // 存用户信息，token
				//     commit('SET_USERINFO', saveUserInfo(res.data.user))
				//     commit('SET_TOKEN', saveToken(res.data.token))
				//     resolve(res)
				//   })
				//   .catch(error => {
				//     reject(error)
				//   })
			})
		},
		LoginOut({
			commit
		}) {
			commit('SET_USERID', '')
			commit('SET_TOKEN', '')
			commit('SET_USERINFO', {})

			Cookies.remove('userId')
		}
	}
}

export default user
