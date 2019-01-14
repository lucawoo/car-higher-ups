var app = getApp()
Page({
  uploadimg(){
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
                src:  data.path
              })
            }}
        })
      }
    })
  },

  //提交
  feedSubmit: function (e) {
    console.log(e)
    var contact = e.detail.value.contact;
    var content = e.detail.value.content;
    var image = this.data.src
    if (contact.length > 0 && content.length > 0) {
      if (contact.length == 11 && /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(contact)){
        this.setData({
          contact: contact,
          content: content
        })
        this.addfeed()
      } else if (contact.indexOf('@') > -1 && /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(contact)){
        this.setData({
          contact: contact,
          content: content
        })
        this.addfeed()
      } else if (contact.length >= 4 && /^[1-9][0-9]{4,11}$/.test(contact)){
        this.setData({
          contact: contact,
          content: content
        })
        this.addfeed()
      }else{
        wx.showToast({
          title: '请正确填写联系方式',
          icon: 'none'
        })
      }
     
    }else{
      wx.showToast({
        title: '请将反馈信息填写完整！',
        icon: 'none'
      })
      return;
    }
  },

  addfeed(){
    wx.$.fetch(`api/addFeedback`, {
        method: 'post',
        data: {
          contact: this.data.contact,
          content: this.data.content,
          image: this.data.src,
          api_token: wx.getStorageSync('token')
        }
    }).then(res => {
      
      wx.navigateTo({
        url: '/pages/feed_success/feed_success?id=2',
      })
    })
  }
})