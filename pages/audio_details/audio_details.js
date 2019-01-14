const utils = require('../../utils/util.js')
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    buynum: 1,
    shuomintit: false,
    dark: false,
    paycon: false,
    audioAction: {
      method: 'pause'
    },
    isplay: true,
    evalshow: false,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/starH.png',
    selectedSrc: '../../images/starW.png',
    key: 5,
    page: 1,
    allcommList: [],
    attachshow: false,
    goodfirst: true,
    lecturerId: false,
    share: app.data.share,
    showContact: false,
    showShareModal: false,
    showPhoneModal: false,
    ios: false
  },
  //设置评价星级
  celeval() {
    this.setData({
      evalshow: false
    })
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
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  },

  showShareModal() {
    this.setData({
      showShareModal: true
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

  feedSubmit: function (e) {
    var content = e.detail.value.content
    var _that = this
    if (e.detail.value.content.length > 0) {
      wx.$.fetch(`api/evaluate/add`, {
        method: 'post',
        hideLoading: true,
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


  //页面跳转
  tokejian() {
    this.setData({
      attachshow: true
    })
    wx.$.fetch('api/lesson/attach?id=' + this.data.courseList.lesson[0].id, { hideLoading: true }).then(res => {
      var attachList = res.data.data
      attachList.forEach(item => {
        item.size = (item.size / (1024 * 1024)).toFixed(2)
      })
      this.setData({
        attachList: res.data.data
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
    wx.setStorageSync('played', this.data.sendplaytime)
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
      this.setData({
        evalshow: true,
        attachshow: false
      })
    }
  },
  toaboutlecturer(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/teacherHome/index?id=' + id,
    })
  },
  togive() {
    wx.navigateTo({
      url: '/pages/invite/invite?intype=3&goods_id=' + this.data.courseList.id,
    })
    this.setData({
      showShareModal: true
    })
  },



//播放视频
  audioPlayed: function (e) {
    console.log('audio is play')
  },
  audioend: function(){
    this.setData({
      isplay: true
    })
  },
  audioTimeUpdated: function (e) {
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    var sendplaytime = e.detail.currentTime
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

  playAudio: function () {
    if (app.data.playfirst){
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
                  // wx.navigateBack()
                }
              },
            })
          }
        }
      })
    }else{
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
        zongjia: ((this.data.buynum*100) * (this.data.courseList.price * 100))/10000
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
      dark: false
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
    var _that = this
    const system = wx.getSystemInfoSync().system

    if (system.indexOf("iOS") != -1) {
      var token = wx.getStorageSync('token')
      // if (wx.getStorageSync('is_vip')) {
      //   wx.navigateTo({
      //     url: '/pages/web-view/index?api_token=' + token + '&course_id=' + this.data.courseList.id + '&type=buy' + '&formios=1' + '&price=' + this.data.courseList.vip_scale,
      //   })
      // } else {
      //   wx.navigateTo({
      //     url: '/pages/web-view/index?api_token=' + token + '&course_id=' + this.data.courseList.id + '&type=buy' + '&formios=1' + '&price=' + this.data.courseList.price,
      //   })
      // }
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
      // var token = wx.getStorageSync('token')
      // wx.navigateTo({
      //   url: '/pages/web-view/index?api_token=' + token + '&course_id=' + this.data.courseList.id + '&type=give' + '&formios=1' + '&price=' + this.data.zongjia + '&quantity=' + this.data.buynum,
      // })
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
        wx.requestPayment({
          'timeStamp': res.data.data.out_trade.timestamp,
          'nonceStr': res.data.data.out_trade.nonceStr,
          'package': res.data.data.out_trade.package,
          'signType': 'MD5',
          'paySign': res.data.data.out_trade.paySign,
          'success': function (res) {
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
    if (wx.getStorageSync('teacherId') != null) {
      var lecturerId = wx.getStorageSync('teacherId')
      this.setData({
        lecturerId: lecturerId
      })
    };
    if (system.indexOf("iOS") != -1) {
      this.setData({
        ios: true
      })
    }
    

  },
  onShow() {
    
    this.setData({
      page: 1,
      allcommList: [],
      share: app.data.share,
    })
    if (wx.getStorageSync('played')) {
      this.setData({
        audioAction: {
          method: 'play'
        },
        btnshow: (!this.data.btnshow),
        isplay: false
      })
    }
    this.getjson()
  },
  geteval(){
    wx.$.fetch('api/evaluate?course_id=' + this.data.id + '&page=' + this.data.page).then(res => {
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
  // iknow() {
  //   this.setData({
  //     firstcome: false
  //   })
  //   app.data.firstcome = 2
  // },

  getjson() {
    this.geteval()
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
            audioSrc: res.data.data.lesson[0].url
          })
        })
      } else if (res.data.state == 400) {
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


  onUnload(){
    if (this.data.courseList.is_Purchased == true) {
      wx.$.fetch(`api/course/learnRecord`, {
        method: 'post',
        data: {
          course_id: this.data.id,
          lesson_id: this.data.cid,
          time: this.data.sendplaytime,
          api_token: wx.getStorageSync('token'),
        }
      }).then(res => {

      })
    } else {
      return
    }
    wx.removeStorageSync('played')
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
  },
  onShareAppMessage() {
    this.setData({
      showShareModal: false
    })
   }

})