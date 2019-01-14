var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    fixed: true,
    menus: ['详情', '目录', '评价'],
    tabIndex: 0,
    buynum: 1,
    shuomintit: false,
    dark: false,
    paycon: false,
    takeoff: true,
    takeon: false,
    viewoff: true,
    takeevaloff: true,
    takeevalon: false,
    evalviewoff: true,
    // firstcome: false,
    evalshow: false,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/starH.png',
    selectedSrc: '../../images/starW.png',
    key: 5,
    sort: true,
    page: 1,
    allcommList: [],
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
        data: {
          score: this.data.key,
          content: content,
          course_id: this.data.courseList.id,
          api_token: wx.getStorageSync('token')
        }
      }).then(res => {
        this.setData({
          evalshow: false,
          page: 1,
          allcommList: []
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


  takeoff(){
    this.setData({
      takeoff: false,
      takeon: true,
      viewoff: false
    })
  },
  takeon(){
    this.setData({
      takeoff: true,
      takeon: false,
      viewoff: true
    })
  },

  takeevaloff(){
    this.setData({
      takeevaloff: false,
      takeevalon: true,
      evalviewoff: false
    })
  },
  takeevalon() {
    this.setData({
      takeevaloff: true,
      takeevalon: false,
      evalviewoff: true
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 193) {
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
//页面跳转
  toclum(e){
    var id = e.currentTarget.dataset.id
    var fid = e.currentTarget.dataset.fid
    var type = e.currentTarget.dataset.type
    var purchased = e.currentTarget.dataset.purchased
    var is_eval = e.currentTarget.dataset.is_eval
    var is_try_see = e.currentTarget.dataset.is_try_see
    if (purchased == true || this.data.lecturerId == this.data.courseList.lecturer.id || is_try_see == true){
      if (type == 'article') {
        wx.navigateTo({
          url: '/pages/clumArt/clumArt?id=' + id + '&fid=' + fid + '&purchased=' + purchased + '&is_eval=' + is_eval,
        })
      } else if (type == 'audio') {
        wx.navigateTo({
          url: '/pages/clumAudio/clumAudio?id=' + id + '&fid=' + fid + '&purchased=' + purchased + '&is_eval=' + is_eval,
        })
      } else if (type == 'video') {
        wx.navigateTo({
          url: '/pages/clumVideo/clumVideo?id=' + id + '&fid=' + fid + '&purchased=' + purchased + '&is_eval=' + is_eval,
        })
      }
    }else{
      wx.showToast({
        title:'需要获取课程才能查看'
        ,icon: 'none'
      })
    }
    
  },
  toallcomments(e) {
    var goods_id = e.currentTarget.dataset.id
    var purchased = e.currentTarget.dataset.buy
    var is_eval = e.currentTarget.dataset.is_eval
    wx.navigateTo({
      url: '/pages/comments/comments?course_id=' + goods_id + '&is_Purchased=' + purchased + '&is_eval=' + is_eval,
    })
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
        evalshow: true
      })
    }
  },
  toaboutlecturer(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/teacherHome/index?id=' + id,
    })
  },
  togive() {
    wx.navigateTo({
      url: '/pages/invite/invite?intype=4&goods_id=' + this.data.courseList.id,
    })
    this.setData({
      showShareModal: true
    })
  },


  //数据请求
  onShow(){
    //

    if (this.data.lessonItem == undefined) {
      this.setData({
        lessonItem: 0
      })
    }
    this.setData({
      page: 1,
      share: app.data.share,
      allcommList: []
    })
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
  getjson() {
    this.geteval()
    wx.$.fetch('api/course?id=' + this.data.id, { hideLoading: true }).then(res => {
      if (res.data.state == 200) {
        let courseList = res.data.data
        courseList.up_time = courseList.up_time.split(' ')[0]
        this.setData({
          price: parseFloat(res.data.data.price),
          courseList: res.data.data,
          lessonList: res.data.data.lesson,
          lessonItem: res.data.data.lesson.length
        })
        var jianjie = res.data.data.desc
        var that = this
        WxParse.wxParse('jianjie', 'html', jianjie, that, 5)
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


  sortlist() {
    this.setData({
      lessonList: this.data.courseList.lesson.reverse()
    })
    if (this.data.sort==true){
      this.setData({
        sort: false
      })
    }else{
      this.setData({
        sort: true
      })
    }
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
      this.getjson()
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
      this.getjson()
    })
  },
  //收藏取消收藏
  collectdel() {
    wx.$.fetch(`api/addCollect`, {
      method: 'post',
      data: {
        goods_id: this.data.courseList.id,
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      wx.showToast({
        title: '收藏成功!',
        icon: 'none'
      })
      this.getjson()
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
      wx.showToast({
        title: '取消收藏成功!',
        icon: 'none'
      })
      this.getjson()
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
              title: '学习成功'
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