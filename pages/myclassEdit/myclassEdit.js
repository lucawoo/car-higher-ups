// pages/teacherCheckIn/index.js

var app = getApp()
Page({


  data: {
    courseInfo: {}
    
  },
  onLoad(options) {
    this.setData({
      courseInfo: app.data.lecturerInfo.data.lecturer,
      id: options.id
    })
  },
  chooseLogo (e) {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        const tempFilePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: wx.$.host + 'api/uploadImage',
          filePath: tempFilePath,
          name: 'files',
          success: function (res) {
            if (res.data) {
              let data = JSON.parse(res.data);
              var logo =  data.path
              var courseInfo = that.data.courseInfo
              courseInfo.classroom_logo = logo
              app.data.lecturerInfo.data.lecturer = courseInfo
              that.setData({
                courseInfo: courseInfo
              })
            }
          }
        })
      },
    })
  },

  getName (e) {
    var name = e.detail.value
    var courseInfo = this.data.courseInfo
    courseInfo.classroom_name = name
    this.setData({
      courseInfo: courseInfo
    })
    app.data.lecturerInfo.data.lecturer = courseInfo
  },

  getRank (e) {
    var info = e.detail.value
    var courseInfo = this.data.courseInfo
    courseInfo.classroom_info = info
    this.setData({
      courseInfo: courseInfo
    })
    app.data.lecturerInfo.data.lecturer = courseInfo
  },
  submitData() {
    const classroom_logo = this.data.courseInfo.classroom_logo
    const classroom_name = this.data.courseInfo.classroom_name
    const classroom_info = this.data.courseInfo.classroom_info

    if (classroom_logo && classroom_name && classroom_info) {
      const data = {
        classroom_logo: classroom_logo,
        classroom_name: classroom_name,
        classroom_info: classroom_info,
        api_token: wx.getStorageSync('token')
      }
      wx.$.fetch('api/editMyCourse',
        {
          method: 'post',
          data: data
        }
      ).then(res => {
          wx.showToast({
            title: res.data.msg,
          })
          wx.navigateBack()
        })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整！',
        confirmColor: '#00A0E8',
      })
    }
  }
    

    
  
})