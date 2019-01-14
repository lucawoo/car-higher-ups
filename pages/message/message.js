var util = require('../../utils/util.js');

Page({
  data: {
    sex: ['女','男'],
    index: 0,
    endtime: '0000-00-00',
    codebtn: true,
    codetime: 60
  },


  getTrueName(e) {
    const truename = e.detail.value;
    this.setStorge('truename', truename)
    this.setData({
      truename: truename
    })
  },
  getCompanyAds(e) {
    const company_ads = e.detail.value;
    this.setStorge('company_ads', company_ads)
    this.setData({
      company_ads: company_ads
    })
  },
  getCompanyName(e) {
    const company_name = e.detail.value;
    this.setStorge('company_name', company_name)
    this.setData({
      company_name: company_name
    })
  },
  getjob(e) {
    const duty = e.detail.value;
    this.setStorge('duty', duty)
    this.setData({
      duty: duty
    })
  },
  //封装の修改信息
  setStorge(name, data) {
    let info = wx.getStorageSync('info')
    info[name] = data
    wx.setStorageSync('info', info)
  },


  // //获取手机号
  // gettel(e) {
  //   var member_mobile = e.detail.value
  //   if ((/^1[34578]\d{9}$/.test(member_mobile))) {
  //     this.setData({
  //       codebtn: false,
  //       member_mobile: member_mobile
  //     })
  //   } else if (member_mobile.length < 11) {
  //     this.setData({
  //       codebtn: true
  //     })
  //   }
  // },

  //发送验证码
  sendCode() {
    wx.$.fetch('api/sendSmsCode', {
      method: 'post',
      data: {
        phone: this.data.member_mobile,
        log_type: 1,
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      if (res.data.state == 200) {
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
    this.setData({
      getView: (!this.data.geting)
    })
    var timer = setInterval(() => {
      this.setData({
        codetime: this.data.codetime -= 1
      })
      if (this.data.codetime <= 0) {
        clearInterval(timer)
        this.setData({
          codetime: 60,
          getView: false
        })
      }
    }, 30)
  },
  // 获取验证码
  getCode(e) {
    const code = e.detail.value;
    this.setData({
      code: code
    })
  },

  //保存按钮验证
  sumTel() {
    if (this.data.member_mobile && this.data.code) {
      wx.$.fetch(`api/validateCode`, {
        method: 'post',
        data: {
          phone: this.data.member_mobile,
          code: this.data.code,
          api_token: wx.getStorageSync('token')
        }
      }).then(res => {
        if (res.data.state == 200) {
          wx.showToast({
            title: res.data.msg,
          })
          this.setData({
            showView: !this.data.showView,
            appiphone: this.data.member_mobile,
            code: ''
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入完整',
        icon: 'none'
      })
    }
  },



  //  点击性别确定事件
  bindPickerChange: function (e) {
    const index = e.detail.value
    this.setData({
      sexSelect: this.data.sex[index],
      jb_sex: index,
    })
    const member_sex = e.detail.value[0];
    this.setStorge('member_sex', member_sex)
  },
  //  点击生日确定事件  
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    const birthday = e.detail.value;
    this.setStorge('birthday', birthday)
  },
  
  subscribeOn: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  onShow () {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: time
    })
    const info = wx.getStorageSync("info")
    this.setData({
      usermsg: info
    })
  },

  onUnload(){
    wx.$.fetch('api/member/edit', {
      method: 'post',
      data: {
        sex: this.data.jb_sex,
        birthday: this.data.date,
        company_ads: this.data.company_ads,
        company_name: this.data.company_name,
        duty: this.data.duty,
        truename: this.data.truename,
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      
    })
  }

})