var WxParse = require('../../wxParse/wxParse.js');
Page({

 
  data: {
    doc_code: {}
  },

  
  onLoad: function (options) {
    var that = this
    wx.$.fetch('api/document',{
      method: 'post',
      hideLoading: true,
      data: {
        'doc_code': 'join_process'
      }
    }).then(res => {
      var content = res.data.data.doc_content;
      wx.showLoading({
        title: '请稍后',
      })
      WxParse.wxParse('content', 'html', content, that, 5);
      wx.hideLoading()
      this.setData({
        doc_code: res.data.data,
      })
    })
  },

  backPre() {
    wx.navigateBack({
      delta: 1,
    })
  }

  
  
})