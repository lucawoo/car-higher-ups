// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.requestPayment({
      'timeStamp': options.timeStamp,
      'nonceStr': options.nonceStr,
      'package': options.text + '=' + options.num,
      'signType': 'MD5',
      'paySign': options.paySign,
      'success': function (res) {
        if (options.type == 'buy') {
          wx.navigateBack()
        } else if (options.type == 'give') {
          wx.redirectTo({
            url: '/pages/giftrecord/giftrecord',
          })
        } else if (options.type == 'vip') {
          wx.switchTab({
            url: '/pages/mine/mine',
          })
        }
      },
      fail: function (res) {
        if (options.type == 'buy') {
          wx.navigateBack()
        } else if (options.type == 'give') {
          wx.redirectTo({
            url: '/pages/giftrecord/giftrecord',
          })
        } else if (options.type == 'vip') {
          wx.navigateBack()
        }
      }
    })
  },


})