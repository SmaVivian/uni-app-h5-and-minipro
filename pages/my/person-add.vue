<template>
	<view class="page-person-add g-wrap-has-foot">
		<u-form :model="form" :rules="rules" ref="uForm" label-width="150">
			<u-form-item label="姓名" prop="name">
				<u-input type="text" placeholder="请填写真实姓名" v-model="form.name" />
			</u-form-item>

			<u-form-item label="手机号" prop="phone" label-width="150">
				<u-input type="text" placeholder="请填写真实手机号" v-model="form.phone" />
			</u-form-item>

			<u-form-item label="证件类型" prop="typeName" label-width="150">
				<view class="sel-txt" @click="selectShow = true">
					<text>{{form.typeName}}</text>
					<u-icon :name="selectShow?'arrow-up':'arrow-down'" size="32" color="#999"></u-icon>
				</view>

				<!-- 支付宝小程序上颜色有问题-禁用的灰色且无法修改 -->
				<!-- <u-input
					type="select"
					placeholder="请选择证件类型"
					:select-open="selectShow"
					v-model="form.typeName"
					@click="selectShow = true" /> -->
			</u-form-item>

			<u-form-item label="证件号码" prop="identificationNumber">
				<u-input type="text" placeholder="请填写真实有效的证件号码" v-model="form.identificationNumber" />
			</u-form-item>
		</u-form>

		<u-select mode="single-column" :list="selectList" :default-value="activeIndex" v-model="selectShow" @confirm="selectConfirm"></u-select>

		<view class="g-footer-box">
			<u-button type="primary" shape="circle" :loading="isLoading" @click="save">保存</u-button>
		</view>
	</view>
</template>

<script>
	import { validCard } from '@/common/util.js'
	export default {
		data() {
			return {
				pageType: '',
				detailId: '',
				selectList: [{
						value: '1',
						label: '身份证'
					},
					{
						value: '2',
						label: '护照'
					},
					{
						value: '3',
						label: '港澳台通行证'
					}
				],
				activeIndex: [0],
				cardItem: {
					value: '1',
					label: '身份证'
				},
				selectShow: false,
				index: 0,
				form: {
					name: '',
					phone: '',
					identificationNumber: '',
					typeName: '身份证'
				},
				rules: {
					name: [{
							required: true,
							message: '请填写真实姓名',
							trigger: 'blur',
						},
						// {
						// 	min: 3,
						// 	max: 5,
						// 	message: '姓名长度在3到5个字符',
						// 	trigger: ['change', 'blur'],
						// },
						// {
						// 	// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						// 	validator: (rule, value, callback) => {
						// 		// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
						// 		return this.$u.test.chinese(value);
						// 	},
						// 	message: '姓名必须为中文',
						// 	// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						// 	trigger: ['change', 'blur'],
						// },
						// 异步验证，用途：比如用户注册时输入完账号，后端检查账号是否已存在
						// {
						// 	trigger: ['blur'],
						// 	// 异步验证需要通过调用callback()，并且在里面抛出new Error()
						// 	// 抛出的内容为需要提示的信息，和其他方式的message属性的提示一样
						// 	asyncValidator: (rule, value, callback) => {
						// 		this.$u.post('/ebapi/public_api/index').then(res => {
						// 			// 如果验证出错，需要在callback()抛出new Error('错误提示信息')
						// 			if(res.error) {
						// 				callback(new Error('姓名重复'));
						// 			} else {
						// 				// 如果没有错误，也要执行callback()回调
						// 				callback();
						// 			}
						// 		})
						// 	},
						// }
					],
					phone: [{
							required: true,
							message: '请填写真实手机号',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					],
					typeName: [{
						required: true,
						message: '请选择证件类型',
						trigger: ['change', 'blur'],
					}],
					identificationNumber: [{
							required: true,
							message: '请填写真实有效的证件号码',
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								if (this.cardItem.value == '1') {
									return validCard(value);
									// return this.$u.test.idCard(value);
								} else {
									let re1 = /^[a-zA-Z]{5,17}$/
									let re2 = /^[a-zA-Z0-9]{5,17}$/
									return re1.test(value) || re2.test(value)
								}
							},
							message: '证件格式错误',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						}
					]
				},
				isLoading: false
			}
		},
		onLoad(event) {
			this.pageType = event.type
			if (event.data) {
				this.form = JSON.parse(event.data)
				console.log(this.form)
				
				this.selectList.find((item, index) => {
					if(item.value === this.form.identificationType) {
						this.cardItem = item
						
						this.form.typeName = item.label
						this.activeIndex = [index]
					}
				})
			} else {
				this.form = {
					name: '',
					phone: '',
					identificationNumber: '',
					typeName: '身份证',
					// name: '张笑笑',
					// phone: '13563214525',
					// identificationNumber: '',
					// typeName: '身份证'
				}
			}
		},
		onReady() {
			// 使用validateFunction需要在onReady中设置规则
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			// 选择证件类型回调
			selectConfirm(e) {
				console.log(e)
				// this.form.typeName = '';
				e.map((val, index) => {
					this.cardItem = val
					this.form.typeName = val.label
					// this.form.typeName += this.form.typeName == '' ? val.label : '-' + val.label;
				})
			},
			// 保存
			save() {
				console.log(this.cardItem)
				console.log(11, this.form)
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过', this.form);

						// this.$api.prePage().refreshList(this.form, this.pageType) // 操作上一个页面方法
						// this.$u.toast(`联系人${this.pageType=='edit' ? '修改': '添加'}成功`)
						this.isLoading = true
						this.$u
							.post('/addVisitor', {
								userId: this.$store.state.userId,
								token: this.$store.state.token,
								...this.form,
								identificationType: this.cardItem.value
							})
							.then(res => {
								this.isLoading = false
								this.$api.prePage().refreshList(this.form, this.pageType) // 操作上一个页面方法
								this.$u.toast(`${this.pageType=='edit' ? '编辑': '新增'}联系人成功`)
								setTimeout(() => {
									uni.navigateBack()
								}, 800)
							})
							.catch(() => {
								this.isLoading = false
							})
					} else {
						console.log('验证失败')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-person-add {
		padding: 20rpx;

		.sel-txt {
			width: 100%;
			display: flex;
			justify-content: space-between;
			/* #ifdef MP-ALIPAY */
			padding-left: 10rpx;
			/* #endif */
		}

		.uni-input {
			height: 36px;
			line-height: 36px;
		}
	}
</style>
