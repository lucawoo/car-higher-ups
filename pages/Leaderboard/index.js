Page({
  data: {
    leaderboard: ['日榜', '月榜', '总榜'],
    leaderData: [],
    tabIndex: 0,
    page: 1,
    order: 3,
    noData: false,
    lastIndex: 0
  },

  onLoad() {
    this.getData(this.data.order)
  },
  // 获取数据
  getData(order) {
    wx.$.fetch(`/api/goods_class/getClassGoods?order=${this.data.order}&page=${this.data.page}`).then(res => {
      var data = res.data.data;
      var leaderData = this.data.leaderData
      if (data.length > 0) {
        leaderData = leaderData.concat(data)
        this.setData({
          leaderData: leaderData,
        })
      };
      if (leaderData.length > 0) {
        this.setData({
          noData: false
        })
      } else {
        this.setData({
          noData: true
        })
      }
    })
  },

  selectTop(e) {
    const tabIndex = e.currentTarget.dataset.index
    if (this.data.lastIndex == tabIndex) return false;
    this.setData({
      tabIndex: tabIndex,
      lastIndex: tabIndex,
      page: 1,
      leaderData: []
    })
    if (tabIndex == 0) {
      this.setData({
        order: 3
      })
      this.getData();
    }
    if (tabIndex == 1) {
      this.setData({
        order: 4
      })
      this.getData();
    }
    if (tabIndex == 2) {
      this.setData({
        order: 2
      })
      this.getData();
    }
  },
  // 跳转到详情
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

  // 上拉加载
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getData()
  }


})