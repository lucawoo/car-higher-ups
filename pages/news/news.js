// pages/news/news.js
Page({

  data: {
    tabIndex: 0,
    evaluateToMe: [],
    newsData: [],
    replyToMe: [],
    page: 1,
    lastIndex: 0
  },
  onShow () {
    this.setData({
      evaluateToMe: [],
      newsData: [],
      replyToMe: [],
    })
    this.getData(this.data.tabIndex)
  },

  // 获取相应数据
  getNews (e) {
    const tabIndex = e.currentTarget.dataset.index
    if (this.data.lastIndex == tabIndex) return false;
    
    this.setData({
      tabIndex: tabIndex,
      lastIndex: tabIndex,
      page: 1,
      evaluateToMe: [],
      newsData: [],
      replyToMe: [],
    })
    this.getData(tabIndex)
  },
  // 清空相应的数据
  clearNews () {
    wx.showModal({
      title: '确认清空消息记录？',
      confirmColor: '#00A0E8',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            newsData: []
          })
          wx.$.fetch('api/messageClean',{
            method: 'post'
          }).then(res => {
            wx.showToast({
              title: '已删除！',
              icon:"success", 
            })
          })
        }
      }
    })
  },

  // 清空相应的数据
  clearNews2() {
    wx.showModal({
      title: '确认清空消息记录？',
      confirmColor: '#00A0E8',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            evaluateToMe: []
          })
          wx.$.fetch('api/cleanEvaluate?type=1', {
            method: 'post'
          }).then(res => {
            wx.showToast({
              title: '已删除！',
              icon: "success",
            })
          })
        }
      }
    })
  },

  clearNews3() {
    wx.showModal({
      title: '确认清空消息记录？',
      confirmColor: '#00A0E8',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            replyToMe: []
          })
          wx.$.fetch('api/cleanEvaluate?type=2', {
            method: 'post'
          }).then(res => {
            wx.showToast({
              title: '已删除！',
              icon: "success",
            })
          })
        }
      }
    })
  },


  getData (index) {
    if (index == 0) {
      wx.$.fetch('api/getMessage?page='+ this.data.page).then(res => {
        var data = res.data.data;
        if (data.length > 0) {
          var newsData = this.data.newsData
          newsData = newsData.concat(data)
          this.setData({
            newsData: newsData
          })
        }
        setTimeout(()=>{
          this.setData({
            click:true
          })
        },500)
        
      })
    };
    if (index == 1) {
      wx.$.fetch('api/evaluateToMe?page=' + this.data.page).then(res => {
        var data = res.data.data;
        if (data.length > 0) {
          var evaluateToMe = this.data.evaluateToMe
          evaluateToMe = evaluateToMe.concat(data)
          this.setData({
            evaluateToMe: evaluateToMe
          })
        }
        setTimeout(() => {
          this.setData({
            click: true
          })
        }, 500)
      })
    };
    if (index == 2) {
      wx.$.fetch('api/replyToMe?page=' + this.data.page).then(res => {
        var data = res.data.data;
        if (data.length > 0) {
          var replyToMe = this.data.replyToMe
          replyToMe = replyToMe.concat(data)
          this.setData({
            replyToMe: replyToMe
          })
        }
        setTimeout(() => {
          this.setData({
            click: true
          })
        }, 500)
      })
    };
  },

  linkReplay(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/replay/replay?id=' + id,
    })
  },
  // 上拉加载
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getData(this.data.tabIndex)
  },
  // 跳详情
  newtodetail (e) {
    var type = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id
    var mid = e.currentTarget.dataset.mid
    wx.$.fetch('api/messageInfo?id=' + mid, { hideLoading: true }).then(res => {
      console.log(res)
    })
    if (type =='article'){
      wx.navigateTo({
        url: '/pages/article_details/article_details?id=' + id,
      })
    } else if (type == 'audio'){
      wx.navigateTo({
        url: '/pages/audio_details/audio_details?id=' + id,
      })
    } else if (type == 'video'){
      wx.navigateTo({
        url: '/pages/video_details/video_details?id=' + id,
      })
    } else if (type == 'course'){
      wx.navigateTo({
        url: '/pages/course/course?id=' + id,
      })
    } else if (type == undefined){
      wx.showToast({
        title: '消息已读',
      })
      
      
      setTimeout(() => {
        this.setData({
          page: 1,
          newsData: []
        })
        this.getData(this.data.tabIndex)
      }, 500)
    }
  },

  linkDetail (e) {
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
})