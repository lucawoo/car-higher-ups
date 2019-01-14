Page({
  data: {
    focusList: [],
    page: 1
  },
  onShow() {
    this.setData({
      focusList: [],
      page: 1
    })
    this.getjson()
  },

  getjson(){
    wx.$.fetch(`api/focusList?page=${this.data.page}`).then(res => {
      var data = res.data.data.data;
      if (data.length > 0) {
        var focusList = this.data.focusList
        focusList = focusList.concat(data)
        this.setData({
          focusList: focusList
        })
      }
    })
  },

  cancelfcous(e) {
    wx.$.fetch(`api/disFocus`, {
      method: 'post',
      data: {
        lecturer_id: e.currentTarget.dataset.sss,
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      wx.showToast({
        title: res.data.msg,
      })
      setTimeout(() => {
        this.setData({
          focusList: [],
          page: 1
        })
        this.getjson()
      },500)
    })
  },

  toteacherHome(e){
    var teacherid = e.currentTarget.dataset.teacherid
    wx.navigateTo({
      url: '/pages/teacherHome/index?id=' + teacherid,
    })
  },

  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getjson()
  }

})