
Page({
  data: {
    showNew: true,
    knoweledgeType: ['全部', '图文', '视频', '音频', '课程'], 
    knoweledgeTypeIndex: 0,
    classifyType: ['全部','管理','销售','售后','技术','维修','运营'],
    classifyTypeIndex: 0,
    showFilter: false,
    classifyList: [],
    classifyDatas: {},
    type: 0,
    cid: 0,
    order: 1,
    page: 1
  },

  onLoad: function(options) {
    this.setData({
      cid: options.cid,
      classifyTypeIndex: options.cid,
    })
    this.classifyData()
    this.getData(this.data.cid, this.data.knoweledgeTypeIndex, this.data.order)
    
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },
  getData(cid, type, order) {
    wx.$.fetch(`api/goods_class/getClassGoods?class_id=${cid}&goods_type=${type}&order=${order}&page=${this.data.page}`).then(res => {
      var data = res.data.data;
      if (data.length > 0) {
        this.filterData(data, type)
      }
    })
  },
  // 数据筛选
  filterData (data, type) {
    var classifyList = this.data.classifyList
    // 图文
    if (type == 1) {
      data.forEach((item) => {
        if (item.goods.goods_type == 1) {
          classifyList.push(item)
        }
      })
      this.setData({
        classifyList: classifyList
      })
    } else if (type == 2) {
    // 视频
      data.forEach((item) => {
        if (item.goods.goods_type == 2) {
          classifyList.push(item)
        }
      })
      this.setData({
        classifyList: classifyList
      })
    } else if (type == 3) {
      // 音频
      data.forEach((item) => {
        if (item.goods.goods_type == 3) {
          classifyList.push(item)
        }
      })
      this.setData({
        classifyList: classifyList
      })
    } else {
      this.setData({
        classifyList: classifyList.concat(data)
      })
    }
    
    
  },
  // 获取分类类型
  classifyData() {
    wx.$.fetch(`api/goods_class/getGoodsClass`, { hideLoading: true }).then(res => {
      res.data.data.unshift({
        cid: 0,
        class_name: '全部'
      })
      this.setData({
        classifyDatas: res.data.data
      })
    })
  },
  // 最新
  classifyNew () {
    this.setData({
      showNew: true,
      order: 1,
      page: 1,
      classifyList: []
    })
    this.getData(this.data.cid, this.data.type, this.data.order)
  },
  // 最热
  classifyHot () {
    this.setData({
      showNew: false,
      order: 2,
      page: 1,
      classifyList: []
    })
    this.getData(this.data.cid, this.data.knoweledgeTypeIndex, this.data.order)
  },

  // 关闭打开筛选
  toggleFilter () {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },

  // 选择知识点类型
  selectKnoweledgeType (e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      knoweledgeTypeIndex: index,
      page: 1,
      classifyList: []
    })
    this.getData(this.data.cid, this.data.knoweledgeTypeIndex, this.data.order)
  },
  // 分类类型
  selectClassifyType(e) {
    const index = e.currentTarget.dataset.index
    const cid = e.currentTarget.dataset.type
    wx.setNavigationBarTitle({
      title: e.currentTarget.dataset.name,
    })
    this.setData({
      classifyTypeIndex: index,
      cid: cid,
      page: 1,
      classifyList: []
    })
    this.getData(this.data.cid, this.data.knoweledgeTypeIndex, this.data.order)
  },
  // 跳转到详情
  linkDetail(e) {
    var type = e.currentTarget.dataset.type
    var type2 = e.currentTarget.dataset.typecourse
    var id = e.currentTarget.dataset.id
    if (type == 2) {
      wx.navigateTo({
        url: '/pages/video_details/video_details?id=' + id,
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '/pages/audio_details/audio_details?id=' + id,
      })
    } else if (type == 1) {
      wx.navigateTo({
        url: '/pages/article_details/article_details?id=' + id,
      })
    } else if (type2 == 2) {
      wx.navigateTo({
        url: '/pages/course/course?id=' + id,
      })
    } else if (type2 == 1) {
      wx.navigateTo({
        url: '/pages/column_details/column_details?id=' + id,
      })
    }
  },
  onReachBottom () {
    this.setData({
      page: this.data.page + 1
    })
    this.getData(this.data.cid, this.data.knoweledgeTypeIndex, this.data.order)
  }
})