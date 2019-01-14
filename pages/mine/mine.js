Page({
  data: {
    usermsg:[],
  },
  onShow(){
    
  //数据
    wx.$.fetch('api/browseList').then(res => {
      this.setData({
        lookedList: res.data.data.slice(0,4)
      })

      wx.$.fetch(`api/member/isVip`, {hideLoading: true}).then(res => {
        if (res.data.msg == '您已是') {
          wx.setStorageSync('is_vip', true)
          this.setData({
            vipstate: true
          })
        } else if (res.data.msg == '还没成为') {
          wx.setStorageSync('is_vip', false)
          this.setData({
            vipstate: false
          })
        } else if (res.data.msg == '已过期') {
          wx.setStorageSync('is_vip', false)
          this.setData({
            vipstate: false
          })
        }
      })

      wx.$.fetch(`api/member/memberInfo`, { hideLoading: true }).then(res => {
        this.setData({
          is_lecturer: res.data.data.is_lecturer
        })
      })
      const info = wx.getStorageSync("info")
      this.setData({
        usermsg: info
      })

    })
  },

  togoods(e) {
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




  /* 跳转我的信息 */
  tomessage() {
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },
  /* 跳转 */
  tovip() {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },
  /* 跳转浏览记录 */
  tolooked() {
    wx.navigateTo({
      url: '/pages/looked/looked',
    })
  },
  /* 跳转我的课程 */
  tomyclass() {
    wx.$.fetch('api/getJoinState', { hideLoading: true }).then(res => {
      if (res) {
        const data = res.data
        if (data.state == 1 || data.state == 2) {
          wx.showModal({
            title: '提示',
            content: '请先申请成为讲师！',
            confirmColor: '#00A0E8',
            success: res => {
              if(res.confirm) {
                wx.navigateTo({
                  url: '/pages/teacherCheckInStatus/index?first=false'
                })
              }
            }
          })
        } else if (data.state == 3) {
          if (data.data.lecturer.lecturer_state == 0) {
            wx.showModal({
              title: '提示',
              content: '开课申请资料未填写完整，请前往填写！',
              confirmColor: '#00A0E8',
              success: res => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/teacherCheckInStatus/index?first=false'
                  })
                }
              }
            })
          } else if (data.data.lecturer.lecturer_state == 1) {
            wx.showModal({
              title: '提示',
              content: '开课申请审核中！请耐心等待！',
              confirmColor: '#00A0E8',
              showCancel: false
            })
          } else if (data.data.lecturer.lecturer_state == 2) {
            wx.navigateTo({
              url: '/pages/myclass/myclass',
            })
          } else if (data.data.lecturer.lecturer_state == 3) {
            wx.showModal({
              title: '提示',
              content: '开课申请审核失败！请前往重新申请！',
              confirmColor: '#00A0E8',
              success: res => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/teacherCheckInStatus/index?first=false'
                  })
                }
              }
            })
          }
        }
      }
    })
    
  },
  /* 跳转我的账户 */
  toaccount() {
    wx.navigateTo({
      url: '/pages/account/account',
    })
  },
  /* 跳转我的关注 */
  tofocus() {
    wx.navigateTo({
      url: '/pages/focusOn/focusOn',
    })
  },
  /* 跳转我的收藏 */
  tocollection() {
    wx.navigateTo({
      url: '/pages/collection/collection',
    })
  },
  /* 跳转我的消息 */
  tomynews() {
    wx.navigateTo({
      url: '/pages/myNews/myNews',
    })
  },
  /* 跳转赠送记录 */
  togiftrecord() {
    wx.navigateTo({
      url: '/pages/giftrecord/giftrecord',
    })
  },
  /* 跳转意见反馈 */
  tofeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback?id=1',
    })
  },
})
