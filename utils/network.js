/**
 * 网络请求类，这里是异步请求，那么get，post等不能直接写到对应的类里面
 */
import Util from '../utils/util'

const BASE_URL = "https://www.yongrui.wang/WeChatMiniProgram/";

class network {
    constructor() {

    }

}



/**
 * 使用GET方法获取数据
 * @param type
 * @param key
 */
function getData(type, key) {
    wx.showLoading({
        title: '获取数据',
    });

    wx.request({
            url: BASE_URL + type + "/" + key,
            method: 'GET',
            success: function (res) {
                if (typeof res.data.id !== 'undefined') {
                    console.log("return id:", res.data.id);
                    switch (type) {
                        case "user":
                            data2Local.userUID = parseInt(res.data.id);
                            Util.saveData(Settings.Storage.UserInfo, data2Local);
                            console.log("data2Local: ", data2Local);
                            console.log("create user successful, res.data:", res.data);
                            wx.hideLoading();
                            break;
                        case "plan":
                            data2Sever.id = res.data.id;
                            data2Local.push(data2Sever);
                            Util.saveData(Settings.Storage.UserPlanSet, data2Local);
                            console.log("create plan successful, res.data:", res.data);
                            wx.hideLoading();
                            wx.switchTab({
                                url: '../../index/index',
                            });
                            break;
                        case "reality":
                            data2Sever.id = res.data.id;
                            data2Local.push(data2Sever);
                            Util.saveData(Settings.Storage.RealitySet, data2Local);
                            wx.hideLoading();
                            console.log("create reality successful, res.data:", res.data);
                            break;
                        default:
                            console.log("in createData, wrong type!");
                            break;
                    }
                }
            },
            fail: function (res) {
                wx.hideLoading();
                wx.switchTab({
                    url: '../../index/index',
                });
                console.log("create fail: ", res.data);
            }
        }
    );
}

/**
 * 到服务端创建数据，本地保存新建的数据
 * @param type
 * @param data2Sever
 * @param data2Local
 */
function postData(type, data2Sever, data2Local) {
    wx.showLoading({
        title: '同步数据',
    });

    wx.request({
            url: BASE_URL + type + "/",
            method: 'POST',
            data: data2Sever,
            success: function (res) {
                if (typeof res.data.id !== 'undefined') {
                    console.log("return id:", res.data.id);
                    switch (type) {
                        case "user":
                            data2Local.userUID = parseInt(res.data.id);
                            saveData(Settings.Storage.UserInfo, data2Local);
                            console.log("data2Local: ", data2Local);
                            console.log("create user successful, res.data:", res.data);
                            wx.hideLoading();
                            break;
                        case "plan":
                            data2Sever.id = res.data.id;
                            data2Local.push(data2Sever);
                            saveData(Settings.Storage.UserPlanSet, data2Local);
                            console.log("create plan successful, res.data:", res.data);
                            wx.hideLoading();
                            wx.switchTab({
                                url: '../../index/index',
                            });
                            break;
                        case "reality":
                            data2Sever.id = res.data.id;
                            data2Local.push(data2Sever);
                            saveData(Settings.Storage.RealitySet, data2Local);
                            wx.hideLoading();
                            console.log("create reality successful, res.data:", res.data);
                            break;
                        default:
                            console.log("in createData, wrong type!");
                            break;
                    }
                }
            },
            fail: function (res) {
                wx.hideLoading();
                wx.switchTab({
                    url: '../../index/index',
                });
                console.log("create fail: ", res.data);
            }
        }
    );
}

/**
 * 到服务端更新数据，本地保存更新的数据
 * @param type
 * @param data2Sever
 * @param data2Local
 */
function putData(type, data2Sever, data2Local) {
    // 后台更新
    wx.showLoading({
        title: '同步数据',
    });
    wx.request({
            url: BASE_URL + type + "/",
            method: 'PUT',
            data: data2Sever,
            success: function (res) {
                if (typeof res.data.id !== 'undefined') {
                    switch (type) {
                        case "user":
                            console.log("update user success: ", res.data);
                            saveData(Settings.Storage.UserInfo, data2Local);
                            break;
                        case "plan":
                            let newPlanId = res.data.id;
                            data2Sever.id = newPlanId;
                            data2Local.push(data2Sever);

                            saveData(Settings.Storage.UserPlanSet, data2Local);
                            console.log("update plan successful, res.data:", res.data);
                            wx.hideLoading();
                            wx.switchTab({
                                url: '../../index/index',
                            });
                            break;
                        case "reality":
                            let newRealityId = res.data.id;
                            data2Sever.id = newRealityId;
                            data2Local.push(data2Sever);

                            saveData(Settings.Storage.RealitySet, data2Local);
                            console.log("update reality successful, res.data:", res.data);
                            wx.hideLoading();
                            break;
                        default:
                            console.log("in createData, wrong type");
                            break;
                    }
                }

            },
            fail: function (res) {
                console.log("update", type, "fail: ", res.data);
            }
        }
    );

}

module.exports = {
    network: network
};