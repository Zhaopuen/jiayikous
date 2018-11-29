module.exports = function Trequest(a) {
    a.data || (a.data = {});
    var t = wx.getStorageSync("access_token");
    t && (a.data.access_token = t), 
    wx.request({
        url: 'https://jingpai.fengsh.cn/api/'+a.url,
        header: a.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: a.data || {},
        method: a.method || "POST",
        dataType: a.dataType || "json",
        success: function(f) {
            // -1 == t.data.code ? getApp().login() : a.success && a.success(t.data);
          a.callback(f);
          return
        },
        fail: function(f) {
          a.callback(f);
        }
    });
};