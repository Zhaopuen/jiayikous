//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");

Page({
  data: {
    sendersignname: '',
    sendernamess: '',
    senderPhone: '',
    senderName: '',
  },
  onLoad: function () {
    var that = this;
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'user/detail',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign
      },
      callback(res) {
        console.log(res,'userinfo')
        var myInfo = [];
        var obj = {};
        var data = res.data.data 
        var sendersignname, sendernamess, senderPhone
        obj.nickname = data.nickname;
        obj.avatar = data.avatar;
        data.signname ? (sendersignname = data.signname) : (sendersignname = '')
        data.tel ? (senderPhone = data.tel) : (senderPhone = '')
        data.userProfile.name ? (sendernamess = data.userProfile.name) : (sendernamess = '')
        myInfo.push(obj)
        that.setData({
          myInfoBox: myInfo,
          sendersignname: sendersignname,
          sendernamess: sendernamess,
          senderPhone: senderPhone
        })
      }
    })
  },
  senderName: function (e) {
    this.setData({
      senderName: e.detail.value,
    })
  },
  senderPhone: function (e) {
    this.setData({
      senderPhone: e.detail.value
    })
  },
  sendernamess: function (e) {
    this.setData({
      sendernamess: e.detail.value
    })
  },
  
  sendersignname:function(e){
    this.setData({
      sendersignname: e.detail.value
    })
  },
  saveBtn(){
    var that = this;
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      // url: 'user/edit',
      url:'user/account',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        tel: that.data.senderPhone,      //联系方式
        // name: that.data.sendernamess,    //真实姓名
        signname: that.data.sendersignname   //个性签名
      },
      callback(res) {
        if (res.data.msg == "设置成功"){
          wx.navigateBack({
            delta:2
          })
        }
      }
    })
    Trequest({
      url: 'user_profile/edit',
      // url: 'user/account',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign,
        // tel: that.data.senderPhone,      //联系方式
        name: that.data.sendernamess,    //真实姓名
        // signname: that.data.sendersignname   //个性签名
      },
      callback(res) {
        if (res.data.msg == "修改成功") {
          wx.navigateBack({
            delta: 2
          })
        }
      }
    })
  },

})
