var util = require('../../utils/util');


Page({
  data: {
    dsearchTabs: ['全部', '最新', '最热'],
    searchText: '',
    tabIndex: 0,
    infoDatas:[],
    page:1
  },
  onLoad() {
    this.getData()
  },
  selectTab(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex,
      page: 1,
      infoDatas: []
    })
    this.getData()
  },
  
  // 点击键盘确认按钮 开始搜索
  startSearch(e) {
    const value = e.detail.value
    this.setData({
      searchText: value,
      infoDatas:[]
    })
    this.getData()
  },
  getData() {
    const order = this.data.tabIndex;
    const name = this.data.searchText;
    wx.$.fetch(`api/informationList?order=${order}&page=${this.data.page}&name=${name}`).then(res => {
      let infoDatas = this.data.infoDatas
      let data = res.data.data.data
      this.setData({
        data: res.data.data.data
      })
      if (data.length > 0) {
        infoDatas = infoDatas.concat(data)
        this.setData({
          infoDatas: infoDatas,
          data: res.data.data.data
        })
      } else if (this.data.page ==1){
        this.setData({
          infoDatas: data
        })
      }

    })
  },
  //跳转到咨询详情 
  linkInfoDetail(e) {
    var base = new util.Base64()
    var url = e.currentTarget.dataset.url
    var infor = e.currentTarget.dataset.infor
    if (url) {
      if (infor) {
        wx.navigateTo({
          url: '/pages/web-view/index?src=' + url + '&infor=' + infor
        })
      } else {
        wx.navigateTo({
          url: `/pages/web-view/index?src=${base.encode(url) + '&infor=' + infor}`
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/informationDetail/index?id=' + e.currentTarget.dataset.id,
      })
    }
  },
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getData()
    if (this.data.page > 1 && this.data.data.length==0){
      
    }
  }
})