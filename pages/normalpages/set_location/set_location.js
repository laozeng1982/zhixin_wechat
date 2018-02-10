// pages/normalpages/set_location/set_location.js

import DataStructure from '../../../datamodel/DataStructure'

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userLocation: {}
    },

    /**
     * 选择位置
     */
    chooseLocation: function () {
        let host = this;
        wx.chooseLocation({
            success: function (res) {
                console.log(res);
                host.setData({
                    hasLocation: true,
                    location: app.Util.formatLocation(res.longitude, res.latitude),
                    locationAddress: res.address
                })
            }
        });
    },

    /**
     * 根据用户信息初始化
     */
    initLocation: function () {
        let userLocation = new DataStructure.Location();
        let host = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                console.log(res);
                userLocation.latitude = res.latitude;
                userLocation.longitude = res.longitude;

                console.log(userLocation);

                host.setData({
                    userLocation: userLocation
                });
            },
        });


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.initLocation();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})