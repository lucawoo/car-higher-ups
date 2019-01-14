var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util');
var base = new util.Base64()
var app = getApp()

Page({
  
  data: {
    src: '',
    id: '',
    url: wx.$.host,
    firstcome: false
  },
  onLoad(options) {
    if (options.formios==1){
      this.setData({
        course_id: options.course_id,
        type: options.type,
        api_token: options.api_token,
        formios: options.formios,
        price: options.price,
        quantity: options.quantity
      })
    }
    if (options.src) {
      if (options.infor) {
        var src = options.src
      }else{
        var src = options.src
        src = base.decode(src)
      }
      if (src) this.setData({ src: src });
    }
    
    if (options.id) {
      this.setData({id: options.id})
      this.getData(options.id)
    }
  },
  onShow(){
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

  getData(id) {
    let that = this
    wx.$.fetch(`api/firstBanner?ap_id=1`).then(res => {
      const data = res.data.data
      let content;
      data.forEach(item => {
        if (item.adv_id == id) {
          content = item.adv_detail
        }
      })
      WxParse.wxParse('content', 'html', content, that, 5);
    })
  },


})