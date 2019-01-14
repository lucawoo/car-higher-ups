var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var app = getApp()
var base = new util.Base64()


Page({
  //初始数据
  data: {
    buynum: 1,
    shuomintit: false,
    dark: false,
    paycon: false,
    evalshow: false,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/starH.png',
    selectedSrc: '../../images/starW.png',
    key: 5,
    allcommList:[],
    page: 1,
    attachshow: false,
    desctitle: '<简介>',
    lecturerId: false,
    share: app.data.share,
    showContact: false,
    showShareModal: false,
    showPhoneModal: false,
    ios: false,
  },
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
  },
  onShow() {
    this.setData({
      page: 1,
      allcommList: [],
      share: app.data.share,
    })
    console.log(app.data.share)
    this.getjson()
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

  hidePhoneModal () {
    this.setData({
      showPhoneModal: false
    })
  },

  //设置评价星级
  celeval(){
    this.setData({
      evalshow: false
    })
  },
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  },

  //提交
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
        this.setData({
          page: 1,
          allcommList: [],
          evalshow: false,
          giveshow: true,
        })
        _that.getjson()
      })
    } else {
      wx.showToast({
        title: '评价内容为空！',
        icon: 'none'
      })
      return
    }


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

//页面跳转
  tokejian(){
    wx.$.fetch('api/lesson/attach?id=' + this.data.courseList.lesson[0].id, { hideLoading: true }).then(res => {
      var attachList = res.data.data
      attachList.forEach(item=>{
        item.size = (item.size / (1024 * 1024)).toFixed(2)
      })
      this.setData({
        attachList: res.data.data,
        attachshow: true
      })
    })
  },
  kejianhide(){
    this.setData({
      attachshow: false
    })
    wx.hideLoading()
  },
  seeattach(e){
    var atturl = e.currentTarget.dataset.url
    var container = e.currentTarget.dataset.container
    if (container == 'jpeg' || container == 'jpg' || container == 'png'){
      wx.previewImage({
        current: atturl,
        urls: [atturl]
      })
    }else{
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
      url: '/pages/invite/invite?intype=1&goods_id=' + this.data.courseList.id,
    })
    this.setData({
      showShareModal: true
    })
  },


  //赠送数量
  addnum(){
    this.setData({
      buynum: this.data.buynum += 1,
      zongjia: ((this.data.buynum * 100) * (this.data.courseList.price * 100)) / 10000
    })
  },
  subtractnum(){
    if (this.data.buynum<=1){
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

  givefirend(){
    if (this.data.courseList.price==0){
      wx.showToast({
        title: '此商品商品不能赠送！',
        icon: 'none'
      })
    }else{
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
  darkclick(){
    this.setData({
      shuomintit: false,
      paycon: false,
      dark: false
    })
  },

  ///获取//////////////////////////////
  closeContact(){
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
      // var token = wx.getStorageSync('token')
      // if (wx.getStorageSync('is_vip')) {
        // wx.navigateTo({
        //   url: '/pages/web-view/index?api_token=' + token + '&course_id=' + this.data.courseList.id + '&type=buy' + '&formios=1' + '&price=' + this.data.courseList.vip_scale,
        // })
        //'goods_id=' + this.data.courseList.id + '&goods_type=buy&quantity=' + 1
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
        
      // } else {
        // wx.navigateTo({
        //   url: '/pages/web-view/index?api_token=' + token + '&course_id=' + this.data.courseList.id + '&type=buy' + '&formios=1' + '&price=' + this.data.courseList.price,
        // })
      // }
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
  givebuy(){
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

  // iknow(){
  //   this.setData({
  //     firstcome: false
  //   })
  //   app.data.firstcome = 2
  // },
  
  getjson() {
    this.geteval()
    var tsh= this
    wx.$.fetch('api/course?id=' + this.data.id, { hideLoading: true }).then(res => {
      if (res.data.state == 200) {
        this.setData({
          courseList: res.data.data,
          price: parseFloat(res.data.data.price),
          is_focus: res.data.data.is_focus,
          is_collect: res.data.data.is_collect
        })
        var content = res.data.data.lesson[0].try_see_content;
        var desc = res.data.data.desc;
        var that = this;
        WxParse.wxParse('content', 'html', content, that, 5);
        WxParse.wxParse('desc', 'html', desc, that, 5);
        wx.$.fetch('api/lesson?id=' + this.data.courseList.lesson[0].id, { hideLoading: true }).then(res => {
          var allcontent = res.data.data.lesson[0].content
          WxParse.wxParse('allcontent', 'html', allcontent, that, 5);
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
  onShareAppMessage(){
    this.setData({
      showShareModal: false
    })
  }
  
})