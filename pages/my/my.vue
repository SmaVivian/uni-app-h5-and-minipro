<template>
	<view class="page-my">
		<!-- #ifndef H5 -->
		<u-navbar :is-back="false" :background="{ background: '#2979ff' }"
			title="我的"
			title-color="#fff"
			:border-bottom="false">
			<!-- <view>
				<text style="color:#fff;">我的</text>
			</view> -->
		</u-navbar>
		<!-- #endif -->
		
		
		<!-- <u-navbar :is-back="false" :background="{ background: '#2979ff' }"
			title=""
			title-width="0"
			:border-bottom="false">
		</u-navbar> -->

		<!-- <button
			class="user-box"
			open-type="getAuthorize"
			scope="userInfo"
			@getAuthorize="onGetAuthorize"
			@error="onAuthError">
			<u-avatar :src="userInfo.avatar || '../../../static/default-head.svg'" size="140"></u-avatar>
			<view class="name">{{userInfo.userName}}</view>
			<button type="primary" plain size="mini">登录</button>
		</button> -->

		<view class="user-box">
			<u-avatar :src="userInfo.avatar || '../../../static/default-head.svg'" size="140"></u-avatar>
			<view class="name">{{userInfo.userName}}</view>
			
			<!-- <button class="btn-login" v-if="!userInfo.userName" type="primary" plain size="mini" @click="beforeGoPage('')">登录</button> -->

			<!-- <button class="btn-login" v-if="!userInfo.userName"
				open-type="getAuthorize"
				scope="userInfo"
				@getAuthorize="onGetAuthorize"
				@error="onAuthError"
				type="primary" plain size="mini">授权</button> -->
		</view>

		<view class="cards">
			<view class="item" @click="beforeGoPage('order')">
				<!-- <u-icon name="wodeyuyue" custom-prefix="custom-icon" size="50" color="#2979ff"></u-icon> -->
				<u-image width="50rpx" height="50rpx" src="@/static/icon-yuyue.svg"></u-image>
				<text class="u-m-t-20">我的预约</text>
			</view>
			<view class="item" @click="beforeGoPage('person')">
				<!-- <u-icon name="cylxr" custom-prefix="custom-icon" size="50" color="#2979ff"></u-icon> -->
				<u-image width="50rpx" height="50rpx" src="@/static/icon-person.svg"></u-image>
				<text class="u-m-t-20">常用联系人</text>
			</view>
		</view>

		<!-- todo dele -->
		<!-- <button @click="beforeGoPage('test')">核验故宫博物馆</button> -->
		<!-- <button @click="beforeGoPage('test2')">查询</button> -->
		<!-- <button @click="beforeGoPage('test3')">登录</button> -->
		<!-- <view>
			<u-cell-group>
				<u-cell-item title="我的预约" @click="beforeGoPage('order')">
					<u-icon class="u-m-r-10" slot="icon" size="32" name="search"></u-icon>
				</u-cell-item>
				<u-cell-item icon="photo" title="常用联系人" @click="beforeGoPage('person')"></u-cell-item>
				<u-cell-item icon="photo" title="核验" @click="beforeGoPage('test')"></u-cell-item>
				<u-cell-item icon="photo" title="查询" @click="beforeGoPage('test2')"></u-cell-item>
			</u-cell-group>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// pic: '../../../static/default-head.svg',
				show: true,
				userInfo: {}
			}
		},
		onLoad() {
			
		},
		onShow() {
			// this.$store.commit('logout')
			this.userInfo = uni.getStorageSync('userInfo')
			if (!this.$store.state.hasLogin) {
				// this.$u.route({
				// 	url: '/pages/login/login'
				// })
				this.$store.dispatch('getLoginAuth', 'auth_user')
					.then((res) => {
						this.userInfo = uni.getStorageSync('userInfo')
					}, (error) => {
						this.$u.route({
							type: 'reLaunch',
							url: '/pages/index/index'
						})
					})
				return
			}
			
			// this.userInfo = uni.getStorageSync('userInfo')

			// 动态修改导航栏
			// setTimeout(()=>{
			// 	uni.setNavigationBarColor({
			// 	    frontColor: '#ffffff', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
			// 	    backgroundColor: '#bd1b2d', //背景颜色值，有效值为十六进制颜色
			// 	    // animation: {  //动画效果:微信小程序、百度小程序
			// 	    //     duration: 400,
			// 	    //     timingFunc: 'easeIn'
			// 	    // }
			// 	})
			// 	// uni.setNavigationBarColor({
			// 	//     backgroundColor: '#000000'
			// 	// })
			// }, 100)
		},
		methods: {
			// // 授权会员信息
			// onGetAuthorize() {
			// 	if (uni.getStorageSync('userInfo').userName) {
			// 		return
			// 	}
			// 	my.getOpenUserInfo({
			// 		fail: res => {
			// 			console.log(res);
			// 		},
			// 		success: res => {
			// 			const data = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
			// 			console.log('授权成功', data)
			// 			this.$store.commit('login', {
			// 				...uni.getStorageSync('userInfo'),
			// 				userName: data.nickName,
			// 				avatar: data.avatar
			// 			})
			// 			this.userInfo = uni.getStorageSync('userInfo')
			// 			// uni.navigateBack()
			// 		},
			// 	});
			// },
			// // 授权失败回调
			// onAuthError(e) {
			// 	this.$u.toast('授权失败')
			// },
			beforeGoPage(type) {
				if (!this.$store.state.hasLogin || !type) {
				// if (!uni.getStorageSync('userInfo').userName) {
					this.$u.route({
						url: '/pages/login/login'
					})
					return
				} else {
					this.goPage(type)
				}
				
				// if(!this.$store.state.hasLogin) {
				// 	this.$store.dispatch('getLoginAuth')
				// 		.then((res) => {
				// 			this.goPage(type)
				// 		})
				// } else {
				// 	this.goPage(type)
				// }
			},
			goPage(type) {
				switch (type) {
					case 'order':
						this.$u.route({
							url: '/pages/my/my-order'
						})
						break
					case 'person':
						this.$u.route({
							url: '/pages/my/person-list'
						})
						break

						// todo dele
					case 'test':
						this.$u.route({
							url: '/moduleA/query/query',
							params: {
								u: '0735BB984DB6DD9C35E7B63241EE86B9'
							}
						})
						break
					case 'test2':
						this.$u.route({
							url: '/moduleA/query/search',
							params: {
								u: '0735BB984DB6DD9C35E7B63241EE86B9'
							}
						})
						break
					case 'test3':
						this.$u.route({
							url: '/pages/login/login'
						})
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-box {
		height: 280rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: $u-type-primary;
		color: #fff;
		border: none;
		border-radius: 0;

		&::after {
			display: none;
		}

		.name {
			font-size: 36rpx;
			/* #ifdef MP-ALIPAY */
			margin-top: 10rpx;
			/* #endif */
		}
		
		.btn-login {
			margin-top: 10rpx;
			border-color: #fff;
			border-radius: 6rpx;
			color: #fff;
		}
	}

	.cards {
		padding: 24rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-bottom: 20rpx;
			width: 338rpx;
			height: 213rpx;
			background: #f5f7f9;
			border-radius: 16rpx;
			font-size: 30rpx;
			color: $u-main-color;
		}
	}

	/* #ifdef MP-ALIPAY */
	// 处理u-cell-item在支付宝小程序中样式问题
	.u-cell_title {
		margin-left: 10rpx;
	}

	.u-cell__value {
		padding-right: 10rpx;
	}

	/* #endif */
</style>
