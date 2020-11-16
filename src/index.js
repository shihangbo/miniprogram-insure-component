const _ = require('./utils')

Component({
  properties: {
    prop: {
      type: String,
      value: 101972
    },
  },
  data: {
    flag: false,
  },
  lifetimes: {
    attached() {
      wx.getSystemInfo({
        success: () => {
          this.setData({
            flag: _.getFlag(),
          })
        }
      })
    }
  }
})
