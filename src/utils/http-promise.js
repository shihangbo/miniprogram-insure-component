
const devBaseUrl = 'https://insurance2a-api.wyins.net.cn'
const proBaseUrl = 'https://insurance2a-api.wyins.net'
// const accountInfo = wx.getAccountInfoSync()
// const env = accountInfo.miniProgram.envVersion
// const BASE_URL = env === 'release' ? proBaseUrl : devBaseUrl
class HTTP {
  request({
    url, data = {}, header = {}, method = 'GET', mode
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, data, header, method, resolve, reject, mode)
    })
  }

  _request(url, data, header, method, resolve, reject, mode) {
    console.log(this, 'mode: ', mode)
    wx.request({
      url: `${(mode === 'development' ? devBaseUrl : proBaseUrl) + url}`,
      data,
      header,
      method,
      success: (res) => {
        const data = res.data
        if (data.code !== undefined && data.code === 200) {
          resolve(data.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  }
}

export default new HTTP()
