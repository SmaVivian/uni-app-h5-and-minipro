<template>
	<!-- 预约查询 -->
	<view class="page-query-search g-wrap-has-foot">
		<div class="header">
			<u-search :show-action="false"
				placeholder="请输入预约时您本人的证件号码"
				v-model="key"
				@search="onSearch"
				@clear="key=''"></u-search>
		</div>

		<div class="content">
			<p class="title" v-if="searchList && searchList.length">您的预约信息如下</p>

			<ul class="res-list">
				<li class="item" v-for="(item, index) in searchList" :key="index">
					<p class="para">
						<span>{{item.museumName}}</span>
						<span class="time">{{item.visiteTime}}</span>
					</p>
					<p class="para des">
						<span>{{item.name}}</span>
						<span class="card">{{item.identificationNumber}}</span>
					</p>
				</li>

				<view class="g-no-data" v-if="searchList && !searchList.length">
					<u-empty text="未找到记录" mode="list"></u-empty>
				</view>
			</ul>
		</div>

		<div class="g-footer-box" v-show="searchList && searchList.length">
			<u-button type="primary" shape="circle" :loading="isLoading" @click="handleEnter"
				v-show="searchList && searchList.length">确认入馆
			</u-button>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				searchList: null,
				isLoading: false,
				uCode: '' // 博物馆ID加密字符串 故宫 0735BB984DB6DD9C35E7B63241EE86B9 中国国家 5216DCAFDD9F5A18DCC52D0364AD3D75
			}
		},
		onLoad(event) {
			this.uCode = event.u    // 5216DCAFDD9F5A18DCC52D0364AD3D75
		},
		methods: {
			onSearch() {
				this.$u
					.post('/search', {
						u: this.uCode,
						key: this.key,
						userId: this.$store.state.userId,
						token: this.$store.state.token
					})
					.then(res => {
						if (res.success) {
							this.searchList = [res.data]
						} else if (res.code == '300022') {
							this.searchList = []
						} else {
							this.$u.toast(res.msg)
						}
					})
			},
			handleEnter() {
				this.isLoading = true
				this.$u
					.post('/sureEntry', {
						u: this.uCode,
						key: this.key,
						userId: this.$store.state.userId,
						token: this.$store.state.token
					})
					.then(res => {
						this.isLoading = false
						if (res.success) {
							this.$u.toast('操作成功')
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
	.page-query-search {
		.header {
			padding: 20rpx 32rpx 0;
		}

		.content {
			padding: 20rpx 32rpx 40rpx;

			.title {
				font-size: 28rpx;
				color: $u-content-color;
				margin-bottom: 20rpx;
			}

			.res-list {
				.item {
					box-shadow: 0 6rpx 20rpx 0 rgba(173, 179, 191, 0.3);
					border-radius: 16rpx;
					margin-bottom: 40rpx;

					.para {
						padding: 20rpx 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 32rpx;
						color: $u-main-color;
						
						.time {
							font-size: 28rpx;
						}
						&.des {
							border-top: dashed 2rpx $u-border-color;

							.card {
								font-size: 28rpx;
								color: $u-content-color;
							}
						}
					}
				}
			}
		}
	}
</style>
