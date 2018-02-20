/**
 * 格式化输出数字，固定位数
 * @param n，位数
 */
function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

function transEnDate2ChDate(date) {

    switch (date) {
        case "Sun":
            return "周日";
        case "Mon":
            return "周一";
        case "Tue":
            return "周二";
        case "Wed":
            return "周三";
        case "Thu":
            return "周四";
        case "Fri":
            return "周五";
        case "Sat":
            return "周六";
    }

}

function transNumDate2ChDate(date) {

    switch (date) {
        case 0:
            return "周日";
        case 1:
            return "周一";
        case 2:
            return "周二";
        case 3:
            return "周三";
        case 4:
            return "周四";
        case 5:
            return "周五";
        case 6:
            return "周六";
    }

}

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

    // console.log(startDate,checkDate,endDate);
    // console.log(startDateTimeMills,checkDateTimeMills,endDateTimeMills);

    return startDateTimeMills <= checkDateTimeMills && checkDateTimeMills <= endDateTimeMills;
}

/**
 * 最核心的函数
 * 1、获取每个的显示列表
 * 2、搜索、标记日期状态
 */
function getDateList(year, month) {
    let week;
    // 如果是闰年，则2月有29天
    let monthDaysCountArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (parseInt(year) % 4 === 0 && parseInt(year) % 100 !== 0) {
        console.log(parseInt(year) % 4, "and ", parseInt(year) % 100);
        monthDaysCountArr[1] = 29;
    }

    //第几个月；下标从0开始，实际月份需要加1
    let dateList = [];
    dateList[0] = [];

    //第几个星期
    let weekIndex = 0;
    let firstDayOfWeek = new Date(Date.UTC(year, month - 1, 1)).getDay();
    let hasDoneFirstWeek = false;
    // console.log(firstDayOfWeek);
    let lastYear = month - 1 > 0 ? year : year - 1;
    let lastMonth = month - 1 > 0 ? month - 1 : 12;
    let nextYear = month + 1 === 13 ? year + 1 : year;
    let nextMonth = month + 1 === 13 ? 1 : month + 1;
    for (let idx = 0; idx < monthDaysCountArr[month - 1]; idx++) {
        week = new Date(Date.UTC(year, month - 1, idx + 1)).getDay();
        // 补齐每个月前面的日子，计算上个月的尾巴
        if (firstDayOfWeek === 0 && !hasDoneFirstWeek) {
            for (let idx = 0; idx < 7; idx++) {
                let date = monthDaysCountArr[lastMonth - 1] + idx - 6;
                dateList[weekIndex].push({
                    value: formatStringDate(lastYear, lastMonth, date),
                    date: date,
                    week: idx,
                    selected: false,
                    hasCourse: false,
                    courseArray: [],
                    courseString: '',
                    inThisMonth: false
                });
            }
            weekIndex++;
            dateList[weekIndex] = [];
            hasDoneFirstWeek = true;

        } else if (!hasDoneFirstWeek) {
            for (let blank = 0; blank < firstDayOfWeek; blank++) {
                let date = monthDaysCountArr[lastMonth - 1] + blank + 1 - firstDayOfWeek;
                dateList[weekIndex].push({
                    value: formatStringDate(lastYear, lastMonth, date),
                    date: date,
                    week: week + blank - firstDayOfWeek,
                    selected: false,
                    hasCourse: false,
                    courseArray: [],
                    courseString: '',
                    inThisMonth: false
                });
            }
            hasDoneFirstWeek = true;
        }

        // 每个月的日子
        dateList[weekIndex].push({
            value: formatStringDate(year, month, (idx + 1)),
            date: idx + 1,
            week: week,
            selected: false,
            hasCourse: false,
            courseArray: [],
            courseString: '',
            inThisMonth: true
        });


        if (week === 6) {
            weekIndex++;
            dateList[weekIndex] = [];
        }

        // 补齐每个月最后面的日子，计算下个月的头
        if (idx === monthDaysCountArr[month - 1] - 1) {
            let rest = 7 - dateList[weekIndex].length;
            for (let i = 0; i < rest; i++) {
                dateList[weekIndex].push({
                    value: formatStringDate(nextYear, nextMonth, (i + 1)),
                    date: i + 1,
                    week: week + i + 1 <= 6 ? week + i + 1 : i,
                    selected: false,
                    hasCourse: false,
                    courseArray: [],
                    courseString: '',
                    inThisMonth: false
                });
            }

            if (weekIndex !== 5) {
                weekIndex = 5;
                dateList[weekIndex] = [];
                for (let i = 0; i < 7; i++) {
                    dateList[weekIndex].push({
                        value: formatStringDate(nextYear, nextMonth, (rest + i + 1)),
                        date: rest + i + 1,
                        week: i,
                        selected: false,
                        hasCourse: false,
                        courseArray: [],
                        courseString: '',
                        inThisMonth: false
                    });
                }
            }
        }
    }

    // 准备有课程日期的标注数据
    // console.log(app.currentPlan);
    // for (let week = 0; week < dateList.length; week++) {
    //     for (let day = 0; day < dateList[week].length; day++) {
    //         // 先判断这天是否在周期内
    //         if (checkDate(app.currentPlan.fromDate, dateList[week][day].value, app.currentPlan.endDate)) {
    //             let partArr = [];
    //             for (let circleDay of app.currentPlan.circleDaySet) {
    //                 if (circleDay.id === dateList[week][day].week) {
    //                     dateList[week][day].hasCourse = true;
    //                     dateList[week][day].courseArray.push(circleDay.name);
    //                     for (let exercise of circleDay.exerciseSet) {
    //                         partArr.push(exercise.action.partSet[0]);
    //                     }
    //                 }
    //             }
    //             dateList[week][day].courseString = app.Util.makePartString(partArr);
    //         }
    //     }
    // }

    // 打印检验
    // console.log("log begins here~~~~~~~~~~~~~~~~~~~~~");
    // for (let week = 0; week < dateList.length; week++) {
    //     for (let day = 0; day < dateList[week].length; day++) {
    //         console.log("dateList[", week, "][", day, "], is: ", dateList[week][day].value
    //             , ", ", dateList[week][day].date
    //             , ", ", dateList[week][day].week
    //             , ", selected", dateList[week][day].selected
    //             , ", hasCourse", dateList[week][day].hasCourse
    //             , ", courseString", dateList[week][day].courseString.toString()
    //             , ", inThisMonth", dateList[week][day].inThisMonth);
    //     }
    // }

    // host.setData({
    //     dateList: dateList
    // });

    // console.log("dateList:", dateList);

    return dateList;
}

/**
 * 移动月的操作，整月移动
 */
function moveMonth(isNext) {
    // let currentYear = this.data.currentYear;
    // let currentMonth = this.data.currentMonth;
    // let currentDate = this.data.currentDate;
    //
    // if (isNext === "next") {
    //     currentYear = currentMonth + 1 === 13 ? currentYear + 1 : currentYear;
    //     currentMonth = currentMonth + 1 === 13 ? 1 : currentMonth + 1;
    //     currentDate = 1;
    // } else if (isNext === "last") {
    //     currentYear = currentMonth - 1 ? currentYear : currentYear - 1;
    //     currentMonth = currentMonth - 1 ? currentMonth - 1 : 12;
    //     currentDate = 1;
    // } else if (isNext === "now") {
    //     let now = new Date();
    //     currentYear = now.getFullYear();
    //     currentMonth = now.getMonth() + 1;
    //     currentDate = now.getDate();
    // }
    //
    // console.log("move to: ", currentYear, "年", currentMonth, "月", currentDate, "日");
    // this.setData({
    //     currentYear: currentYear,
    //     currentMonth: currentMonth,
    //     currentDate: currentDate,
    //     showPlanDetail: false,
    //     selectedDate: app.Util.formatDateToString(new Date())
    // });
    //
    // getDateList(currentYear, currentMonth);

}

module.exports = {
    formatNumber: formatNumber,
    formatTime: formatTime,
    transEnDate2ChDate: transEnDate2ChDate,
    transNumDate2ChDate: transNumDate2ChDate,
    formatTimeToString: formatTimeToString,
    formatDateToString: formatDateToString,
    getDateFromString: getDateFromString,
    formatStringDate: formatStringDate,
    dateDirection: dateDirection,
    datesDistance: datesDistance,
    getMovedDate: getMovedDate,
    checkDate: checkDate,
    getDateList: getDateList
};