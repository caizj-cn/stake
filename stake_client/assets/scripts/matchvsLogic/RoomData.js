/**
 * 体验地址的游戏信息
 * @type {{gameID: number, channel: string, platform: string, gameVersion: number, appKey: string, secret: string, userName: string, mxaNumer: number}}
 */
var obj = {
    roomID: 0, // 房间ID
    ownerID: 0, // 房主ID
    roomProperty: '', // 房间属性（存储房间所有信息json）
    smallBetRatio: 10, // 小押注比率
    bigBetRatio: 20, // 大押注比率
    users_in: [], // 在房间的玩家
    users_out: [], // 不在房间的玩家（下注过）

    // 获取房间信息
    getRoomProperty(){
        let data = {};
        data.users_in  = this.users_in;
        data.users_out = this.users_out;
        return JSON.stringify(data);
    },

    // 更新玩家信息
    updateUserInfo(userInfo){
        // 在房间内
        for(let i = 0; i < this.users_in.length; i++){
            if(this.users_in[i].userID == userInfo.userID){
                this.users_in[i] = userInfo;
                return;
            }
        }

        // 不在房间内
        for(let i = 0; i < this.users_out.length; i++){
            if(this.users_out[i].userID == userInfo.userID){
                this.users_in[i] = userInfo;
                return;
            }
        }
    },

    // 清除玩家
    clearUsers(){
        this.users_in = [];
        this.users_out = [];
    },

    // 添加玩家
    addUser(userInfo){
        // 在里面
        for(let i = 0; i < this.users_in.length; i++){
            if(this.users_in[i].userID == userInfo.userID){
                return;
            }
        }

        // 退出了再进来的
        for(let i = 0; i < this.users_out.length; i++){
            if(this.users_out[i].userID == userInfo.userID){
                this.users_out.splice(i, 1);                
                return;
            }
        }

        this.users_in.push(userInfo);
    },

    // 删除玩家
    removeUser(userInfo){
        // 房间内查找
        for(let i = 0; i < this.users_in.length; i++){
            if(this.users_in[i].userID == userInfo.userID){
                this.users_in.splice(i, 1);
                break;
            }
        }

        // 已经标记的直接更新
        for(let i = 0; i < this.users_out.length; i++){
            if(this.users_out[i].userID == userInfo.userID){
                return;
            }
        }
        this.users_out.push(userInfo);
    },

    // 根据玩家ID获取信息
    getUserInfoByID(userID){
        // 在房间的
        for(let i = 0; i < this.users_in.length; i++){
            if(this.users_in[i].userID == userID){
                return this.users_in[i];
            }
        }

        // 不在房间的
        for(let i = 0; i < this.users_out.length; i++){
            if(this.users_out[i].userID == userID){
                return this.users_out[i];
            }
        }

        return null;
    },
}

module.exports = obj;