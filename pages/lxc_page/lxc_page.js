Page({
    data: {
        page: 0
    },
    val: function (e) {
        this.setData({
            page: e.detail.value
        })
    },
    seach:function(){
        if (this.data.page == 0) {
            wx.showToast({
                title: '输入书的页码',
                image: '../../images/fail.png'
            })
        } else {
            var that = this;
            wx.getStorage({
                key: 'Data',
                success:function(e){
                    wx.request({
                        url: 'https://learningx.cn/api/v3/students/me/problems/',
                        header: {
                            'Content-Type': 'application/json',
                            'cookie': getApp().globalData.cookie
                        },
                        data: {
                            book: e.data.bookid,
                            page: parseInt(that.data.page)
                        },
                        success: function (res) {
                            if (res.statusCode == 200) {
                                if (res.data.length !== 0) {
                                    wx.setStorage({
                                        key: 'Data',
                                        data: {
                                            bookid: e.data.bookid,
                                            name: e.data.name,
                                            type: e.data.type,
                                            page: that.data.page,
                                            Data: JSON.stringify(res.data)
                                        }
                                    })
                                    wx.navigateTo({
                                        url: '../../pages/lxc/lxc'
                                    })
                                } else {
                                    wx.showToast({
                                        title: '没有题目',
                                        image: '../../images/fail.png'
                                    })
                                }
                            } else {
                                wx.showToast({
                                    title: '没有题目',
                                    image: '../../images/fail.png'
                                })
                            }
                        }
                    })
                }
            })
        }
    }
})