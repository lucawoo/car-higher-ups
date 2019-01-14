// pages/teacherCheckInStatus/index.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: false,
    phone: ''
  },

  
  onLoad: function (options) {
    this.getTel()
    const first = options.first === "false" ? false : true
    this.setData({
      first: first
    })
    if (!first) {
      const lecturerInfo = app.data.lecturerInfo
      if (lecturerInfo.state == 1 || lecturerInfo.state == 2) {
        wx.redirectTo({
          url: '/pages/selsetType/selsetType'
        })
      } else if (lecturerInfo.state == 3) {
        if (lecturerInfo.data.lecturer.lecturer_state == 0) {
          wx.redirectTo({
            url: '/pages/selsetType/selsetType'
          })
        } else {
          this.setData({
            lecturerInfo: lecturerInfo,
          })
        }
      }
    }
  },

  getTel() {
    wx.$.fetch('api/webSetting',{
      method:'post',
      data: {
        api_token: wx.getStorageInfoSync('token'),
        code: 'customer_service_phone'
      }
    }).then(res => {
      this.setData({
        phone: res.data.data.value
      })
    })
  },

  // 重新申请
  replyAgain() {
    wx.redirectTo({
      url: '/pages/selsetType/selsetType'
    })
  },
  contact() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  }

 
  

  
})