Page({
  data:{
    dark: false,
    walcont: false,
    page:1,
    allfinanceList:[],
    bindCont: false,
    showModal: false,
  },
  onLoad() {
    wx.$.fetch(`api/finance/show`).then(res => {
      this.setData({
        accList: res.data.data,
        today_income: res.data.data.today_income
      })
      console.log(this.data.accList)
    })
    this.getfinancelist()
  },

  //页面跳转
  todetail() {
    wx.navigateTo({
      url: '/pages/alldetail/alldetail',
    })
  },
  // 提现弹窗说明
  openModa() {
    this.setData({
      showModal: true
    })
  },

  //关闭提示
  closeModal() {
    this.setData({
      showModal: false
    })
  },
  //提现
  alert() {
    this.setData({
      dark: true,
      walcont: true
    })
  },
  dark() {
    this.setData({
      dark: false,
      walcont: false
    })
  },
  //cont
  timoney(e) {
    this.setData({
      yue: e.detail.value
    })
  },
  tixian() {
    var yue = this.data.yue
    if (yue.length <= 0) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return
    } else {
      if (this.data.yue == 0) {
        wx.showToast({
          title: '请输入有效金额',
          icon: 'none'
        })
        
      } else if (this.data.yue >= 1) {
        wx.$.fetch(`api/finance/withdraw`, {
          method: 'post',
          data: {
            price: this.data.yue,
            api_token: wx.getStorageSync('token')
          }
        }).then(res => {
          if (res.data.state == 400) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            this.setData({
              dark: false,
              walcont: false
            })
          } else if (res.data.state == 200) {
            wx.showToast({
              title: res.data.msg
            })
            this.setData({
              dark: false,
              walcont: false
            })
          }
        })
      } else if (this.data.yue < 1) {
        wx.showToast({
          title: '提现金额需大于1元',
          icon: 'none'
        })
      }
    }
  },

  getfinancelist(){
    wx.$.fetch(`api/finance/list?type=''&page=${this.data.page}`,{hideLoading: true}).then(res => {
      var data = res.data.data;
      if (data.length > 0) {
        var allfinanceList = this.data.allfinanceList
        allfinanceList = allfinanceList.concat(data)
        this.setData({
          allfinanceList: allfinanceList
        })
      }
    })
  },

  //下拉加载
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getfinancelist()
  }
})