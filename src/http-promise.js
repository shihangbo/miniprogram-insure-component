
const deBvaseUrl = 'https://insurance2a-api.wyins.net.cn'
class HTTP {
  request({
    url, data = {}, header = {}, method = 'GET'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, data, header, method, resolve, reject)
    })
  }

  _request(url, data, header, method, resolve, reject) {
    console.log(this)
    wx.request({
      url: `${deBvaseUrl + url}`,
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
