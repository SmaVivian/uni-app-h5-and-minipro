<template>
	<view class="page-order g-wrap-has-foot">
		<view class="header">
			<!-- <u-image height="170rpx" src="@/static/top1.png"></u-image> -->
			<view class="info u-type-primary">
				<view class="name u-flex">
					<!-- <u-icon name="huizhanzhongxin" custom-prefix="custom-icon" size="32" color="#2979ff"></u-icon> -->
					<u-image width="32rpx" height="32rpx" src="@/static/icon-museum.svg"></u-image>
					<text class="u-m-l-10">{{museumName}}</text>
				</view>
				<view>
					<u-icon name="clock" size="32" color="#2979ff"></u-icon>
					<!-- <u-icon name="shijian" custom-prefix="custom-icon" size="32" color="#2979ff"></u-icon> -->
					<text class="u-m-l-10">{{currentTime | DateFormat('MM月dd日')}} {{timesStr}}</text>
				</view>
			</view>
		</view>

		<view class="content u-margin-top-20">
			<view class="title">
				参观人信息
				<text class="tit-des">（最多3人）</text>
			</view>
			<view class="list">
				<view class="item u-border-bottom" v-for="(item,index) in orderPersonList" :key="index">
					<text class="name u-line-1">{{item.name}}</text>
					<text class="code">{{item.identificationNumber}}</text>
					<view class="btns">
						<u-icon name="close-circle" size="40" color="#6D7278" @click="dele(index)"></u-icon>
						<!-- <i class="btn btn-dele" @click="dele(index)"></i> -->
					</view>
				</view>
			</view>
			<view class="u-text-center u-margin-top-20" v-if="orderPersonList.length<3">
				<u-button type="primary" plain shape="circle" size="medium" @click="handleClick">
					<u-icon class="u-margin-right-10" name="plus"></u-icon> 添加参观人
				</u-button>
				<!-- <view class="tips u-margin-top-20">请确保姓名、证件号填写正确</view> -->
			</view>
		</view>

		<view class="promise-box u-margin-top-20" v-if="orderPersonList.length>0">
			<u-checkbox-group>
				<u-checkbox v-model="isCheck">我承诺以上参观人近14天内未接触过新冠确诊病人或疑似病人，体温在 37.3℃以下，无乏力、干咳、鼻塞、流涕、咽痛、腹泻等症状
				</u-checkbox>
			</u-checkbox-group>
		</view>

		<view class="g-footer-box">
			<u-button type="primary" shape="circle" :disabled="isDisable" :loading="isLoading" @click="submitPre">提交预约
			</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			// 按钮是否禁用
			isDisable() {
				return this.orderPersonList.length < 1 || !this.isCheck
			}
		},
		data() {
			return {
				orderPersonList: [],
				detailId: '',
				museumName: '',
				currentTime: '',
				timesStr: '',
				isCheck: false,
				isLoading: false
			}
		},
		onLoad(event) {
			this.detailId = event.id
			this.museumName = event.museumName
			this.currentTime = event.time
			this.timesStr = event.timesStr
			this.settingTimesId = event.settingTimesId
		},
		methods: {
			handleClick() {
				let idArr = this.orderPersonList.map(item => item.id)
				this.$u.route({
					url: '/pages/my/person-list',
					params: {
						ids: idArr.join(),
						source: 1
					}
				})
			},
			dele(index) {
				this.orderPersonList.splice(index, 1)
			},
			submitPre() {
				// my.getAuthCode({
				// 	scopes: ['scenic_order_auth'], //景区订单指定授权SCOPE，常量，请勿自行修改
				// 	extInfo: {
				// 		bizId: '2021002136687993', //景区订单指定授权APPID，常量，请勿自行修改
				// 		bizType: 'GENERAL_REPLACE' // //景区订单指定业务类型，常量，请勿自行修改
				// 	},
				// 	success: (result) => {
				// 		console.log('2', result)
				// 		// 在result.authCode中获取到authCode即代表用户授权成功或已授权
				// 	},
				// 	fail: (err) => {
				// 		console.log('33', err)
				// 		// 无论用户是否授权成功，都正常进入后续下单流程
				// 	},
				// 	complete: (result) => {
				// 		console.log('44', result)
				// 		// 无论用户是否授权成功，都正常进入后续下单流程
				// 	}
				// });
				this.submit()
			},
			submit() {
				if (this.orderPersonList.length < 1 || !this.isCheck) return
				let arr = this.orderPersonList.map(item => item.id)

				this.isLoading = true
				this.$u
					.post('/apply', {
						orgId: this.detailId, //int	博物馆ID
						appointEntryTime: this.currentTime, //string	预约的哪一天（例如：2020-04-21）
						settingTimesId: this.settingTimesId, //string	时段
						userListStr: JSON.stringify(arr), //游客id "[1,2]"
						userId: this.$store.state.userId,
						token: this.$store.state.token
					})
					.then(res => {
						this.isLoading = false
						if (res.success) {
							this.$u.route({
								url: '/pages/order/order-res',
								params: {
									pageType: '1',
									orderId: res.data
								}
							})
						} else if (res.code == '300011') {
							// 余票不足
							this.$u.route({
								url: '/pages/order/order-res',
								params: {
									pageType: '2'
								}
							})
						} else {
							this.$u.toast(res.msg)
						}
					})
					.catch(() => {
						this.isLoading = false
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-order {
		padding: 20rpx 32rpx;

		.header {
			position: relative;

			.info {
				padding: 32rpx;
				font-size: 28rpx;
				font-weight: 500;
				// color: $u-type-primary;
				line-height: 32rpx;
				box-shadow: 0px 3px 10px 0px rgba(173, 179, 191, 0.3);
				border-radius: 8px;

				.name {
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 20rpx;
				}
			}
		}

		.content {
			padding: 32rpx;
			box-shadow: 0px 6rpx 20rpx 0px rgba(173, 179, 191, 0.3);
			border-radius: 8px;

			.title {
				padding-bottom: 32rpx;
				font-size: 32rpx;
				color: $u-main-color;

				.tit-des {
					font-size: 24rpx;
					color: $u-content-color;
				}
			}

			.list {
				background: #f8f8f8;
				border-radius: 6rpx;

				.item {
					padding: 20rpx;
					position: relative;
					line-height: 72rpx;
					padding-right: 120rpx;
					font-size: 28rpx;
					color: $u-content-color;
					display: flex;
					align-items: center;

					.name {
						display: inline-block;
						width: 160rpx;
						font-size: 32rpx;
						color: $u-main-color;
					}

					.btns {
						position: absolute;
						width: 60rpx;
						right: 20rpx;
						top: 0;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						height: 100%;
						padding: 0 10rpx;
						box-sizing: border-box;
					}
				}
			}

			.tips {
				text-align: center;
				font-size: 24rpx;
				color: $u-tips-color;
			}
		}

		.promise-box {
			/deep/ .u-checkbox {
				align-items: baseline;

				.u-checkbox__label {
					font-size: 28rpx;
					line-height: 40rpx;
					color: #979797;
				}
			}
		}
	}
</style>
