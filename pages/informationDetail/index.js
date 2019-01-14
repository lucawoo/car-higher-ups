// pages/informationDetail/index.js
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  //video
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 页面的初始数据
   */

  data: {
    Comments:[],
    infoDetail: {},
    id: '',
    page: 1,
    // firstcome: false,
    share: app.data.share
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      info: wx.getStorageSync('info')
    })

  },
  onShow() {
    this.infoDetailData(this.data.id)
    this.getComment(this.data.id)
    // if (app.data.firstcome == 1) {
    //   this.setData({
    //     firstcome: true
    //   })
    // }
  },
  // iknow() {
  //   this.setData({
  //     firstcome: false
  //   })
  //   app.data.firstcome = 2
  // },

  infoDetailData(id) {
    wx.$.fetch(`api/informationDetail?id=${id}`, { hideLoading: true }).then(res => {
      var content = res.data.data.content;
      var that = this;
      WxParse.wxParse('content', 'html', content, that, 0);
      this.setData({
        infoDetail: res.data.data,
      })
    })
  },


  // 获取评论
  getComment(id) {
    wx.$.fetch(`api/informationEval?id=${id}&page=${this.data.page}`, {
      method: 'post',
      data: {
        id: id
      }
    }).then(res => {
      var data = res.data.data.data;
      if (data.length > 0) {
        var Comments = this.data.Comments
        Comments = Comments.concat(data)
        this.setData({
          Comments: Comments
        })
      }
    })
  },

  
  // 提交评论
  submitData(e) {
    var geval_content = e.detail.value
    if (geval_content) {
      wx.$.fetch('api/addEvaluate', {
        method: 'post',
        data: {
          info_id: this.data.id,
          geval_content: geval_content,
          member_id: this.data.info.member_id,
          api_token: wx.getStorageSync('token')
        }
      }).then(res => {
        this.infoDetailData(this.data.id)
        this.setData({
          inputVal: '',
          Comments: [],
          page: 1
        })
        this.getComment(this.data.id)
        wx.showToast({
          title: res.data.msg,
        })
      })
    }
    
  },

  onShareAppMessage(){
    
  },

  _backhome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
    app.data.share = false
  },
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getComment(this.data.id)
  }


})