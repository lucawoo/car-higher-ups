var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    livePlay: true,
    fullScreen: false,
    showScreenBtn: false,
    liveData: {},
    startLiving: false,
    orientation: 'vertical',
    errorCODE:　false
  },
  onLoad() {
    this.getLiveUrl()
    this.getLiveData()
  },
  onReady() {
    const ltx = wx.createLivePlayerContext('livePlay')
    this.setData({
      ltx: ltx
    })
  },
  // 获取直播地址
  getLiveUrl() {
    wx.$.fetch('api/getPlayUrl', { hideLoading: true }).then(res => {
      if (res.data.state == 200) {
        this.setData({
          liveData: res.data
        })
        var desc = res.data.live_info.live_desc
        WxParse.wxParse('desc', 'html', desc, this, 5)
      }
    })
  },
  // 获取直播状态
  getLiveData() {
    wx.$.fetch('api/channelGetStatus', { hideLoading: true }).then(res => {
      if (res.statusCode == 200) {
        this.setData({
          liveStatus: res.data.output[0]
        })
      }
    })
  },
  // 显示全屏/退出全屏按钮  2秒后按钮隐藏
  showScreenBtn() {
    this.setData({
      showScreenBtn: true
    })
    setTimeout(() => {
      this.setData({
        showScreenBtn: false
      })
    }, 2000)
  },

  fullScreen() {
    const ltx = this.data.ltx;
    const that = this;
    ltx.requestFullScreen({
      success: function () {
        that.setData({
          fullScreen: true,
          orientation: 'horizontal',
        })
      },
      fail: function () {
        wx.showToast({
          title: '进入全屏失败!',
          icon: 'none'
        })
      },
    });
  },

  exitFullScreen() {
    const ltx = this.data.ltx;
    const that = this;
    ltx.exitFullScreen({
      success: function () {
        that.setData({
          fullScreen: false,
          orientation: 'vertical',
        })
      },
      fail: function () {
        wx.showToast({
          title: '退出全屏失败!',
          icon: 'none'
        })
      },
    });
  },
  // 监听屏幕变化
  screenchange(e){
    const fullScreen = e.detail.fullScreen
    if (fullScreen) {
      this.setData({
        fullScreen: true,
        orientation: 'horizontal',
      })
    } else {
      this.setData({
        fullScreen: false,
        orientation: 'vertical',
      })
    }
  },

  statechange(e) {
    if (e.detail.code == 2003) {
      this.setData({
        startLiving: true
      })
    } else if (e.detail.code == -2003) {
      errorCODE: true
    }
  },
  error(e) {
    wx.showToast({
      title: e.detail.errMsg,
      icon: 'none'
    })
  }
})
