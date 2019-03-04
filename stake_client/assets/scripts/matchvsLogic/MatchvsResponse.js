var mvs = require("Matchvs");
var msg = require("MatvhsvsMessage");
function MatchvsResponse() {

}


//使用外部传递的原型进行事件发送
MatchvsResponse.prototype.init = function (Context) {
    this.context = Context;
};


/**
 * 绑定所有的回调事件，只需调用一次
 */
MatchvsResponse.prototype.bind = function () {
    mvs.response.initResponse = this.initResponse.bind(this);
    mvs.response.registerUserResponse = this.registerUserResponse.bind(this);
    mvs.response.loginResponse = this.loginResponse.bind(this);
    // mvs.response.reconnectResponse = this.reconnectResponse.bind(this);
    mvs.response.errorResponse = this.errorResponse.bind(this);
    mvs.response.joinRoomResponse = this.joinRoomResponse.bind(this)
    mvs.response.joinRoomNotify = this.joinRoomNotify.bind(this);
    mvs.response.leaveRoomResponse = this.leaveRoomResponse.bind(this);
    mvs.response.leaveRoomNotify = this.leaveRoomNotify.bind(this);
    mvs.response.joinOverResponse = this.joinOverResponse.bind(this);
    mvs.response.joinOverNotify = this.joinOverNotify.bind(this);
    mvs.response.sendEventResponse = this.sendEventResponse.bind(this);
    mvs.response.sendEventNotify = this.sendEventNotify.bind(this);
    mvs.response.createRoomResponse = this.createRoomResponse.bind(this);
};

/**
 * 初始化回调
 */
MatchvsResponse.prototype.initResponse = function (status) {
    this.context.node.emit(msg.MATCHVS_INIT, status);
};

/**
 * 注册返回
 * @param userInfo
 */
MatchvsResponse.prototype.registerUserResponse = function (userInfo) {
    console.log(JSON.stringify(userInfo));
    this.context.node.emit(msg.MATCHVS_REGISTER_USER, userInfo);
};

/**
 *  登录回调
 */
MatchvsResponse.prototype.loginResponse = function (MsLoginRsp) {
    this.context.node.emit(msg.MATCHVS_LOGIN, MsLoginRsp);
};

/**
 * 创建房间回调
 * @param CreateRoomRsp
 */
MatchvsResponse.prototype.createRoomResponse = function (CreateRoomRsp) {
    this.context.node.emit(msg.MATCHVS_CREATE_ROOM_RSP,CreateRoomRsp);
};

/**
 * 进入房间回调
 * @param status
 * @param userInfoList
 * @param roomInfo
 */
MatchvsResponse.prototype.joinRoomResponse = function (status, userInfoList, roomInfo) {
    this.context.node.emit(msg.MATCHVS_JOIN_ROOM_RSP,status,userInfoList,roomInfo);
};

/**
 * 其他玩家进入房间通知
 * @param roomUserInfo
 */
MatchvsResponse.prototype.joinRoomNotify = function (roomUserInfo) {
    console.log(roomUserInfo.userID+"加入了房间");
    this.context.node.emit(msg.MATCHVS_JOIN_ROOM_NOTIFY,roomUserInfo);
};

/**
 * 房间关闭回调
 * @param rep
 */
MatchvsResponse.prototype.joinOverResponse = function (joinOverRsp) {
    this.context.node.emit(msg.MATCHVS_JOIN_OVER_RSP,joinOverRsp);
};

/**
 * 房间关闭通知
 * @param notify
 */
MatchvsResponse.prototype.joinOverNotify = function (notify) {
    this.context.node.emit(msg.MATCHVS_JOIN_OVER_NOTIFY,notify);
};

/**
 * 发送消息回调
 * @param sendEventRsp
 */
MatchvsResponse.prototype.sendEventResponse = function (sendEventRsp) {
    this.context.node.emit(msg.MATCHVS_SEND_EVENT_RSP,sendEventRsp);
};

/**
 * 设置房间属性回调
 * @param setRoomPropertyResponse
 */
MatchvsResponse.prototype.setRoomPropertyResponse = function (rsp) {
    this.context.node.emit(msg.MATCHVS_SET_ROOM_PROPETY, rsp);
};

/**
 * 设置房间属性通知
 * @param setRoomPropertyNotify
 */
MatchvsResponse.prototype.setRoomPropertyNotify = function (notify) {
    this.context.node.emit(msg.MATCHVS_SET_ROOM_PROPETY_NOTIFY, notify);
};

/**
 * 发送消息通知
 * @param eventInfo
 */
MatchvsResponse.prototype.sendEventNotify = function (eventInfo) {
    this.context.node.emit(msg.MATCHVS_SEND_EVENT_NOTIFY, eventInfo);
};

/**
 * 离开房间回调
 * @param leaveRoomRsp
 */
MatchvsResponse.prototype.leaveRoomResponse = function (leaveRoomRsp) {
    this.context.node.emit(msg.MATCHVS_LEAVE_ROOM,leaveRoomRsp);
};

/**
 * 离开房间通知
 * @param leaveRoomInfo
 */
MatchvsResponse.prototype.leaveRoomNotify = function (leaveRoomInfo) {
    this.context.node.emit(msg.MATCHVS_LEAVE_ROOM_NOTIFY,leaveRoomInfo);
};

/**
 * 错误回调
 * @param error
 */
MatchvsResponse.prototype.errorResponse = function (errorCode,errorMsg) {
    console.log("发生错误了！！！");
    this.context.node.emit(msg.MATCHVS_ERROE_MSG, errorCode,errorMsg);
};


module.exports = MatchvsResponse;