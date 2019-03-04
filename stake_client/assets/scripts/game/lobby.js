var engine = require('MatchvsEngine');
var response = require('MatchvsResponse');
var msg = require('MatvhsvsMessage');
var appData = require('AppData');
var userData = require('UserData');
var roomData = require('RoomData');
var dataMgr = require('dataMgr');

cc.Class({
    extends: cc.Component,

    properties: {        
        labelUserID: cc.Label,
        labelName: cc.Label,
        nodeJoin: cc.Node,
        editRoomID: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.networkFlow = this.getComponent('NetworkFlow');
        this.initMatchvsEvent(this);

        this.labelName.string = userData.name;
        this.labelUserID.string = userData.userID;
    },

    start () {

    },

    // update (dt) {},

    onClick(btn, cd){
        switch(cd){
            case 'create': {
                this.networkFlow.createRoom('玩家简介', '{}');
                break;
            }
            case 'open_join': {
                this.nodeJoin.active = true;                
                break;
            }
            case 'join': {
                let roomID = this.editRoomID.string;
                cc.log('房间号：' + roomID);
                this.networkFlow.joinRoom(roomID, '玩家简介');
                break;
            }
        }
    },

    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     * @param self this
     */
    initMatchvsEvent(self) {
        //在应用开始时手动绑定一下所有的回调事件
        response.prototype.bind();
        response.prototype.init(self);
        this.node.on(msg.MATCHVS_JOIN_ROOM_RSP, this.joinRoomResponse, this);
        this.node.on(msg.MATCHVS_CREATE_ROOM_RSP, this.createRoomResponse, this);
    },

    /**
     * 移除监听
     */
    removeEvent() {
        this.node.off(msg.MATCHVS_JOIN_ROOM_RSP,this.joinRoomResponse,this);
        this.node.off(msg.MATCHVS_CREATE_ROOM_RSP, this, this.createRoomResponse, this);
    },

    onDestroy() {
        this.removeEvent();
    },

    /**
     * 进入房间回调
     * @param status
     * @param userInfoList
     * @param roomInfo
     */
    joinRoomResponse(status, userInfoList, roomInfo) {
        if (status == 200) {
            // 我加入成功
            roomData.clearUsers();
            roomData.roomID = roomInfo.roomID;
            roomData.ownerID = roomInfo.ownerId;
            roomData.roomProperty = roomInfo.roomProperty;

            // 添加房间已有玩家
            let data = JSON.parse(roomInfo.roomProperty);
            for(let i = 0; i < data.users_in.length; i++){
                roomData.addUser(data.users_in[i]);
            }
            for(let i = 0; i < data.users_out.length; i++){
                roomData.addUser(data.users_out[i]);
            }

            // 我之前不在房间内
            let myInfo = roomData.getUserInfoByID(userData.userID);
            if(myInfo == null){
                myInfo = dataMgr.getUserInfoWithID(userData.userID);
                roomData.addUser(myInfo);
            }

            // 更新房间信息
            let roomProperty = roomData.getRoomProperty();
            this.networkFlow.setRoomProperty(roomData.roomID, roomProperty);

            cc.director.loadScene('game');
            // // 不包含自己
            // for(var i = 0; i < userInfoList.length; i++) {
            //     let userInfo = dataMgr.getUserInfoWithID(userInfoList[i].userID);                
                
            //     for(let j = 0; j < data.users_in.length; j++){
            //         if(data[j].userID === userInfoList[i].userID){
            //             userInfo.big   = data[j].big;
            //             userInfo.small = data[j].small;
            //         }
            //     }

            //     roomData.addUser(userInfo);
            // }

            

            // if (userInfoList.length == 0) {
            //     cc.log('joinRoomResponse：房间暂时无其他玩家');
            // }            

        } else {
            cc.log('joinRoomResponse：进入房间失败');
        }
    },

    /**
     * 创建房间回调
     * @param CreateRoomRsp
     */
    createRoomResponse(CreateRoomRsp) {
        if (CreateRoomRsp.status == 200) {
            // 房间信息
            roomData.clearUsers();
            roomData.roomID = CreateRoomRsp.roomID;
            roomData.ownerID = CreateRoomRsp.owner;

            let myInfo = dataMgr.getUserInfoWithID(userData.userID);
            roomData.addUser(myInfo);

            // 更新房间信息
            let roomProperty = roomData.getRoomProperty();
            this.networkFlow.setRoomProperty(roomData.roomID, roomProperty);
            
            cc.director.loadScene('game');

        } else if (CreateRoomRsp.status == 400) {
            cc.log('客户端参数错误');
        } else if (CreateRoomRsp.status == 500) {
            cc.log('服务器内部错误');
        } else {
            cc.log('createRoomResponse：创建房间失败');
        }
    },
});
