Page({
    data: {
        star: '',
        end: '',
        name: ''
    },
    onShow: function() {
        var that = this;
        wx.request({
            url: 'https://learningx.cn/api/v3/students/me/books/',
            header: {
                'Content-Type': 'application/json',
                'cookie': getApp().globalData.cookie
            },
            success: function(res) {
                that.setData({
                    Data: res.data
                })
            }
        })
    },
    group: function(e) {
        this.setData({
            name: e.currentTarget.dataset.name,
            bookid: e.currentTarget.dataset.bookid
        })
    },
    star: function(e) {
        this.setData({
            star: e.detail.value
        })
    },
    end: function(e) {
        this.setData({
            end: e.detail.value
        })
    },
    ok: function() {
        if (this.data.name == '') {
            wx.showToast({
                title: '请选择错题来源',
                image: '../../images/fail.png'
            })
        } else if (this.data.star == '') {
            wx.showToast({
                title: '请输入起始页码',
                image: '../../images/fail.png'
            })
        } else if (this.data.end == '') {
            wx.showToast({
                title: '请输入结束页码',
                image: '../../images/fail.png'
            })
        } else {
            getApp().globalData.Data.push({
                name: this.data.name,
                star: this.data.star,
                end: this.data.end
            })
            getApp().globalData.bookPage.push({
                bookID: this.data.bookid,
                startPage: parseInt(this.data.star),
                endPage: parseInt(this.data.end)
            })
            wx.navigateBack({})
        }
    }
})