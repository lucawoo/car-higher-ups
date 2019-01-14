const app = getApp()
Page({

  
  data: {
    url: wx.$.host +  'store'
  },
  onLoad() {
    this.setData({
      url: app.data.courseInfo.lecturer_admin_url
    })
  }
})