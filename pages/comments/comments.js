
Page({
  data: {
    commList: [],
    page: 1
  },


  topublishedcomm(e){
    if (this.data.is_eval == "true") {
      wx.showToast({
        title: '已经进行过评价！',
        icon: 'none'
      })
      return
    }else{
      wx.navigateTo({
        url: '/pages/publishedcomm/publishedcomm?course_id=' + this.data.good_id + '&lesson=' + this.data.lesson
      })
    }
  },

  onLoad(option){
    this.setData({
      purchased: option.is_Purchased,
      is_eval: option.is_eval,
      good_id: option.course_id,
      lesson: option.lesson,
    })

  },

  getjson(){
    if (this.data.lesson==1){
      wx.$.fetch('api/evaluate?lesson_id=' + this.data.good_id + '&page=' + this.data.page).then(res => {
        var data = res.data.data;
        if (data.length > 0) {
          var commList = this.data.commList
          commList = commList.concat(data)
          this.setData({
            commList: commList
          })
        }
      })
    }else{
      wx.$.fetch('api/evaluate?course_id=' + this.data.good_id + '&page=' + this.data.page).then(res => {
        var data = res.data.data;
        if (data.length > 0) {
          var commList = this.data.commList
          commList = commList.concat(data)
          this.setData({
            commList: commList
          })
        }
      })
    }
    
  },

  onShow() {
    this.setData({
      commList:[]
    })
    this.getjson()
  },

  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getjson()
  }


})