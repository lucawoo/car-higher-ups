Page({
  showMenuDetail(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex,
      page:1
    })
  },
  data: {
    menus: ['未赠出', '已赠出'],
    tabIndex: 0,
    page:1,
    giftreList:[],
    giftrecordList:[]
  },
  onLoad(){
    this.givelistF()
    this.givelistT()
  },

  givelistF(){
    wx.$.fetch(`api/member/give/list?receive=false&page=${this.data.page}`, { hideLoading: true }).then(res => {
      var data = res.data.data;
      if (data.length > 0) {
        var giftreList = this.data.giftreList
        giftreList = giftreList.concat(data)
        this.setData({
          giftreList: giftreList
        })
      }
    })
  },
  givelistT() {
    wx.$.fetch(`api/member/give/list?receive=true&page=${this.data.page}`).then(res => {
      var data = res.data.data;
      if (data.length > 0) {
        var giftrecordList = this.data.giftrecordList
        giftrecordList = giftrecordList.concat(data)
        this.setData({
          giftrecordList: giftrecordList
        })
      }
    })
  },

  togive(e){
    var id = e.currentTarget.dataset.id
    var price = e.currentTarget.dataset.price
    var tit = e.currentTarget.dataset.tit
    var token = e.currentTarget.dataset.token
    var type = e.currentTarget.dataset.type
    var course_id = e.currentTarget.dataset.course_id
    var c_type = e.currentTarget.dataset.c_type
    var cover = e.currentTarget.dataset.cover

    wx.navigateTo({
      url: '/pages/giving/giving?id=' + id + '&price=' + price + '&token=' + token + '&c_type=' + c_type + '&course_id=' + course_id + '&type=' + type + '&tit=' + tit + '&cover=' + cover,
    })
  },


  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.givelistF()
    this.givelistT()
  }
})