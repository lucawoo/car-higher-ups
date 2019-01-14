var app = getApp()
Page({
  data: {
    id: ''
  },
  onLoad(options) {
    
    const info = wx.getStorageSync("info")
    this.setData({
      info: info,
      id: options.id
    })

  },

  //option.course_id
  feedSubmit: function (e) {
    const content = e.detail.value.content
    if (content) {
      wx.$.fetch('api/replyEvaluate',{
        method: 'post',
        data: {
          api_token: wx.getStorageSync('token'),
          content: content,
          id: this.data.id
        }
      }).then(res => {
        if (res.data.state == 200) {
          wx.showToast({
            title: res.data.msg,
          })
          wx.navigateBack()
        } else if (res.data.state == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            success: function() {
              setTimeout(res => {
                wx.navigateBack()
              }, 600)
            }
          })
          
        }
      })
    } else {
      wx.showToast({
        title: '回复内容不能为空！',
        icon: 'none'
      })
    }
    


  },
  
})