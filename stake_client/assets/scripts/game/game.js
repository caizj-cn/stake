var engine = require('MatchvsEngine');
var response = require('MatchvsResponse');
var msg = require('MatvhsvsMessage');
var appData = require('AppData');
var userData = require('UserData');
var roomData = require('RoomData');

cc.Class({
    extends: cc.Component,

    properties: {
        labelRoomID: cc.Label,
        labelOwerID: cc.Label,
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

        this.labelOwerID.string = '房主：' + roomData.ownerID;
        this.labelRoomID.string = '房号：' + roomData.roomID;

        this.updateBetInfo();

        this.betNum = 0;
    },

    start () {

    },

    updateBetInfo(){
        let [total, tSmall, tBig] = [0, 0, 0];
        for(let i = 0; i < roomData.userInfoList.length; i++){
            let userID = roomData.userInfoList[i].userID;
            let small = roomData.userInfoList[i].small;
            let big = roomData.userInfoList[i].big;

            cc.log('userID:' + userID + ' small:' + small + ' big:' + big);
            tSmall = tSmall + small * roomData.smallBetRatio;
            tBig = tBig + big * roomData.bigBetRatio;
            total = tSmall + tBig;
        }

        this.labelBig.string = tBig;
        this.labelSmall.string = tSmall;
        this.labelTotal.string = total;
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

        let data = {};
        data.userID = userData.userID;
        data.small = userData.actSmall;
        data.big = userData.preBig;
        this.networkFlow.sendEvent(JSON.stringify(data));
    },

    betSmall(){
        userData.preSmall = userData.actSmall + 1;

        let data = {};
        data.userID = userData.userID;
        data.small = userData.preSmall;
        data.big = userData.actBig;
        this.networkFlow.sendEvent(JSON.stringify(data));
    },

    // bet(type, )

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
    },

    /**
     * 移除监听
     */
    removeEvent() {
        this.node.off(msg.MATCHVS_SEND_EVENT_RSP,this.sendEventResponse,this);
        this.node.off(msg.MATCHVS_SEND_EVENT_NOTIFY,this.sendEventNotify,this);
        this.node.off(msg.MATCHVS_LEAVE_ROOM,this.leaveRoomResponse,this);
        this.node.off(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.joinRoomNotify,this);
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
     * 发送消息回调
     * @param sendEventRsp
     */
    sendEventResponse(sendEventRsp) {
        this.enableBet(true);

        if (sendEventRsp.status == 200) {
            userData.actBig = userData.preBig;
            userData.actSmall = userData.preSmall;
            roomData.updateUserInfo({
                userID: userData.userID, 
                big: userData.actBig, 
                small: userData.actSmall
            });
            this.updateBetInfo();
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
        cc.log('sendEventNotify：用户' + eventInfo.srcUserID + '对你使出了一招' + eventInfo.cpProto);
        let data = JSON.parse(eventInfo.cpProto);
        roomData.updateUserInfo(data);
        this.updateBetInfo();
    },

    /**
     * 其他玩家加入房间通知
     * @param roomUserInfo
     */
    joinRoomNotify(roomUserInfo) {
        cc.log('joinRoomNotify：加入房间的玩家ID是' + roomUserInfo.userID);
        cc.log(roomUserInfo);

        let data = JSON.parse(roomUserInfo.userProfile);
        roomData.addUser(data);
    },
});
