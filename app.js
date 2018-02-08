// app.js
// 小程序入口
import util from './utils/Util'
import settings from './datamodel/Settings'

const Settings = new settings.Settings();

App({
    onLaunch: function () {

        // 先读取本地内容
        let userInfoLocal = util.loadData(Settings.Storage.WeChatUser);

        // 登录
        // 等待服务器反应
        // wx.showLoading({
        //     title: '同步数据',
        // });

        wx.login({
            success: res => {
                console.log("login res: ", res.code);
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: 'https://www.newpictown.com/WeChatMiniProgram/user/weChatMPOpenIdByJSCode/' + res.code,
                    success: response => {
                        console.log("openId response:", response);
                        let mpOpenId = response.data.mpOpenId;
                        // 获取用户信息
                        wx.getSetting({
                            success: res => {
                                // if (res.authSetting['scope.userInfo']) {
                                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                                wx.getUserInfo({
                                    data: {
                                        'withCredentials': true
                                    },
                                    success: res => {
                                        // 可以将 res 发送给后台解码出 unionId
                                        console.log("res.userInfo", res.userInfo);
                                        // 复制微信信息
                                        userInfoLocal.nickName = res.userInfo.nickName;
                                        userInfoLocal.gender = (res.userInfo.gender === 1) ? "Male" : "Female";
                                        userInfoLocal.avatarUrl = res.userInfo.avatarUrl;

                                        wx.request({
                                            url: 'https://www.newpictown.com/WeChatMiniProgram/user/weChatMPUnionIdQuery',
                                            method: 'POST',
                                            data: {
                                                mpOpenId: mpOpenId,
                                                encryptedData: res.encryptedData,
                                                iv: res.iv
                                            },
                                            success: response => {
                                                userInfoLocal.weChatInfo.unionId = response.data;
                                                util.saveData(Settings.Storage.WeChatUser, userInfoLocal);
                                                if (userInfoLocal.currentAuth === "") {
                                                    wx.hideLoading();
                                                    wx.redirectTo({
                                                        url: '/pages/normalpages/userinfo/userinfo' + '?model=register',
                                                    });
                                                }
                                                // if (typeof response.data.id === "undefined") {
                                                //     wx.hideLoading();
                                                //     wx.redirectTo({
                                                //         url: '/pages/normalpages/userinfo/userinfo' + '?model=register',
                                                //     });
                                                // }
                                                console.log("unionId response:", response);
                                            },
                                            fail: response => {
                                                console.log("failed response:", response);
                                            },
                                        });

                                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                        // 所以此处加入 callback 以防止这种情况
                                        if (this.userInfoReadyCallback) {
                                            this.userInfoReadyCallback(res);
                                        }
                                    },
                                    fail: function () {
                                        console.log("Failed to get OpenId");
                                    }
                                })
                                // }
                            }
                        })
                    },
                    fail: function (res) {
                        console.log(res);
                        console.log("Failed to get OpenId");
                    }
                })
            }
        });

        console.log("after wx.getSetting():", userInfoLocal);

    },

    Util: util,
    Settings: Settings,    // 全局同步标志
    globalData: {
        // 定义一些全局变量，在页面跳转的时候判断，方便其他的JS通过app调用

    }
})