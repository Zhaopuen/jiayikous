//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");

Page({
  data: {
    logs: [],
    bookData:[],
    id:'',
    orderId:''
  },
  
  onLoad: function (option) {
    var that = this;
    that.setData({
      orderId:option.id
    })
    var userInfo = wx.getStorageSync('user_info').data;
    Trequest({
      url: 'user_address/getlist',
      data: {
        user_id: userInfo.id,
        sign: userInfo.sign
      },
      callback(res) {
        console.log(res)
        let addressList = [];
        let obj = {};
        for (let i of res.data.data) {
          obj = {};
          obj.consignee = i.consignee;
          obj.phone = i.mobile;
          obj.addressdetail = i.address;
          obj.province = i.region_province.region_name;
          obj.city = i.region_city.region_name;
          obj.district = i.region_district.region_name;
          obj.id = i.id
          i.default == 1 ? obj.selector = true : obj.selector = false
          addressList.push(obj)
        }
        that.setData({
          bookData: addressList
        })
      }
    })
  },
  // 设为默认地址
  radioChange(e) {
    console.log(e)
    var that = this;
    var userInfo = wx.getStorageSync('user_info').data;
    var list = this.data.bookData;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == e.detail.value) {
        list[i].selector = true;
        Trequest({
          url: 'user_address/default',
          data: {
            user_id: userInfo.id,
            sign: userInfo.sign,
            id: list[i].id
          },
          callback(res) {
            console.log(res)
            if (res.data.msg == "设置成功"){
              wx.showToast({
                title: '设置成功',
              })
            }
          }
        })
      } else {
        list[i].selector = false
      }
      this.setData({
        bookData: list
      })
    }
  },
  removeData(e){
    let that = this;
    var list = that.data.bookData;
    var index = e.currentTarget.dataset.id;
    var userInfo = wx.getStorageSync('user_info').data;
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          Trequest({
            url: 'user_address/delete',
            data: {
              user_id: userInfo.id,
              sign: userInfo.sign,
              id: index
            },
            callback(res) {
              for (var i in list) list[i].id == index ? (list.splice(i, 1)) : console.log('');
              that.setData({
                bookData: list
              })
              if (res.data.msg == "移动到回收站成功"){
                wx.showToast({
                  title: '删除成功',
                })
              }
            }
          })
         
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  changeAddress(e){
    wx.navigateTo({
      url: '../changeAddress/changeAddress?id=' + e.currentTarget.dataset.id,
    })
  },
  addAddress(){
    wx.navigateTo({
      url: '../addAddress/addAddress?id=1&order=' + this.data.orderId,
    })
  },
  toback(e){
    wx.navigateTo({
      url: '../pay/pay?id=' + this.data.orderId + '&addid=' + e.currentTarget.dataset.id,
    })
  }
})
