// type 1:视频 2：图文 3：音频 4：课程
var util = require('../../utils/util');
const app = getApp()

//index.js
Page({
  data: {
    menus: ['分类','推荐','关注','资讯'],
    tabIndex: 1,
    lastX: null,
    left: 0,
    informationTabIndex: 0,
    headerFixed: false,
    current: 1,
    classifyDatas: [],
    host: app.data.host,
    attentionData: [],
    freeDatas: [],
    infoDatas: [],
    banners: [],
    page: 1,
    order: 1,
    noData: false,
    noData2: false,
    is_lecturer: false,
    lastIndex: 1,
    thisall :false,
    hasSee: true
  },

  onShow() {
    app.data.firstcome = 2
    wx.$.fetch('api/message/unread_count', { hideLoading: true }).then(res => {
      this.setData({
        newnews: res.data.data.unread_notifications_count
      })
    })
    this.isTeacher();
    this.getTeacherId();
  },

  getTeacherId() {
    wx.$.fetch(`api/member/memberInfo`, { hideLoading: true }).then(res => {
      const info = wx.getStorageSync("info")
      info.member_mobile = res.data.data.member_mobile
      wx.setStorageSync('info', info)
      if (res.data.data.my_lecturer) {
        wx.setStorageSync('teacherId', res.data.data.my_lecturer.id)
      };
      
      if (res.data.data.my_lecturer) {
        if (res.data.data.my_lecturer.write_information_notice == 0) {
          this.setData({
            hasSee: false
          });
          // wx.hideTabBar()
        }
        
      }
    })
  },
  

  // 判断是否是讲师
  isTeacher() {
    wx.$.fetch('api/getJoinState', { hideLoading: true }).then(res => {
      if (res) {
        const data = res.data
        app.data.lecturerInfo = data
        if (data.state == 1 || data.state == 2) {
          this.setData({
            is_lecturer: false
          })
        } else if (data.state == 3) {
          if (data.data.lecturer.lecturer_state == 0) {
            this.setData({
              is_lecturer: false
            })
          } else if (data.data.lecturer.lecturer_state == 1) {
            this.setData({
              is_lecturer: false
            })
          } else if (data.data.lecturer.lecturer_state == 2) {
            this.setData({
              is_lecturer: true
            })
          } else if (data.data.lecturer.lecturer_state == 3) {
            this.setData({
              is_lecturer: false
            })
          }
        }
      }
    })
  },
  
  // 分类 数据
  classifyData() {
    wx.$.fetch(`api/goods_class/getGoodsClass`, { hideLoading: true }).then(res => {
      this.setData({
        classifyDatas: res.data.data
      })
    })
  },
  // 推荐 
  getAds() {
    // 广告
    wx.$.fetch(`api/firstBanner?ap_id=1&type=2`).then(res => {
      this.setData({
        banners: res.data.data
      })
    })
    // 精品推荐

    // 6 种分类课程  不够一行如5种或4种分类   空白部分留补白  
    wx.$.fetch('api/goods_class/getRecommentCourse', { hideLoading: true }).then(res => {
      // if ()
      var classes = res.data.data.class
      if (classes.length % 3 == 1) {
        this.setData({
          space: 2
        })
      } else if (classes.length % 3 == 2) {
        this.setData({
          space: 1
        })
      }
      this.setData({
        classifyRecomment: res.data.data
      })
    })
  },
  // 关注
  getAttention() {
    wx.$.fetch(`${this.data.host}api/firstFocusList?api_token=${wx.getStorageSync('token')}&page=${this.data.page}`, { hideLoading: true }).then(res => {
      let attentionData = this.data.attentionData
      let data = res.data.data
      if (data.length > 0) {
        attentionData = attentionData.concat(data)
        this.setData({
          attentionData: attentionData
        })
      };
      if (attentionData.length> 0) {
        this.setData({
          noData: false
        })
      } else {
        this.setData({
          noData: true
        })
      }
    })
  },


  
  freeData() {
    wx.$.fetch('api/goods/freeGoodsList?page=' + this.data.page, { hideLoading: true }).then(res => {

      let freeDatas = this.data.freeDatas
      let data = res.data.data
      
      if (data.length > 0) {
        freeDatas = freeDatas.concat(data)
        this.setData({
          freeDatas: freeDatas
        })
      };

      if (freeDatas.length > 0) {
        this.setData({
          noData2: false,
        })
      } else {
        this.setData({
          noData2: true,
        })
      }
    })
  },
  // 资讯
  infoData() {
    wx.$.fetch(`api/informationList?order=${this.data.order}&page=${this.data.page}`).then(res => {

      let infoDatas = this.data.infoDatas
      let data = res.data.data.data
      if (data.length > 0) {
        infoDatas = infoDatas.concat(data)
        this.setData({
          infoDatas: infoDatas
        })
      }else{
        this.setData({
          thisall: true
        })
      }

    })
  },
  // 资讯广告
  getInfoAds() {
    wx.$.fetch(`api/firstBanner?ap_id=2`, { hideLoading: true }).then(res => {
      this.setData({
        bannersInfo: res.data.data
      })
    })
  },

  getData(tabIndex) {
    this.setData({
      infoDatas: [],
      freeDatas: [],
      attentionData: []
    })
    switch (tabIndex) {
      case 0:
        //分类 
        this.classifyData()
        break;
      case 1:
        // 广告
        this.getAds()
        this.classifyData()
        this.isTeacher()
        this.setData({
          left: 0
        })
        break;
      case 2:
        this.getAttention()
        break;
      case 3:
        
        this.getInfoAds()
        this.infoData()
        
        break;
      case 4:
        this.getInfoAds()
        this.infoData()
        break;
      default:
        break;
    }
  },
  

  // 头部菜单导航
  showMenuDetail (e) {
    let tabIndex = e.currentTarget.dataset.index
    if (this.data.lastIndex == tabIndex) return false;
    this.setData({
      tabIndex: tabIndex,
      lastIndex: tabIndex,
      page: 1,
      thisall :false
    })
    this.getData(tabIndex)
  },
  // // 移动菜单
  // moveleftStart (e) {
  //   this.data.lastX = e.touches[0].pageX;  
  // },
  // moveleftMove (e) {
  //   let currentX = e.touches[0].pageX;  
  //   let tx = currentX - this.data.lastX;  
  //   if (tx < -20) {
  //     this.setData({
  //       left: -120
  //     })
  //   } else if (tx > 20) {
  //     this.setData({
  //       left: 0
  //     })
  //   }
    
  // },
  // 跳转到推荐列表
  linkRemcomend() {
    wx.navigateTo({
      url: '/pages/recommend/index',
    })
  },

  // 分类
  getCurrent (e) {
    const current = e.detail.current;
    this.setData({
      current: current + 1
    })
  },
  // 跳转到分类详情
  linkClassifyDetail(e) {
    const cid = e.currentTarget.dataset.cid
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/classifyDetail/index?cid=' + cid + '&name=' + name,
    })
  },
  toclassnew(e){
    var cid = e.currentTarget.dataset.cid
    var name = e.currentTarget.dataset.name 
    wx.navigateTo({
      url: '/pages/classifyDetail/index?cid=' + cid + '&name=' + name,
    })
  },
  // 跳专栏
  // tocolumn(){
  //   wx.navigateTo({
  //     url: '/pages/column/column',
  //   })
  // },
  
  toFree() {
    wx.navigateTo({
      url: '/pages/free/free',
    })
  },




  // 资讯
  // 最新资讯
  newInformation (e) {
    this.setData({
      informationTabIndex: 0,
      page: 1,
      order: 1,
      infoDatas:[]
    })
    this.infoData()
  },
  // 最热资讯
  hotInformation (e) {
    this.setData({
      informationTabIndex: 1,
      page: 1,
      order: 2,
      infoDatas: []
    })
    this.infoData()
  },

  // 向上滑动重新定位
  onPageScroll (e) {
    if (e.scrollTop > 250) {
      this.setData({
        headerFixed: true,
      })
    } else {
      this.setData({
        headerFixed: false,
      })
    }
  },


  //跳转到咨询详情 
  linkInfoDetail (e) {
    var base = new util.Base64()
    var url = e.currentTarget.dataset.url
    var infor = e.currentTarget.dataset.infor
    if (url){
      if (infor){
        wx.navigateTo({
          url: '/pages/web-view/index?src=' + url + '&infor=' + infor
        })
      }else{
        wx.navigateTo({
          url: `/pages/web-view/index?src=${base.encode(url) + '&infor=' + infor}`
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/informationDetail/index?id=' + e.currentTarget.dataset.id,
      })
    }
  },


  linkDetail (e) {
    var type = e.currentTarget.dataset.type
    var type2 = e.currentTarget.dataset.typecourse
    var id = e.currentTarget.dataset.id
    if(type == 2){
      wx.navigateTo({
        url: '/pages/video_details/video_details?id=' + id,
      })
    } else if (type == 3){
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

  // 推荐广告跳转
  adsLinkDetail(e) {
    const server = e.currentTarget.dataset.server
    const url = e.currentTarget.dataset.url
    const id = e.currentTarget.dataset.id
    const detail = e.currentTarget.dataset.detail
    if (server!=null) {
      if (server.type == 'lecturer') {
        wx.navigateTo({
          url: '/pages/teacherHome/index?id=' + server.id,
        })
      };
      if (server.type == 'article') {
        wx.navigateTo({
          url: '/pages/article_details/article_details?id=' + server.id,
        })
      };
      if (server.type == 'audio') {
        wx.navigateTo({
          url: '/pages/audio_details/audio_details?id=' + server.id,
        })
      };
      if (server.type == 'video') {
        wx.navigateTo({
          url: '/pages/video_details/video_details?id=' + server.id,
        })
      };
      if (server.type == 'course') {
        wx.navigateTo({
          url: '/pages/course/course?id=' + server.id,
        })
      };
      if (server.type == 'column') {
        wx.navigateTo({
          url: '/pages/column_details/column_details?id=' + server.id,
        })
      };
    } else if (detail == 1){
      wx.navigateTo({
        url: '/pages/web-view/index?id=' + id,
      })
    } else if(url) {
      var base = new util.Base64()
      if (url === 'live') {
        console.log(url === 'live')
        wx.navigateTo({
          url: '/pages/live/live',
        })
      } else {
        wx.navigateTo({
          url: `/pages/web-view/index?src=${base.encode(url)}`,
        })
      }
      
    }
  },


  //  资讯广告跳转
  infoLinkDetailAds (e) {
    const server = e.currentTarget.dataset.server
    const url = e.currentTarget.dataset.url
    const id = e.currentTarget.dataset.id
    if (server!=null) {
      if (server.type == 'lecturer') {
        wx.navigateTo({
          url: '/pages/teacherHome/index?id=' + server.id,
        })
      };
      if (server.type == 'article') {
        wx.navigateTo({
          url: '/pages/article_details/article_details?id=' + server.id,
        })
      };
      if (server.type == 'audio') {
        wx.navigateTo({
          url: '/pages/audio_details/audio_details?id=' + server.id,
        })
      };
      if (server.type == 'video') {
        wx.navigateTo({
          url: '/pages/video_details/video_details?id=' + server.id,
        })
      };
      if (server.type == 'course') {
        wx.navigateTo({
          url: '/pages/course/course?id=' + server.id,
        })
      };
      if (server.type == 'column') {
        wx.navigateTo({
          url: '/pages/column_details/column_details?id=' + server.id,
        })
      };
      if (server.type == 'information') {
        
        wx.navigateTo({
          url: '/pages/informationDetail/index?id=' + server.id,
        })
      };
    } else if (url) {
      wx.navigateTo({
        url: '/pages/web-view/index?src=' + url + '&infor=1',
      })
    }
  },
  // 上拉加载
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    })
    if (this.data.tabIndex == 2) {
      this.getAttention()
    };
    if (this.data.tabIndex == 3) {
      //this.freeData()
      this.infoData()
    }
    
  },
  onShareAppMessage() {},

  onLoad(options){
    if(options.fromgive==1){
      if (options.c_type == 'item') {
        if (options.type == 'article') {
          wx.navigateTo({
            url: '/pages/article_details/article_details?id=' + options.id,
          })
        } else if (options.type == 'video') {
          wx.navigateTo({
            url: '/pages/video_details/video_details?id=' + options.id,
          })
        } else if (options.type == 'audio') {
          wx.navigateTo({
            url: '/pages/audio_details/audio_details?id=' + options.id,
          })
        }} else if (options.c_type == 'course') {
          wx.navigateTo({
            url: '/pages/course/course?id=' + options.id,
          })
        } else if (options.c_type == 'column') {
          wx.navigateTo({
            url: '/pages/column_details/column_details?id=' + options.id,
          })
        }
    }

    let tabIndex = this.data.tabIndex
    this.setData({
      page: 1
    })
    this.getData(tabIndex);
  },

  closeTIPS() {
    this.setData({
      hasSee: true
    })
    wx.showTabBar()
    wx.$.fetch('api/changeNoticeState',{
      method: 'post',
      data: {
        type: 'write_information_notice',
        api_token: wx.getStorageSync('token')
      }
    }).then(res => {
      console.log(res)
    })
  }

  
})
