
Page({
  data:{
    codeimg: '',
    menus: ['../../images/menu_1.png', '../../images/menu_2.png', '../../images/menu_3.png', '../../images/menu_4.png'],
    tabIndex: 0,
    hidesheet: false,
    path: '/pages/article_details/article_details',
    canvasimg: '',
    url: wx.$.host
  },
  onLoad(options) {
    this.setData({
      intype: options.intype,
      goods_id: options.goods_id
    })
    //intype  1图文 2视频 3音频 4课程 5专栏 6讲师
    if (options.intype==1){
      this.setData({
        path: '/pages/article_details/article_details?id=' + this.data.goods_id,
      })
    } else if (options.intype == 2){
      this.setData({
        path: '/pages/video_details/video_details?id=' + this.data.goods_id,
      })
    } else if (options.intype == 3) {
      this.setData({
        path: '/pages/audio_details/audio_details?id=' + this.data.goods_id,
      })
    } else if (options.intype == 4) {
      this.setData({
        path: '/pages/course/course?id=' + this.data.goods_id,
      })
    } else if (options.intype == 5) {
      this.setData({
        path: '/pages/column_details/column_details?id=' + this.data.goods_id,
      })
    } else if (options.intype == 6) {
      this.setData({
        path: '/pages/teacherHome/index?id=' + this.data.goods_id + '&share=1',
      })
    }
  },
  onShow() {
    const info = wx.getStorageSync("info")
    this.setData({
      usermsg: info
    })
    this.getToken()
  },



  savecode() {
    this.setData({
      hidesheet: true
    })
  },
  hidesheet(){
    this.setData({
      hidesheet: false
    })
  },

  canvasToImg(bg, avatar, name, text, codeimg, bgW, bgH) {
    const that = this;
    const ctx = wx.createCanvasContext('shareFrends');
    ctx.save()
    ctx.drawImage(bg, 0, 0, bgW, bgH-100 , 0, 0, 375, 630);
    ctx.arc(190, 120, 40, 0, 2 * Math.PI);
    ctx.clip()
    ctx.drawImage(avatar, 150, 80, 80, 80);
    ctx.restore();
    ctx.save()
    ctx.font = 'normal bold 18px sans-serif';
    if (this.data.tabIndex == 3) {
      ctx.setFillStyle('#ffffff')
    };
    ctx.fillText(name, (375 - ctx.measureText(name).width) / 2, 200 );
    ctx.font = 'normal normal 15px sans-serif';
    ctx.fillText(text, 130, 240);
    // ctx.arc(190, 370, 90, 0, 2 * Math.PI);
    // ctx.setStrokeStyle('#fff')
    // ctx.clip()
    ctx.drawImage(codeimg, 98, 278, 180, 180);
    ctx.restore();
    ctx.draw()
  },

  getCanvasInfo(index) {
    const that = this;
    let bg; //背景
    let bgW;
    let bgH;
    let avatar; //头像
    let name = this.data.usermsg.member_name;// 昵称
    let text = '邀请你来一起学习'; // 说明文字
    let codeimg;
    if (this.data.tabIndex == 0) bg = wx.$.host + 'image/invite.png';
    if (this.data.tabIndex == 1) bg = wx.$.host + 'image/invite_2.png';
    if (this.data.tabIndex == 2) bg = wx.$.host + 'image/invite_3.png';
    if (this.data.tabIndex == 3) bg = wx.$.host + 'image/invite_4.png';
    wx.getImageInfo({
      src: bg,
      success: res => {
        bg = res.path;
        bgW = res.width;
        bgH = res.height;
        wx.getImageInfo({
          src: this.data.codeimg,
          success: res => {
            codeimg = res.path;
            wx.$.fetch('api/member/setLocalAvatar',{
              method: 'post',
              hideLoading: true,
              data: {
                api_token: wx.getStorageSync('token'),
                member_id: this.data.usermsg.member_id
              }
            }).then(res => {
              wx.getImageInfo({
                src: res.data.url,
                success: res => {
                  console.log(res)
                  avatar = res.path
                  that.canvasToImg(bg, avatar, name, text, codeimg, bgW, bgH)
                }
              })
            }) 
          }
        })
      }
    })
  },

  //保存图片
  saveimg(){    
    const that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'shareFrends',
      success: function (res) {
        let canvasimg = res.tempFilePath;
        that.setData({
          canvasimg: canvasimg
        })
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.saveImageToPhotosAlbum({
                    filePath: that.data.canvasimg,
                    success() {
                      wx.showToast({
                        title: '保存成功'
                      })
                    },
                    fail() {
                      wx.showToast({
                        title: '保存失败',
                        icon: 'none'
                      })
                    }
                  })
                },
                fail() {
                  wx.openSetting({
                    success: (res) => {

                    }
                  })
                }
              })
            } else {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.canvasimg,
                success() {
                  wx.showToast({
                    title: '保存成功'
                  })
                },
                fail() {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            }
          }
        })
      }
    })
   
  },
  //分享
  onShareAppMessage: function () {
    this.setData({
      hidesheet: false
    })
    if (this.data.intype==1){
      return {
        title: '邀请你来一起学习',
        path: this.data.path,
        success: function (res) {

        },
      }
    } else if (this.data.intype == 2){
      return {
        title: '邀请你来一起学习',
        path: this.data.path,
        success: function (res) {

        },
      }
    } else if (this.data.intype == 3) {
      return {
        title: '邀请你来一起学习',
        path: this.data.path,
        success: function (res) {

        },
      }
    } else if (this.data.intype == 4) {
      return {
        title: '邀请你来一起学习',
        path: this.data.path,
        success: function (res) {

        },
      }
    } else if (this.data.intype == 5) {

      return {
        title: '邀请你来一起学习',
        path: this.data.path,
        success: function (res) {

        },
      }
    } else if (this.data.intype == 6) {
      return {
        title: '邀请你来一起学习',
        path: this.data.path,
        success: function (res) {

        },
      }
    }
    
  },

  showMenuDetail(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex
    })

    // 画图
    this.getCanvasInfo(tabIndex)
  },
  getToken() {
    wx.$.fetch('api/getQrCode',{
      method: 'post',
      data:{
        path: this.data.path,
        width: 430,
        api_token: wx.getStorageSync('token'),
        type: 1
      }
    }).then(res => {
      this.setData({
        codeimg: res.data.path
      });
      this.getCanvasInfo(0)
    })
  },

})