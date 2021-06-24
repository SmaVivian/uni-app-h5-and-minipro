import Vue from 'vue'
import App from './App'
import store from './store'
// import request from '@/common/request'
import '@/common/filters'
import uView from "uview-ui";
Vue.use(uView);

// Vue.prototype.$http = request

const prePage = (lastLen) => {
	let len = lastLen || 1
	let pages = getCurrentPages()
	let prePage = pages[pages.length - 1 - len]
	// #ifdef H5
	return prePage
	// #endif
	return prePage.$vm
}

Vue.config.productionTip = false
Vue.prototype.$api = {
	prePage
}

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})

// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

app.$mount()
