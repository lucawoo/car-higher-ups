const utils = require('../../utils/util.js')

Page({
  data: {
    buyTabs: ['课程', '单品'],
    tabIndex: 0,
    // singGoods: [],
    // course: [],
    // column: [],
    page: 1
  },
  onShow() {
    this.setData({
      page: 1
    })
    setTimeout(() => {
      this.getData()
    }, 500)
  },
  selectTab (e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      tabIndex: index,
      page: 1
    })
    this.getData()
  },
  getData() {
    let index = this.data.tabIndex;
    let type;
    if (index == 0) type = 'course';
    // if (index == 1) type = 'column';
    if (index == 1) type = 'item';
    wx.$.fetch('api/member/course?type=' + type + '&page=' + this.data.page).then(res => {
      var data = res.data.data;
      if (this.data.page > 1) {
        if (index == 0 && data.length > 0) {
          var course = this.data.course
          course = course.concat(data)
          this.setData({ course: course });
        };
        // if (index == 1 && data.length > 0) {
        //   var column = this.data.column
        //   column = column.concat(data)
        //   this.setData({ column: column });
        // };
        if (index == 1 && data.length > 0) {
          var singGoods = this.data.singGoods
          data.forEach(item => {
            item.learn_record_time = utils.formDate(item.learn_record_time)
          })
          singGoods = singGoods.concat(data)
          this.setData({ singGoods: singGoods });
        };
      } else {
        if (index == 0) {
          this.setData({ course: data });
        };
        // if (index == 1) {
        //   this.setData({ column: data });
        // };
        if (index == 1) {
          data.forEach(item => {
            item.learn_record_time = utils.formDate(item.learn_record_time)
          })
          this.setData({ singGoods: data });
        };
      }
    })
  },
  linkInfoDetail (e) {
    const type = e.currentTarget.dataset.type;
    const id = e.currentTarget.dataset.id;
    if (type == 'article') {
      wx.navigateTo({
        url: '/pages/article_details/article_details?id=' + id,
      })
    } else if (type == 'audio') {
      wx.navigateTo({
        url: '/pages/audio_details/audio_details?id=' + id,
      })
    } else if (type == 'video') {
      wx.navigateTo({
        url: '/pages/video_details/video_details?id=' + id,
      })
    } else if (type == 'course') {
      wx.navigateTo({
        url: '/pages/course/course?id=' + id,
      })
    }else if(type == 'column') {
      wx.navigateTo({
        url: '/pages/column_details/column_details?id=' + id,
      })
    }
  },
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getData()
  },

})