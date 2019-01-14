// pages/selsetType/selsetType.js
const app = getApp()
Page({

  data: {
    showView: false,
    codebtn: true,
    codetime: 60, 
  },
  onLoad(options) {
    const lecturerInfo = app.data.lecturerInfo;
    if (lecturerInfo.state == 1) {
      this.setData({
        showView: true
      })
      app.data.lecturerInfo = {
        data: {
          lecturer: {}
        }
      };
    };
    if (lecturerInfo.state == 2) {
      app.data.lecturerInfo = {
        data: {
          lecturer: {}
        }
      };
    } else if (lecturerInfo.state == 3) {
      if (lecturerInfo.data.lecturer.lecturer_state == 0) {
        if (lecturerInfo.data.lecturer.lecturer_class == 1) {
          wx.redirectTo({
            url: '/pages/teacherCheckIn/index?lecturer_class=1',
          })
        } else if (lecturerInfo.data.lecturer.lecturer_class == 2) {
          wx.redirectTo({
            url: '/pages/teacherCheckIn/index?lecturer_class=2',
          })
        } 
      } else if (lecturerInfo.data.lecturer.lecturer_state == 3) {
        if (lecturerInfo.data.lecturer.lecturer_class == 1) {
          wx.redirectTo({
            url: '/pages/teacherCheckIn/index?lecturer_class=1',
          })
        } else if (lecturerInfo.data.lecturer.lecturer_class == 2) {
          wx.redirectTo({
            url: '/pages/teacherCheckIn/index?lecturer_class=2',
          })
        } 
      };
      
    };
    this.setData({
      lecturerInfo: app.data.lecturerInfo.data.lecturer
    })
  },


  //获取手机号
  gettel(e) {
    var lecturer_phone = e.detail.value
    if ((/^1[34578]\d{9}$/.test(lecturer_phone))) {
      this.setData({
        codebtn: false,
        lecturer_phone: lecturer_phone
      })
    } else if (lecturer_phone.length < 11) {
      this.setData({
        codebtn: true
      })
    }
  },

  //发送验证码
  sendCode() {
    wx.$.fetch('api/sendSmsCode', {
      method: 'post',
      data: {
        phone: this.data.lecturer_phone,
        log_type: 1,
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      if (res.data.state == 200) {
        wx.showToast({
          title: res.data.msg,
        })
        app.data.lecturerInfo = {
          data: {
            lecturer: {
              lecturer_phone: this.data.lecturer_phone
            }
          }
        }

        this.setData({
          getView: false
        })
        var timer = setInterval(() => {
          this.setData({
            codetime: this.data.codetime -= 1
          })
          if (this.data.codetime <= 0) {
            clearInterval(timer)
            this.setData({
              codetime: 60,
            })
          }
        }, 1000)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 获取验证码
  getCode(e) {
    const code = e.detail.value;
    this.setData({
      code: code
    })
  },
  // 提交手机号
  sumTel() {
    const lecturerInfo = this.data.lecturerInfo
    if (this.data.lecturer_phone && this.data.code) {
      wx.$.fetch(`api/validateCode`, {
        method: 'post',
        data: {
          phone: this.data.lecturer_phone,
          code: this.data.code,
          api_token: wx.getStorageSync('token')
        }
      }).then(res => {
        if (res.data.state == 200) {
          wx.showToast({
            title: res.data.msg,
          })
          lecturerInfo.lecturer_phone = this.data.lecturer_phone
          app.data.lecturerInfo.lecturer = lecturerInfo;
          this.setData({
            showView: false,
          })
        } else {
          this.setData({
            lecturer_phone: ''
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    } else {
      this.setData({
        lecturer_phone: ''
      })
      wx.showToast({
        title: '请输入完整',
        icon: 'none'
      })
    }
  },

  selectType(e) {
    app.data.lecturerInfo = {
      data: {
        lecturer: {
          lecturer_class: e.currentTarget.dataset.type,
        }
      }
    }
    wx.navigateTo({
      url: '/pages/teacherCheckIn/index?lecturer_class=' + e.currentTarget.dataset.type,
    })
  }
  
})