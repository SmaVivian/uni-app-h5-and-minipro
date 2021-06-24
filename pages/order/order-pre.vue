<template>
	<view class="page-order-pre g-wrap-has-foot" :class="{'is-hide': show}">
		<!-- #ifdef MP-ALIPAY -->
		<!-- <button type="default" @click="getAuthCode">
		  获取授权码
		</button>
		
		<button
		  type="primary"
		  open-type="getAuthorize"
		  scope="userInfo"
		  @getAuthorize="onGetAuthorize"
		  @error="onAuthError"
		>
		  会员基础信息授权
		</button> -->

		<!-- <button type="default" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">获取手机号</button> -->
		<!-- #endif -->

		<view class="u-flex">
			<u-image height="400rpx" :src="detailData.museumUrl || '../../../static/default-2.webp'" style="flex: 1;">
			</u-image>
		</view>

		<view class="content">
			<view class="title">
				{{detailData.name || ''}}
			</view>
			<view class="con-body u-border-bottom">
				<view class="tags-box">
					<view class="tags u-flex">
						<view class="tag-it">
							<u-tag :text="detailData.level" type="info" size="mini"></u-tag>
						</view>
						<view class="tag-it">
							<u-tag :text="detailData.type" type="info" size="mini"></u-tag>
						</view>
					</view>
					<view class="phone u-flex" @click="handlePhone" v-if="detailData.appointPhone">
						<!-- <u-icon name="dianhua" custom-prefix="custom-icon" size="32" color="#2979ff"></u-icon> -->
						<!-- <u-image width="32rpx" height="32rpx" src="@/static/icon-phone.svg"></u-image> -->
						<text class="u-m-l-5 u-type-primary">028-87687485</text>
					</view>
				</view>

				<view class="desc-box">
					<view class="time u-m-t-30">
						<u-icon name="clock" size="32" color="#999"></u-icon>
						<!-- <u-icon name="shijian" custom-prefix="custom-icon" size="32" color="#999"></u-icon> -->
						<text class="label">{{detailData.openTime}}</text>
					</view>
					<view class="addr u-m-t-20">
						<view class="addr-l">
							<!-- <u-icon name="didian" custom-prefix="custom-icon" size="32" color="#999"></u-icon> -->
							<u-icon name="map-fill" size="32" color="#999"></u-icon>
							<text class="label">{{detailData.address}}</text>
						</view>
						<view class="btn-map" @click="handleLoc">
							地图
							<u-icon name="arrow-right" size="28"></u-icon>
						</view>
					</view>
				</view>
			</view>

			<view class="tips-wrap">
				<view class="tips-title">预约须知</view>

				<view class="html-detail">
					<!-- <rich-text :nodes="richData"></rich-text> -->
					<u-parse :html="richData"></u-parse>
				</view>
			</view>
		</view>

		<view class="g-footer-box">
			<u-button type="primary" shape="circle" @click="showSheet">免费预约</u-button>
		</view>

		<u-popup v-model="show" mode="bottom" :closeable="true" border-radius="45" close-icon-pos="top-right">
			<view class="sheet-box">
				<view class="date-content">
					<view class="sheet-title">选择参观日期</view>
					<view class="date-box">
						<view class="date-item"
							:class="{'active': item.times===activeItem.times,'gray': item.openState==='0' || (item.openState==='1'&&item.surplusSum<=0)}"
							v-for="(item, index) in dataList" :key="index" @click="handleClickDate(item)">
							<text>{{item.times | DateFormat('MM月dd日')}}</text>
							<text class="u-margin-top-10" v-if="item.openState==='0'">闭馆</text>
							<text class="u-margin-top-10" v-if="item.openState==='1'&&item.surplusSum===0">售罄</text>
							<text class="u-margin-top-10" v-if="item.openState==='1'&&item.surplusSum=== -1">停止入馆</text>
							<text class="u-margin-top-10"
								v-if="item.openState==='1'&&item.surplusSum>0">余{{item.surplusSum}}</text>
						</view>
					</view>

					<view class="sheet-title">选择参观时段</view>
					<view class="date-box date-box2 bottom mb-10">
						<view class="date-item"
							:class="{'active': it.settingTimesId === settingTimesId,'gray': activeItem.openState==='0' || (activeItem.openState==='1'&&it.surplusSum<=0)}"
							v-for="(it, index) in activeItem.sum" :key="index" @click="handleSel(it)">
							<text>{{it.timesStr}}</text>
							<text class="u-margin-top-10" v-if="activeItem.openState==='0'">闭馆</text>
							<text class="u-margin-top-10" v-if="activeItem.openState==='1'&&it.surplusSum===0">售罄</text>
							<text class="u-margin-top-10"
								v-if="activeItem.openState==='1'&&it.surplusSum=== -1">停止入馆</text>
							<text class="u-margin-top-10"
								v-if="activeItem.openState==='1'&&it.surplusSum>0">余{{it.surplusSum}}</text>
						</view>
					</view>
				</view>

				<view class="footer">
					<u-button type="primary" shape="circle" :disabled="!settingTimesId" @click="goOrder">下一步</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailId: '',
				show: false,
				activeItem: {},
				settingTimesId: '', // 时间段id
				timesStr: '', // 时间段字符串
				detailData: {},
				dataList: [],
				richData: ''
			}
		},
		onLoad(event) {
			this.detailData = {}
			this.detailId = event.id
			this.getDetailData()

			// 获取定位
			// uni.getLocation({
			// 	// type: 'wgs84', // 默认  114.30525 30.59276
			// 	type: 'gcj02', // 国测局坐标 可用于 uni.openLocation 的坐标
			// 	success: function(res) {
			// 		console.log('当前位置的经度：' + res.longitude);
			// 		console.log('当前位置的纬度：' + res.latitude);
			// 	}
			// })
		},
		methods: {
			getDetailData() {
				this.$u.get('/museumDetail', {
						id: this.detailId,
					})
					.then(res => {
						if (res.success) {
							uni.setNavigationBarTitle({
								title: res.data.name
							});
							
							this.detailData = res.data
							this.richData = res.data.describe || '<p style="margin-bottom:20rpx;">1.预约时需填写本人真实有效的身份证件（包含儿童）</p>\
					<p style="margin-bottom:20rpx;">2.每个预约订单可预约3人，每张证件号码可预约1人，且每天限约1次</p>\
					<p>3.预约成功后，入馆当天扫码入馆处二维码进行核验，无须换票</p>'
						} else {
							this.$u.toast(res.msg)
						}
					})
			},
			getMuseumTicket() {
				this.$u
					.get('/museumTicket', {
						id: this.detailId
					})
					.then(res => {
						if(res.success) {
							this.dataList = res.data

							if (res.data.length) {
								this.activeItem = res.data.find(item => item.surplusSum > 0) || {}

								this.show = true
							} else {
								this.$u.toast('还未开馆哟，明天再来看吧')
							}
						} else {
							this.$u.toast(res.msg)
						}
					})
			},
			showSheet() {
				if(!this.$store.state.hasLogin) {
					this.$store.dispatch('getLoginAuth', 'auth_user')
						.then((res) => {
							this.getMuseumTicket()
						})
				} else {
					this.getMuseumTicket()
				}
			},
			handleClickDate(item) {
				if (item.surplusSum > 0) {
					this.activeItem = item
					this.settingTimesId = ''
				}
			},
			handleSel(it) {
				if (it.surplusSum > 0) {
					this.settingTimesId = it.settingTimesId
					this.timesStr = it.timesStr
				}
			},
			goOrder() {
				if (!this.settingTimesId) {
					this.$toast('请选择时段')
					return
				}

				// 当前用户当天是否已经提交过预约
				this.$u
					.post('/checkToday', {
						appointEntryTime: this.activeItem.times,
						orgId: this.detailId,
						userId: this.$store.state.userId,
						token: this.$store.state.token
					})
					.then(res => {
						if (res.success) {
							this.show = false
							this.$u.route({
								url: '/pages/order/order',
								params: {
									id: this.detailId,
									time: this.activeItem.times,
									settingTimesId: this.settingTimesId,
									timesStr: this.timesStr,
									museumName: this.detailData.name
								}
							})
						} else {
							this.$u.toast(res.msg)
						}
					})

			},
			// 导航
			handleLoc() {
				uni.openLocation({
					latitude: Number(this.detailData.latitude), //要去的纬度-地址       
					longitude: Number(this.detailData.longitude), //要去的经度-地址
					name: this.detailData.name, //地址名称
					address: this.detailData.address, //详细地址名称
					success: () => {
						console.log('导航成功');
					},
					fail: error => {
						console.log(error)
					}
				})
			},
			// 拨打电话
			handlePhone() {
				uni.makePhoneCall({
					phoneNumber: this.detailData.appointPhone
				})
			},
			// // 授权成功回调
			// onGetAuthorize() {
			// 	my.getOpenUserInfo({
			// 		fail: res => {
			// 			console.log(res);
			// 		},
			// 		success: res => {
			// 			const userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
			// 			console.log(userInfo)
			// 			my.alert({
			// 				content: userInfo,
			// 			});
			// 		},
			// 	});
			// },
			// // 授权失败回调
			// onAuthError(e) {
			// 	console.log('授权失败', e)
			// 	this.$u.toast('授权失败')
			// },
			// // 获取授权码
			// getAuthCode() {
			// 	my.getAuthCode({
			// 		scopes: 'auth_user',
			// 		success: ({
			// 			authCode
			// 		}) => {
			// 			console.log(authCode)
			// 			this.getMuseumTicket()
			// 		},
			// 	});
			// },
			// // 授权手机号
			// decryptPhoneNumber() {
			// 	my.getPhoneNumber({
			// 		scopes: "auth_user",
			// 		success: res => {
			// 			var resData = JSON.parse(res.response);
			// 			console.log('res', resData)
			// 			// 	my.request({
			// 			// 		url: '你的后端服务端',

			// 			// 		data: encryptedData,
			// 			// 	});
			// 		},
			// 		fail: res => {
			// 			this.$u.toast('需要您授权手机号码哦~')
			// 		}
			// 	});
			// },
		}
	}
</script>

<style lang="scss" scoped>
	.page-order-pre {
		&.is-hide {
			overflow: hidden;
		}

		.content {
			.title {
				padding: 30rpx 40rpx;
				font-size: 40rpx;
				border-bottom: dashed 1px $u-border-color;
			}

			.con-body {
				padding: 30rpx 40rpx;

				.tags-box {
					display: flex;
					justify-content: space-between;

					.tags {
						.tag-it {
							margin-right: 10rpx;
						}
					}

					.phone {}
				}

				.desc-box {
					font-size: 28rpx;
					line-height: 40rpx;
					color: $u-main-color;

					.time,
					.addr-l {
						display: flex;
						align-items: baseline;

						.label {
							flex: 1;
							margin-left: 10rpx;
						}
					}

					.addr {
						display: flex;

						.addr-l {
							flex: 1;
							padding-right: 20rpx;
						}

						.btn-map {
							width: 100rpx;
							text-align: right;
							color: $u-type-primary;
						}
					}
				}
			}

			.tips-wrap {
				padding: 30rpx 40rpx;

				.tips-title {
					margin-bottom: 30rpx;
					font-size: 32rpx;
					color: #000;
				}

				.html-detail {
					color: #6D7278;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}

		.sheet-box {
			width: 100%;
			padding-bottom: 40rpx;
			font-size: 28rpx;
			color: $u-content-color;
			background: #fff;

			.date-box {
				margin-left: -20rpx;
				padding: 0 32rpx 40rpx;
				display: flex;
				flex-wrap: wrap;

				.date-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					margin-top: 40rpx;
					margin-left: 20rpx;
					box-sizing: border-box;
					width: 156rpx;
					height: 120rpx;
					border-radius: 16rpx;
					box-shadow: 0rpx 6rpx 20rpx 0rpx rgba(173, 179, 191, 0.3);

					&.active {
						background: $uni-color-primary;
						color: #fff;
					}

					&.gray {
						background: #f0f2f5;
						color: $u-tips-color;
					}
				}

				&.bottom {}
			}

			.date-box2 {
				margin-left: -40rpx;

				.date-item {
					width: 200rpx;
					margin-left: 40rpx;
				}
			}

			.sheet-title {
				padding-left: 30rpx;
				padding-top: 40rpx;
				border-top: dashed 2rpx $u-border-color;
				font-size: 32rpx;
				color: #262628;

				&:first-child {
					border-top: none;
				}
			}

			.footer {
				width: 100%;
				padding: 0 32rpx;
				box-sizing: border-box;
			}
		}
	}
</style>
