<template>
	<!-- 我的联系人 -->
	<view class="page-person-list" :class="{'g-wrap-has-foot': source=='1'}">
		<view class="list">
			<view class="add-box u-m-b-20">
				<u-button type="primary" plain shape="circle" @click="add('add')">
					<u-icon class="u-margin-right-10" name="plus"></u-icon> 新增联系人
				</u-button>
			</view>

			<view class="item u-border-bottom" v-for="(item, index) in personList" :key="index" @click="toggleCheck(item)">
				<view class="person-wrap">
					<view class="title-box">
						<text class="person">{{item.name}}</text>
					</view>
					<view class="info-box u-m-t-10">
						<text>证件号码：{{item.identificationNumber}}</text>
					</view>
				</view>
				
				<u-icon :name="item.checked?'checkmark-circle-fill':'checkmark-circle'"
					:color="item.checked?'#2979ff':'#999999'"
					size="40"
					v-if="source=='1'"></u-icon>

				<view class="u-type-primary" @click.stop="dele(item)" v-if="source!=='1'">
					<u-icon name="close-circle" size="40" color="#6D7278"></u-icon>
				</view>
				<!-- <view class="u-type-primary" @click.stop="add('edit', item)">
					<u-icon name="bianji" custom-prefix="custom-icon" size="40" color="#2979ff"></u-icon>
				</view> -->
			</view>
		</view>

		<view class="g-footer-box" v-if="source=='1'">
			<u-button type="primary" shape="circle" @click="sure">确定</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				source: '',
				personList: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				preIdArr: []  // 上一个(预约)页面已添加的人员
			}
		},
		onLoad(event) {
			this.source = event.source // 1 从预约页面而来
			this.preIdArr = event.ids && event.ids.split(',') || []
			this.getDataList()
		},
		methods: {
			getDataList() {
				this.$u.post('/myVisitor', {
						userId: this.$store.state.userId,
						token: this.$store.state.token
					})
					.then(res => {
						this.personList = res.data

						if (this.source == 1) {
							// console.log(11, this.$api.prePage()) // 下一个页面调用这个方法时实际上得到的是该页面实例
							// console.log(22, this.$api.prePage(2).orderPersonList)  // 应该用此方法
							// 从预约页面而来 带入人员
							// let arr = this.$api.prePage(2).orderPersonList
							if (this.preIdArr.length) {
								this.personList.forEach(it => {
									this.$set(it, 'checked', false)
								})
								this.preIdArr.forEach(item => {
									this.personList.forEach(it => {
										if (it.id == item) {
											this.$set(it, 'checked', true)
										}
									})
								})
							}
						}
					})

			},
			add(type, item) {
				if (type === 'edit') {
					this.$u.route({
						url: '/pages/my/person-add',
						params: {
							type: type,
							data: JSON.stringify(item)
						}
					})
				} else {
					this.$u.route({
						url: '/pages/my/person-add',
						params: {
							type: type
						}
					})
				}
			},
			dele(item) {
				uni.showModal({
					title: '是否确认删除联系人？',
					// content: '是否确认删除联系人？',
					// cancelColor: '',
					// confirmColor: '',
					success: res => {
						if (res.confirm) {
							this.sendDele(item)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			sendDele(item) {
				this.$u.post('/deleteVisitor', {
						id: item.id,
						userId: this.$store.state.userId,
						token: this.$store.state.token
					})
					.then(res => {
						if(res.success) {
							this.$u.toast('删除成功')
							this.getDataList()
						} else {
							this.$u.toast(res.msg)
						}
					})
			},
			//添加或修改成功之后回调
			refreshList(data, type) {
				console.log(data, type);
				this.getDataList()

				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				// this.personList.unshift(data);
			},
			toggleCheck(item) {
				if (item.checked) {
					this.$set(item, 'checked', !item.checked)
				} else {
					let selPersonList = this.personList.filter(item => item.checked)
					if (!item.checked && selPersonList.length === 3) {
						this.$u.toast(`最多选择3人`)
						return
					}
					this.$set(item, 'checked', !item.checked)
				}
				this.preIdArr = this.personList.filter(item => item.checked).map(it => it.id)
			},
			sure() {
				let selPersonList = this.personList.filter(item => item.checked)

				if (this.source == 1) {
					this.$api.prePage().orderPersonList = selPersonList
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-person-list {
		padding: 20rpx 0 40rpx;
		.list {
			.item {
				display: flex;
				align-items: center;
				padding: 20rpx 32rpx;
				background: #fff;
				position: relative;

				.person-wrap {
					display: flex;
					flex-direction: column;
					flex: 1;
					color: $u-content-color;
					font-size: 28rpx;

					.title-box {
						display: flex;
						align-items: center;

						.person {
							color: $u-main-color;
						}
					}
				}
			}
		}

		.add-box {
			padding: 0 32rpx;
		}
	}
</style>
