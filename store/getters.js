const getters = {
	// headerShow: state => state.app.headerShow,
	// defaultImg: state => state.app.defaultImg,
	// defaultHeadImg: state => state.app.defaultHeadImg,

	token: state => state.user.token,
	userInfo: state => state.user.userInfo,
	loginStatus: state => state.user.loginStatus
}
export default getters
