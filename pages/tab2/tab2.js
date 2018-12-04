Page({
    data: {
        n1: true,
        n2: true,
        n3: true
    },
    onShow: function () {
        var that = this;
        // 1
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/uploadTasks/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.data.length == 0) {
                        that.setData({
                            n1: true
                        })
                    } else {
                        that.setData({
                            n1: false
                        })
                    }
                }
            }
        })
        // 2
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/notMarkedPapers/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                    if (res.data.length !== 0) {
                        that.setData({
                            n2: false
                        })
                    } else {
                        that.setData({
                            n2: true
                        })
                    }
                }else{
                    that.setData({
                        n2: true
                    })
                }
            }
        })
        // 3
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/books/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            success: function (res) {
                if (res.statusCode == 404) {
                    that.setData({
                        n3: true
                    })
                } else {
                    that.setData({
                        n3: false,
                        arr: res.data
                    })
                }
            }
        })
    },
    jcb_list: function () {
        wx.navigateTo({
            url: '../../pages/jcb_list/jcb_list',
        })
    },
    sj_list: function () {
        wx.navigateTo({
            url: '../../pages/sj_list/sj_list',
        })
    },
    lxc_page: function (e) {
        wx.setStorage({
            key: 'Data',
            data: {
                bookid: e.currentTarget.dataset.bookid,
                name: e.currentTarget.dataset.name,
                type: e.currentTarget.dataset.type
            }
        })
        wx.navigateTo({
            url: '../../pages/lxc_page/lxc_page'
        })
    }
})