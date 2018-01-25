//index.js
//获取应用实例

import DataStructure from '../../datamodel/DataStructure'


const app = getApp();

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onBtn: function () {
        let wechatUser = new DataStructure.WeChatUser();
        let tmpUser = {};
        tmpUser.dateOfBirth = "1982-08-30";  // (Calendar, optional),
        tmpUser.email = "25471915@qq.com";  // (string, optional),
        tmpUser.enName = "JianGe";  // (string, optional),
        tmpUser.enabled = true;  // (boolean, optional),
        tmpUser.gender = "Male";  // (string, optional) = ['Unknown', 'Male', 'Female'],
        tmpUser.weChatInfo = {
            mpOpenId: "1234",// (string, optional),
            oaOpenId: "5678", // (string, optional),
            unionId: "12345678"  // (string, optional)
        };

        wechatUser.cloneDataFrom(tmpUser);
        console.log("wechatUser", wechatUser);
        wechatUser.validate();
    },

    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
