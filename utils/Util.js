/**
 * 工具类包，提供以下功能：
 * 1、日期之间的转换，日期和字符串的转换
 *
 */
import DataStructure from '../datamodel/DataStructure'
import settings from '../datamodel/Settings'

const _ = require('./underscore.modified');
const BASE_URL = 'https://www.newpictown.com/';

const Course = new DataStructure.Course();

function formatTime(time) {
    if (typeof time !== 'number' || time < 0) {
        return time;
    }

    let hour = parseInt(time / 3600);
    time = time % 3600;
    let minute = parseInt(time / 60);
    time = time % 60;
    let second = time;

    return ([hour, minute, second]).map(function (n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    }).join(':');
}


/**
 * 将日期和时间转为指定格式，例如：2017-08-30 15:30:25
 * 参数：date，日期类（Date）
 */
function formatTimeToString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

/**
 * 将日期转为指定格式，例如：2017-01-01, 2017-08-30
 * 参数：date，日期类（Date）
 */
function formatDateToString(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(formatNumber).join('-');
}

/**
 * 给定年月日，取得当前时间
 * 参数year：年
 * 参数month：月，自然月
 * 参数day：当月第day日
 */
function getDateFromNumbers(year, month, day) {
    return new Date(Date.UTC(year, month - 1, day));
}

/**
 * 将字符串日期转换为日期类，得到对应的日期对象
 * 参数date：字符串表示的日期，比如 '2016-9-01'或者'2016/9/01'
 * 参数splicer：字符串中的分隔符
 */
function getDateFromString(date, splicer) {
    let year = date.split(splicer)[0];
    let month = date.split(splicer)[1];
    let day = date.split(splicer)[2];

    return new Date(Date.UTC(year, month - 1, day));
}

/**
 * 格式化输出日期字符串，输出格式为：2017-08-30
 * 参数year：年
 * 参数month：月，自然月
 * 参数day：当月第day日
 */
function formatStringDate(year, month, day) {
    return [year, month, day].map(formatNumber).join('-');
}

/**
 * 格式化输出数字，固定位数
 * @param n，位数
 */
function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude);
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}

/**
 * 检查当前选择日期与今天的关系
 * 过期，则返回：-1
 * 今天，则返回：0
 * 将来，则返回：1
 */
function dateDirection(selectedDate) {
    let direction = -1;

    let distance = datesDistance(selectedDate, formatDateToString(new Date()));
    if (distance > 0) {
        direction = -1;
    } else if (distance === 0) {
        direction = 0;
    } else {
        direction = 1;
    }

    return direction;
}

/**
 * 检查当前选择日期与今天的关系
 * 返回end时间到start的天数，正数表示end时间靠后，反之亦然
 */
function datesDistance(start, end) {
    let distance;

    let startTime = getDateFromString(start, '-').getTime() / (3600 * 24 * 1000);
    let endTime = getDateFromString(end, '-').getTime() / (3600 * 24 * 1000);

    distance = endTime - startTime;

    return distance;
}

/**
 *
 * @param startDay
 * @param isNext
 * @param dayCount
 */
function getMovedDate(startDay, isNext, dayCount) {
    let selectedDayTimeMills;
    let movedDayTimeMills;

    // 判断参数时间类型
    if (typeof startDay === "string") {
        selectedDayTimeMills = getDateFromString(startDay, '-').getTime();
    } else {
        selectedDayTimeMills = startDay.getTime();
    }

    //时间改变一天，直接加上、或减去一天的毫秒数
    if (isNext) {
        movedDayTimeMills = selectedDayTimeMills + 3600 * 24 * 1000 * dayCount;
    } else {
        movedDayTimeMills = selectedDayTimeMills - 3600 * 24 * 1000 * dayCount;
    }
    let movedDayDate = new Date();
    movedDayDate.setTime(movedDayTimeMills);
    // console.log("move to ", movedDayDate + ".............");

    // 根据输入返回
    if (typeof startDay === "string") {
        return formatDateToString(movedDayDate);
    } else {
        return movedDayDate;
    }

}

/**
 *
 * @param startDate
 * @param checkDate
 * @param endDate
 */
function checkDate(startDate, checkDate, endDate) {
    let startDateTimeMills = getDateFromString(startDate, '-').getTime();
    let checkDateTimeMills = getDateFromString(checkDate, '-').getTime();
    let endDateTimeMills = getDateFromString(endDate, '-').getTime();

    return startDateTimeMills <= checkDateTimeMills && checkDateTimeMills <= endDateTimeMills;
}

/**
 * 深度克隆
 * @param obj
 * @returns {*}
 */
function deepClone(obj) {

    let clone = obj.constructor === Array ? [] : {};

    // 递归
    for (let item in obj) {
        if (obj.hasOwnProperty(item)) {
            clone[item] = typeof obj[item] === "object" ? deepClone(obj[item]) : obj[item];
        }
    }

    return clone;
}

function isEqual(a, b) {
    return _.isEqual(a, b);
}

/**
 * 功能：从选中的日期读取指定内容
 * 参数1：key，要读取的数据
 * 参数2：dataType，数据类型（Storage）
 * 返回：请求类型的数据
 * 调用关系：外部函数，开放接口
 */
function loadData(dataType) {
    // 读取该类型数据已存储的内容
    let readInData = wx.getStorageSync(dataType.key);
    // 当天请求的数据
    let requestData = '';

    // 根据类型来抽取需要的数据
    // 如果没有这个记录，取的会是空值，则新建一个对应的项
    if (readInData !== '') {
        requestData = readInData;
    } else {
        switch (dataType.id) {
            case 0:
                // 0. UserInfo
                requestData = new DataStructure.WeChatUser();
                break;
            case 1:
                // 1. UserProfile
                requestData = [];
                break;
            case 2:
                // 2. UserPlanSet
                requestData = [];

                break;
            case 3:
                // 3. RealitySet
                requestData = [];
                break;
            case 4:
                // 4. SystemPlanSet
                requestData = [];
                break;
            case 5:
                // 5. PartsWithActions
                // requestData = new DataStructure.artsWithActions();
                break;
            case 6:
                // 6. SyncedTag
                requestData = new settings.Settings();
                break;
            default:
                break;
        }
    }

    return requestData;
}

/**
 * 功能：存储数据
 * 参数1：dataType，数据类型（StrorageType）
 * 参数2：dataToSave，要存储的数据
 * 调用关系：外部函数，开放接口
 */
function saveData(dataType, dataToSave) {
    // 根据类型来判断是否需要替换其中的数据，还是直接覆盖
    console.log("in saveData, targetToSave: ", dataToSave);
    wx.setStorageSync(dataType.key, dataToSave);
}

/**
 * 同步爱撸铁设计的动作信息
 * @param host
 */
function syncActions(host) {
    // 获取后台服务器上的动作数据
    wx.request({
        url: 'https://www.newpictown.com/part/allPredefinedOnes',
        success: function (res) {
            // console.log("in syncActions, body info:", res.data);
            let actionArray = res.data;
            let body = new Body.PartsWithActions(actionArray);

            // console.log("in syncActions, body info:", body);
            // console.log(Storage);

            // 保存在本地
            saveData(Settings.Storage.PartsWithActions, body);
        }
    });
}

/**
 * 同步用户的微信信息
 * @param host
 */
function syncWechatUserInfo(host) {
    // 获取用户的微信信息
    wx.getUserInfo({
        success: res => {
            // 可以将 res 发送给后台解码出 unionId
            console.log("in syncWechatUserInfo, wechatUserInfo: ", res.userInfo);
            host.wechatUserInfo = res.userInfo;
            host.userInfoLocal.nickName = res.userInfo.nickName;
            host.userInfoLocal.gender = res.userInfo.gender === 1 ? "Male" : "Female";
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (host.userInfoReadyCallback) {
                host.userInfoReadyCallback(res);
            }
        },
        fail: res => {
            console.log("failed: ", res);
        }
    });
}

function copyInfo(host, res) {
    host.userInfoLocal.userUID = res.data.id;
    host.userInfoLocal.birthday = res.data.dateOfBirth;
    host.userInfoLocal.nickName = res.data.nickName;
    host.userInfoLocal.gender = res.data.gender;
    host.userInfoLocal.height = res.data.extendedInfoMap.height.value;
    host.userInfoLocal.weight = res.data.extendedInfoMap.weight.value;
    host.userInfoLocal.wechatOpenId = res.data.wechatMPOpenId;
    host.userInfoLocal.wechatUnionId = res.data.wechatMPOpenId;
    host.userInfoLocal.mobileNumber = res.data.mobileNumber;

}

/**
 * 同步由爱撸铁设计的用户数据信息
 * @param host
 * @param type
 * @param data2Sever
 * @param data2Local
 */
function syncUserInfo(host, type, data2Sever, data2Local) {
    if (host) {
        wx.login({
            success: function (res) {
                console.log("in syncUserInfo, login.res.code:", res);
                if (res.code) {
                    // 1、获取js_code，去后台换取OpenId
                    wx.request({
                        url: urls.user.getOpenId(res.code),
                        method: 'GET',
                        success: function (res) {
                            let openId = res.data;
                            console.log("in syncUserInfo, openId:", openId);
                            // 2、根据OpenId获取服务器上用户信息
                            if (typeof openId !== 'undefined' || openId !== '') {
                                wx.request({
                                        url: urls.user.byOpenId(openId),
                                        method: 'GET',
                                        success: function (res) {
                                            if (typeof res.data.id !== 'undefined') {
                                                console.log("in syncData, res.data:", res.data);
                                                copyInfo(host, res);
                                                console.log("in syncData, host.userInfoLocal:", host.userInfoLocal);
                                                saveData(Settings.Storage.UserInfo, host.userInfoLocal);
                                            } else {
                                                console.log("in syncData, host.userInfoLocal:", host.userInfoLocal);
                                                host.userInfoLocal.wechatOpenId = openId;
                                                console.log("in syncData, user didn't register on server!");
                                                wx.showModal({
                                                    title: 'Error',
                                                    content: '还未注册，去注册？',
                                                    success: function (res) {
                                                        if (res.confirm) {
                                                            // 去注册
                                                            wx.redirectTo({
                                                                url: '/pages/settings/userinfo/userinfo?model=newUser',
                                                            });
                                                        } else if (res.cancel) {
                                                            console.log('用户取消UserUID');
                                                        }
                                                    }
                                                });

                                            }
                                        },
                                        fail: function (res) {
                                            console.log("Get user id fail: ", res.data);
                                        }
                                    }
                                );
                            } else {
                                console.log("Get OpenId fail: ", res.data);
                                wx.showModal({
                                    title: 'Error',
                                    content: '未能获取用户的OpenId，请检查网络',
                                });
                            }
                        },
                        fail: function (res) {
                            console.log("get OpenId fail: ", res.data);
                            wx.showModal({
                                title: 'Error',
                                content: '未能获取用户的OpenId，请检查网络',
                            });
                        }
                    })
                }
            }
        });
    } else {
        if (data2Sever.id === -1) {
            delete data2Sever.id;
            createData(type, data2Sever, data2Local);
        } else {
            updateData(type, data2Sever, data2Local);
        }
    }

}

function syncPlan(host, type, data2Sever, data2Local) {
    if (data2Sever.id === -1) {
        delete data2Sever.id;
        createData(type, data2Sever, data2Local);
    } else {
        updateData(type, data2Sever, data2Local);
    }

}

function syncReality(host, type, data2Sever, data2Local) {
    // wx.showLoading({
    //     title: '同步数据',
    // });
    let data = {
        "fromDate": host.selectedDateString,
        "toDate": host.selectedDateString,
        "userId": host.userInfoLocal.userUID
    };
    wx.request({
        url: 'https://www.newpictown.com/reality/page/',
        data: data,
        method: 'POST',
        success: function (res) {
            console.log("in syncReality, reality info:", res.data);
            // 查询当天是否存有reality
            let realityId = -1;
            for (let item of res.data.content) {
                if (item.date === host.selectedDateString) {
                    realityId = item.id;
                }
            }

            if (realityId === -1) {
                delete data2Sever.id;
                createData(type, data2Sever, data2Local);
            } else {
                data2Sever.id = realityId;
                updateData(type, data2Sever, data2Local);
            }
            // wx.hideLoading();
        }
    });

}


/**
 * 同步数据
 * @param host
 * @param type
 * @param data2Sever
 * @param data2Local
 */
function syncData(host, type, data2Sever, data2Local) {
    switch (type) {
        case "predefined":
            // 爱撸铁自定义动作列表
            syncActions(host);
            break;
        case "wechat":
            // 微信用户信息
            syncWechatUserInfo(host);
            break;
        case "user":
            // 爱撸铁用户信息
            syncUserInfo(host, type, data2Sever, data2Local);
            break;
        case "plan":
            syncPlan(host, type, data2Sever, data2Local);
            break;
        case "reality":
            syncReality(host, type, data2Sever, data2Local);
            break;
        default:
            console.log("in createData, wrong type!");
            break;
    }
}

/**
 * 到服务端创建数据，本地保存新建的数据
 * @param type
 * @param data2Sever
 * @param data2Local
 */
function createData(type, data2Sever, data2Local) {
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
function updateData(type, data2Sever, data2Local) {
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
    formatTime: formatTime,
    formatTimeToString: formatTimeToString,
    formatDateToString: formatDateToString,
    getDateFromString: getDateFromString,
    formatStringDate: formatStringDate,
    formatLocation: formatLocation,
    formatNumber: formatNumber,
    dateDirection: dateDirection,
    datesDistance: datesDistance,
    getMovedDate: getMovedDate,
    checkDate: checkDate,
    deepClone: deepClone,
    isEqual: isEqual,
    underscore: _,
    loadData: loadData,
    saveData: saveData,
    syncData: syncData,

};
