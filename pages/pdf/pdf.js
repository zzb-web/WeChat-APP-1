Page({
    onLoad: function(options) {
        this.setData({
            PDF: options.pdf
        })
        setTimeout(function(){
            wx.switchTab({
                url: '../../pages/tab1/tab1',
            })
        },1000)    
    }
})