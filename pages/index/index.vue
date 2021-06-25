<template>
	<view class="page-info">
		<!-- <u-swiper :list="list" height="300"></u-swiper> -->
		<u-swiper :list="list" :effect3d="true" height="300" :autoplay="false"></u-swiper>
		
		<u-grid :col="3" class="model-box u-m-t-40">
			<u-grid-item bg-color="transparent" v-for="(item, i) in menus" @click="goDetail(i)">
				<u-icon name="photo" :size="46"></u-icon>
				<view class="grid-text">{{item}}</view>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
				menus: ['博物馆列表', '瀑布流', '登录', '', '', '']
			}
		},
		onLoad() {
			this.getDataList()
		},
		methods: {
			goDetail(item) {
				switch(item) {
					case 0:
						this.$u.route({
							url: '/pages/museum/museum'
						})
						break
					case 1:
						this.$u.route({
							url: '/pages/list/list'
						})
						break
					case 2:
						this.$u.route({
							url: '/pages/login/login'
						})
						break
				}
				// this.$u.route({
				// 	url: '/pages/order/order-pre',
				// 	params: {
				// 		id: item.id
				// 	}
				// })
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
		
		.model-box {
			background: #f5f5f5;
			.u-grid-item {
				height: 200rpx;
				box-sizing: border-box;
				padding: 20rpx 10px;
				/deep/ .u-grid-item-box {
					background-color: #fff;
				}
			}
			.grid-text {
				font-size: 28rpx;
				margin-top: 4rpx;
				color: $u-type-info;
			}
		}
	}
</style>
