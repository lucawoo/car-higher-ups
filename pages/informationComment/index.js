// pages/informationComment/index.js
Page({

  data: {
    Comments: [],
    inputVal: '',
    id: '',
    page: 1
  },
  onLoad(options) {
    this.setData({
      id: options.id,
      info: wx.getStorageSync('info')
    })
    this.getComment(options.id)
  },
  // 获取评论
  getComment(id) {
    wx.$.fetch(`api/informationEval?id=${id}&page=${this.data.page}`, {
      method: 'post',
      data: {
        id: id
      }
    }).then(res => {
      var data = res.data.data.data;
      if (data.length > 0) {
        var Comments = this.data.Comments
        Comments = Comments.concat(data)
        this.setData({
          Comments: Comments
        })
      }
    })
  },

  // 提交评论
  submitData(e) {
    var geval_content = e.detail.value
    if (geval_content) {
      wx.$.fetch('api/addEvaluate', {
        method: 'post',
        data: {
          info_id: this.data.id,
          geval_content: geval_content,
          member_id: this.data.info.member_id,
          api_token: wx.getStorageSync('token')
        }
      }).then(res => {
        this.setData({
          inputVal: '',
          Comments: []
        })
        this.getComment(this.data.id)
        wx.showToast({
          title: res.data.msg,
        })
        
      })
    }

  },
  // 上拉加载
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getComment(this.data.id)
  }
  
})