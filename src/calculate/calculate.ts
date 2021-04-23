import fetch from '../utils/http-promise'

Component({
  properties: {
    // 小程序环境
    mode: {
      type: String,
      value: 'development'
    },
    // 产品特色 是否展示（组件自带）
    productFeatureShow: {
      type: Boolean,
      value: true
    },
    // 产品特色 是否展示（用户提供）
    productFeatureCustom: {
      type: Boolean,
      value: false
    },
    // 产品特色 浮层高度
    productFeatureContentHeight: {
      type: String,
      value: '90%'
    },
    // 产品特色 关闭按钮控制
    productFeatureCloseable: {
      type: Boolean,
      value: false
    },
    // 用户userUuid
    uuid: {
      type: String
    },
    // 产品id
    productId: {
      type: Number,
      optionalTypes: [String],
      required: true
    },
    // 直播间的 uuid
    meetingUuid: {
      type: String,
      optionalTypes: [Number],
      required: true
    },
    // 微信token
    wechatToken: {
      type: String,
      optionalTypes: [Number],
      required: true
    },
    // 订单ID number
    preorderId: {
      type: Number,
      optionalTypes: [String],
      required: true
    },
    // 微信appId
    wechatAppId: {
      type: String,
      optionalTypes: [Number],
      required: true
    },
    // 邀请人的appId
    appId: {
      type: String,
      optionalTypes: [Number],
      required: true
    },
    // header 整体控制
    showHeader: {
      type: Boolean,
      value: false
    },
    // 关闭按钮控制
    closeable: {
      type: Boolean,
      value: false
    },
    // 标题名称
    title: {
      type: String,
      value: undefined
    }
  },
  data: {
    getCalculateApi: '/api/product/ability/calculate', // 试算API
    getProductInfoApi: '/api/product/data/getProductInfo', // 产品信息API
    getProductContentApi: '/api/product/data/getProductContent', // 产品特色API
    submitCalculateApi: '/api/product/ability/submitCalculate', // 试算数据提交API，获取
    widgets: undefined, // 试算因子集合
    total_premium: 0, // 预计保费
    showPopup: false, // 产品特色半浮层控制
    productInfo: undefined, // 产品信息保存字段
    content: undefined, // 产品特色保存字段
    customStyle: '', // 产品特色半浮层高度定义
    observerIndex: 0 // 数据监听器
  },
  observers: {
    observerIndex() {
      this.reCalculate()
    }
  },
  lifetimes: {
    attached() {
      console.log('insure-component:1:attached')
      // 初始化参数
      this.init()
      let url = ''
      if (this.properties.uuid) {
        url += `?userUuid=${this.properties.uuid}`
      }
      if (this.properties.appId) {
        if (url.indexOf('?') > -1) {
          url += `&appId=${this.properties.appId}`
        } else {
          url += `?appId=${this.properties.appId}`
        }
      }
      const productInfoParams = {
        url: `${this.data.getProductInfoApi}${url}`,
        data: {
          productId: this.properties.productId
        },
        method: 'POST',
        mode: this.properties.mode
      }
      // 获取产品信息
      this.getProductInfo(productInfoParams)
      const params = {
        url: `${this.data.getCalculateApi}${url}`,
        data: {
          current_data: null,
          product_id: this.properties.productId,
          scenario: 'miniProgram'
        },
        method: 'POST',
        mode: this.properties.mode
      }
      // 获取试算信息
      this.calculate(params)
    }
  },
  methods: {
    init() {
      const props = this.properties
      this.setData({
        customStyle: 'height:' + props.productFeatureContentHeight,
        productId: props.productId,
      })
    },
    // 事件处理：投保申请
    applyInsure() {
      const currentData = []
      this.data.widgets.forEach(item => {
        if (item.index === undefined) {
          currentData.push(item.current)
        } else if ((item.index || Number(item.index) === 0) && item.type !== 'input_number_range') {
          const temp = JSON.parse(JSON.stringify(item.current))
          temp.v = item.opts[item.key][item.index].value
          currentData.push(temp)
        } else {
          currentData.push(item.current)
        }
      })
      this.submitCalculate(currentData)
    },
    submitCalculate(currentData) {
      // if (!this.properties.uuid) {
      //   wx.showToast({
      //     title: '请求参数有误：no uuid',
      //     icon: 'none',
      //     duration: 3000
      //   })
      //   return
      // }
      if (!this.properties.productId) {
        wx.showToast({
          title: '请求参数有误：no productId',
          icon: 'none',
          duration: 3000
        })
        return
      }
      if (!this.properties.meetingUuid) {
        wx.showToast({
          title: '请求参数有误：no meetingUuid',
          icon: 'none',
          duration: 3000
        })
        return
      }
      if (!this.properties.wechatToken) {
        wx.showToast({
          title: '请求参数有误：no wechatToken',
          icon: 'none',
          duration: 3000
        })
        return
      }
      if (!this.properties.wechatAppId) {
        wx.showToast({
          title: '请求参数有误：no wechatAppId',
          icon: 'none',
          duration: 3000
        })
        return
      }
      if (!this.properties.preorderId) {
        wx.showToast({
          title: '请求参数有误：no preorderId',
          icon: 'none',
          duration: 3000
        })
        return
      }
      if (!this.properties.appId) {
        wx.showToast({
          title: '请求参数有误：no appId',
          icon: 'none',
          duration: 3000
        })
        return
      }
      // 检验输入框
      let errMsg
      for (let i = 0, l = this.data.widgets.length; i < l; i++) {
        const item = this.data.widgets[i]
        const minValue = item.minValue
        const maxValue = item.maxValue
        const v = Number(item.current.v)
        const unit = '份'
        if ((minValue || minValue === 0) && maxValue && v) {
          if ((minValue && v < minValue) || (maxValue && v > maxValue)) {
            errMsg = `${minValue}${unit}起购，最多购买${maxValue}${unit}`
            break
          }
        }
        errMsg = ''
      }
      if (errMsg) {
        wx.showToast({
          title: errMsg,
          icon: 'none',
          duration: 3000
        })
        return
      }

      let url = ''
      if (this.properties.uuid) {
        url += `?userUuid=${this.properties.uuid}`
      }
      if (this.properties.appId) {
        if (url.indexOf('?') > -1) {
          url += `&appId=${this.properties.appId}`
        } else {
          url += `?appId=${this.properties.appId}`
        }
      }
      const params = {
        url: `${this.data.submitCalculateApi}${url}`,
        data: {
          current_data: currentData,
          product_id: this.properties.productId,
          meetingUuid: this.properties.meetingUuid,
          wechatToken: this.properties.wechatToken,
          wechatAppId: this.properties.wechatAppId,
          preorderId: this.properties.preorderId
        },
        method: 'POST',
        mode: this.properties.mode
      }
      fetch.request(params)
        .then(res => {
          if (res) {
            const params = {
              current_data: currentData,
              total_premium: this.data.total_premium,
              status: 'ok'
            }
            this.triggerEvent('applyInsure', params)
          } else {
            const params = {
              err: res,
              status: 'fail'
            }
            this.triggerEvent('applyInsure', params)
          }
        })
        .catch(err => {
          wx.showToast({
            title: (err.data && err.data.msg) || '接口出错',
            icon: 'none',
            duration: 3000
          })
        })
    },
    // 防抖 + 监听
    debounce(method, context, delay, cpWidgets, currTarget) {
      clearTimeout(method.id)
      method.id = setTimeout(function () {
        method.call(context, cpWidgets, currTarget)
      }, delay || 300)
    },
    observerData(cpWidgets, currTarget = {}) {
      if (currTarget.cal_key) { // 试算
        this.setData({
          widgets: cpWidgets,
          observerIndex: this.data.observerIndex + 1
        })
      } else {
        this.setData({
          widgets: cpWidgets
        })
      }
    },
    // 事件处理：点击选择tab
    bindSelectChange(e) {
      // console.log('select发送选择改变，携带值为', e)
      const cpWidgets = JSON.parse(JSON.stringify(this.data.widgets))
      const currTarget = e.currentTarget.dataset.item || e.target.dataset.item
      const currClickItem = e.currentTarget.dataset.it || e.target.dataset.it
      let orginTarget
      if (currTarget.duty) {
        orginTarget = cpWidgets.find(item => item.riskCode === currTarget.riskCode &&
          item.key === currTarget.key &&
          item.duty === currTarget.duty)
      } else {
        orginTarget = cpWidgets.find(item => item.riskCode === currTarget.riskCode &&
          item.key === currTarget.key)
      }
      orginTarget.current.v = currClickItem.value
      // 试算
      const self = this
      this.debounce(self.observerData, self, undefined, cpWidgets, currTarget)
    },
    // 事件处理：半浮层选择
    bindPickerChange(e) {
      const cpWidgets = JSON.parse(JSON.stringify(this.data.widgets))
      const currTarget = e.currentTarget.dataset.item || e.target.dataset.item
      const orginTarget = cpWidgets.find(item => item.riskCode === currTarget.riskCode &&
        item.key === currTarget.key)
      orginTarget.index = Number(e.detail.value)
      // 试算
      const self = this
      this.debounce(self.observerData, self, undefined, cpWidgets, currTarget)
    },
    // 事件处理：日期
    bindDateChange(e) {
      const cpWidgets = JSON.parse(JSON.stringify(this.data.widgets))
      const currTarget = e.currentTarget.dataset.item || e.target.dataset.item
      const orginTarget = cpWidgets.find(item => item.riskCode === currTarget.riskCode &&
        item.key === currTarget.key)
      orginTarget.current.v = e.detail.value
      // 试算
      const self = this
      this.debounce(self.observerData, self, undefined, cpWidgets, currTarget)
    },
    // input 输入框处理
    inputNumberRangeChange(e) {
      const cpWidgets = this.data.widgets
      const currTarget = e.currentTarget.dataset.item || e.target.dataset.item
      const orginTarget = cpWidgets.find(item => item.riskCode === currTarget.riskCode &&
        item.key === currTarget.key)
      orginTarget.current.v = e.detail.value
      const minValue = orginTarget.minValue
      const maxValue = orginTarget.maxValue
      const v = orginTarget.current.v
      const unit = '份'
      if ((minValue && v < minValue) || (maxValue && v > maxValue)) {
        orginTarget.errorMessage = `${minValue}${unit}起购，最多购买${maxValue}${unit}`
        wx.showToast({
          title: orginTarget.errorMessage,
          icon: 'none',
          duration: 3000
        })
        this.setData({
          total_premium: Number(0).toFixed(2)
        })
      } else {
        orginTarget.errorMessage = ''
        // 试算
        const self = this
        this.debounce(self.observerData, self, undefined, cpWidgets, currTarget)
      }
    },
    // 事件处理：展示产品特色
    showDetailPopup() {
      if (this.properties.productFeatureCustom) {
        this.triggerEvent('onFeatureCustom')
      } else {
        this.init()
        let url = ''
        if (this.properties.uuid) {
          url += `?userUuid=${this.properties.uuid}`
        }
        if (this.properties.appId) {
          if (url.indexOf('?') > -1) {
            url += `&appId=${this.properties.appId}`
          } else {
            url += `?appId=${this.properties.appId}`
          }
        }
        const params = {
          url: `${this.data.getProductContentApi}${url}`,
          data: {
            id: this.properties.productId
          },
          method: 'POST',
          mode: this.properties.mode
        }
        this.getProductContent(params)
      }
    },
    // 事件处理：关闭产品特色
    closeDetailPopup() {
      this.setData({
        showPopup: false
      })
    },
    // 事件处理：关闭当前页，showHeader为true时，可以控制
    closeInsure() {
      this.triggerEvent('closeInsure')
    },
    // 接口处理
    getProductInfo(params) {
      console.log('insure-component:2:getProductInfo', params)
      fetch.request(params)
        .then(res => {
          console.log('insure-component:3:getProductInfo', res)
          this.setData({
            productInfo: res
          })
        })
        .catch(err => {
          wx.showToast({
            title: (err.data && err.data.msg) || '接口出错',
            icon: 'none',
            duration: 3000
          })
        })
    },
    calculate(params) {
      console.log('insure-component:4:calculate', params)
      fetch.request(params)
        .then(res => {
          const data = this.translateData(res)
          console.log('insure-component:5:calculate', data)
          this.setData({
            widgets: data.widgets,
            current_data: data.current_data,
            total_premium: Number(data.total_premium).toFixed(2)
          })
        })
        .catch(err => {
          wx.showToast({
            title: (err.data && err.data.msg) || '接口出错',
            icon: 'none',
            duration: 3000
          })
        })
    },
    reCalculate() {
      wx.showLoading({
        title: '加载中',
      })
      const currentData = []
      this.data.widgets.forEach(item => {
        if (item.index === undefined) {
          currentData.push(item.current)
        } else if ((item.index || Number(item.index) === 0) && item.type !== 'input_number_range') {
          const temp = JSON.parse(JSON.stringify(item.current))
          temp.v = item.opts[item.key][item.index].value
          currentData.push(temp)
        } else {
          currentData.push(item.current)
        }
      })
      let url = ''
      if (this.properties.uuid) {
        url += `?userUuid=${this.properties.uuid}`
      }
      if (this.properties.appId) {
        if (url.indexOf('?') > -1) {
          url += `&appId=${this.properties.appId}`
        } else {
          url += `?appId=${this.properties.appId}`
        }
      }
      const params = {
        url: `${this.data.getCalculateApi}${url}`,
        data: {
          current_data: currentData,
          product_id: this.properties.productId
        },
        method: 'POST',
        mode: this.properties.mode
      }
      fetch.request(params)
        .then(res => {
          const data = this.translateData(res)
          this.setData({
            widgets: data.widgets,
            currentData: data.current_data,
            total_premium: Number(data.total_premium).toFixed(2)
          })
          wx.hideLoading()
        })
        .catch(err => {
          wx.hideLoading()
          wx.showToast({
            title: (err.data && err.data.msg) || '接口出错',
            icon: 'none',
            duration: 3000
          })
        })
    },
    getProductContent(params) {
      fetch.request(params)
        .then(res => {
          const contentOrigin = res.feature.content.replace(/<p>/g, '').replace(/<\/p>/g, '').split('/>')
          let content = ''
          contentOrigin.forEach(item => {
            if (item) {
              content += (item + '/>')
            }
          })
          this.setData({
            content,
            showPopup: true
          })
        })
        .catch(err => {
          wx.showToast({
            title: (err.data && err.data.msg) || '接口出错',
            icon: 'none',
            duration: 3000
          })
        })
    },
    // 数据转换
    translateData(res) {
      const widgets = res.widgets
      const currentData = res.current_data
      this.translateWidgets(widgets, currentData)
      return res
    },
    translateWidgets(widgets, currentData) {
      widgets.forEach(item => {
        let current
        // 增加current字段，保存current_data的数据
        if (item.duty) {
          item.current = current = currentData.find(it => it.k === item.key &&
            it.risk === item.riskCode && item.duty === it.d)
        } else {
          item.current = current = currentData.find(it => it.k === item.key &&
            it.risk === item.riskCode)
        }
        // 自定义输入框
        if (item.type === 'input' && item.opts && item.opts[item.key]) {
          const isNumberRange = item.opts[item.key].some(
            it => it.opt_type === 'number_range'
          )
          if (isNumberRange) {
            item.type += '_number_range'
          }
        }
        switch (item.type) {
          case 'text':
            this.translateText(item)
            break
          case 'select':
            this.translateSelect(item, current)
            break
          case 'calendar':
            this.translateCalendar(item, current)
            break
          case 'input_number_range':
            this.translateInputNumberRange(item, current)
            break
          default:
        }
      })
    },
    translateText(item) {
      item.name = item.opts[item.key][0].name
    },
    translateSelect(item, current) {
      let len = 0
      if (item.opts && item.opts[item.key] && item.opts[item.key].length) {
        len = item.opts[item.key].length
      }
      if (len <= 2) {
        item.type = 'select_checkbox'
      } else {
        item.type = 'select_picker'
        let idx = 0
        if (item.opts && item.opts[item.key] && item.opts[item.key].length) {
          item.opts[item.key].forEach((it, index) => {
            if (it.value === current.v) {
              idx = index
            }
          })
        }
        // 增加index字段，保存用户选项，同时设置默认值
        item.index = idx
      }
    },
    translateInputNumberRange(item, current) {
      const curr = item.opts[item.key].find(
        it => it.opt_type === 'number_range'
      )
      if (curr) {
        const unit = '份'
        item.showInput = true
        if (curr.value && curr.value.split('-')) {
          item.minValue = Number(curr.value.split('-')[0])
          item.maxValue = Number(curr.value.split('-')[1])
          item.tip = `${curr.value.split('-')[0]}${unit}起购，最多购买${curr.value.split('-')[1]}${unit}`
        }
        if (curr.step_length) {
          item.step = Number(curr.step_length)
        }
        item.unit = unit
        item.errorMessage = ''
        if (item.current) {
          item.current.v = current.v
        } else {
          item.current = {}
          item.current.v = current.v
        }
      }
      item.index = 0
    },
    translateCalendar(item, current) {
      // 增加current字段，保存currentData的数据
      item.current = current
    }
  }
})
