<script>
	// import {getQueryString} from '@/common/util.js'
	export default {
		globalData: {
			codeUrl: ''  // 二维码核验路径  https://wxa.tj720.com/moduleA/query/query?u=0735BB984DB6DD9C35E7B63241EE86B9
		},
		// 首次进入或者首次进入后一段时间内再次进入已经销毁了的小程序
		onLaunch(options) {
			console.log('App Launch', options)
			// this.$scope.globalData
			if(options.query && options.query.qrCode) {
				this.globalData.codeUrl = options.query.qrCode
				// this.globalData.codeUrl = getQueryString(options.query.qrCode, 'u')
			}
			// my.alert({
			//   title: 'app onLaunch',
			//   content:  JSON.stringify(options),
			//   success: (res) => {
			// 	  //成功处理代码段
			//   },
			// });
			
			// 当前路由
			let route = options.path;
			console.log(route)
			// 静默授权
			if(route !== 'moduleA/query/query') {
				this.$store.commit('logout')
				this.$store.dispatch('getLoginAuth')
					.then((res) => {
						
					})
			}
			// let pages = getCurrentPages();
			// console.log(pages)
			// let route = pages[pages.length - 1].route;
			// // 静默授权
			// if(route !== 'moduleA/query/query') {
			// 	this.$store.dispatch('getLoginAuth')
			// 		.then((res) => {
						
			// 		})
			// }
			
			// let userInfo = uni.getStorageSync('userInfo') || {};
			// if(userInfo.userId){
			// 	//更新登录状态
			// 	uni.getStorage({
			// 		key: 'userInfo',
			// 		success: (res) => {
			// 			let data = res.data
			// 			console.log('更新登录状态', res)
			// 			// this.login(res.data);
			// 			// this.$store.commit('login', {userId: '2334', token: '3245124', nickName: '晓晓', navator: ''})
			// 			this.$store.commit('login', res.data)
						
			// 			// 待测试-看需不需要调用接口
			// 			// 特殊情况下 已知uesrId 和 token 用于更新用户登录状态 无需code
			// 			// this.$u
			// 			// 	.post('/login', {
			// 			// 		code: '',
			// 			// 		// userId: '',
			// 			// 		userId: data.userId,
			// 			// 		token: data.token
			// 			// 	})
			// 			// 	.then(res => {
								
			// 			// 	})
			// 		}
			// 	});
			// } else {
			// 	// 静默授权
			// 	// this.$store.dispatch('getLoginAuth')
			// 	// 	.then((res) => {
			// 	// 		console.log(22)
			// 	// 	})
			// }
			
			
			// #ifdef MP-ALIPAY
			// 静默授权
			// my.getAuthCode({
			// 	scopes: 'auth_base',
			// 	success: ({
			// 		authCode
			// 	}) => {
			// 		console.log(666, authCode)
			// 		// debugger
			// 		// this.$store.commit('login', {userId: '2334', token: '3245124', nickName: '晓晓', navator: ''})
					
			// 		// this.$u
			// 		// 	.get('/AppointOrder/museumTicket.do', {
			// 		// 		authCode: authCode
			// 		// 	})
			// 		// 	.then(res => {
			// 		// 		this.$store.commit('login', {})
			// 		// 	})
			// 	},
			// })
			// #endif
		},
		// 我们访问过该小程序，并且小程序并没有被销毁（也就是在几分钟里退出又重新进来了）
		onShow() {
			console.log('App Show')
		},
		onHide() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	// @import "./common/iconfont.css";

	@import "uview-ui/index.scss";
	/*每个页面公共css */
	@import './common/theme.scss';
</style>
