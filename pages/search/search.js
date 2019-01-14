
Page({
  data: {
    dsearchTabs: ['全部','讲师','课程'],
    searchText: '',
    tabIndex: 0,
    showHistorySearch: true,
    historySearch: [],
    hotSearch: [],
  },

  onShow () {
    this.getSearchHis()
  },

  getSearchHis () {
    wx.$.fetch('api/goods/getSearch', { hideLoading: true }).then(res => {
      this.setData({
        historySearch: res.data.data.history_search,
        hotSearch: res.data.data.hot_search,
      })
    })
  },

  selectTab (e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex
    })
  },
  // 搜索历史显示
  showHistorySearch () {
    this.setData({
      showHistorySearch: true
    })
  },

  hideHistorySearch() {
    this.setData({
      showHistorySearch: false
    })
  },
  // 选择的历史或热门搜索
  selectSearch (e) {
    const searchText = e.currentTarget.dataset.text
    this.setData({
      searchText: searchText,
      showHistorySearch: false
    })
    this.getData()
  },
  // 点击键盘确认按钮 开始搜索
  startSearch (e) {
    const value = e.detail.value
    this.setData({
      searchText: value
    })
    this.getData()
  },
  getData() {
    const name = this.data.searchText
    wx.$.fetch('api/goods/search?name=' + name).then(res => {
      this.setData({
        Lecturer: res.data.data.Lecturer,
        all: res.data.data.all,
        course: res.data.data.course
      })
      this.getSearchHis()
    })
  },

// 关注
  toggleFocus(e) {

    const focus = e.currentTarget.dataset.focus
    const id = e.currentTarget.dataset.id
    if (focus == 1) {
      wx.$.fetch('api/disFocus',
        {
          method: 'post',
          data: {
            lecturer_id: id,
            api_token: wx.getStorageSync('token')
          }
        }
      ).then(res => {
        if (res.data.state == 200) {
          this.getData()
          wx.showToast({
            title: '已取消',
          })
        }
      })
    } else {
      wx.$.fetch('api/addFocus',
        {
          method: 'post',
          data: {
            lecturer_id: id,
            api_token: wx.getStorageSync('token')
          }
        }
      ).then(res => {
        if (res.data.state == 200) {
          this.getData()
          wx.showToast({
            title: '已关注',
          })
        }
      })
    }
  },


  // 跳转
  linkDetail(e) {
    
    var type = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id
    var type2 = e.currentTarget.dataset.typecourse
    var goodstype = e.currentTarget.dataset.goodstype
  
     if (type == 'teacher') {
      wx.navigateTo({
        url: '/pages/teacherHome/index?id=' + id,
      })
    } else {
       if (goodstype == 2) {
         wx.navigateTo({
           url: '/pages/video_details/video_details?id=' + id,
         })
       } else if (goodstype == 3) {
         wx.navigateTo({
           url: '/pages/audio_details/audio_details?id=' + id,
         })
       } else if (goodstype == 1) {
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
    }
  },
  // 清空
  cleanSearchList () {
    wx.$.fetch('api/goods/clearSearch', {
      method: 'post',
      data: {
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      wx.showToast({
        title: res.data.msg,
      })
      this.getSearchHis()
    })
  }
})