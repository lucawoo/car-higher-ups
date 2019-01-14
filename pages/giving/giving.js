Page({
  data: {
    
  },

  onLoad(options){
    this.setData({
      url: wx.$.host,
      id: options.id,
      price: options.price,
      tit: options.tit,
      token: options.token,
      type: options.type,
      course_id: options.course_id,
      c_type: options.c_type,
      cover: options.cover
    })
  },
  
  getmsg(e){
    this.setData({
      message: e.detail.value
    })
  },

  onShareAppMessage: function () {
    var _that = this
    return {
      title: this.data.tit,
      desc: this.data.message ? this.data.message : '邀请你来一起学习',
      path: '/pages/acceptgive/acceptgive?tit=' + this.data.tit + '&price=' + this.data.price + '&message=' + this.data.message + '&member_name=' + wx.getStorageSync('info').member_name + '&member_avatar=' + wx.getStorageSync('info').avatar + '&token=' + this.data.token + '&type=' + this.data.type + '&course_id=' + this.data.course_id + '&c_type=' + this.data.c_type + '&id=' + this.data.id,
      success: function (res) {

        wx.$.fetch(`api/member/give/save_message`, {
          method: 'post',
          header: {
            'Accept': 'application/json'
          },
          data: {
            id: _that.data.id,
            api_token: wx.getStorageSync('token'),
            message: _that.data.message ? _that.data.message : '邀请你来一起学习'
          }
        }).then(res => {
          wx.navigateBack({
            delta: 1
          })
        })

      },
    }
  }


})