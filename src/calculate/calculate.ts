import fetch from '../http-promise'

Component({
  properties: {
    prop: {
      type: String,
      value: 'other.properties'
    },
  },
  data: {
    name: 'other',
    getCalculateApi: '/api/product/ability/calculate',
    getProductInfoApi: '/api/product/data/getProductInfo',
    getProductContentApi: '/api/product/data/getProductContent',
    uuid: '153cdcf26b66434e94079bca08666678',
    productId: 101972,
    widgets: undefined,
    currentData: undefined,
    index: 0,
    date: '2016-09-01',
    total_premium: 0,
    showPopup: false,
    productInfo: undefined
  },
  lifetimes: {
    attached() {
      const productInfoParams = {
        url: `${this.data.getProductInfoApi}?userUuid=${this.data.uuid}`,
        data: {
          productId: this.data.productId
        },
        method: 'POST'
      }
      this.getProductInfo(productInfoParams)
      const params = {
        url: `${this.data.getCalculateApi}?userUuid=${this.data.uuid}`,
        data: {
          currentData: null,
          product_id: this.data.productId
        },
        method: 'POST'
      }
      this.calculate(params)
    }
  },
  methods: {
    getProductInfo(params) {
      fetch.request(params)
        .then(res => {
          this.setData({
            productInfo: res
          })
        })
        .catch(err => {
          wx.showToast({
            title: err.data.msg || '接口出错',
            icon: 'none',
            duration: 3000
          })
        })
    },
    calculate(params) {
      fetch.request(params)
        .then(res => {
          const data = this.translateData(res)
          this.setData({
            widgets: data.widgets,
            currentData: data.current_data,
            total_premium: Number(data.total_premium).toFixed(2)
          })
        })
        .catch(err => {
          wx.showToast({
            title: err.data.msg || '接口出错',
            icon: 'none',
            duration: 3000
          })
        })
    },
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
        item.current = current = currentData.find(it => it.k === item.key &&
          it.risk === item.riskCode)
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
    translateCalendar(item, current) {
      // 增加current字段，保存currentData的数据
      item.current = current
    },
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
      this.setData({
        widgets: cpWidgets
      })
    },
    bindPickerChange(e) {
      const cpWidgets = JSON.parse(JSON.stringify(this.data.widgets))
      const currTarget = e.currentTarget.dataset.item || e.target.dataset.item
      const orginTarget = cpWidgets.find(item => item.riskCode === currTarget.riskCode &&
        item.key === currTarget.key)
      orginTarget.index = Number(e.detail.value)
      this.setData({
        widgets: cpWidgets
      })
    },
    bindDateChange(e) {
      const cpWidgets = JSON.parse(JSON.stringify(this.data.widgets))
      const currTarget = e.currentTarget.dataset.item || e.target.dataset.item
      const orginTarget = cpWidgets.find(item => item.riskCode === currTarget.riskCode &&
        item.key === currTarget.key)
      orginTarget.current.v = e.detail.value
      this.setData({
        widgets: cpWidgets
      })
    },
    apply() {
      const currentData = []
      this.data.widgets.forEach(item => {
        if (item.index === undefined) {
          currentData.push(item.current)
        } else if (item.index || Number(item.index) === 0) {
          const temp = JSON.parse(JSON.stringify(item.current))
          temp.v = item.opts[item.key][item.index].value
          currentData.push(temp)
        } else {
          currentData.push(item.current)
        }
      })
      console.log('提交数据：', currentData)
    },
    getProductContent(params) {
      fetch.request(params)
        .then(res => {
          const content = res.feature.content.replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/img/g, 'image')

          console.log(1111, content)
          // this.setData({
          //   content,
          //   showPopup: false
          // })
        })
        .catch(err => {
          wx.showToast({
            title: err.data.msg || '接口出错',
            icon: 'none',
            duration: 3000
          })
        })
    },
    showDetailPopup() {
      const params = {
        url: `${this.data.getProductContentApi}?userUuid=${this.data.uuid}`,
        data: {
          id: this.data.productId
        },
        method: 'POST'
      }
      this.getProductContent(params)
    },
    colseDetailPopup() {
      this.setData({
        showPopup: false
      })
    },
    preventTouchMove() {
    },
  }
})
