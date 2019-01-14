// pages/column/column.js
Page({
  data: {
    menus: ['最新', '最热'],
    tabIndex: 0,
    page:1,
    columnList:[]
  },
  showMenuDetail(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex,
      columnList: [],
      page:1
    })
    this.detdata(tabIndex+1)
  },


  tocdetail(e) {
    var goods_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/column_details/column_details?id=' + goods_id,
    })
  },

   
  detdata(order){
    wx.$.fetch('api/goods_class/getClassGoods?goods_type=5&recommend=2&order=' + order + '&page='+this.data.page).then(res => {
      var data = res.data.data;
      if (data.length > 0) {
        var columnList = this.data.columnList
        columnList = columnList.concat(data)
        this.setData({
          columnList: columnList
        })
      }
    })
  },
  onLoad(){
    this.detdata(1)
  },


  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.detdata(this.data.tabIndex + 1)
  }
})