Page({
    onShow: function () {
        var that = this;
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/uploadTasks/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.length == 0) {
                        wx.switchTab({
                            url: '../../pages/tab2/tab2',
                        })
                    } else {
                        var arr = [];
                        for (var i = 0; i < res.data.length; i++) {
                            arr.push({
                                time: new Date(res.data[0].time * 1000).getFullYear() + '年' + (new Date(res.data[0].time * 1000).getMonth() + 1) + '月' + new Date(res.data[0].time * 1000).getDate() + '日',
                                unix: res.data[i].time,
                                type: res.data[i].type
                            })
                        }
                        that.setData({
                            Data: arr
                        })
                    }
                }
            }
        })
    },
    jcb: function (e) {
        wx.navigateTo({
            url: '../../pages/jcb/jcb',
        })
        wx.setStorage({
            key: 'unix',
            data: e.currentTarget.dataset.unix,
        })
    }
})