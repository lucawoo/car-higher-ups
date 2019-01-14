var app = getApp()
Page({
  uploadimg() {
    var _this = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: wx.$.host + 'api/uploadImage',
          filePath: tempFilePath,
          name: 'files',
          success: function (res) {
            if (res.data) {
              let data = JSON.parse(res.data);
              _this.setData({
                src: data.path
              })
            }
          }
        })
      }
    })
  },

  feedSubmit: function (e) {
    var content = e.detail.value.content;
    var image = this.data.src
    if (content.length > 0) {
      wx.$.fetch(`api/addComplain`, {
        method: 'post',
        data: {
          content: content,
          goods_id: this.data.id,
          image: this.data.src,
          api_token: wx.getStorageSync('token')
        }
      }).then(res => {
        wx.navigateBack({
          delta: 1
        })
      })
    } else {
      wx.showToast({
        title: '请将反馈信息填写完整',
        icon: 'none'
      })
      return;
    }
  },

  onLoad(option){
    this.setData({
      id: option.course_id
    })
  }

})