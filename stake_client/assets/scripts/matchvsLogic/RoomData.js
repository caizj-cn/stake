/**
 * 体验地址的游戏信息
 * @type {{gameID: number, channel: string, platform: string, gameVersion: number, appKey: string, secret: string, userName: string, mxaNumer: number}}
 */
var obj = {
    roomID: 0, // 房间ID
    ownerID: 0, // 房主ID
    roomProperty: '', // 房间属性
    smallBetRatio: 10, // 小押注比率
    bigBetRatio: 20, // 大押注比率
    userInfoList: [], // 玩家信息列表

    // 更新玩家信息
    updateUserInfo(userInfo){
        for(let i = 0; i < this.userInfoList.length; i++){
            if(this.userInfoList[i].userID == userInfo.userID){
                this.userInfoList[i].big = userInfo.big;
                this.userInfoList[i].small = userInfo.small;
                break;
            }
        }
    },

    // 清除玩家
    clearUsers(){
        this.userInfoList = [];
    },

    // 添加玩家
    addUser(userInfo){
        for(let i = 0; i < this.userInfoList.length; i++){
            if(this.userInfoList[i].userID == userInfo.userID){
                return;
            }
        }

        this.userInfoList.push(userInfo);
    },

    // 删除玩家
    removeUser(userInfo){
        for(let i = 0; i < this.userInfoList.length; i++){
            if(this.userInfoList[i].userID == userInfo.userID){
                this.userInfoList.splice(i, 1);
                break;
            }
        }
    },
}

module.exports = obj;