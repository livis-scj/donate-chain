/**
 * 时间戳转成格式化
 * 示例：1540382575908 转成  2018-10-24 20:02:55
 * @param {number} timer 时间戳
 * @return {string} str 格式化时间
 */
export const timerFormat = timer => {
    let date = new Date(timer);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + '&nbsp;&nbsp;&nbsp;' + h + m + s;
};
