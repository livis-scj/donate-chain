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

/**
 * 通过cookie获取用户信息
 * 示例：1540382575908 转成  2018-10-24 20:02:55
 * @param {null}
 * @return {Object}
 * {
 *      account 账号
 *      token token信息
 *      userId 用户编号
 *      name 用户姓名
 * }
 */
export const getToken = that => {
    const cookiePath = getPath();
    const cookieToken = that.$cookies.get(`${cookiePath.slice(1)}token`);
    let account = '';
    let token = '';
    let userId = '';
    let name = '';
    if (cookieToken) {
        const accountToken = cookieToken.split(' ');
        account = accountToken[0];
        token = accountToken[1];
        userId = accountToken[2];
        name = accountToken[3];
    }
    return {account, token, userId, name};
};

/**
 * 获取path
 * @param {null}
 * @return {String}}
 * {
 *      cookiePath 路径
 * }
 */
export const getPath = () => {
    const cookiePath = '/' + location.hash.split('/')[1];
    return cookiePath;
};
