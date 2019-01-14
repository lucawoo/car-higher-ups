let app = getApp()
Page({

 
  data: {
    host: app.data.host,
    countText: 0,
    lecturerInfo: {},
    IDCard: '',
    cuttype: null,
    agencyType: ['国企', '民营', '合资', '外资', '非盈利组织','其他'],
    agencyTypeIndex: 3,
    personalNum: ['1-10人', '11-30人', '30人以上'],
    personalNumIndex: 1,
    licenceCard: '',
    certificationCard: ''
  },

  onLoad(options) {
    const lecturerInfo = app.data.lecturerInfo;
    if (options.lecturer_class) {
      lecturerInfo.data.lecturer.lecturer_class =  options.lecturer_class
    } else {
      lecturerInfo.data.lecturer.lecturer_class = lecturerInfo.data.lecturer.lecturer_class
    };
    this.setData({
      lecturerInfo: lecturerInfo.data.lecturer
    })
    this.getTeacherId()
  },
  getTeacherId() {
    const lecturerInfo = this.data.lecturerInfo;
    wx.$.fetch(`api/member/memberInfo`, { hideLoading: true }).then(res => {
      lecturerInfo.lecturer_phone = res.data.data.member_mobile
      this.setData({
        lecturerInfo: lecturerInfo
      })
    })
  },

  onShow() {
    const lecturerInfo = app.data.lecturerInfo;
    this.setData({
      lecturerInfo: lecturerInfo.data.lecturer
    })
    if (this.data.cuttype == 1) {
      this.upLoadImg(this.data.IDCard)
    };
    if (this.data.cuttype == 3) {
      this.upLoadImg(this.data.licenceCard)
    };
    if (this.data.cuttype == 4) {
      this.upLoadImg(this.data.certificationCard)
    };
  },

  upLoadImg(path) {
    let that = this;
    wx.uploadFile({
      url: wx.$.host + 'api/uploadImage',
      filePath: path,
      name: 'files',
      success: function (res) {
        if (res.data) {
          const lecturerInfo = that.data.lecturerInfo
          let data = JSON.parse(res.data);
          if (that.data.cuttype == 1) {
            lecturerInfo.hand_card_one = data.path
          };
          if (that.data.cuttype == 3) {
            lecturerInfo.licence_pic = data.path
          };
          if (that.data.cuttype == 4) {
            lecturerInfo.certification_pic = data.path
          };
          app.data.lecturerInfo.data.lecturer = lecturerInfo
          that.setData({
            lecturerInfo: lecturerInfo,
            cuttype: null
          })
        }
      }
    })
  },

  // 更换头像
  changeAvatar() {
    let that = this;
    const lecturerInfo = this.data.lecturerInfo
    wx.chooseImage({
      success: function(res) {
        const tempFilePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: wx.$.host + 'api/uploadImage',
          filePath: tempFilePath,
          name: 'files',
          success: function(res) {
            if (res.data) {
              let data = JSON.parse(res.data);
              lecturerInfo.lecturer_avatar = data.path
              that.setData({
                lecturerInfo: lecturerInfo
              })
              app.data.lecturerInfo.data.lecturer = lecturerInfo
            }
          }
        })
      },
    })
  },

  // 姓名
  getName(e) {
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.lecturer_name = e.detail.value
    this.setData({
      lecturerInfo: lecturerInfo
    })
    app.data.lecturerInfo.data.lecturer = lecturerInfo
  },

  // 个人简介 字数计算
  getInfo(e) {
    const countText = e.detail.cursor;
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.lecturer_info = e.detail.value
    this.setData({
      countText: countText,
      lecturerInfo: lecturerInfo
    })
    app.data.lecturerInfo.data.lecturer = lecturerInfo
  },

  getType(e) {
    const index = e.detail.value
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.agency_type = index -0 + 1
    this.setData({
      lecturerInfo: lecturerInfo,
      agencyTypeIndex: index,
    })
    app.data.lecturerInfo.data.lecturer = lecturerInfo
  },

  getNum(e) {
    const index = e.detail.value
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.lecturer_scale = index-0 + 1
    this.setData({
      lecturerInfo: lecturerInfo,
      personalNumIndex: index,
    })
    app.data.lecturerInfo.data.lecturer = lecturerInfo
  },

  getContactName(e) {
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.contact_man = e.detail.value
    this.setData({
      lecturerInfo: lecturerInfo
    })
    app.data.lecturerInfo.data.lecturer = lecturerInfo
  },

  getContactPhone(e) {
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.contact_phone = e.detail.value
    this.setData({
      lecturerInfo: lecturerInfo
    })
    app.data.lecturerInfo.data.lecturer = lecturerInfo
  },

  getLicence() {
    wx.navigateTo({
      url: '/pages/cutFace/index?cuttype=3',
    })
  },

  getCertification() {
    wx.navigateTo({
      url: '/pages/cutFace/index?cuttype=4',
    })
  },



  // 身份证
  IDCardFont() {
    wx.navigateTo({
      url: '/pages/cutFace/index?cuttype=1',
    })
  },

  // 保存
  saveInfo() {
    const lecturerInfo = this.data.lecturerInfo
    
    if (lecturerInfo.skill_area && lecturerInfo.skill_area.length > 0) {
      if (Array.isArray(lecturerInfo.skill_area)) {
        lecturerInfo.skill_area = lecturerInfo.skill_area.join(',')
      }
    } else {
      lecturerInfo.skill_area = ''
    };
  
    
    lecturerInfo.lecturer_state = 0
    app.data.lecturerInfo.data.lecturer = lecturerInfo
    this.setData({
      lecturerInfo: lecturerInfo
    })
    wx.$.fetch('api/joinIn', {
      method: 'post',
      data: lecturerInfo
    }).then(res => {
      if (res.data && res.data.state == 200) {
        wx.showToast({
          title: '已保存',
        })
        
      }
    })
  },
  

  // 下一步
  nextStep () {
    const lecturerInfo = this.data.lecturerInfo;
    if (lecturerInfo.skill_area && lecturerInfo.skill_area.length > 0) {
      if (Array.isArray(lecturerInfo.skill_area)) {
        lecturerInfo.skill_area = lecturerInfo.skill_area.join(',')
      }
    };
    let canNext = true;
    if (!lecturerInfo.lecturer_avatar) {
      canNext = false;
      wx.showToast({
        title: '请上传头像',
        icon: 'none'
      })
    } else 
    if (!lecturerInfo.lecturer_name) {
      canNext = false;
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
    } else 
    if (!lecturerInfo.lecturer_info) {
      canNext = false;
      wx.showToast({
        title: '请填写简介',
        icon: 'none'
      })
    } else 
    if (lecturerInfo.lecturer_class == 1) {
      if (!lecturerInfo.hand_card_one) {
        canNext = false;
        wx.showToast({
          title: '请上传身份证正面照',
          icon: 'none'
        })
      };
    } else 
    if (lecturerInfo.lecturer_class == 2) {
      if (!lecturerInfo.agency_type) {
        canNext = false;
        wx.showToast({
          title: '请选择机构性质',
          icon: 'none'
        })
      } else 
      if (!lecturerInfo.lecturer_scale) {
        canNext = false;
        wx.showToast({
          title: '请选择讲师规模',
          icon: 'none'
        })
      } else 
      if (!lecturerInfo.licence_pic) {
        canNext = false;
        wx.showToast({
          title: '请上传营业执照',
          icon: 'none'
        })
      } else 
      if (!lecturerInfo.certification_pic) {
        canNext = false;
        wx.showToast({
          title: '请上传资质证书',
          icon: 'none'
        })
      } else 
      if (!lecturerInfo.contact_man) {
        canNext = false;
        wx.showToast({
          title: '请填写联系人姓名',
          icon: 'none'
        })
      }else 
      if (!lecturerInfo.contact_phone) {
        canNext = false;
        wx.showToast({
          title: '请填写联系人手机号',
          icon: 'none'
        })
      } else 
      if (!/^1[34578]\d{9}$/.test(lecturerInfo.contact_phone)) { 
        wx.showToast({
          title: '请填写正确的手机号码',
          icon: 'none'
        })
      }
    };
    
    if (canNext) {
      app.data.lecturerInfo.data.lecturer = lecturerInfo
      this.setData({
        lecturerInfo: lecturerInfo
      })
      if (lecturerInfo.lecturer_class == 1) {
        wx.navigateTo({
          url: '/pages/teacherCheckIn2/index',
        })
      } else if (lecturerInfo.lecturer_class == 2) {
        wx.navigateTo({
          url: '/pages/teacherCheckIn3/index',
        })
      }
      
    }
    
    
  },
  
})