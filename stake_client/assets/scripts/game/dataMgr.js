/**
 * 体验地址的游戏信息
 * @type {{gameID: number, channel: string, platform: string, gameVersion: number, appKey: string, secret: string, userName: string, mxaNumer: number}}
 */
var obj = {
    // 获取玩家信息
    getUserInfo(){
        return {
            userID: 0, // 玩家ID
            small: 0, // 押大次数
            big: 0, // 押小次数
        };
    },

    // 根据玩家ID获取玩家信息
    getUserInfoWithID(userID){
        return {
            userID: userID, // 玩家ID
            small: 0, // 押大次数
            big: 0, // 押小次数
        };
    },
}

module.exports = obj;