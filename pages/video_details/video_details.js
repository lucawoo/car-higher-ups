var app = getApp()
var timer = null
var WxParse = require('../../wxParse/wxParse.js');

Page({
  /* video */
  data: {
    buynum: 1,
    shuomintit: false,
    dark: false,
    paycon: false,
    videocontrol: false,
    evalshow: false,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/starH.png',
    selectedSrc: '../../images/starW.png',
    key: 5,
    page: 1,
    allcommList: [],
    giveshow: true,
    attachshow: false,
    goodfirst: true,
    lecturerId: false,
    fullscreen: false,
    firststop: true,
    videoplay: false,
    share: app.data.share,
    showContact: false,
    canvasimg: '',
    closeShareModal: false,
    showPhoneModal: false,
    ios: false,
    i: 0
  },
  //video
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  showPhoneModal() {
    this.setData({
      showPhoneModal: true
    })
  },

  makePhone() {
    const that = this
    wx.makePhoneCall({
      phoneNumber: '13810755845',
      success() {
        that.setData({
          showPhoneModal: false
        })
      }
    })
  },

  hidePhoneModal() {
    this.setData({
      showPhoneModal: false
    })
  },
  showShareModal() {
    this.setData({
      showShareModal: true
    })
  },
  togive() {
    wx.navigateTo({
      url: '/pages/invite/invite?intype=2&goods_id=' + this.data.courseList.id,
    })
    this.setData({
      showShareModal: false
    })
  },
  stopFather() {
    this.setData({
      showShareModal: false
    })
    return false
  },

  closeShare() {
    this.setData({
      showShareModal: false
    })
  },
  playVideo(e){
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
                    // wx.navigateBack()
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
  //video进度
  videoTimeUpdated: function (e) {
    // var that = this
    var playtime = e.detail.currentTime
    // if(this.data.firststop){
    //   if (e.detail.currentTime) {
    //     console.log(e.detail.currentTime)
    //     that.videoContext.pause()
    //     this.setData({
    //       firststop: false
    //     })
    //   }
    // }else{
    //   return
    // }
    this.setData({
      playtime: playtime
    })
   
    
    // wx.hideLoading()
  },
  // videowaiting(e){
  //   wx.showLoading({
  //     title: '视频加载中',
  //     icon: 'loading'
  //   })
  // },
  startDraw() {
    const that = this;
    let bg = '../../images/video-bg.png'; //背景
    let bgW;
    let bgH;
    let avatar = this.data.courseList.lecturer.avatar; //头像
    let name = this.data.courseList.lecturer.name;// 昵称
    if (name.length > 14) {
      name = name.substring(0, 14) + '...'
    } else {
      name = name
    };
    let text;// 说明文字
    if (this.data.courseList.name.length > 12) {
      text = this.data.courseList.name.substring(0, 12) + '...'
    } else {
      text = this.data.courseList.name
    };

    text = '我正在学习【' + text + '】'

    let codeimg = this.data.codeimg;
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
                lecturer_id: this.data.courseList.lecturer.id
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
        path: '/pages/video_details/video_details?id=' + this.data.id + '&share=1',
        width: 430,
        api_token: wx.getStorageSync('token'),
        goods_id: this.data.id,
        type: 2
      }
    }).then(res => {
      this.setData({
        codeimg: res.data.path
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

  closeShareModal () {
    this.setData({
      closeShareModal: false
    })
  },

  stopFather() {
    return false
  },


  fullscreenchange: function (e) {
    var isfall = e.detail.fullScreen
    this.setData({
      fullscreen: isfall
    })
  },
  videoerror(res){
    wx.showToast({
      title: '视频加载中',
      icon: 'none'
    })
  },


  //设置评价星级
  
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  },

  feedSubmit: function (e) {
    var content = e.detail.value.content
    var _that = this
    if (e.detail.value.content.length > 0) {
      wx.$.fetch(`api/evaluate/add`, {
        method: 'post',
        data: {
          score: this.data.key,
          content: content,
          course_id: this.data.courseList.id,
          api_token: wx.getStorageSync('token')
        }
      }).then(res => {
        var courseList = this.data.courseList
        console.log(courseList)
        courseList.evaluate_num = courseList.evaluate_num + 1
        courseList.is_evaluate = true
        this.setData({
          page: 1,
          allcommList: [],
          evalshow: false,
          giveshow: true,
          courseList: courseList
        })
        _that.geteval()
      })
    } else {
      wx.showToast({
        title: '评价内容为空！',
        icon: 'none'
      })
      return
    }
  },
  celeval() {
    this.setData({
      evalshow: false,
      giveshow: true
    })
  },

//页面跳转
  tokejian() {
    wx.$.fetch('api/lesson/attach?id=' + this.data.courseList.lesson[0].id, { hideLoading: true }).then(res => {
      var attachList = res.data.data
      attachList.forEach(item => {
        item.size = (item.size / (1024 * 1024)).toFixed(2)
      })
      this.setData({
        attachList: attachList,
        attachshow: true
      })
    })
  },
  kejianhide() {
    this.setData({
      attachshow: false
    })
    wx.hideLoading()
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
  tocomplaints(e) {
    var goods_id = e.currentTarget.dataset.id
    this.videoContext.pause()
    clearTimeout(timer)
    wx.navigateTo({
      url: '/pages/complaints/complaints?course_id=' + goods_id,
    })
  },
  topublishedcomm() {
    if (this.data.courseList.is_evaluate == true) {
      wx.showToast({
        title: '已经进行过评价！',
        icon: 'none'
      })
      return
    } else {
      this.videoContext.pause()
      clearTimeout(timer)
      this.setData({
        evalshow: true,
        giveshow: false,
        attachshow: false
      })
    }
  },
  toinvite() {
    this.videoContext.pause()
    clearTimeout(timer)
    wx.navigateTo({
      url: '/pages/invite/invite?intype=2&goods_id=' + this.data.courseList.id,
    })
    this.setData({
      evalshow: false,
      giveshow: true
    })
  },
  togift() {
    this.videoContext.pause()
    clearTimeout(timer)
    wx.navigateTo({
      url: '/pages/giving/giving',
    })
    this.setData({
      evalshow: false,
      giveshow: false
    })
  },
  toaboutlecturer(e) {
    this.videoContext.pause()
    clearTimeout(timer)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/teacherHome/index?id=' + id,
    })
  },

//获取成功显示
  addnum() {
    this.setData({
      buynum: this.data.buynum += 1,
      zongjia: ((this.data.buynum * 100) * (this.data.courseList.price * 100)) / 10000
    })
  },
  subtractnum() {
    if (this.data.buynum <= 1) {
      this.setData({
        buynum: 1,
        zongjia: ((this.data.buynum * 100) * (this.data.courseList.price * 100)) / 10000
      })
      return
    }
    this.setData({
      buynum: this.data.buynum -= 1,
      zongjia: ((this.data.buynum * 100) * (this.data.courseList.price * 100)) / 10000
    })
  },

  givefirend() {
    if (this.data.courseList.price == 0) {
      wx.showToast({
        title: '此类商品不能赠送！',
        icon: 'none'
      })
    } else {
      this.setData({
        shuomintit: true,
        dark: true,
        zongjia: ((this.data.buynum * 100) * (this.data.courseList.price * 100)) / 10000
      })
    }
  },
  paynext() {
    this.setData({
      shuomintit: false,
      paycon: true
    })
  },
  darkclick() {
    this.setData({
      shuomintit: false,
      paycon: false,
      dark: false,
      giveshow: true
    })
  },

  ///获取成功//////////////////////////////
  closeContact() {
    this.setData({
      showContact: false
    })
  },

  callBack() {
    this.setData({
      showContact: false
    })
  },

  noHandler() {
    return false
  },

  buthis() {
    this.videoContext.pause()
    clearTimeout(timer)
    var _that = this
    const system = wx.getSystemInfoSync().system

    if (system.indexOf("iOS") != -1) {
      var buyInfo = {
        goods_id: this.data.courseList.id,
        goods_type: 'buy',
        quantity: 1
      };

      buyInfo = JSON.stringify(buyInfo)
      if (this.data.courseList.examining) {
        wx.showModal({
          title: '提示',
          content: 'IOS设备暂不支持，敬请谅解。',
          showCancel: false
        })
      } else {
        this.setData({
          buyInfo: buyInfo,
          showContact: true,
          ios: true
        })
      }
      //IOS
    } else {
      wx.$.fetch(`api/order`, {
        method: 'post',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          course_id: this.data.courseList.id,
          api_token: wx.getStorageSync('token')
        }
      }).then(res => {
        wx.requestPayment({
          'timeStamp': res.data.data.out_trade.timestamp,
          'nonceStr': res.data.data.out_trade.nonceStr,
          'package': res.data.data.out_trade.package,
          'signType': 'MD5',
          'paySign': res.data.data.out_trade.paySign,
          'success': function (res) {
            wx.showToast({
              title: '获取成功'
            })
            _that.getjson()
          }
        })
      })
    }
  },
  ///////////////////////////////////////
  //////////赠送////////////////
  givebuy() {
    var _that = this
    const system = wx.getSystemInfoSync().system
    if (system.indexOf("iOS") != -1) {
      this.videoContext.pause()
      clearTimeout(timer)
      var buyInfo = {
        goods_id: this.data.courseList.id,
        goods_type: 'give',
        quantity: 1
      };

      buyInfo = JSON.stringify(buyInfo)
      if (this.data.courseList.examining) {
        wx.showModal({
          title: '提示',
          content: 'IOS设备暂不支持，敬请谅解。',
          showCancel: false
        })
      } else {
        this.setData({
          buyInfo: buyInfo,
          showContact: true,
          paycon: false,
          dark: false,
          ios: true
        })
      }
    } else {
      wx.$.fetch(`api/order`, {
        method: 'post',
        data: {
          course_id: this.data.courseList.id,
          api_token: wx.getStorageSync('token'),
          type: 'give',
          quantity: this.data.buynum
        }
      }).then(res => {
        this.videoContext.pause()
        clearTimeout(timer)
        wx.requestPayment({
          'timeStamp': res.data.data.out_trade.timestamp,
          'nonceStr': res.data.data.out_trade.nonceStr,
          'package': res.data.data.out_trade.package,
          'signType': 'MD5',
          'paySign': res.data.data.out_trade.paySign,
          'success': function (res) {
            this.setData({
              giveshow: true
            })
            
            wx.navigateTo({
              url: '/pages/giftrecord/giftrecord',
            })
          }
        })
      })
    }
  },
  ////////////////////////////////////


//数据请求
  onLoad(options) {
    
    this.setData({
      id: options.id
    })
    this.getToken()
    if (wx.getStorageSync('teacherId') != null) {
      var lecturerId = wx.getStorageSync('teacherId')
      this.setData({
        lecturerId: lecturerId
      })
    };
    if (options.share == 1) {
      this.setData({
        share: true
      })
    };
    const system = wx.getSystemInfoSync().system
    if (system.indexOf("iOS") != -1) {
      this.setData({
        ios: true
      })
    }
  },
  onShow() {
    this.setData({
      page: 1,
      share: app.data.share,
      allcommList: []
    })
    this.geteval()
    this.getjson()
  },
  geteval(){
    wx.$.fetch('api/evaluate?course_id=' + this.data.id + '&page=' + this.data.page, { hideLoading: true }).then(res => {
      var data = res.data.data
      if (data.length > 0) {
        var allcommList = this.data.allcommList
        allcommList = allcommList.concat(data)
        this.setData({
          allcommList: allcommList
        })
      }
    })
  },
  getjson() {
    var that = this
    wx.$.fetch('api/course?id=' + this.data.id, { hideLoading: true }).then(res => {
      if (res.data.state == 200) {
        this.setData({
          price: parseFloat(res.data.data.price),
          courseList: res.data.data,
          cid: res.data.data.lesson[0].id,
          is_focus: res.data.data.is_focus,
          is_collect: res.data.data.is_collect
        })
        var jianjie = res.data.data.desc
        var that = this
        WxParse.wxParse('jianjie', 'html', jianjie, that, 5)
        wx.$.fetch('api/lesson?id=' + this.data.courseList.lesson[0].id, { hideLoading: true }).then(res => {
          this.setData({
            videoSrc: res.data.data.lesson[0].url
          })
        })
        

        if (this.data.courseList.is_Purchased) {
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
            }, 6000)
          } else {
            return false
          }
          
        }
      }else if (res.data.state == 400) {
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  //关注取消关注
  focusLea() {
    wx.$.fetch(`api/addFocus`, {
      method: 'post',
      data: {
        lecturer_id: this.data.courseList.lecturer.id,
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      //this.getjson()
      this.setData({
        is_focus: true
      })
    })
  },
  cancelfcous() {
    wx.$.fetch(`api/disFocus`, {
      method: 'post',
      data: {
        lecturer_id: this.data.courseList.lecturer.id,
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      //this.getjson()
      this.setData({
        is_focus: false
      })
    })
  },
  //收藏取消收藏
  collectdel() {
    wx.$.fetch(`api/addCollect`, {
      method: 'post',
      data: {
        goods_id: this.data.courseList.id,
        api_token: wx.getStorageSync('token'),
        is_collect: true
      }
    }).then(res => {
      //this.getjson()
      this.setData({
        is_collect: true
      })
      wx.showToast({
        title: '收藏成功!',
        icon: 'none'
      })
    })
  },
  cancelcollect() {
    wx.$.fetch(`api/cancelCollect`, {
      method: 'post',
      data: {
        goods_id: this.data.courseList.id,
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      //this.getjson()
      this.setData({
        is_collect: false
      })
      wx.showToast({
        title: '取消收藏成功!',
        icon: 'none'
      })
    })
  },

  onUnload() {
    if (this.data.courseList.is_Purchased == true) {
      wx.$.fetch(`api/course/learnRecord`, {
        method: 'post',
        data: {
          course_id: this.data.id,
          lesson_id: this.data.cid,
          time: this.data.playtime,
          api_token: wx.getStorageSync('token'),
        }
      }).then(res => {

      })
    } else {
      return
    }

    clearTimeout(timer)
  },
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.geteval()
  },
  _backhome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
    app.data.share = false
  },
  onShareAppMessage() {
    this.setData({
      showShareModal: false
    })
   }
  
})