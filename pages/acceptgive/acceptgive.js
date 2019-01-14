var app = getApp()

Page({
  data: {
    edit: false,
    url: wx.$.host,
    share: app.data.share
  },
  //页面初始化
  onLoad: function(options) {
    this.setData({
      tit: options.tit,
      message: options.message,
      price: options.price,
      member_name: options.member_name,
      member_avatar: options.member_avatar,
      token: options.token,
      type: options.type,
      course_id: options.course_id,
      c_type: options.c_type,
      id: options.id
    })
  },
  //数据放在onShow请求，返回会重新加载
  onShow() {
    wx.$.fetch(`api/member/give/show?id=` + this.data.id).then(res => {
      this.setData({
        sendlist: res.data.data
      })
    })
    app.data.firstcome = 2
  },
  //页面跳转
  gohome() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  gogood() {
    wx.reLaunch({
      url: '/pages/home/home?fromgive=1&id=' + this.data.course_id + '&c_type=' + this.data.c_type + '&type=' + this.data.type,
    })
  },


  //页面事件
  //关闭提示
  cancel() {
    this.setData({
      edit: false
    })
  },
  //接受赠送
  accept() {
    var that = this
    if (this.data.sendlist.receiver_id == 0) {
      wx.$.fetch(`api/member/give/receiver`, {
        method: 'post',
        header: {
          'Accept': 'application/json'
        },
        data: {
          token: this.data.token,
          api_token: wx.getStorageSync('token')
        }
      }).then(res => {
        if (res.data.state == 400) {
          this.setData({
            accsuccess: res.data.msg,
            acctype: 3
          })
        } else {
          this.setData({
            accsuccess: '恭喜您，领取成功！',
            acctype: 1
          })
        }
      })
      that.setData({
        edit: true
      })
    } else {
      that.setData({
        accsuccess: '领取失败，商品已被领取！',
        edit: true,
        acctype: 1
      })
    }
  },
  _backhome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
    app.data.share = false
  }
})