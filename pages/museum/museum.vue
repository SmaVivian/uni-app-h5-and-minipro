<template>
	<view class="page-info">
		<view class="sch">
			<u-search
				:show-action="false"
				placeholder="输入要预约的博物馆名称"
				v-model="queryParams.key"
				@search="handleSearch"
				@clear="queryParams.key=''"></u-search>
		</view>

		<!-- <view class="tabs">
			<u-tabs :list="tabs" :is-scroll="false" :current="tabCurrent" font-size="32" bg-color="transparent" active-color="#000" inactive-color="#333" bar-width="80" @change="changeTab"></u-tabs>
		</view> -->
		<!-- <view class="u-margin-top-20 u-margin-bottom-20">博物馆列表 ？</view> -->
		<view class="list">
			<view class="item" v-for="(item, i) in dataList" :key="i" @click="goDetail(item)">
				<view class="item-con">
					<u-image width="180rpx" height="180rpx" border-radius="10" :src="item.museumUrl"></u-image>
					<view class="info">
						<view>
							<view class="name">{{item.name}}</view>
							<view class="center u-m-t-5">
								<view v-show="item.level">
									<u-tag :text="item.level" type="info" size="mini"></u-tag>
								</view>
								<view class="u-m-l-10" v-show="item.type">
									<u-tag type="info" size="mini" :text="item.type"></u-tag>
								</view>
							</view>
						</view>
						<div class="bottom">
							<span class="num">{{item.appointSum}}人已预约</span>
						</div>
					</view>
				</view>

				<view class="icon-box">
					<u-icon name="arrow-right" color="#1677FF" size="28"></u-icon>
				</view>
			</view>
		</view>
		<u-loadmore :status="loadingType"></u-loadmore>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// tabCurrent: 0,
				// tabVal: '展讯',
				// tabs: [{
				// 	name: '展讯'
				// }, {
				// 	name: '活动'
				// }, {
				// 	name: '研究'
				// }, {
				// 	name: '资讯'
				// }],
				dataList: [],
				loadingType: 'loadmore', // loadmore加载前 nomore没有更多了 loading正在加载中
				queryParams: {
					key: '',
					currentPage: 1,
					size: 10,
				},
				totalPage: 0,
			}
		},
		onLoad() {
			this.getDataList()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.dataList = []

			this.queryParams.currentPage = 1
			this.getDataList()
		},
		onReachBottom() {
			if (this.queryParams.currentPage < this.totalPage) {
				this.queryParams.currentPage++
				this.getDataList()
			}
		},
		methods: {
			// changeTab(index) {
			// 	this.tabCurrent = index
			// 	this.tabVal = this.tabs[index].name

			// 	this.dataList = []
			// 	this.queryParams.currentPage = 1
			// 	// this.loadingType = 'loading'
			// 	this.getDataList()
			// },
			goDetail(item) {
				this.$u.route({
					url: '/pages/order/order-pre',
					params: {
						id: item.id
					}
				})
			},
			handleSearch() {
				this.dataList = []
				this.queryParams.currentPage = 1
				this.getDataList()
			},
			getDataList(operate) {
				this.loadingType = 'loading'

				this.$u.get('/museumList', {
						...this.queryParams,
					})
					.then(res => {
						uni.stopPullDownRefresh()
						if(res.success) {
							let data = res.data
							this.totalPage = res.totalPage
							this.loadingType = this.queryParams.currentPage < this.totalPage ? 'loadmore' : 'nomore'
							this.dataList = this.dataList.concat(data)
						} else {
							this.loadingType = 'loadmore'
							this.$u.toast(res.msg)
						}
					})
					.catch(err => {
						this.loadingType = 'loadmore'
						this.$u.toast('服务器异常')
					})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-info {
		padding: 20rpx;

		.list {
			.item {
				display: flex;
				align-items: center;
				padding: 20rpx;
				margin-top: 20rpx;
				box-shadow: 0px 6rpx 20rpx 0px rgba(173, 179, 191, 0.3);
				border-radius: 16rpx;

				.item-con {
					flex: 1;
					display: flex;
				}

				.info {
					width: 100%;
					padding-left: 20rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					flex: 1;
					font-size: 34rpx;
					color: #000;

					.center {
						display: flex;
					}

					.bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.num {
							font-size: 24rpx;
							color: $u-tips-color;
						}
					}
				}
			}
		}
	}
</style>
