Page({
  data: {
    menus: ['收益', '提现'],//, '支出'
    tabIndex: 0,
    page: 1,
    incomeList:[],
    spendList:[],
    withdrawList:[]
  },
  showMenuDetail(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex,
      page:1
    })
  },
  onLoad(){
    this.getincome()
    this.getspend()
    this.getwithdraw()
  },

  getincome(){
    //收益
    wx.$.fetch(`api/finance/list?type=income&page=${this.data.page}`).then(res => {
      var incom = res.data.meta.income
      var data = res.data.data;
      if (data.length > 0) {
        var incomeList = this.data.incomeList
        incomeList = incomeList.concat(data)
        this.setData({
          incomeList: incomeList,
          incom: incom
        })
      }
    })
  },
  getspend(){
    //支出
    wx.$.fetch(`api/finance/list?type=spend&page=${this.data.page}`,{hideLoading: true}).then(res => {
      var data = res.data.data;
      var spend = res.data.meta.spend
      if (data.length > 0) {
        var spendList = this.data.spendList
        spendList = spendList.concat(data)
        this.setData({
          spendList: spendList,
          spend: spend
        })
      }
    })
  },
  getwithdraw(){
    //提现
    wx.$.fetch(`api/finance/list?type=withdraw&page=${this.data.page}`, { hideLoading: true }).then(res => {
      var withdraw = res.data.meta.withdraw
      var data = res.data.data;
      if (data.length > 0) {
        var withdrawList = this.data.withdrawList
        withdrawList = withdrawList.concat(data)
        this.setData({
          withdrawList: withdrawList,
          withdraw: withdraw
        })
      }
    })
  },

  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getincome()
    this.getspend()
    this.getwithdraw()
  }
})