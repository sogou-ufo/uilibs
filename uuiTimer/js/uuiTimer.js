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
	 * @param {Array} options.tpl 时间模版设置
	 * @param {Number} options.serverTime 服务器时间戳(13位)
	 * @param {jQuery} options.container 显示倒计时容器
	 * @param {String} options.endTime 结束时间属性选择器字符串
	 * @param {Number} options.time 刷新时间间隔
	 * @param {Boolean} options.theEnd 是否销毁定时器开关
	 * @param {Number} options.nowTime 初始化的当前时间戳
	 * @param {function} options.diffTime() 返回服务器和客户端时间差
	 * @param {function} options.onSettime(options) 设置时间回调,options返回针对tpl转化后的数组,this指向当前容器
	 * @param {function} options.onEnd() 结束回调,this指向当前容器
	 * @param {function} options.onDestroy() 销毁定时器回调，this指向构造函数
     * @example $('.uuiTimer').uuiTimer({enable:0})
     * 
	 */
    // default setting
    var _options = {
        tpl: [86400000, 3600000, 60000, 1000, 10],
        serverTime: +new Date(),
        container: $([]),
        endTime: 'data-endtime',
        time: 　1000,
        theEnd: false,
        nowTime: +new Date(),
        diffTime: function(serverTime) {
            return this.nowTime - this.serverTime;
        },
        onSettime: function(options) {},
        onEnd: function() {},
        onDestroy: function() {}
    };
    function uuiTimer($this, options) {
        var me = this;
        // extend default setting
        var opt = me.options = $.extend({},
        _options);
        me.guid = $.UUIBase.guid();
        me.update(options || {});
    };
    uuiTimer.prototype = {
        /**
         * 设置时间核心实现
		 
         * @method setTimes
         * @param null
         * @example null
         * */
        setTimes: function() {
            var _this = this;
            var opts = _this.options;
            var diffTime = opts.diffTime();
            opts.container.each(function(i, v) {
                var $this = $(v);
                var endTime = $this.attr(opts.endTime);
                var t = endTime - +new Date() - diffTime;
                if (t <= 0) {
                    opts.onEnd.call(this);
                    return
                };
                var aTime = [];
                $.each(opts.tpl,
                function(i, v) {
                    var d = parseInt(t / v);
                    t -= d * v;
                    aTime.push(d)
                });

                opts.onSettime.call(this, aTime);
            })
        },
        /**
         * setTimeout 核心实现，请通过 $('.uuiTimer').uuiTimer().excUUICMD('init')调用
		 
         * @method timeout
         * @param null
         * @example $('.uuiTimer').uuiTimer().excUUICMD('init');
         * */
        timeout: function() {
            var _this = this;
            var opts = _this.options; (function t() {
                window.setTimeout(function() {
                    if (opts.theEnd) return;
                    _this.setTimes();
                    t();
                },
                opts.time);
            })();
        },
        /**
         * 更新实例实现，请通过$('.uuiTimer').uuiTimer({xxxx})调用
		 
         * @method update
         * @param null
         * @example $('.uuiTimer').uuiTimer().excUUICMD('update', {enable:1 }) = $('.uuiTimer').uuiTimer({enable: 1});
         * */
        update: function(options) {
            this.options = $.extend(this.options, options);
        },
        /**
         * 销毁setTimeout
		 
         * @method destroy
         * @param null
         * @example $('.uuiTimer').uuiTimer().excUUICMD('destroy');
         * */
        destroy: function() {
            this.update({
                theEnd: true
            });
            this.options.onDestroy();
        },
        /**
         * 初始化setTimeout
		 
         * @method init
         * @param null
         * @example $('.uuiTimer').uuiTimer().excUUICMD('init');
         * */
        init: function() {
            this.update({
                theEnd: false
            });
            this.timeout()
        }
    };
    $.UUIBase.create('uuiTimer', uuiTimer);
    // 创建css
    $($.UUIBase.init);
})(jQuery);