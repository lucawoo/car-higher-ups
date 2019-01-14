var app = getApp()
Page({
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/starH.png',
    selectedSrc: '../../images/starW.png',
    key: 1,
  },
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  },

  //option.course_id
  feedSubmit: function (e) {
    var content = e.detail.value.content
    if (e.detail.value.content.length>0){
      if (this.data.lesson == 1) {
        wx.$.fetch(`api/evaluate/add`, {
          method: 'post',
          data: {
            score: this.data.key,
            content: content,
            lesson_id: this.data.goods_id,
            api_token: wx.getStorageSync('token')
          }
        }).then(res => {
          wx.navigateBack({
            delta: 1
          })
        })
      } else {
        wx.$.fetch(`api/evaluate/add`, {
          method: 'post',
          data: {
            score: this.data.key,
            content: content,
            course_id: this.data.goods_id,
            api_token: wx.getStorageSync('token')
          }
        }).then(res => {
          wx.navigateBack({
            delta: 1
          })
        })
      }
    }else{
      wx.showToast({
        title:'评价内容为空！',
        icon:'none'
      })
      return
    }
    
    
  },
  onLoad(option){
    this.setData({
      goods_id: option.course_id,
      lesson: option.lesson
    })

    const info = wx.getStorageSync("info")
    this.setData({
      info: info
    })

  }
})