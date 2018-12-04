Page({
    onShow: function () {
        var that = this;
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/notMarkedPapers/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    var arr = [];
                    for (var i = 0; i < res.data.length; i++) {
                        arr.push({
                            name: res.data[i].name,
                            paperID: res.data[i].paperID
                        })
                    }
                    that.setData({
                        Data: arr
                    })
                }else{
                    wx.switchTab({
                        url: '../../pages/tab2/tab2',
                    })
                }
            }
        })
    },
    sj: function (e) {
        wx.navigateTo({
            url: '../../pages/sj/sj?paperID=' + e.currentTarget.dataset.paperid + '&name=' + e.currentTarget.dataset.name
        })
    }
})