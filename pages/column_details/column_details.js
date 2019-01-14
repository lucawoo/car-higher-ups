var app = getApp()

Page({
  data: {
    fixed: true,
    menus: ['详情', '目录'],
    tabIndex: 0,
    buynum: 1,
    shuomintit: false,
    dark: false,
    paycon: false,
    firstcome: false,
    evalshow: false,
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/starH.png',
    selectedSrc: '../../images/starW.png',
    key: 1,
    sort: true,
    share: app.data.share
  },

  trysee(e) {
    var id = e.currentTarget.dataset.id
    var fid = e.currentTarget.dataset.fid
    var type = e.currentTarget.dataset.type
    var purchased = e.currentTarget.dataset.purchased
      if (type == 'article') {
        wx.navigateTo({
          url: '/pages/clumArt/clumArt?id=' + id + '&fid=' + fid + '&purchased=' + purchased,
        })
      } else if (type == 'audio') {
        wx.navigateTo({
          url: '/pages/clumAudio/clumAudio?id=' + id + '&fid=' + fid,
        })
      } else if (type == 'video') {
        wx.navigateTo({
          url: '/pages/clumVideo/clumVideo?id=' + id + '&fid=' + fid,
        })
      }
  },




  showMenuDetail(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex
    })
  },


  toclum(e) {
    var id = e.currentTarget.dataset.id
    var fid = e.currentTarget.dataset.fid
    var type = e.currentTarget.dataset.type
    var purchased = e.currentTarget.dataset.purchased
    var is_eval = e.currentTarget.dataset.is_eval
    if (purchased == true) {
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
    } else {
      
    }
  },
  togive() {
    wx.navigateTo({
      url: '/pages/invite/invite?intype=5&goods_id=' + this.data.courseList.id,
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop>200){
      this.setData({
        fixed: false
      })
    } else {
      this.setData({
        fixed: true
      })
    }
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
  buthis() {
    var _that = this
    const system = wx.getSystemInfoSync().system

    if (system.indexOf("iOS") != -1) {
      var token = wx.getStorageSync('token')
      wx.navigateTo({
        url: '/pages/web-view/index?api_token=' + token + '&course_id=' + this.data.courseList.id + '&type=buy' + '&formios=1' + '&price=' + this.data.courseList.price,
      })
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
      var token = wx.getStorageSync('token')
      wx.navigateTo({
        url: '/pages/web-view/index?api_token=' + token + '&course_id=' + this.data.courseList.id + '&type=give' + '&formios=1' + '&price=' + this.data.zongjia + '&quantity=' + this.data.buynum,
      })
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

//请求数据
  onLoad(options){
    this.setData({
      id: options.id
    })
    this.getjson()
  },

  getjson(){
    wx.$.fetch('api/course?id=' + this.data.id, { hideLoading: true }).then(res => {
      this.setData({
        price: parseFloat(res.data.data.price),
        courseList: res.data.data,
        lessonList: res.data.data.lesson
      })
    })
  },

  sortlist() {
    this.setData({
      lessonList: this.data.courseList.lesson.reverse()
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
      this.getjson()
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
      this.getjson()
      wx.showToast({
        title: '取消收藏成功!',
        icon: 'none'
      })
    })
  },

  onShow(){
    if (app.data.firstcome == 1) {
      this.setData({
        firstcome: true
      })
    }
  },
  iknow() {
    this.setData({
      firstcome: false
    })
    app.data.firstcome = 2
  },

  _backhome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
    app.data.share = false
  },
  onShareAppMessage() { }

})