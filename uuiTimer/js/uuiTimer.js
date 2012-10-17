/**
* 组件
* @module uuiTimer
* @authoer sogou ufo team
**/
(function($) {
    /**
    * 构造器
    * @class $.fn.uuiTimer
    * @constructor
    * @param {Object} options 参数配置
    * @param {Number} options.serverTime 服务器时间戳(13位)
    * @param {jQuery | null} options.container 显示倒计时容器 值为null默认不创建倒计时 不传值等于绑定的jQuery
    * @param {String} options.endTimeAttrName 结束时间属性选择器字符串
    * @param {Number} options.refreshTime 刷新时间间隔
    * @param {Number} options.nowTime 初始化的当前时间戳
    * @param {function} options.diffTime() 返回服务器和客户端时间差
    * @param {String} options.timeType  设置时间类型 'd'、'h'、'm'、's'、'ss'  日、时、分、秒、毫秒
    * @param {function} options.getTimeTpl() 获取时间类型模版 
    * @param {function} options.onSettime(options) 设置时间回调,options返回针对tpl转化后的数组,this指向当前容器
    * @param {function} options.onEnd() 结束回调,this指向当前容器
    * @param {function} options.onDestroy() 销毁定时器回调，this指向构造函数
    * @example $('.uuiTimer').uuiTimer({enable:0})
    */
    function uuiTimer($this, options) {

        this.options = $.extend({
            serverTime: +new Date(),
            endTimeAttrName: 'data-endTime',
            refreshTime: 1000,
            _theEnd: false,
            nowTime: +new Date(),
            diffTime: function(serverTime) {
                return this.nowTime - this.serverTime;
            },
            timeType: 'd',
            getTimeTpl: function() {
                var tpl;
                switch (this.timeType) {
                case 'd':
                    tpl = {
                        d: 86400000,
                        h: 3600000,
                        m: 60000,
                        s: 1000,
                        ss: 10
                    };
                    break;
                case 'h':
                    tpl = {
                        h: 3600000,
                        m: 60000,
                        s: 1000,
                        ss: 10
                    };
                    break;
                case 'm':
                    tpl = {
                        m: 60000,
                        s: 1000,
                        ss: 10
                    };
                    break;
                case 's':
                    tpl = {
                        s: 1000,
                        ss: 10
                    };
                    break;
                case 'ss':
                    tpl = {
                        ss: 10
                    };
                    break;
                default:
                    tpl = {
                        d: 86400000,
                        h: 3600000,
                        m: 60000,
                        s: 1000,
                        ss: 10
                    }
                };
                return tpl;

            },
            onSettime: function(options) {},
            onEnd: function() {},
            onDestroy: function() {},
            _$this: $this
        },
        options || {});
        this.guid = $.UUIBase.guid();

    };
    uuiTimer.prototype = {
        /*
        * 设置时间核心实现
        * @method setTimes
        * */
        setTimes: function() {
            var _this = this;
            var opts = _this.options;
            var diffTime = opts.diffTime();
            var container = (opts.container === null) ? $([]) : (typeof opts.container === 'undefined') ? opts._$this: opts.container;
            container.each(function(i, v) {
                var $this = $(v);
                var endTimeAttrName = $this.attr(opts.endTimeAttrName);
                var t = endTimeAttrName - +new Date() - diffTime;
                if (t <= 0) {
                    opts.onEnd.call(this);
                    return
                };
                var tpl = opts.getTimeTpl();
                var oTime = {};

                $.each(tpl,
                function(i, v) {
                    var d = parseInt(t / v);
                    t -= d * v;
                    oTime[i] = d
                });
                opts.onSettime.call(this, oTime);
            })
        },
        /*
        * setTimeout 核心实现，请通过 $('.uuiTimer').uuiTimer().excUUICMD('init')调用
        * @method timeout
        * @example $('.uuiTimer').uuiTimer().excUUICMD('init');
        * */
        timeout: function() {
            var _this = this;
            var opts = _this.options; (function t() {
                _this.setTimes();
                window.setTimeout(function() {
                    if (opts._theEnd) return;
                    t();
                },
                opts.refreshTime);
            })();
        },
        /**
        * 更新实例实现，请通过$('.uuiTimer').uuiTimer({xxxx})调用
        * @method update
        * @example $('.uuiTimer').uuiTimer().excUUICMD('update', {enable:1 }) = $('.uuiTimer').uuiTimer({enable: 1});
        * */
        update: function(options) {
            this.options = $.extend(this.options, options);
        },
        /**
        * 销毁setTimeout
        * @method destroy
        * @example $('.uuiTimer').uuiTimer().excUUICMD('destroy');
        * */
        destroy: function() {
            this.update({
                _theEnd: true
            });
            this.options.onDestroy();
        },
        /**
        * 初始化setTimeout
        * @method init
        * @example $('.uuiTimer').uuiTimer().excUUICMD('init');
        * */
        init: function() {
            this.update({
                _theEnd: false
            });
            this.timeout()
        }
    };
    $.UUIBase.create('uuiTimer', uuiTimer);
    // 创建css
    $($.UUIBase.init);
})(jQuery);