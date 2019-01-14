const app = getApp()
Page({
  data: {
    agree: true,
    lookPwd: false,
    lookPwd2: false,
  },

  onLoad: function (options) {
    const lecturerInfo = app.data.lecturerInfo;
    this.setData({
      lecturerInfo: lecturerInfo.data.lecturer
    })
  },
  onShow() {
    const lecturerInfo = app.data.lecturerInfo;
    this.setData({
      lecturerInfo: lecturerInfo.data.lecturer
    })
  },
  agreeAgreement() {
    this.setData({
      agree: !this.data.agree
    })
  },

  getTeacher(e) {
    var teacherName = e.detail.value
    const lecturerInfo = this.data.lecturerInfo
    if (teacherName.length >= 3 && teacherName.length <= 36) {
      if (/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(teacherName)) {
        wx.$.fetch('api/checkName', {
          method: 'post',
          data: {
            api_token: wx.getStorageSync('token'),
            user_name: teacherName
          }
        }).then(res => {
          if (res.data.state == 200) {
            wx.showToast({
              title: '用户名可用',
            })
            lecturerInfo.user_name = teacherName
            this.setData({
              lecturerInfo: lecturerInfo
            })
            app.data.lecturerInfo.data.lecturer = lecturerInfo
          } else {
            wx.showModal({
              title: '用户名已存在',
              showCancel: false
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '用户名必须为3-36位的数字和字母的组合！',
          confirmColor: '#00a0e8',
        })
      }
    } else if (teacherName.length == 0) {
      return
    } else {
      wx.showModal({
        title: '提示',
        content: '请按要求长度输入用户名！',
        confirmColor: '#00a0e8',
      })
    }
  },

  getPwd(e) {
    var password = e.detail.value
    const lecturerInfo = this.data.lecturerInfo
    if (password.length > 0 && password.length >= 6 && password.length <= 16) {
      if (/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(password)) {
        this.setData({
          password: password
        })
        lecturerInfo.password = password
      } else {
        wx.showModal({
          title: '提示',
          content: '密码必须为6-16位的数字和字母的组合！',
          confirmColor: '#00a0e8',
        })
      }
    } else if (password.length == 0) {
      return
    } else {
      wx.showModal({
        title: '提示',
        content: '请按要求长度输入密码！',
        confirmColor: '#00a0e8',
      })
    }
  },

  getPwd2(e) {
    var password = e.detail.value
    this.setData({
      password2: password
    })
  },

  lookPwd() {
    this.setData({
      lookPwd: !this.data.lookPwd
    })
  },

  lookPwd2() {
    this.setData({
      lookPwd2: !this.data.lookPwd2
    })
  },

  linkAggree(e) {
    wx.navigateTo({
      url: '/pages/myNews/myNews',
    })
  },

  saveInfo() {
    const lecturerInfo = this.data.lecturerInfo
    
    if (lecturerInfo.skill_area && lecturerInfo.skill_area.length > 0) {
      if (Array.isArray(lecturerInfo.skill_area)) {
        lecturerInfo.skill_area = lecturerInfo.skill_area.join(',')
      }
    } else {
      lecturerInfo.skill_area = ''
    };

    lecturerInfo.lecturer_state = 0
    app.data.lecturerInfo.data.lecturer = lecturerInfo
    this.setData({
      lecturerInfo: lecturerInfo
    })
    wx.$.fetch('api/joinIn', {
      method: 'post',
      data: lecturerInfo
    }).then(res => {
      if (res.data && res.data.state == 200) {
        wx.showToast({
          title: '已保存',
        })
      }
    })
  },

  // 提交
  getAllData(e) {
    // 是否同意协议
    let canNext = true;
    const lecturerInfo = this.data.lecturerInfo;
    if (lecturerInfo.skill_area && lecturerInfo.skill_area.length > 0) {
      if (Array.isArray(lecturerInfo.skill_area)) {
        lecturerInfo.skill_area = lecturerInfo.skill_area.join(',')
      }
    } else {
      lecturerInfo.skill_area = ''
    };
    lecturerInfo.form_id = e.detail.formId;
    lecturerInfo.lecturer_state = 1
    if (!lecturerInfo.user_name) {
      canNext = false;
      wx.showToast({
        title: '请填写登陆账号',
        icon: 'none'
      })
    } else 
    if (!this.data.password) {
      canNext = false;
      wx.showToast({
        title: '请填写登陆密码',
        icon: 'none'
      })
    } else 
    if (this.data.password !== this.data.password2) {
      canNext = false;
      wx.showToast({
        title: '两次密码不一致，请重新填写',
        icon: 'none'
      })
    };
    if (canNext) {
      app.data.lecturerInfo.data.lecturer = lecturerInfo
      this.setData({
        lecturerInfo: lecturerInfo
      })
      if (this.data.agree) {
        wx.$.fetch('api/joinIn', {
          method: 'post',
          data: lecturerInfo
        }).then(res => {
          if (res.data && res.data.state == 200) {
            wx.showToast({
              title: res.data.msg,
            })
            wx.reLaunch({
              url: '/pages/teacherCheckInStatus/index?first=true',
            })
          }
        })
      } else {
        wx.showToast({
          title: '请仔细阅读协议并同意！',
          icon: 'none'
        })
      }

      
    }
    

  },




  preStep() {
    const lecturerInfo = this.data.lecturerInfo;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      lecturerInfo: lecturerInfo
    })
    wx.navigateBack()
  }

  

 
})