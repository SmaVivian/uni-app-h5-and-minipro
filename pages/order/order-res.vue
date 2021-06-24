<template>
	<view class="page-order-res">
		<!-- 成功 -->
		<view class="content-success" v-if="pageType==='1'">
			<view class="header">
				<u-image width="200rpx" height="200rpx" src="@/static/success.png"></u-image>
				<view class="head-txt">
					<view class="title">预约成功</view>
					<view class="des">请在约定时间前往博物馆参观，若需取消预约，请提前 2 小时在我的“预约记录”中取消</view>
				</view>
			</view>

			<view class="content">
				<view class="box-bor">
					<view class="list">
						<view class="item" v-for="(item, index) in detailData.visitors" :key="index">
							<image class="status" v-if="detailData.orderStatus==='1'" src="@/static/status-1.png"
								mode="aspectFill"></image>
							<image class="status" v-if="detailData.orderStatus==='2'" src="@/static/status-2.png"
								mode="aspectFill"></image>
							<image class="status" v-if="detailData.orderStatus==='3'" src="@/static/status-3.png"
								mode="aspectFill"></image>
							<image class="status" v-if="detailData.orderStatus==='0'" src="@/static/status-4.png"
								mode="aspectFill"></image>
							<view class="bg-box" v-show="index+1<detailData.visitors.length">
								<image class="pic left-bg" src="@/static/semicircle.png" mode="aspectFill"></image>
								<image class="pic right-bg" src="@/static/semicircle.png" mode="aspectFill"></image>
							</view>
							<h2 class="name">{{item.name}}</h2>
							<view>
								<text>预约场馆：</text>
								{{detailData.museumName}}
							</view>
							<view>
								<text>参观日期：</text>
								{{detailData.visiteTime}}
							</view>
							<view>
								<text>证件号码：</text>
								{{item.identificationNumber}}
							</view>
							<view>
								<text>手机号码：</text>
								{{item.phone}}
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="footer">
				<u-button type="primary" shape="circle" @click="goMyOrder">查看预约记录</u-button>
			</view>
		</view>

		<!-- 失败 -->
		<view class="content-fail" v-if="pageType==='2'">
			<view class="content">
				<u-image width="274rpx" height="240rpx" src="@/static/fail.png"></u-image>
				<view class="title">余票不足</view>
				<view class="des">当前余票不足，无法预约，请更改参观日期或时段后重新提交预约，若您提交的预约订单中包含多个参观人，也可删减参观人后再尝试</view>
			</view>

			<view class="footer">
				<u-button type="primary" shape="circle" @click="handleReOrder">重新预约</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageType: '',
				orderId: '', // 39
				detailData: {}
			}
		},
		onLoad(event) {
			this.pageType = event.pageType
			this.orderId = event.orderId

			if (event.pageType === '1') {
				this.getDetailData()
			}
		},
		methods: {
			getDetailData() {
				this.$u
					.post('/detail', {
						id: this.orderId,
						userId: this.$store.state.userId,
						token: this.$store.state.token
					})
					.then(res => {
						if (res.success) {
							this.detailData = res.data
						} else {
							this.$u.toast(res.msg)
						}
					})
			},
			handleReOrder() {
				uni.navigateBack()
			},
			goMyOrder() {
				this.$u.route({
					url: '/pages/my/my-order'
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.page-order-res {
		.content-success {
			.header {
				display: flex;
				padding: 40rpx 60rpx 100rpx;
				background: $success;

				.head-txt {
					flex: 1;
					padding-left: 40rpx;
					font-size: 24rpx;
					color: #fff;
					line-height: 34rpx;

					.title {
						font-size: 48rpx;
						line-height: 66rpx;
						margin-bottom: 8rpx;
					}

					.des {
						text-align: justify;
					}
				}
			}

			.content {
				margin-top: -60rpx;
				padding: 0 40rpx 60rpx;

				.box-bor {
					padding: 12rpx 12rpx 0;
					background: url(@/static/bg-top1.png) top center no-repeat;
					background-size: 100% 20rpx;

					// img.bor {
					// 	width: 100%;
					// 	height: 28rpx;
					// 	display: block;
					// }

					.list {
						box-shadow: 0 6rpx 20rpx 0px rgba(173, 179, 191, 0.3);

						.item {
							position: relative;
							padding: 60rpx 40rpx;
							font-size: 28rpx;
							color: $u-content-color;
							line-height: 40rpx;
							background-color: #fff;
							border-bottom: dashed 2rpx $border;

							&:first-child {
								background: #fff url(@/static/bg-border.png) top center no-repeat;
								// background-image: url(@/static/bg-border.png);
								// background-position: top center;
								// background-repeat: no-repeat;
								background-size: 100% 20rpx;
							}

							&:last-child {
								border-bottom: none;
							}

							.status {
								position: absolute;
								width: 140rpx;
								height: 140rpx;
								right: 0;
								top: 0;
							}

							.name {
								font-size: 32rpx;
								color: $u-main-color;
								margin-bottom: 16rpx;
							}

							.bg-box {
								.pic {
									width: 60rpx;
									height: 80rpx;
									position: absolute;
									bottom: -40rpx;
									z-index: 2;

									&.left-bg {
										left: -24rpx;
									}

									&.right-bg {
										right: -24rpx;
										transform: rotate(180deg);
									}
								}
							}
						}
					}
				}
			}

			.footer {
				position: relative;
				padding-top: 0;
			}
		}

		.content-fail {
			.content {
				padding: 60rpx 90rpx 50rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 24rpx;
				color: $u-content-color;
				line-height: 34rpx;

				.title {
					margin-top: 40rpx;
					margin-bottom: 24rpx;
					font-size: 48rpx;
					line-height: 66rpx;
				}

				.des {
					text-align: justify;
				}
			}
		}

		.footer {
			padding: 40rpx 32rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			box-sizing: border-box;
		}
	}
</style>
