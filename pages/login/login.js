var e = require("../../utils/request.js"), t = getApp();
Page({
  data: {
    page: '',
    back:''
  },
  onLoad: function (option) {
    this.setData({
      back: option.id
    })
  },
  getUserInfo: function (t) {
    var that = this;
    wx.login({
      success: function (o) {
        var n = o.code;
        wx.request({
          url: 'https://jingpai.fengsh.cn/api/user/wechatLoginMiniProgram',
          method: "POST",
          data: {
            code: n,
            encryptedData: t.detail.encryptedData,
            iv: t.detail.iv,
            headimgurl: t.detail.userInfo.avatarUrl,
            nickname: t.detail.userInfo.nickName
          },
          success: function (e) {
            console.log('e', e)
            if (200 == e.statusCode) {
              wx.setStorageSync("access_token", e.data.access_token), wx.setStorageSync("user_info", e.data);
              if (that.data.back == 1) {
                wx.switchTab({
                  url: "/pages/home/home"
                });
              } 
              else if (that.data.back == 'mine') {
                wx.switchTab({
                  url: "/pages/mine/mine"
                });
              } else if (that.data.back == 2){
                wx.switchTab({
                  url: "/pages/index/index"
                });
              }
            }
          },
          complete: function () {
            wx.hideLoading();
          }
        });
      },
      fail: function (e) {

      }
    });
  }
});