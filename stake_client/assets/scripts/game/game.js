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
        labelRoomID: cc.Label,
        labelOwerID: cc.Label,
        labelLoginID: cc.Label,
        labelBig: cc.Label,
        labelSmall: cc.Label,
        labelTotal: cc.Label,
        buttonBig: cc.Button,
        buttonSmall: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.networkFlow = this.getComponent('NetworkFlow');
        this.initMatchvsEvent(this);

        this.labelRoomID.string = '房号：' + roomData.roomID;

        this.updateUserUI();
        this.updateBetUI();
    },

    start () {

    },

    updateBetUI(){
        let [total, tSmall, tBig] = [0, 0, 0];
        
        // 房间内玩家
        for(let i = 0; i < roomData.users_in.length; i++){
            let userID = roomData.users_in[i].userID;
            let small = roomData.users_in[i].small;
            let big = roomData.users_in[i].big;
            tSmall = tSmall + small * roomData.smallBetRatio;
            tBig = tBig + big * roomData.bigBetRatio;
            total = tSmall + tBig;
        }

        // 不在房间内玩家
        for(let i = 0; i < roomData.users_out.length; i++){
            let userID = roomData.users_out[i].userID;
            let small = roomData.users_out[i].small;
            let big = roomData.users_out[i].big;
            tSmall = tSmall + small * roomData.smallBetRatio;
            tBig = tBig + big * roomData.bigBetRatio;
            total = tSmall + tBig;
        }

        this.labelBig.string = tBig;
        this.labelSmall.string = tSmall;
        this.labelTotal.string = total;
    },

    updateUserUI(){
        this.labelOwerID.string = '房主：' + roomData.ownerID;
        this.labelLoginID.string = '玩家：' + userData.userID;
    },

    // update (dt) {},

    onClick(btn, cd){
        switch(cd){
            case 'leave': {
                this.networkFlow.leaveRoom();
                break;
            }
            case 'big': {
                this.betBig();
                this.enableBet(false);
                break;
            }
            case 'small': {
                this.betSmall();
                this.enableBet(false);
                break;
            }
        }
    },

    enableBet(enabled){
        this.buttonBig.interactable = enabled;
        this.buttonSmall.interactable = enabled;
    },

    betBig(){
        userData.preBig = userData.actBig + 1;
        let myInfo = dataMgr.getUserInfoWithID(userData.userID);
        myInfo.small = userData.actSmall;
        myInfo.big = userData.preBig;
        this.networkFlow.sendEvent(JSON.stringify(myInfo));
    },

    betSmall(){
        userData.preSmall = userData.actSmall + 1;
        let myInfo = dataMgr.getUserInfoWithID(userData.userID);
        myInfo.small = userData.preSmall;
        myInfo.big = userData.actBig;
        this.networkFlow.sendEvent(JSON.stringify(myInfo));
    },

    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     * @param self this
     */
    initMatchvsEvent(self) {
        //在应用开始时手动绑定一下所有的回调事件
        response.prototype.bind();
        response.prototype.init(self);
        this.node.on(msg.MATCHVS_SEND_EVENT_RSP,this.sendEventResponse,this);
        this.node.on(msg.MATCHVS_SEND_EVENT_NOTIFY,this.sendEventNotify,this);
        this.node.on(msg.MATCHVS_LEAVE_ROOM,this.leaveRoomResponse,this);
        this.node.on(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.joinRoomNotify,this);
        this.node.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY,this.leaveRoomNotify,this);
        this.node.on(msg.MATCHVS_SET_ROOM_PROPETY,this.setRoomPropertyResponse,this);
        this.node.on(msg.MATCHVS_SET_ROOM_PROPETY_NOTIFY,this.setRoomPropertyNotify,this);
    },

    /**
     * 移除监听
     */
    removeEvent() {
        this.node.off(msg.MATCHVS_SEND_EVENT_RSP,this.sendEventResponse,this);
        this.node.off(msg.MATCHVS_SEND_EVENT_NOTIFY,this.sendEventNotify,this);
        this.node.off(msg.MATCHVS_LEAVE_ROOM,this.leaveRoomResponse,this);
        this.node.off(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.joinRoomNotify,this);
        this.node.off(msg.MATCHVS_LEAVE_ROOM_NOTIFY,this.leaveRoomNotify,this);
        this.node.off(msg.MATCHVS_SET_ROOM_PROPETY,this.setRoomPropertyResponse,this);
        this.node.off(msg.MATCHVS_SET_ROOM_PROPETY,this.setRoomPropertyNotify,this);
    },

    onDestroy() {
        this.removeEvent();
    },

    /**
     * 离开房间回调
     * @param leaveRoomRsp
     */
    leaveRoomResponse(leaveRoomRsp) {
        if (leaveRoomRsp.status == 200) {
            cc.log('leaveRoomResponse：离开房间成功，房间ID是'+leaveRoomRsp.roomID);
            let myInfo = roomData.getUserInfoByID(userData.userID);
            if(myInfo == null){
                myInfo = dataMgr.getUserInfoWithID(userData.userID);
            }
            roomData.removeUser(myInfo);
            
            // 更新房间信息
            let roomProperty = roomData.getRoomProperty();
            this.networkFlow.setRoomProperty(roomData.roomID, roomProperty);
            
            cc.director.loadScene('lobby');
        } else if (leaveRoomRsp.status == 400) {
            cc.log('leaveRoomResponse：客户端参数错误,请检查参数');
        } else if (leaveRoomRsp.status == 404) {
            cc.log('leaveRoomResponse：房间不存在')
        } else if (leaveRoomRsp.status == 500) {
            cc.log('leaveRoomResponse：服务器错误');
        }
    },

    /**
     * 其他离开房间通知
     * @param leaveRoomInfo
     */
    leaveRoomNotify(leaveRoomInfo) {
        cc.log('leaveRoomNotify：' + leaveRoomInfo.userID + '离开房间，房间ID是' + leaveRoomInfo.roomID);
        cc.log(leaveRoomInfo.owner + '   ' + leaveRoomInfo.cpProto);
        
        roomData.ownerID = leaveRoomInfo.owner;

        let userInfo = roomData.getUserInfoByID(leaveRoomInfo.userID);
        if(userInfo != null){
            roomData.removeUser(userInfo);

            // 更新房间信息
            let roomProperty = roomData.getRoomProperty();
            this.networkFlow.setRoomProperty(roomData.roomID, roomProperty);
        }

        this.updateUserUI();
    },

    /**
     * 设置房间信息回调
     * @param rsp
     */
    setRoomPropertyResponse(rsp){
        if(rsp.status == 200){
            if(rsp.roomID == roomData.roomID && rsp.userID == userData.userID){
                roomData.roomProperty = rsp.roomProperty;
                let data = JSON.parse(rsp.roomProperty);
                this.roomData.users_in = data.users_in;
                this.roomData.users_out = data.users_out;
            }
        }
        else{
            cc.log('setRoomPropertyResponse失败', rsp);
        }
    },

    /**
     * 设置房间信息通知
     * @param notify
     */
    setRoomPropertyNotify(notify){
        if(notify.roomID == roomData.roomID){
            roomData.roomProperty = notify.roomProperty;
            let data = JSON.parse(rsp.roomProperty);
            this.roomData.users_in = data.users_in;
            this.roomData.users_out = data.users_out;
        }
    },

    /**
     * 发送消息回调
     * @param sendEventRsp
     */
    sendEventResponse(sendEventRsp) {
        this.enableBet(true);

        if (sendEventRsp.status == 200) {
            // 下注成功，要更新
            userData.actBig = userData.preBig;
            userData.actSmall = userData.preSmall;

            // 更新我的下注信息
            let myInfo   = dataMgr.getUserInfoWithID(userData.userID);
            myInfo.big   = userData.actBig;
            myInfo.small = userData.actSmall;
            roomData.updateUserInfo(myInfo);

            // 更新房间信息
            let roomProperty = roomData.getRoomProperty();
            this.networkFlow.setRoomProperty(roomData.roomID, roomProperty);

            this.updateBetUI();
            cc.log('sendEventResponse：发送消息成功');
        } else {
            cc.log('sendEventResponse：发送消息失败');
        }
    },

    /**
     * 接收到其他用户消息通知
     * @param eventInfo
     */
    sendEventNotify(eventInfo) {
        cc.log('sendEventNotify：用户' + eventInfo.srcUserID + '数据' + eventInfo.cpProto);
        
        // 更新玩家下注信息
        let userInfo   = dataMgr.getUserInfoWithID(eventInfo.srcUserID);
        let data       = JSON.parse(eventInfo.cpProto);
        userInfo.big   = data.big;
        userInfo.small = data.small;
        roomData.updateUserInfo(userInfo);

        // 更新房间信息
        let roomProperty = roomData.getRoomProperty();
        this.networkFlow.setRoomProperty(roomData.roomID, roomProperty);
        this.updateBetUI();
    },

    /**
     * 其他玩家加入房间通知
     * @param roomUserInfo
     */
    joinRoomNotify(roomUserInfo) {
        cc.log('joinRoomNotify：加入房间的玩家ID是' + roomUserInfo.userID);
        cc.log(roomUserInfo);

        let userInfo = roomData.getUserInfoByID(roomUserInfo.userID);
        if(userInfo == null){
            userInfo = dataMgr.getUserInfoWithID(roomUserInfo.userID);
        }
        roomData.addUser(userInfo);

        // 更新房间信息
        let roomProperty = roomData.getRoomProperty();
        this.networkFlow.setRoomProperty(roomData.roomID, roomProperty);
    },
});
