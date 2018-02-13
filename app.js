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
        wx.showLoading({
            title: '同步数据',
        });

        let host = this;

        wx.login({
            success: res => {
                console.log("login res: ", res.code);
                // 发送 res.code 到后台换取 openId
                wx.request({
                    url: 'https://www.yongrui.wang/WeChatMiniProgram/user/weChatMPOpenIdByJSCode/' + res.code,
                    // 获取OpenId成功
                    success: response => {
                        console.log("openId response.data:", response.data);
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

                                        // 取得openId后去获取unionId，并带回服务器上用户的数据
                                        wx.request({
                                            url: 'https://www.yongrui.wang/WeChatMiniProgram/user/weChatMPUnionIdQuery',
                                            method: 'POST',
                                            data: {
                                                mpOpenId: mpOpenId,
                                                encryptedData: res.encryptedData,
                                                iv: res.iv
                                            },
                                            success: response => {
                                                // 形成其他request要的header
                                                let userAuth = response.data.weChatInfo.unionId + ":password";
                                                let arrayBuffer = new ArrayBuffer(userAuth.length * 2);
                                                let bufferView = new Uint16Array(arrayBuffer);
                                                for (let i = 0, strLen = userAuth.length; i < strLen; i++) {
                                                    bufferView[i] = userAuth.charCodeAt(i);
                                                }

                                                let basicAuth = "Basic " + wx.arrayBufferToBase64(bufferView);

                                                let request_header = {
                                                    Authorization: basicAuth
                                                };

                                                console.log(request_header);

                                                // 将来注册和查询用
                                                host.tempData.request_header = request_header;
                                                host.tempData.unionId = response.data.weChatInfo.unionId;

                                                userInfoLocal.weChatInfo.unionId = response.data.weChatInfo.unionId;

                                                console.log("unionId response.data:", response.data);
                                                // 判断本地是否数据    
                                                if (userInfoLocal.id === -1) {
                                                    // 如果未注册，不返回id，去注册页面
                                                    if (typeof response.data.id === "undefined") {
                                                        // 先保存，然后在另外一个页面再调用localStorage
                                                        util.saveData(Settings.Storage.WeChatUser, userInfoLocal);
                                                        wx.hideLoading();

                                                        wx.redirectTo({
                                                            url: '/pages/normalpages/userinfo/userinfo' + '?model=register',
                                                        });
                                                    } else {
                                                        // 如果返回id，表示本地删除过小程序，找回用户信息，在获取了用户id之后，更新用户信息，这步必须的。
                                                        // 复制信息
                                                        // userInfoLocal.id = response.data.id;
                                                        // userInfoLocal.nickName =response.data.

                                                        for (let item in response.data) {
                                                            if (userInfoLocal.hasOwnProperty(item)) {
                                                                userInfoLocal[item] = response.data[item];
                                                            }
                                                        }

                                                        let authorities = [];
                                                        for (let item of response.data.roleSet) {
                                                            switch (item.id) {
                                                                case 2:
                                                                    authorities.push("teacher");
                                                                    break;
                                                                case 3:
                                                                    authorities.push("student");
                                                                    break;
                                                                case 4:
                                                                    authorities.push("parent");
                                                                    break;
                                                                default:
                                                                    break;
                                                            }
                                                        }

                                                        userInfoLocal.authorities = authorities;

                                                        util.saveData(Settings.Storage.WeChatUser, userInfoLocal);

                                                        wx.hideLoading();
                                                    }
                                                } else {
                                                    // 有的话也要同步，万一多设备登录
                                                    for (let item in response.data) {
                                                        if (userInfoLocal.hasOwnProperty(item)) {
                                                            userInfoLocal[item] = response.data[item];
                                                        }
                                                    }

                                                    let authorities = [];
                                                    for (let item of response.data.roleSet) {
                                                        switch (item.id) {
                                                            case 2:
                                                                authorities.push("teacher");
                                                                break;
                                                            case 3:
                                                                authorities.push("student");
                                                                break;
                                                            case 4:
                                                                authorities.push("parent");
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    }

                                                    userInfoLocal.authorities = authorities;

                                                    util.saveData(Settings.Storage.WeChatUser, userInfoLocal);
                                                    wx.hideLoading();
                                                }

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
                                    fail: res => {
                                        console.log("Failed to get OpenId.", res);
                                    }
                                })
                                // }
                            },
                            fail: res => {
                                console.log("Failed to getSetting, res:", res);
                            }
                        })
                    },
                    // 获取OpenId失败
                    fail: function (res) {
                        console.log(res);
                        console.log("Failed to get OpenId");
                    }
                })
            }
        });

    },

    Util: util,
    Settings: Settings,    // 全局同步标志
    currentAuth: "",

    // 定义全局变量
    tempData: {
        unionId: "",
        currentCourseSubTab: "all_course",
        recurringRulesArray: [],
        recurringRulesString: "",
        location: {}
    },

    globalData: {
        // 定义一些全局变量，在页面跳转的时候判断，方便其他的JS通过app调用

    }
})