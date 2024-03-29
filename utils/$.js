
const host = "https://auto.17link.cc/"; 

let logfirst = true
// 检测微信小程序环境
if (wx) {
  wx.$ = {};
  wx.$.host = host;
  wx.$.getRequestOptions = function (options) {
    let url = options.url;
    let header = options.header || {};

    if (
      options.url.indexOf("https://") !== 0 &&
      options.url.indexOf("http://") !== 0
    ) {
      if (options.url.indexOf("?") == -1) {
        url = `${wx.$.host}${options.url}?api_token=${wx.getStorageSync('token')}`;
      } else {
        url = `${wx.$.host}${options.url}&api_token=${wx.getStorageSync('token')}`;
      }
    } else {
      if (options.url.indexOf(`${wx.$.host}`) !== 0) {
        url = `${wx.$.host}`;
        header.Proxy = options.url;
      }
    }

    header = Object.assign(
      {
        "Content-Type": "application/json"
      },
      header
    );

    return Object.assign(options, { url, header });
  };
  wx.$.request = function (options) {
    return wx.request(wx.$.getRequestOptions(options));
  };
  wx.$.login = function (userInfo) {
    wx.showLoading({
      title: '登录中...'
    })
    const data = {
      code: userInfo.code,
      encryptedData: userInfo.encryptedData,
      iv: encodeURIComponent(userInfo.iv)
    };
    wx.$.request({
      url: host + 'api/login',
      method: "POST",
      data: data,
      success: res => {
        if (res && res.data.api_token) {
          wx.setStorageSync("token", res.data.api_token);
          wx.setStorageSync("info", res.data.info);
          setTimeout(() => {
            wx.navigateBack()
            wx.hideLoading()
          }, 500)
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '登录失败',
            confirmColor: '#00A0E8',
            showCancel: false
          });
        };
      },
      fail: res => {
        console.error(
          "wx.$.login request Fail" +
          res.errMsg
        );
      }
    });

  };
  wx.$.fetch = function (url, options = {}) {
    options.url = url;
    if (!options.hideLoading) {
      wx.showLoading({
        title: '加载中',
      })
    }

    return new Promise((resolve, reject) => {
      options.success = res => {
        wx.hideLoading()
        if (res.data.msg == 'invalid login.' && logfirst == true) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
          logfirst = false
          setTimeout(() => {
            logfirst = true
          }, 5000)
        } else {
          setTimeout(() => {
            logfirst = true
          }, 5000)
          resolve(res);
        }
      };
      options.fail = res => {
        wx.hideLoading()
        reject(res);
      };
      wx.$.request(options);
    });
  };
  wx.$.upload = function (options) {
    return wx.uploadFile(wx.$.getRequestOptions(options));
  };
  module.exports = wx.$;
}
