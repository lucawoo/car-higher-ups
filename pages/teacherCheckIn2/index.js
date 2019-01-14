// pages/teacherCheckIn/index.js

const app = getApp()
Page({


  data: {
    countText: 0,
    years: ['无','1-3年', '4-6年', '7-10年', '10年以上'],
    trainYear: ['无', '1-3年', '4-6年', '7-10年', '10年以上'],
    carsIndex: 5,
    trainIndex: 5,
    classifyDatas: [],
    showGoodsModal: false,
    agree: false,
    skill_area: '',
    cuttype: null,
    hornerCard: '',
    lecturerInfo: {}
  },
  onLoad() {
    const lecturerInfo = app.data.lecturerInfo;
    this.setData({
      lecturerInfo: lecturerInfo.data.lecturer
    })
   
    this.classifyData()
    
  },
  onShow() {
    if (this.data.cuttype == 2) {
      this.upLoadImg(this.data.hornerCard)
    };
  },
  // 分类 数据
  classifyData() {
    const lecturerInfo = this.data.lecturerInfo;
    let skill_area = [];
    if (lecturerInfo.skill_area) {
      if (Array.isArray(lecturerInfo.skill_area)) {
        skill_area = lecturerInfo.skill_area
      } else {
        skill_area = lecturerInfo.skill_area.split(',')
      }  
    };
    
    let goodsValue = [];
    wx.$.fetch(`api/goods_class/getGoodsClass`, { hideLoading: true }).then(res => {
      let data = res.data.data;
      data.forEach(item => {
        item.select = false
      })
      if (skill_area.length > 0) {
        skill_area.forEach((item,index) => {
          data.forEach(item1 => {
           
            if (item == item1.cid) {
              item1.select = true
              goodsValue.push(item1.class_name);
            }
          })
        })
      };
      this.setData({
        classifyDatas: data,
        goodsValue: goodsValue.join(' '),
        cids: skill_area
      })
    })
  },

  // 职位
  getDuty(e) {
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.lecturer_duty = e.detail.value
    this.setData({
      lecturerInfo: lecturerInfo
    })
  },
   // 单位名称
  getCompany(e) {
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.company_name = e.detail.value
    this.setData({
      lecturerInfo: lecturerInfo
    })
  },
  // 汽车行业从业年限
  carsYear (e) {
    const index = e.detail.value
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.industry_work_years = index - 0  + 1
    this.setData({
      lecturerInfo: lecturerInfo,
      carsIndex: index,
    })
  },
  // 培训师从业年限
  trainYear(e) {
    const index = e.detail.value
    const lecturerInfo = this.data.lecturerInfo
    lecturerInfo.lecturer_work_years = index - 0 + 1
    this.setData({
      lecturerInfo: lecturerInfo,
      trainIndex: index,
    })
  },
  // 擅长领域
  showGoodsModal () {
    this.setData({
      showGoodsModal: true
    })
  },
  seletGoods (e) {
    let classifyDatas = this.data.classifyDatas
    const index = e.currentTarget.dataset.index
    classifyDatas[index].select = !classifyDatas[index].select
    const item = e.currentTarget.dataset.item;
    let i = 0;
    classifyDatas.forEach(item => {
      if (item.select) {
        i = i + 1
      }
    })
    if (i > 3) {
      wx.showToast({
        title: '最多选择3个',
        icon: 'none'
      })
      classifyDatas[index].select = !classifyDatas[index].select
    } else {
      this.setData({
        classifyDatas: classifyDatas,
      })
    }
    
  },
  // 取消
  cancleSelect () {
    this.setData({
      showGoodsModal: false
    })
  },
  // 确定
  confirmSelect () {
    const lecturerInfo = this.data.lecturerInfo
    let classifyDatas = this.data.classifyDatas;
    let goodsValue = [];
    let cids = [];
    classifyDatas.forEach(item => {
      if (item.select) {
        goodsValue.push(item.class_name);
        cids.push(item.cid)
      }
    })
    lecturerInfo.skill_area = cids
    this.setData({
      goodsValue: goodsValue.join(' '),
      showGoodsModal: false,
      cids: cids
    })
  },

  // 荣誉证书
  hornerCard () {
    wx.navigateTo({
      url: '/pages/cutFace/index?cuttype=2',
    })
  },

  // 图片上传
  upLoadImg(path, thisData) {
    let that = this;
    wx.uploadFile({
      url: wx.$.host + 'api/uploadImage',
      filePath: path,
      name: 'files',
      success: function (res) {
        if (res.data) {
          const lecturerInfo = that.data.lecturerInfo
          let data = JSON.parse(res.data);
          lecturerInfo.certification_pic = data.path
          that.setData({
            lecturerInfo: lecturerInfo,
            cuttype: null
          })
          app.data.lecturerInfo.data.lecturer = lecturerInfo
        }
      }
    })
  },
 
  // 保存
  saveInfo() {
    const lecturerInfo = this.data.lecturerInfo
    if (this.data.cids.length > 0) {
      if (Array.isArray(lecturerInfo.skill_area)) {
        lecturerInfo.skill_area = lecturerInfo.skill_area.join(',')
      }
    } else {
      lecturerInfo.skill_area = ''
    };
    lecturerInfo.lecturer_state = 0
    app.data.lecturerInfo.data.lecturer = null
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

  preStep() {
    
    wx.navigateBack()
    
  },

  nextStep() {
    const lecturerInfo = this.data.lecturerInfo;
    if (this.data.cids.length > 0) {
      if (Array.isArray(lecturerInfo.skill_area)) {
        lecturerInfo.skill_area = lecturerInfo.skill_area.join(',')
      }
    }
    let canNext = true;
    if (!lecturerInfo.lecturer_duty) {
      canNext = false;
      wx.showToast({
        title: '请填写职位',
        icon: 'none'
      })
    } else 
    if (!lecturerInfo.company_name) {
      canNext = false;
      wx.showToast({
        title: '请填公司/机构名称',
        icon: 'none'
      })
    } else 
    if (!lecturerInfo.industry_work_years) {
      canNext = false;
      wx.showToast({
        title: '请选择汽车行业从业年限',
        icon: 'none'
      })
    } else 
    if (!lecturerInfo.lecturer_work_years) {
      canNext = false;
      wx.showToast({
        title: '请选择培训师从业年限',
        icon: 'none'
      })
    } else 
    if (canNext) {
      app.data.lecturerInfo.data.lecturer = this.data.lecturerInfo
      this.setData({
        lecturerInfo: lecturerInfo
      })
      wx.navigateTo({
        url: '/pages/teacherCheckIn3/index',
      })
    }
  },
  
})