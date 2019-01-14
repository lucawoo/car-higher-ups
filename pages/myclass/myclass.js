var app = getApp()
Page({
  data: {
    courseData: {},
    course: [],
    page: 1,
    first: true,
    share: app.data.share,
    hasSee: true
  },
  onShow() {
    this.getData();
    this.getTeacherId();
  },
  getTeacherId() {
    wx.$.fetch(`api/member/memberInfo`, { hideLoading: true }).then(res => {
      wx.setStorageSync('teacherId', res.data.data.my_lecturer.id)
      if (res.data.data.my_lecturer.push_course_notice == 0) {
        this.setData({
          hasSee: false
        });
      }
    })
  },


  getData() {
    wx.$.fetch('api/myCourse', { hideLoading: true }).then(res => {
      if (res.data) {
        this.setData({
          courseData: res.data.data,
        })
        this.setData({
          id: res.data.data.lecturer_id
        })
        if (this.data.first) {
          this.getCourse(res.data.data.lecturer_id)
        }
      };
      
    })
  },

  getCourse (id) {
    wx.$.fetch('api/lecturerCourse?id=' + id + '&page=' + this.data.page).then(res => {
      var data = res.data.data
      var course = this.data.course
      if (data.length> 0) {
        course = course.concat(data)
        this.setData({
          course: course,
          first: false
        })
      }
      
    })
  },
  
  editMyclass() {
    wx.navigateTo({
      url: '/pages/myclassEdit/myclassEdit?id=' + this.data.id,
    })
  },
  addContent() {
    wx.navigateTo({
      url: '/pages/myclassEditTip/index',
    })
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
  onReachBottom () {
    this.setData({
      page: this.data.page + 1
    })
    this.getCourse(this.data.id)
  },

  onShareAppMessage(){
    const courseData = this.data.courseData
    return {
      title: courseData.classroom_name || '汽车大咖',
      path: '/pagesteacherHome/index?id='+courseData.lecturer_id
    }
  },

 _backhome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
   app.data.share = false
  },
  closeTIPS() {
    this.setData({
      hasSee: true
    })
    wx.$.fetch('api/changeNoticeState', {
      method: 'post',
      data: {
        type: 'push_course_notice',
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      console.log(res)
    })
  }

})