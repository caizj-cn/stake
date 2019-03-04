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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.networkFlow = this.getComponent('NetworkFlow');
        this.initMatchvsEvent(this);
    },

    start () {

    },

    // update (dt) {},

    onClick(btn, cd){
        switch(cd){
            case 'play': {
                this.play();
                break;
            }
        }
    },

    play(){
        this.networkFlow.init();
    },

    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     * @param self this
     */
    initMatchvsEvent(self) {
        //在应用开始时手动绑定一下所有的回调事件
        response.prototype.bind();
        response.prototype.init(self);
        this.node.on(msg.MATCHVS_INIT, this.initResponse, this);
        this.node.on(msg.MATCHVS_REGISTER_USER,this.registerUserResponse,this);
        this.node.on(msg.MATCHVS_LOGIN,this.loginResponse,this);
    },

    /**
     * 移除监听
     */
    removeEvent() {
        this.node.off(msg.MATCHVS_INIT, this.initResponse, this);
        this.node.off(msg.MATCHVS_REGISTER_USER,this.registerUserResponse,this);
        this.node.off(msg.MATCHVS_LOGIN,this.loginResponse,this);
    },

    /**
     * 初始化回调
     * @param info
     */
    initResponse(status) {
        if(status == 200) {
            cc.log('initResponse：初始化成功，status：'+status);
            this.networkFlow.register();
            cc.log('dddddd');
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
            userData.userID = userInfo.id;
            userData.token = userInfo.token;
            userData.name = userInfo.name;
            userData.avatar = userInfo.avatar;
            appData.userName = userInfo.name;
            this.networkFlow.login();
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
            cc.director.loadScene('lobby');
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

    onDestroy() {
        this.removeEvent();
    },
});
