var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    menus: ['详情', '权益'],
    tabIndex: 0,
    tab: 1
  },
  tab_slide: function (e) {//滑动切换tab   
    var that = this;
    that.setData({ tab: e.detail.current });
  },
  tab_click: function (e) {//点击tab切换  
    var that = this;
    if (that.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
  },
  showMenuDetail(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex
    })
  },


  toDetila(e) {
    var type = e.currentTarget.dataset.type
    var type2 = e.currentTarget.dataset.typecourse
    var id = e.currentTarget.dataset.id
    if (type == 2) {
      wx.navigateTo({
        url: '/pages/video_details/video_details?id=' + id,
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '/pages/audio_details/audio_details?id=' + id,
      })
    } else if (type == 1) {
      wx.navigateTo({
        url: '/pages/article_details/article_details?id=' + id,
      })
    } else if (type2 == 2) {
      wx.navigateTo({
        url: '/pages/course/course?id=' + id,
      })
    } else if (type2 == 1) {
      wx.navigateTo({
        url: '/pages/column_details/column_details?id=' + id,
      })
    }
  },



  //////////////////////////////////
  buyvip() {
    wx.$.fetch(`api/order`, {
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        api_token: wx.getStorageSync('token'),
        type: 'buy_vip',
        trade_type: JSAPI
      }
    }).then(res => {
      var _that = this
      wx.requestPayment({
        'timeStamp': res.data.data.out_trade.timestamp,
        'nonceStr': res.data.data.out_trade.nonceStr,
        'package': res.data.data.out_trade.package,
        'signType': 'MD5',
        'paySign': res.data.data.out_trade.paySign,
        'success': function (res) {
          this.getjson()
        }
      })
    })
  },
  ///////////////////////////////////

  /////请求数据
  onLoad() {
    wx.$.fetch(`api/member/vipInfo`).then(res => {
      this.setData({
        vipInfoList: res.data.data
      })
      var content = res.data.data.content;
      var that = this;
      WxParse.wxParse('content', 'html', content, that, 5);
    })

    wx.$.fetch(`api/member/vipCourse`, { hideLoading: true }).then(res => {
      this.setData({
        vipCourselList: res.data.data.slice(0, 6)
      })
    }),


      wx.$.fetch(`api/member/isVip`, { hideLoading: true }).then(res => {
        this.setData({
          vipcover: res.data.data.cover
        })
      }),



      this.setData({
        vipstate: wx.getStorageSync('is_vip')
      })

  }
})