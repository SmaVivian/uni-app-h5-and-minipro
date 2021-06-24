<template>
	<!-- 我的预约 -->
	<view class="page-my-order">
		<view class="page-myorder">
			<view class="box-bor">
				<view class="list-parent">
					<view v-for="(item, index) in dataList" :key="index">
						<view class="list u-m-b-40">
							<view class="item" v-for="(child, i) in item.visitors" :key="'child'+i">
								<!-- 0-手动取消 1-待参观 2-已参观 3-已过期 -->
								<image class="status" v-if="item.orderStatus==='1'" src="@/static/status-1.png"
									mode="aspectFill"></image>
								<image class="status" v-if="item.orderStatus==='2'" src="@/static/status-2.png"
									mode="aspectFill"></image>
								<image class="status" v-if="item.orderStatus==='3'" src="@/static/status-3.png"
									mode="aspectFill"></image>
								<image class="status" v-if="item.orderStatus==='0'" src="@/static/status-4.png"
									mode="aspectFill"></image>
								<view class="bg-box">
									<image class="pic left-bg" src="@/static/semicircle.png" mode="aspectFill"></image>
									<image class="pic right-bg" src="@/static/semicircle.png" mode="aspectFill"></image>
								</view>
								<view class="name">{{child.name}}</view>
								<view>
									<text>预约场馆：</text>
									{{item.museumName}}
								</view>
								<view>
									<text>参观日期：</text>
									{{item.visiteTime}}
								</view>
								<view>
									<text>证件号码：</text>
									{{child.identificationNumber}}
								</view>
								<view>
									<text>手机号码：</text>
									{{child.phone}}
								</view>
							</view>
							<!-- 取消预约 -->
							<view class="item cancel" v-if="item.orderStatus === '1'" @click="handleCancel(item)">
								<view class="btn-cancel">取消预约</view>
							</view>
						</view>
					</view>
				</view>

				<view class="g-no-data" v-if="dataList && !dataList.length">
					<u-empty text="未找到记录" mode="list"></u-empty>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: null
			}
		},
		onLoad() {
			this.getDataList()
		},
		methods: {
			getDataList() {
				this.$u.get('/myAppoint', {
						userId: this.$store.state.userId,
						token: this.$store.state.token
					})
					.then(res => {
						if (res.success) {
							this.dataList = res.data
						} else {
							this.$u.toast(res.msg)
						}
					})
					.catch(res => {
						console.log(res)
					})
			},
			handleCancel(item) {
				console.log({
					...item
				})
				uni.showModal({
					title: '取消预约',
					content: '当日取消 3 次后当天不可再预约，是否确认取消',
					// cancelColor: '',
					// confirmColor: '',
					success: res => {
						if (res.confirm) {
							this.saveCancel(item)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			saveCancel(item) {
				this.$u
					.post('/cancelAppoint', {
						id: item.id,
						userId: this.$store.state.userId,
						token: this.$store.state.token
					})
					.then(res => {
						if (res.success) {
							this.$u.toast('取消成功')
							this.getDataList()
						} else {
							this.$u.toast(res.msg)
						}
					})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.page-myorder {
		padding: 20rpx 32rpx;

		.box-bor {

			// img.bor {
			//   width: 100%;
			//   height: 14px;
			//   display: block;
			// }
			.list {
				box-shadow: 0 6rpx 20rpx 0 rgba(173, 179, 191, 0.3);

				.item {
					position: relative;
					padding: 60rpx 40rpx;
					font-size: 28rpx;
					color: $u-content-color;
					line-height: 40rpx;
					background: #fff;
					border-bottom: dashed 2rpx $u-border-color;

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

					&:last-child {
						border-bottom: none;

						.bg-box {
							display: none;
						}
					}

					&.cancel {
						padding: 30rpx 0;
						text-align: center;
						font-size: 28rpx;
						color: $u-type-primary;
					}
				}
			}
		}
	}
</style>
