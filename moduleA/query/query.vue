<template>
	<!-- 扫码核验 -->
	<view class="page-query">
		<div class="page-query">
			<!-- 找到预约信息 -->
			<div class="content content-success" :class="{'outtime': status==='2'}" v-if="status==='1'||status==='2'">
				<img class="pic-top" v-if="status==='1'" src="@/static/success.png" alt>
				<h1 class="title" v-if="status==='1'">您的预约信息如下</h1>

				<img class="pic-top" v-if="status==='2'" src="@/static/error.png" alt>
				<h1 class="title" v-if="status==='2'">您的预约信息已过期</h1>

				<div class="info mb-20">
					<h2 class="info-title">
						共
						<label class="num">{{detailData.visitors && detailData.visitors.length}}</label> 人
						<span class="time">{{detailData.visiteTime}}</span>
					</h2>
					<ul class="list">
						<li class="item" v-for="(item, index) in detailData.visitors" :key="index">
							<label class="name">{{item.name}}</label>
							<span>{{item.identificationNumber}}</span>
						</li>
					</ul>
				</div>

				<view class="btn-box u-m-t-40">
					<u-button shape="circle" @click="handleReOrder" v-if="status==='2'">重新预约</u-button>
				</view>
			</div>

			<!-- 未找到预约信息 -->
			<div class="content content-none hide" v-if="status==='3'">
				<img class="pic-top" src="@/static/none.png" alt>
				<h1 class="title">未找到您的预约信息</h1>

				<ul class="list">
					<li class="item">
						<p class="u-m-b-20">请查看您预约的场馆和参观时间是否无误，请点击“查看预约记录”进行查看</p>
						<u-button type="primary" shape="circle" size="medium" @click="handleClick('1')">查看预约记录
						</u-button>
					</li>
					<li class="item">
						<p class="u-m-b-20">若您未在线上进行预约，请点击“我要预约”进行预约后再扫码核验</p>
						<u-button type="primary" shape="circle" size="medium" @click="handleClick('2')">我要预约</u-button>
					</li>
					<li class="item">
						<p class="u-m-b-20">如果您是由他人代预约，请输入预约时您本人的证件号码手动查询</p>
						<u-button type="primary" shape="circle" size="medium" @click="handleClick('3')">点击查询</u-button>
					</li>
				</ul>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: '', // 1 成功 2 过期 3未找到
				detailData: {},
				checkData: {},
				uCode: '' // 博物馆ID加密字符串  故宫 0735BB984DB6DD9C35E7B63241EE86B9 中国国家 5216DCAFDD9F5A18DCC52D0364AD3D75
			}
		},
		onLoad(event) {
			// this.uCode = event.u
			this.uCode = getApp().globalData.codeUrl
			this.status = ''
			
			// if (!this.$store.state.hasLogin) {
			// if (!uni.getStorageSync('userInfo').auth) {
			// 	this.$u.route({
			// 		url: '/pages/login/login'
			// 	})
			// 	return
			// }
			
			this.$store.commit('logout')
			let userInfo = uni.getStorageSync('userInfo') || {};
			if(!userInfo.userId) {
				this.$store.dispatch('getLoginAuth')
					.then(res => {
						console.log(res)
						// 未授权用户信息-跳转登录
						if(!res.auth) {
							this.$store.dispatch('getLoginAuth', 'auth_user')
								.then((res) => {
									this.getData()
								}, (error) => {
									this.$u.route({
										type: 'reLaunch',
										url: '/moduleA/query/query'
									})
								})
							// this.$u.route({
							// 	url: '/pages/login/login'
							// })
						} else {
							this.getData()
						}
					})
			} else {
				// this.getData()
			}
		},
		onShow() {
			
		},
		methods: {
			getData() {
				this.$u
					.post('/check', {
						u: this.uCode,
						userId: uni.getStorageSync('userInfo').userId,
						token: uni.getStorageSync('userInfo').token
					})
					.then(res => {
						this.checkData = res.data
						if (res.code == 200) {
							this.status = '1'
							this.getPersonData(res.data.orderId)
						} else if (res.code == '300023') {
							// 过期
							this.status = '2'
							this.getPersonData(res.data.orderId)
						} else if (res.code == '300022') {
							// 未找到
							this.status = '3'
						} else {
							this.$u.toast(res.msg)
						}
					})
					.catch(res => {
						console.log(res)
					})
			},
			getPersonData(orderId) {
				this.$u
					.post('/detail', {
						id: orderId,
						userId: uni.getStorageSync('userInfo').userId,
						token: uni.getStorageSync('userInfo').token
					})
					.then(res => {
						if (res.success) {
							this.detailData = res.data
						} else {
							this.$u.toast(res.msg)
						}
					})
			},
			handleClick(type) {
				switch (type) {
					case '1':
						this.$u.route({
							url: '/pages/my/my-order'
						})
						break
					case '2':
						this.$u.route({
							url: '/pages/order/order-pre',
							params: {
								id: this.checkData.orgId
							}
						})
						break
					case '3':
						this.$u.route({
							url: '/moduleA/query/search',
							params: { u: this.uCode }
						})
						break
				}
			},
			handleReOrder() {
				this.$u.route({
					url: '/pages/order/order-pre',
					params: {
						id: this.checkData.orgId
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.page-query {
		.pic-top {
			width: 320rpx;
			height: 320rpx;
		}

		.content {
			min-height: 100vh;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 40rpx 32rpx;
			box-sizing: border-box;

			.title {
				font-size: 32rpx;
				color: $u-main-color;
				line-height: 32rpx;
				margin-top: 40rpx;
				margin-bottom: 40rpx;
			}

			.btn-box {
				width: 100%;
			}

			.info {
				padding-bottom: 20rpx;
				width: 100%;
				background: #fff;
				color: $u-content-color;
				font-size: 32rpx;
				box-shadow: 0px 6rpx 20rpx 0px rgba(173, 179, 191, 0.3);
				border-radius: 16rpx;

				.info-title {
					position: relative;
					line-height: 40rpx;
					padding: 14rpx 40rpx;
					padding-top: 20rpx;
					border-bottom: dashed 2rpx $u-border-color;

					.num {
						font-size: 60rpx;
					}

					.time {
						position: absolute;
						right: 40rpx;
						bottom: 14rpx;
					}
				}

				.list {
					.item {
						padding: 0 40rpx;
						font-size: 28rpx;
						color: $u-content-color;
						line-height: 72rpx;
						border-bottom: dashed 2rpx $u-border-color;
						display: flex;
						justify-content: space-between;

						.name {
							font-size: 32rpx;
							color: $u-main-color;
						}
					}
				}
			}
		}

		.content-success {
			background: $success;

			&.outtime {
				background: #ffd8ab;
			}
		}

		.content-none {
			background: #809fff;

			.list {
				.item {
					padding: 40rpx 32rpx;
					margin-bottom: 40rpx;
					background: #fff;
					box-shadow: 0px 6rpx 20rpx 0px rgba(173, 179, 191, 0.3);
					border-radius: 16rpx;
					text-align: center;
					font-size: 28rpx;
					color: $u-content-color;
					line-height: 40rpx;
				}
			}
		}
	}
</style>
