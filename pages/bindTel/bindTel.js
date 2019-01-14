// pages/login/login.js
Page({
  data: {
  },
  onShow() {
    this.getCode()
  },
  getCode() {
    wx.login({
      success: res => {
        const code = res.code;
        this.setData({
          code: code
        })
      },
    })
  },
  
  getPhoneNumber(e) {
    var data = e.detail;
    let that = this
    if (this.data.code) {
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
      } else {
        let data = e.detail
        data.iv = encodeURIComponent(data.iv)
        data.code = this.data.code
        this.postTel(data)
      }
    } else {
      wx.login({
        success: res => {
          const code = res.code;
          let data = e.detail
          data.iv = encodeURIComponent(data.iv)
          data.code = this.data.code
          that.postTel(e)
        },
      })
    }
      
  },
  postTel(data) {
    wx.$.fetch('api/getPhone',{
      method: 'post',
      data: data
    }).then(res => {
      console.log(res.data)
      if(res.data.status == 200) {
        wx.switchTab({
          url: '/pages/home/home',
        })
      }
    })
  }
})