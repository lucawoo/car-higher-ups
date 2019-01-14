var app = getApp()
Page({
  data: {
    collectList:[],
    page:1
  }
  ,
  onShow() {
    this.setData({
      collectList: [],
      page:1
    })
    this.getcollect()
  },

  getcollect(){
    wx.$.fetch(`api/collectList?page=${this.data.page}`).then(res => {
      var data = res.data.data;
      if (data.length > 0) {
        var collectList = this.data.collectList
        collectList = collectList.concat(data)
        this.setData({
          collectList: collectList
        })
      }
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


  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getcollect()
  }
})