Page({
    data: {
        Number: '30088',
        Password: '123456',
        disabled: false
    },
    Number: function(e) {
        this.setData({
            Number: e.detail.value
        })
    },
    Password: function(e) {
        this.setData({
            Password: e.detail.value
        })
    },
    Login: function(e) {
        var that = this;
        if (that.data.Number == '') {
            wx.showToast({
                title: '请输入学习号',
                image: '../../images/fail.png'
            })
        } else if (that.data.Password == '') {
            wx.showToast({
                title: '请输入密码',
                image: '../../images/fail.png'
            })
        } else {
            wx.showToast({
                title: '登录中',
                icon: 'loading',
                duration: 2000000
            })
            that.setData({
                disabled: true
            })
            wx.request({
                url: 'https://learningx.cn/api/v3/students/login/',
                header: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                data: {
                    learnId: parseInt(that.data.Number),
                    password: that.data.Password,
                    remember: true
                },
                success: function(res) {
                    if (res.statusCode == 200) {
                        wx.hideToast();
                        getApp().globalData.cookie = res.header['Set-Cookie'];
                        wx.request({
                            url: 'https://learningx.cn/api/v3/students/me/profile/',
                            header: {
                                'Content-Type': 'application/json',
                                'cookie': getApp().globalData.cookie
                            },
                            success: function (res) {
                                if (res.statusCode == 200) {
                                    wx.showModal({
                                        title: '姓名确认：' + res.data.realName + ' ？',
                                        showCancel: false,
                                        success: function (res) {
                                            if (res.confirm) {
                                                wx.switchTab({
                                                    url: '../../pages/tab1/tab1',
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        that.setData({
                            disabled: false
                        })
                        wx.showToast({
                            title: '输入有误',
                            image: '../../images/fail.png'
                        })
                    }
                }
            })
        }
    }
})