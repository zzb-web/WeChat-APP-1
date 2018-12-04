Page({
    onShow: function() {
        var that = this;
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/profile/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            success: function(res) {
                if (res.statusCode == 200) {
                    that.setData({
                        name: res.data.realName,
                        learnId: res.data.learnId
                    })
                }
            }
        })
    },
    remove: function() {
        wx.reLaunch({
            url: '../../pages/login/login',
        })
    }
})