// pages/login/login.js
Page({
  data: {
    wxData: {}
  },
  onShow() {
    this.wxlogin()
  },
  wxlogin() {
    let that = this
    wx.login({
      success: res => {
        const code = res.code;
        let wxData = that.data.wxData
        wxData.code = code
        that.setData({
          wxData: wxData
        })
      },
    })
  },
  getUserInfo (e) {
    var data = e.detail;
    let that = this
    if (this.data.wxData.code) {
      let wxData = this.data.wxData
      wxData.iv = data.iv
      wxData.encryptedData = data.encryptedData
      wx.$.login(wxData)
    } else {
      wx.login({
        success: res => {
          const code = res.code;
          let wxData = that.data.wxData
          wxData.code = code
          that.setData({
            wxData: wxData
          })
          that.getUserInfo(e)
        },
      })
    }
  }
})