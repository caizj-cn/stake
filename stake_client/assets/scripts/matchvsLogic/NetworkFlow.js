var engine = require('MatchvsEngine');
var response = require('MatchvsResponse');
var msg = require('MatvhsvsMessage');
var appData = require('AppData');
var userData = require('UserData');

cc.Class({
    extends: cc.Component,

    properties: {
    },


    onLoad () {
        this.initMatchvsEvent(this);
    },

    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     * @param self this
     */
    initMatchvsEvent(self) {
        // //在应用开始时手动绑定一下所有的回调事件
        // response.prototype.bind();
        // response.prototype.init(self);
        // this.node.on(msg.MATCHVS_INIT, this.initResponse, this);
        // this.node.on(msg.MATCHVS_REGISTER_USER,this.registerUserResponse,this);
        // this.node.on(msg.MATCHVS_LOGIN,this.loginResponse,this);
        // this.node.on(msg.MATCHVS_JOIN_ROOM_RSP,this.joinRoomResponse,this);
        // this.node.on(msg.MATCHVS_CREATE_ROOM_RSP, this, this.createRoomResponse, this);
        // this.node.on(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.joinRoomNotify,this);
        // this.node.on(msg.MATCHVS_JOIN_OVER_RSP,this.joinOverResponse,this);
        // this.node.on(msg.MATCHVS_JOIN_OVER_NOTIFY,this.joinOverNotify,this);
        // this.node.on(msg.MATCHVS_SEND_EVENT_RSP,this.sendEventResponse,this);
        // this.node.on(msg.MATCHVS_SEND_EVENT_NOTIFY,this.sendEventNotify,this);
        // this.node.on(msg.MATCHVS_LEAVE_ROOM,this.leaveRoomResponse,this);
        // this.node.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY,this.leaveRoomNotify,this);
        // this.node.on(msg.MATCHVS_LOGOUT,this.logoutResponse,this);
        // this.node.on(msg.MATCHVS_ERROE_MSG,this.errorResponse,this);
        // this.node.on(msg.MATCHVS_SET_ROOM_PROPETY,this.setRoomPropertyResponse,this);
        // this.node.on(msg.MATCHVS_SET_ROOM_PROPETY_NOTIFY,this.setRoomPropertyNotify,this);
    },

    /**
     * 移除监听
     */
    removeEvent() {
        // this.node.off(msg.MATCHVS_INIT, this.initResponse, this);
        // this.node.off(msg.MATCHVS_REGISTER_USER,this.registerUserResponse,this);
        // this.node.off(msg.MATCHVS_LOGIN,this.loginResponse,this);
        // this.node.off(msg.MATCHVS_JOIN_ROOM_RSP,this.joinRoomResponse,this);
        // this.node.off(msg.MATCHVS_CREATE_ROOM_RSP, this, this.createRoomResponse, this);
        // this.node.off(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.joinRoomNotify,this);
        // this.node.off(msg.MATCHVS_JOIN_OVER_RSP,this.joinOverResponse,this);
        // this.node.off(msg.MATCHVS_JOIN_OVER_NOTIFY,this.joinOverNotify,this);
        // this.node.off(msg.MATCHVS_SEND_EVENT_RSP,this.sendEventResponse,this);
        // this.node.off(msg.MATCHVS_SEND_EVENT_NOTIFY,this.sendEventNotify,this);
        // this.node.off(msg.MATCHVS_LEAVE_ROOM,this.leaveRoomResponse,this);
        // this.node.off(msg.MATCHVS_LEAVE_ROOM_NOTIFY,this.leaveRoomNotify,this);
        // this.node.off(msg.MATCHVS_LOGOUT,this.logoutResponse,this);
        // this.node.off(msg.MATCHVS_ERROE_MSG,this.errorResponse,this);
        // this.node.off(msg.MATCHVS_SET_ROOM_PROPETY,this.setRoomPropertyResponse,this);
        // this.node.off(msg.MATCHVS_SET_ROOM_PROPETY,this.setRoomPropertyNotify,this);
    },

    /**
     * 初始化
     */
    init() {
        var result = engine.prototype.init(appData.channel,appData.platform,appData.gameID);
        cc.log('初始化使用的gameID是:'+appData.gameID,'如需更换为自己SDK，修改NetworkFlow.js 114行即可');
        this.engineCode(result,'init');
    },

    /**
     * 注册
     */
    register() {
        var result =  engine.prototype.registerUser();
        this.engineCode(result,'registerUser');
    },

    /**
     * 登录
     */
    login() {
        if (userData.userID != 0 && userData.token != '') {
            var result = engine.prototype.login(userData.userID, userData.token);
            cc.log('登录的账号userID是:' + userData.userID);
            if (result == -6) {
                cc.log('已登录，请勿重新登录');
            } else if (result === -26){
                cc.log('[游戏账户与渠道不匹配，请使用cocos账号登录Matchvs官网创建游戏]：(https://www.matchvs.com/cocos)');
            } else {
                this.engineCode(result,'login');
            }
        } else {
            cc.log('请先注册，然后在尝试登录');
        }
    },

    /**
     * 创建房间
     */
    createRoom(userProfile, roomProperty) {
        if(appData.mxaNumer != 0){
            var result = engine.prototype.createRoom(appData.mxaNumer, userProfile, roomProperty);
            cc.log('玩家人数:' + appData.mxaNumer);

            if(result == 0){
                cc.log('创建房间成功');
            }
            else if(result == -1){
                cc.log('失败');
            }
            else if(result == -2){
                cc.log('未初始化');
            }
            else if(result == -3){
                cc.log('正在初始化');
            }
            else if(result == -4){
                cc.log('未登录');
            }
            else if(result == -7){
                cc.log('正在创建或者进入房间');
            }
            else if(result == -8){
                cc.log('已在房间');
            }
            else if(result == -21){
                cc.log('userProfile 过长，不能超过512');
            }
            else{
                this.engineCode(result, 'createRoom');
            }
        }
    },

    /**
     * 进入房间
     */
    joinRoom(roomID, userProfile) {
        var result = engine.prototype.joinRoom(roomID, userProfile);
        this.engineCode(result,'joinRoom');
    },

    /**
     * 进入房间
     */
    joinRandomRoom() {
        var result = engine.prototype.joinRandomRoom(appData.mxaNumer);
        this.engineCode(result,'joinRandomRoom');
    },

    /**
     * 关闭房间
     */
    joinOver() {
        var result = engine.prototype.joinOver();
        this.engineCode(result,'joinOver');
    },

    /**
     * 设置房间属性
     */
    setRoomProperty(roomID, roomProperty) {
        var result = engine.prototype.setRoomProperty(roomID, roomProperty);
        this.engineCode(result,'setRoomProperty');
    },

    /**
     * 发送信息
     */
    sendEvent(msg) {
        var result = engine.prototype.sendEvent(msg);
        this.engineCode(result,'sendEvent');
    },

    /**
     *  离开房间
     */
    leaveRoom() {
        var result = engine.prototype.leaveRoom();
        this.engineCode(result,'leaveRoom');
    },

    /**
     * 注销
     */
    logout() {
        var result = engine.prototype.logout();
        this.engineCode(result,'logout');
    },

    /**
     * 反初始化
     */
    unInit() {
        var result = engine.prototype.unInit();
        this.engineCode(result,'unInit');
    },


    /**
     * 初始化回调
     * @param info
     */
    initResponse(status) {
        if(status == 200) {
            cc.log('initResponse：初始化成功，status：'+status);
        } else {
            cc.log('initResponse：初始化失败，status：'+status)
        }
    },


    /**
     * 注册回调
     * @param userInfo
     */
    registerUserResponse(userInfo) {
        if (userInfo.status == 0) {
            cc.log('registerUserResponse：注册用户成功,id = ' + userInfo.id + 'token = ' + userInfo.token + 'name:' + userInfo.name + 
            'avatar:'+userInfo.avatar);
            userData.userID = userInfo.id;
            userData.token = userInfo.token;
            appData.userName = userInfo.name;
        } else {
            cc.log('registerUserResponse: 注册用户失败');
        }
    },

    /**
     * 登陆回调
     * @param MsLoginRsp
     */
    loginResponse(MsLoginRsp) {
        if (MsLoginRsp.status == 200) {
            cc.log('loginResponse: 登录成功');
        } else if (MsLoginRsp.status == 402){
            cc.log('loginResponse: 应用校验失败，确认是否在未上线时用了release环境，并检查gameID、appkey 和 secret');
        } else if (MsLoginRsp.status == 403) {
            cc.log('loginResponse：检测到该账号已在其他设备登录');
        } else if (MsLoginRsp.status == 404) {
            cc.log('loginResponse：无效用户 ');
        } else if (MsLoginRsp.status == 500) {
            cc.log('loginResponse：服务器内部错误');
        }
    },

    /**
     * 创建房间回调
     * @param CreateRoomRsp
     */
    createRoomResponse(CreateRoomRsp) {
        if (CreateRoomRsp.status == 200) {
            cc.log('createRoomResponse: 创建房间成功：房间ID为：' + CreateRoomRsp.roomID + '房主ID：' + roomInfo.owner);
        } else if (CreateRoomRsp.status == 400) {
            cc.log('客户端参数错误');
        } else if (CreateRoomRsp.status == 500) {
            cc.log('服务器内部错误');
        } else {
            cc.log('createRoomResponse：创建房间失败');
        }
    },

    /**
     * 进入房间回调
     * @param status
     * @param userInfoList
     * @param roomInfo
     */
    joinRoomResponse(status, userInfoList, roomInfo) {
        if (status == 200) {
            cc.log('joinRoomResponse: 进入房间成功：房间ID为：' + roomInfo.roomID + '房主ID：' + roomInfo.ownerId + '房间属性为：' + roomInfo.roomProperty);
            for(var i = 0; i < userInfoList.length; i++) {
                cc.log('joinRoomResponse：房间的玩家ID是' + userInfoList[i].userID);
            }
            if (userInfoList.length == 0) {
                cc.log('joinRoomResponse：房间暂时无其他玩家');
            }
        } else {
            cc.log('joinRoomResponse：进入房间失败');
        }
    },

    /**
     * 其他玩家加入房间通知
     * @param roomUserInfo
     */
    joinRoomNotify(roomUserInfo) {
        cc.log('joinRoomNotify：加入房间的玩家ID是' + roomUserInfo.userID);
    },

    /**
     * 关闭房间成功
     * @param joinOverRsp
     */
    joinOverResponse(joinOverRsp) {
        if (joinOverRsp.status == 200) {
            cc.log('joinOverResponse: 关闭房间成功');
        } else if (joinOverRsp.status == 400){
            cc.log('joinOverResponse: 客户端参数错误 ');
        } else if (joinOverRsp.status == 403) {
            cc.log('joinOverResponse: 该用户不在房间 ');
        } else if (joinOverRsp.status == 404) {
            cc.log('joinOverResponse: 用户或房间不存在');
        } else if (joinOverRsp.status == 500) {
            cc.log('joinOverResponse: 服务器内部错误');
        }
    },

    /**
     * 关闭房间通知
     * @param notifyInfo
     */
    joinOverNotify(notifyInfo) {
        cc.log('joinOverNotify：用户' + notifyInfo.srcUserID + '关闭了房间，房间ID为：' + notifyInfo.roomID);
    },

    /**
     * 发送消息回调
     * @param sendEventRsp
     */
    sendEventResponse(sendEventRsp) {
        if (sendEventRsp.status == 200) {
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
    },

    /**
     * 离开房间回调
     * @param leaveRoomRsp
     */
    leaveRoomResponse(leaveRoomRsp) {
        if (leaveRoomRsp.status == 200) {
            cc.log('leaveRoomResponse：离开房间成功，房间ID是'+leaveRoomRsp.roomID);
        } else if (leaveRoomRsp.status == 400) {
            cc.log('leaveRoomResponse：客户端参数错误,请检查参数');
        } else if (leaveRoomRsp.status == 404) {
            cc.log('leaveRoomResponse：房间不存在')
        } else if (leaveRoomRsp.status == 500) {
            cc.log('leaveRoomResponse：服务器错误');
        }
    },

    /**
     * 设置房间信息回调
     * @param rsp
     */
    setRoomPropertyResponse(rsp){

    },

    /**
     * 设置房间信息通知
     * @param notify
     */
    setRoomPropertyNotify(notify){

    },

    /**
     * 其他离开房间通知
     * @param leaveRoomInfo
     */
    leaveRoomNotify(leaveRoomInfo) {
        cc.log('leaveRoomNotify：' + leaveRoomInfo.userID + '离开房间，房间ID是' + leaveRoomInfo.roomID);
    },

    /**
     * 注销回调
     * @param status
     */
    logoutResponse(status) {
        if (status == 200) {
            cc.log('logoutResponse：注销成功');
        } else if (status == 500) {
            cc.log('logoutResponse：注销失败，服务器错误');
        }

    },

    /**
     * 错误信息回调
     * @param errorCode
     * @param errorMsg
     */
    errorResponse(errorCode,errorMsg) {
        cc.log('errorMsg:' + errorMsg + 'errorCode:' + errorCode);
    },


    /**
     * 页面log打印
     * @param info
     */
    matchvsLog: function (info) {
        cc.log(info);
    },


    engineCode:function (code,engineName) {
        switch (code) {
            case 0:
                cc.log(engineName+'调用成功');
                break;
            case -1:
                cc.log(engineName+'调用失败');
                break;
            case -2:
                cc.log('尚未初始化，请先初始化再进行' + engineName + '操作');
                break;
            case -3:
                cc.log('正在初始化，请稍后进行' + engineName + '操作');
                break;
            case -4:
                cc.log('尚未登录，请先登录再进行' + engineName + '操作');
                break;
            case -5:
                cc.log('已经登录，请勿重复登陆');
                break;
            case -6:
                cc.log('尚未加入房间，请稍后进行' + engineName + '操作');
                break;
            case -7:
                cc.log('正在创建或者进入房间,请稍后进行' + engineName + '操作');
                break;
            case -8:
                cc.log('已经在房间中');
                break;
            case -20:
                cc.log('maxPlayer超出范围 0 < maxPlayer ≤ 20');
                break;
            case -21:
                cc.log('userProfile 过长，不能超过512个字符');
                break;
            case -25:
                cc.log(engineName + 'channel 非法，请检查是否正确填写为 “Matchvs”');
                break;
            case -26:
                cc.log(engineName + '：platform 非法，请检查是否正确填写为 “alpha” 或 “release”');
                break;


        }
    },

    onDestroy() {
        this.removeEvent();
    }
    // start () {},
    // update (dt) {},
});
