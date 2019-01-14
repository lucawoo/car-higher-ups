var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    fixed: true,
    menus: ['本节介绍', '课件', '选节'],
    sort: true
  },
  /* tab */
  showMenuDetail(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex
    })
  },
  hidemenu(){
    this.setData({
      tabIndex: 4
    })
  },


  //数据请求
  onLoad(options) {

    this.setData({
      id: options.id,
      fid: options.fid,
      purchased: options.purchased,
      is_eval: options.is_eval,
      lecturerId: lecturerId
    })
    if (wx.getStorageSync('teacherId') != null) {
      var lecturerId = wx.getStorageSync('teacherId')
      this.setData({
        lecturerId: lecturerId
      })
    };

  },

  onShow(){
    wx.$.fetch('api/evaluate?lesson_id=' + this.data.id).then(res => {
      this.setData({
        allcommList: res.data.data,
        commList: res.data.data.slice(0, 3)
      })
    })
    this.getjson()
    this.getboth()
    this.getattcah()
  },


  getjson() {
    wx.$.fetch('api/lesson?id=' + this.data.id, { hideLoading: true }).then(res => {
      var content = res.data.data.lesson[0].try_see_content;
      var allcontent = res.data.data.lesson[0].content;
      var that = this;
      WxParse.wxParse('content', 'html', content, that, 5);
      WxParse.wxParse('content2', 'html', allcontent, that, 5);
      this.setData({
        courseList: res.data.data.lesson[0],
        lecturerMsg: res.data.data
      })
      console.log(this.data.courseList)
      var jianjie = res.data.data.lesson[0].desc
      var that = this
      WxParse.wxParse('jianjie', 'html', jianjie, that, 5)
    })

  },
  getattcah() {
    wx.$.fetch('api/lesson/attach?id=' + this.data.id, { hideLoading: true }).then(res => {
      var attachList = res.data.data
      attachList.forEach(item => {
        item.size = (item.size / (1024 * 1024)).toFixed(2)
      })
      this.setData({
        attachList: res.data.data,
        attachshow: true
      })
    })
  },
  getboth() {
    wx.$.fetch('api/course?id=' + this.data.fid, { hideLoading: true }).then(res => {
      this.setData({
        bothList: res.data.data,
        lectureMsg: res.data.data,
        lessonList: res.data.data.lesson
      })
    })
  },
  
  
  sortlist() {
    this.setData({
      lessonList: this.data.bothList.lesson.reverse()
    })
    if (this.data.sort == true) {
      this.setData({
        sort: false
      })
    } else {
      this.setData({
        sort: true
      })
    }
  },


  onUnload() {
    wx.$.fetch(`api/course/learnRecord`, {
      method: 'post',
      data: {
        course_id: this.data.fid,
        lesson_id: this.data.id,
        time: 0,
        api_token: wx.getStorageSync('token'),
      }
    }).then(res => {

    })
  },



  //页面跳转
  toclum(e) {
    var id = e.currentTarget.dataset.id
    var fid = e.currentTarget.dataset.fid
    var type = e.currentTarget.dataset.type
    var purchased = e.currentTarget.dataset.purchased
    var is_eval = e.currentTarget.dataset.is_eval
    var is_try_see = e.currentTarget.dataset.is_try_see
    if (is_try_see == true || purchased == true || this.data.lecturerId == this.data.bothList.lecturer.id) {
      if (type == 'article') {
        wx.redirectTo({
          url: '/pages/clumArt/clumArt?id=' + id + '&fid=' + fid + '&purchased=' + purchased + '&is_eval=' + is_eval,
        })
      } else if (type == 'audio') {
        wx.redirectTo({
          url: '/pages/clumAudio/clumAudio?id=' + id + '&fid=' + fid + '&purchased=' + purchased + '&is_eval=' + is_eval,
        })
      } else if (type == 'video') {
        wx.redirectTo({
          url: '/pages/clumVideo/clumVideo?id=' + id + '&fid=' + fid + '&purchased=' + purchased + '&is_eval=' + is_eval,
        })
      }
    } else {
      wx.showToast({
        title: '需要获取课程才能查看'
        , icon: 'none'
      })
    }

  },


  seeattach(e) {
    var atturl = e.currentTarget.dataset.url
    var container = e.currentTarget.dataset.container
    if (container == 'jpeg' || container == 'jpg' || container == 'png') {
      wx.previewImage({
        current: atturl,
        urls: [atturl]
      })
    } else {
      wx.showLoading({
        title: '加载文件中...',
      })
      wx.downloadFile({
        url: atturl,
        success: function (res) {
          var filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              wx.hideLoading()
            },
            fail: function (res) {
              console.log(res)
            }
          })
        }
      })
    }
  }
})