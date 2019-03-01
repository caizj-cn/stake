var engine = require('MatchvsEngine');
var response = require('MatchvsResponse');
var msg = require('MatvhsvsMessage');
var appData = require('AppData');
var userData = require('UserData');
var roomData = require('RoomData');

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
                // cc.director.loadScene('game');
                let user = this.getUserInfo();
                roomData.userInfoList = [];
                // roomData.userInfoList.push(user);

                this.networkFlow.createRoom(JSON.stringify(user));
                break;
            }
            case 'open_join': {
                // cc.director.loadScene('game');
                this.nodeJoin.active = true;                
                break;
            }
            case 'join': {
                let roomID = this.editRoomID.string;
                cc.log('房间号：' + roomID);

                let user = this.getUserInfo();
                roomData.userInfoList = [];
                // roomData.userInfoList.push(user);

                this.networkFlow.joinRoom(roomID, JSON.stringify(user));
                break;
            }
        }
    },

    getUserInfo(){
        let user = {};
        user.userID = userData.userID;
        user.small = 0;
        user.big = 0;
        return user;
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
            roomData.roomID = roomInfo.roomID;
            roomData.ownerID = roomInfo.ownerId;
            roomData.roomProperty = roomInfo.roomProperty;

            cc.log('joinRoomResponse: 进入房间成功：房间ID为：' + roomInfo.roomID + '房主ID：' + roomInfo.ownerId + '房间属性为：' + roomInfo.roomProperty);
            for(var i = 0; i < userInfoList.length; i++) {
                cc.log('joinRoomResponse：房间的玩家ID是' + userInfoList[i].userID);
                roomData.addUser(JSON.parse(userInfoList[i].userProfile));
            }
            if (userInfoList.length == 0) {
                cc.log('joinRoomResponse：房间暂时无其他玩家');
            }

            cc.director.loadScene('game');

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
            roomData.roomID = CreateRoomRsp.roomID;
            roomData.ownerID = CreateRoomRsp.owner;
            cc.log('createRoomResponse: 创建房间成功：房间ID为：' + CreateRoomRsp.roomID + '房主ID：' + CreateRoomRsp.owner);
            
            let user = {
                userID: userData.userID,
                big: 0,
                small: 0,
            }
            roomData.clearUsers();
            roomData.addUser(user);
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
