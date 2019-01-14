var app = getApp()
Page({
  data: {
    headerFixed: false,
    teacherData: {},
    course: [],
    page: 1,
    firstcome: false,
    id: '',
    share: app.data.share
  },
  onLoad(options) {
    this.setData({
      id: options.id,
      share: this.data.share
    })
    
  },

  onShow() {
    this.getData(this.data.id)
    this.getCourse(this.data.id)
    var teacherId;
    if (wx.getStorageSync('info').lecturer) {
      teacherId = wx.getStorageSync('info').lecturer.Id
    }
    this.setData({
      teacherId: teacherId
    })
  },
  // 获取讲师信息
  getData(id) {
    wx.$.fetch('api/lecturerInfo?id=' + id, { hideLoading: true }).then(res => {
      this.setData({
        teacherData: res.data.data
      })
    });
  },
  // 获取相关内容
  getCourse(id) {
    wx.$.fetch('api/lecturerCourse?id=' + id + '&page=' + this.data.page).then(res => {
      var data = res.data.data
      var course = this.data.course
      if (data.length > 0) {
        course = course.concat(data)
        this.setData({
          course: course
        })
      }
    })
  },
  // 向上滑动重新定位
  onPageScroll(e) {
    if (e.scrollTop > 260) {
      this.setData({
        headerFixed: true,
      })
    } else {
      this.setData({
        headerFixed: false,
      })
    }
  },

  // 取关\关注
  toggleFocus() {
    if (this.data.teacherData.is_focus) {
      wx.$.fetch('api/disFocus',
        {
          method: 'post',
          data: {
            lecturer_id: this.data.teacherData.lecturer_id,
            api_token: wx.getStorageSync('token')
          }
        }
      ).then(res => {
        if (res.data.state == 200) {
          this.getData(this.data.id)
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
            lecturer_id: this.data.teacherData.lecturer_id,
            api_token: wx.getStorageSync('token')
          }
        }
      ).then(res => {
        if (res.data.state == 200) {
          this.getData(this.data.id)
          wx.showToast({
            title: '已关注',
          })
        }
      })
    }
  },

  // 跳转到详情
  linkDetail(e) {
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
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getCourse(this.data.id)
  },
  _backhome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
    app.data.share = false	
  }
})