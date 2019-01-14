var app = getApp()
var timer = null
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    fixed: true,
    menus: ['本节介绍', '课件', '选节'],
    tabIndex: 0,
    goodfirst: true,
    firststop: true,
    videoplay: false,
    i: 0
  },

  //video
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  //video进度
  videoTimeUpdated: function (e) {
    var playtime = e.detail.currentTime
    this.setData({
      playtime: playtime
    })
    // wx.hideLoading()
  },
  // bindwaiting() {
  //   wx.showLoading({
  //     title: '加载中...',
  //   })
  // },
  playVideo(e) {
    var that = this
    // if(this.data.firststop){
    //   this.videoContext.pause()
    //   this.setData({
    //     firststop: false
    //   })
    // }else{
    if (app.data.playfirst) {
      wx.getNetworkType({
        success: function (res) {
          if (res.networkType == 'wifi') {
            that.videoContext.play()
            that.setData({
              videoplay: true
            })
          } else {
            that.videoContext.pause()
            wx.showModal({
              title: '警告',
              content: '当前使用流量播放',
              confirmText: '继续播放',
              confirmColor: '#00a0e8',
              success: function (res) {
                if (res.confirm) {
                  that.videoContext.play()
                  that.setData({
                    videoplay: true
                  })
                  app.data.playfirst = false
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
      that.videoContext.play()
      that.setData({
        videoplay: true
      })
    }
    // }

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

  //数据请求
  onLoad(options) {
    this.setData({
      id: options.id,
      fid: options.fid,
      is_eval: options.is_eval,
      purchased: options.purchased
    })
    this.getToken()
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

  startDraw() {
    const that = this;
    let bg = '../../images/video-bg.png'; //背景
    let bgW;
    let bgH;
    let avatar = this.data.courseLists.lecturer.avatar; //头像
    let name = this.data.courseLists.lecturer.name;// 昵称
    if (name.length > 14) {
      name = name.substring(0, 14) + '...'
    } else {
      name = name
    };
    let text;// 说明文字
    if (this.data.courseLists.name.length > 14) {
      text = this.data.courseLists.name.substring(0, 14) + '...'
    } else {
      text = this.data.courseLists.name
    };

    text = '我正在学习【' + text + '】'

    let codeimg;
    wx.getImageInfo({
      src: bg,
      success: res => {
        bg = bg;
        bgW = res.width;
        bgH = res.height;
        wx.getImageInfo({
          src: this.data.codeimg,
          success: res => {
            codeimg = res.path;
            wx.$.fetch('api/getLocalClassroomLogo', {
              method: 'post',
              hideLoading: true,
              data: {
                api_token: wx.getStorageSync('token'),
                lecturer_id: this.data.courseLists.lecturer.id
              }
            }).then(res => {
              wx.getImageInfo({
                src: res.data.url,
                success: res => {
                  avatar = res.path
                  that.canvasToImg(bg, avatar, name, text, codeimg, bgW, bgH)
                }
              })
            })
          }
        })
      }
    })
  },

  videoEnd(e) {
    if (this.data.codeimg) {
      this.setData({
        closeShareModal: true,
      })
    }
  },

  getToken() {
    wx.$.fetch('api/getQrCode', {
      method: 'post',
      hideLoading: true,
      data: {
        path: '/pages/course/course?id=' + this.data.id + '&share=1',
        width: 430,
        api_token: wx.getStorageSync('token'),
        goods_id: this.data.id,
        type: 2
      }
    }).then(res => {
      
      this.setData({
        codeimg:  res.data.path
      });
      this.startDraw()
    })
  },

  canvasToImg(bg, avatar, name, text, codeimg, bgW, bgH) {
    const that = this;
    const ctx = wx.createCanvasContext('shareFrends');
    ctx.save()
    ctx.drawImage(bg, 0, 0, bgW, bgH, 0, 0, 315, 442);
    ctx.beginPath();
    ctx.arc(45, 280, 25, 0, 2 * Math.PI);
    ctx.clip()
    ctx.drawImage(avatar, 20, 255, 50, 50);
    ctx.restore();

    ctx.font = 'normal bold 14px sans-serif';
    ctx.fillText(name, 85, 285);

    ctx.font = 'normal normal 14px sans-serif';
    ctx.fillText(text, 25, 330);

    ctx.arc(260, 390, 45, 0, 2 * Math.PI);
    ctx.drawImage(codeimg, 220, 350, 80, 80);
    ctx.restore();
    ctx.draw()
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'shareFrends',
        success: function (res) {
          let canvasimg = res.tempFilePath;

          that.setData({
            canvasimg: canvasimg
          })
        }
      })
    }, 800)

  },

  //保存图片
  saveimg() {
    const that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.canvasimg,
                success() {
                  wx.showToast({
                    title: '保存成功'
                  })
                },
                fail() {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail() {
              wx.openSetting({
                success: (res) => {

                }
              })
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.canvasimg,
            success() {
              wx.showToast({
                title: '保存成功'
              })
            },
            fail() {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })

  },

  closeShareModal() {
    this.setData({
      closeShareModal: false
    })
  },

  stopFather() {
    return false
  },
  
  getjson() {
    var that = this
    wx.$.fetch('api/lesson?id=' + this.data.id).then(res => {
      this.setData({
        courseList: res.data.data.lesson[0],
        courseLists: res.data.data
      })
     
      var jianjie = res.data.data.lesson[0].desc
      var that = this
      WxParse.wxParse('jianjie', 'html', jianjie, that, 5)
    })
    if (this.data.i < 4) {
      timer = setTimeout(() => {
        console.log(this.data.playtime)
        if (this.data.videoplay && this.data.playtime) {
          console.log('视屏播放正常')
          console.log('---------------')
        } else {
          console.log('视屏播放出错')
          console.log('---------------')
          // wx.showToast({
          //   title: '视屏播放出错',
          //   icon: 'none'
          // })
          that.getjson()
          this.data.i += 1
        }
      }, 5000)
    } else {
      return false
    }
    
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
        lessonList: res.data.data.lesson,
        
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
        time: this.data.playtime,
        api_token: wx.getStorageSync('token'),
      }
    }).then(res => {

    })

    clearTimeout(timer)
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
  },
  onShareAppMessage() { }


})