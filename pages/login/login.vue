<template>
	<view class="page-login">
		<view class="box">
			<u-avatar src="../../../static/default-head.svg" size="140"></u-avatar>
			<view class="btn-login">
				<button class="g-btn-primary" @click="handleLogin">
					登录
				</button>
				
				<!-- <button class="g-btn-primary"
					open-type="getAuthorize"
					scope="userInfo"
					@getAuthorize="onGetAuthorize"
					@error="onAuthError">
					登录
				</button> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			// 用户信息授权
			handleLogin() {
				this.$store.dispatch('getLoginAuth', 'auth_user')
					.then((res) => {
						uni.navigateBack()
					})
			},
			// 授权成功回调
			onGetAuthorize() {
				my.getOpenUserInfo({
					fail: res => {
						console.log(res);
					},
					success: res => {
						const data = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						console.log('授权成功', data)
						this.$store.commit('login', {
							...uni.getStorageSync('userInfo'),
							userName: data.nickName,
							avatar: data.avatar
						})
						uni.navigateBack()
					},
				});
			},
			// 授权失败回调
			onAuthError(e) {
				console.log('授权失败', e)
				this.$u.toast('授权失败')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-login {
		padding: 40rpx;

		.box {
			text-align: center;

			.btn-login {
				margin-top: 80rpx;
			}
		}
	}
</style>
