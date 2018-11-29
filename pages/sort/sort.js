//logs.js
const util = require('../../utils/util.js')
var Trequest = require("../../utils/request.js");
Page({
  data: {
    logs: [],
    lunboshow:true,
    cat_list:[
      {name:'推荐分类',active:true},
    ],
    lunbo:[],
    classList: [
      { img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3541939413,828768424&fm=27&gp=0.jpg', title: '裙子' },
      { img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3541939413,828768424&fm=27&gp=0.jpg', title: '短袖' },
      { img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3541939413,828768424&fm=27&gp=0.jpg', title: '相机' },
      { img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3541939413,828768424&fm=27&gp=0.jpg', title: '手机' },
    ]
  },
  onLoad: function () {
    var that = this;
    // 商品分类左侧的列表
    Trequest({
      url: 'goods_category/getlist',
      data: {},
      callback(res) {
        var goodsClass = [];
        var obj = {};
        obj.name = "推荐分类";
        obj.active = true;
        obj.id = 0;
        goodsClass.push(obj);
        for (let i of res.data.data) {
          obj = {};
          obj.name = i.name;
          obj.active = false;
          obj.id = i.id;
          goodsClass.push(obj);
        }
        that.setData({
          cat_list: goodsClass,
        })
      }
    }),
    // 推荐分类轮播
    Trequest({
      url: 'adv/getlist',
      data: {
        type:2
      },
      callback(res) {
        console.log(res,'lunbo')
        let lunbopic = [];
        let obj = {};
        for (let j of res.data.data) {
          obj = {};
          obj.pic_url = j.pic_url;
          obj.id = j.gc_id
          lunbopic.push(obj)
        }
        that.setData({
          lunbo: lunbopic
        })
      }
    })
    // 推荐分类请求数据
    this.classClick(0);
  },
  // 点击左侧列表出现对应的商品
  classClick(id){
    var that = this;
    if(id == 0){
      that.setData({
        lunboshow: true
      })
    }else{
      that.setData({
        lunboshow:false
      })
    }
    Trequest({
      url: 'goods_category/cates',
      data: {
        id:id
      },
      callback(res) {
        var rightClass = [];
        var obj = {};
        for (let i of res.data) {
          obj = {};
          obj.name = i.name;
          obj.pic = i.pic;
          obj.id = i.id;
          rightClass.push(obj);
        }
        that.setData({
          classList: rightClass,
        })
      }
    })
  },
  catItemClick(e){
    var index = e.currentTarget.dataset.index;
    var sid = e.currentTarget.dataset.id;
    var list = this.data.cat_list;
    var rightClass = [];
    for (var i in list) i == index ? (list[i].active = true, this.classClick(sid)) : list[i].active = false;
    this.setData({
      cat_list: list,
    })
  },
  tosearch() {
    wx.navigateTo({
      url: '../sortList/sortList',
    })
  }
})
