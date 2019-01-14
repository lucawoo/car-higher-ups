Page({
  data: {
    lookedList:[],
    page:1
  },
  cleared () {
    wx.showModal({
      title: '确认清空浏览记录？',
      confirmColor: '#00A0E8',
      success: (res) => {
        if (res.confirm) {
          wx.$.fetch('api/cleanBrowse').then(res => {
            this.setData({
              lookedList:[]
            })
            // wx.showModal({
            //   title:'已清空浏览记录',
            //   success: (res) => {
            //     wx.navigateBack({

            //     })
            //   }
            // })
          })
        }
      }
    })
  },

  //数据
  onLoad() {
    this.getlook()
  },
  getlook(){
    wx.$.fetch(`api/browseList?page=${this.data.page}`).then(res => {
      var data = res.data.data;
      if (data.length > 0) {
        var lookedList = this.data.lookedList
        lookedList = lookedList.concat(data)
        this.setData({
          lookedList: lookedList
        })
      }
    })
  },
  
  toDetila(e) {
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



  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    this.getlook()
  }
  
})