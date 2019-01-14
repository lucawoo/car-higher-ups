const utils = require('../../utils/util.js')
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    audioAction: {
      method: 'pause'
    },
    isplay: true,
    fixed: true,
    menus: ['本节介绍', '课件', '选节'],
    tabIndex: 0,
    goodfirst: true
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 271) {
      this.setData({
        fixed: false
      })
    } else {
      this.setData({
        fixed: true
      })
    }
  },
  /* tab */
  showMenuDetail(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex
    })
  },

  //播放音频
  audioPlayed: function (e) {
    console.log('audio is played')
  },
  audioTimeUpdated: function (e) {
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    var sendplaytime = e.detail.currentTime
    var playtime = e.detail.currentTime
    var alltime = e.detail.duration
    this.duration = e.detail.duration
    this.setData({
      progress: progress,
      playtime: utils.formDate(sendplaytime),
      alltime: utils.formDate(alltime),
      sendplaytime: e.detail.currentTime
    })
  },

  timeSliderChanged: function (e) {
    if (!this.duration)
      return;

    var time = this.duration * e.detail.value / 100;

    this.setData({
      audioAction: {
        method: 'setCurrentTime',
        data: time
      }
    });
  },
  playbackRateSliderChanged: function (e) {
    this.setData({
      audioAction: {
        method: 'setPlaybackRate',
        data: e.detail.value
      }
    })
  },


  //视频播放

  playAudio: function () {
    if (app.data.playfirst) {
      var that = this
      wx.getNetworkType({
        success: function (res) {
          if (res.networkType == 'wifi') {
            that.setData({
              audioAction: {
                method: 'play'
              }
            })
          } else {
            that.setData({
              audioAction: {
                method: 'pause'
              }
            })
            wx.showModal({
              title: '警告',
              content: '当前使用流量播放',
              confirmText: '继续播放',
              confirmColor: '#00a0e8',
              success: function (res) {
                if (res.confirm) {
                  app.data.playfirst = false
                  that.setData({
                    audioAction: {
                      method: 'play'
                    }
                  })
                } else {
                  // wx.navigateBack({
                  //   delta: 2
                  // })
                }
              },
            })
          }
        }
      })
    } else {
      this.setData({
        audioAction: {
          method: 'play'
        }
      })
    }

    var that = this;
    that.setData({
      btnshow: (!that.data.btnshow),
      isplay: false
    })
  },
  pauseAudio: function () {
    this.setData({
      audioAction: {
        method: 'pause'
      }
    });
    var that = this;
    that.setData({
      btnshow: (!that.data.btnshow),
      isplay: true
    })
  },


  //数据请求
  onLoad(options) {
    this.setData({
      id: options.id,
      fid: options.fid,
      is_eval: options.is_eval,
      purchased: options.purchased
    })
    if (wx.getStorageSync('teacherId') != null) {
      var lecturerId = wx.getStorageSync('teacherId')
      this.setData({
        lecturerId: lecturerId
      })
    };

    this.getjson()
    this.getboth()
    this.getattcah()
    
  },

  onShow() {
    if (wx.getStorageSync('played')) {
      this.setData({
        audioAction: {
          method: 'play'
        },
        btnshow: (!this.data.btnshow),
        isplay: false
      })
    }
  },

  getjson() {
    wx.$.fetch('api/lesson?id=' + this.data.id).then(res => {
      this.setData({
        courseList: res.data.data.lesson[0],
        lectureMsg: res.data.data
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

  getboth(){
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



  //离开页面记录学习记录
  onUnload() {
    wx.$.fetch(`api/course/learnRecord`, {
      method: 'post',
      data: {
        course_id: this.data.fid,
        lesson_id: this.data.id,
        time: this.data.playtime,
        api_token: wx.getStorageSync('token'),
      }
    }).then(res => {

    })
    wx.removeStorageSync('played')
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
    wx.setStorageSync('played', this.data.sendplaytime)
    if (container == 'jpeg' || container == 'jpg' || container == 'png') {
      wx.previewImage({
        current: atturl,
        urls: [atturl]
      })
      this.setData({
        isplay: true
      })
      //////////////////////////////////////////
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
  },
  onShareAppMessage() { }


})