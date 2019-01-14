var app = getApp()

Page({

  
  data: {
    freeDatas: [],
    page: 1,
    firstcome: false,
    share: app.data.share
  },

  
  onShow: function (options) {
    this.setData({
      freeDatas: [],
      page: 1
    })
    this.freeData()
    if (app.data.firstcome == 1) {
      this.setData({
        firstcome: true
      })
    }
  },

  iknow() {
    this.setData({
      firstcome: false
    })
    app.data.firstcome = 2
  },
  
  freeData() {
    wx.$.fetch('api/goods/freeGoodsList?page=' + this.data.page).then(res => {

      let freeDatas = this.data.freeDatas
      let data = res.data.data

      if (data.length > 0) {
        freeDatas = freeDatas.concat(data)
        this.setData({
          freeDatas: freeDatas
        })
      };

      if (freeDatas.length > 0) {
        this.setData({
          noData2: false,
        })
      } else {
        this.setData({
          noData2: true,
        })
      }
    })
  },

  linkDetail(e) {
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
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    
      this.freeData()

  },
  
  onShareAppMessage: function () {
  
  },

  _backhome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
    app.data.share = false
  }
})