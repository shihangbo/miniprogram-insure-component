const _ = require('../utils/utils')

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
  },
  methods: {
    insureApply(e) {
      console.log(e)
    }
  }
})
