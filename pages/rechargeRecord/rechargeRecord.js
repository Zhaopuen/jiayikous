//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");

Page({
  data: {
    pro_bg:'#fff',
    trueName:'',
    id_card:'',
    bc_bg:'#999'
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    // Trequest({
    //   url: 'goods/getlist',
    //   data: { gc_id:1},
    //   callback(res) {
    //     console.log(res)
    //   }
    // })
  },
  agree_pro(){
    if (this.data.pro_bg == '#fff' ){
      this.setData({
        pro_bg:'#81D8CF',
        bc_bg:'#81D8CF'
      })
    }else{
      this.setData({
        pro_bg: '#fff',
        bc_bg:'#999'
      })
    }
  },
  trueName: function (e) {
    this.setData({
      trueName: e.detail.value,
    })
  },
  id_card: function (e) {
    this.setData({
      id_card: e.detail.value,
    })
  },
  saveBtn() {
    var userInfo = wx.getStorageSync('user_info').data;
    let that = this
    if (this.data.pro_bg == '#fff' ){
      return
    }
    if (this.data.trueName == '') {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
      return
    } else if (this.data.id_card == '' || !(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.id_card))) {
      wx.showToast({
        title: '请输入正确的身份证号',
        icon: 'none'
      })
      return
    } else {
      Trequest({
        url: 'user_profile/edit',
        data: {
          user_id: userInfo.id,
          sign: userInfo.sign,
          name: that.data.trueName,
          keyid: that.data.id_card    //真实姓名
        },
        callback(res) {
          console.log(res)
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          if (res.data.msg == '编辑成功'){
            wx.getStorage({
              key: 'user_info',
              success: function(res) {
                console.log(res)
                var data = res
                data.data.data.userProfile.keyid = that.data.id_card
                wx.setStorageSync("user_info", data.data);
              },
            })
            wx.navigateBack({
              delta:1
            })
          }
        }
      })
    }
  },
  toxy(){
    wx.navigateTo({
      url: '../rulerz/rulerz',
    })
  }
})
