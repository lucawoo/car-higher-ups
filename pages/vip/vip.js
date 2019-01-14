Page({
  data: {
    
  },
  /////页面跳转
  tovipD(){
    wx.navigateTo({
      url: '/pages/vip_details/vip_details',
    })
  },

  //////请求数据
  onLoad(){

    wx.$.fetch(`api/member/isVip`).then(res => {
      this.setData({
        vipcover: res.data.data.cover
      })
    })
    wx.$.fetch(`api/member/memberInfo`, { hideLoading: true }).then(res => {
      this.setData({
        valid_time: res.data.data.valid_time
      })
      var vipstate = wx.getStorageSync('is_vip')
      var endtime = new Date(this.data.valid_time * 1000)
      this.setData({
        vipstate: vipstate,
        endtimeY: endtime.getFullYear(),
        endtimeM: endtime.getMonth() + 1,
        endtimeD: endtime.getDate(),
        endtimeH: endtime.getHours(),
        endtimeMin: endtime.getMinutes(),
        endtimeS: endtime.getSeconds()
      })
    })
    wx.$.fetch(`api/member/vipInfo`, { hideLoading: true }).then(res => {
      this.setData({
        vipprice: res.data.data.vip_price
      })
    })
   


  },

  buyvip() {
    var _that = this
    const system = wx.getSystemInfoSync().system

    if (system.indexOf("iOS") != -1) {
      var token = wx.getStorageSync('token')
      wx.navigateTo({
        url: '/pages/web-view/index?api_token=' + token + '&type=vip' + '&formios=1' + '&price=' + this.data.vipprice,
      })
      //IOS
    }else{
      wx.$.fetch(`api/order`, {
        method: 'post',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          api_token: wx.getStorageSync('token'),
          type: 'buy_vip'
        }
      }).then(res => {
        wx.requestPayment({
          'timeStamp': res.data.data.out_trade.timestamp,
          'nonceStr': res.data.data.out_trade.nonceStr,
          'package': res.data.data.out_trade.package,
          'signType': 'MD5',
          'paySign': res.data.data.out_trade.paySign,
          'success': function (res) {
            wx.$.fetch(`api/member/isVip`).then(res => {
              if (res.data.msg == '您已获取') {
                wx.setStorageSync('is_vip', true)
                _that.setData({
                  vipstate: true
                })
              } else if (res.data.msg == '还没获取') {
                wx.setStorageSync('is_vip', false)
                _that.setData({
                  vipstate: false
                })
              } else if (res.data.msg == '已过期') {
                wx.setStorageSync('is_vip', false)
                _that.setData({
                  vipstate: false
                })
              }
            })
          }
        })
      })
    }    
  },





})