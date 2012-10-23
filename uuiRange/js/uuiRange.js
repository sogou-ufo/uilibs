/**
 组件

 @module uuiRange
 @author sogou ufo team
 **/
(function($) {
    /**
     实现html 5的绑定input@type=range，支持多拖动头，rely on uuiDrag

     @class $.fn.uuiRange
     @constructor
     @param {Object} options 配置.
     @param {Array} options.range 起始区间，默认为 0 - 100.
     @param {Array} options.duration 选中区间或者点，长度为1或者2，默认为[0]，取值区间应该在range指定的范围内.
     @param {String|dom} options.container 容器，默认为绑定ui组件的元素.
     @param {String} options.direction range的防线，h为水平，v为竖直，默认水平.
     @param {Boolean} options.enable 使可用
     @param {Function} options.callback 设定值后执行回调,传递参数{Array}选中的range.
     @example $('.uuiRange').uuiRange({enable:0})
     * */
    function uuiRange($this, options) {
        var me = this, opt;
        // default setting
        opt = me.options = {
            range: [0, 100],
            direction: 'h',
            duration: [0],
            classPrefix: 'uuiRange',
            container: $this[0]
        };
        me.update(options || {});
        me.rangerHTML = '<i class="' + opt.classPrefix + '-ranger"></i>';
        me.durationHTML = '<div class="' + opt.classPrefix + '-duration"></div>';
        me.rangerParHTML = '<div class="' + opt.classPrefix + '-par"></div>';
        me.init();
    };
    // 如果不需要，可以删除
    uuiRange.prototype = {
        /**
         * 初始化
         *
         * @method init
         * @protected
         * */
        init: function() {
            var me = this
                , opt = me.options;
            me.rangeContainer = document.createElement('div');
            me.rangeContainer.className = opt.classPrefix + '-container';
            var html = '';
            html += me.durationHTML;
            html += me.rangerParHTML;
            for (var i = 0, len = Math.min(opt.duration.length, 2); i < len; i++) {
                html += me.rangerHTML;
            }
            $(opt.container).append(me.rangeContainer);
            me.rangeContainer.innerHTML = html;
            me.ranger = $(me.rangeContainer).children('i');
            // 当只有一个拖动头的时候支持click事件
            if (opt.duration.length) {
                me.on($(me.rangeContainer).children('.' + opt.classPrefix + '-par'), 'click', function(e) {
                    if (opt.enable) {
                        me.onclickSet(e);
                    }
                });
            }
            me.setRangeValue();
        },
        /**
         * 点击的时候响应，如果是多个拖动头，则移动距离时间最近的拖动头
         *
         * @method onclickSet
         * @protected
         * @param {event} e 事件.
         * */
        onclickSet: function(e) {
            var me = this
                , opt = me.options
                , v = me.getPos(e)
                , ele
                , direction = opt.direction == 'v' ? 'top' : 'left';
            // 获取距离事件最近的拖动头
            $.each(me.ranger, function(i, ranger) {
                /**umlog(ele)**/
                if((!ele) || Math.abs((parseInt(ele.style[direction]) >> 0) - v) > Math.abs((parseInt(ranger.style[direction]) >> 0) - v)) {
                    ele = ranger;    
                }
            });
            me.setDraggerPos(ele, v);
            me.updataDuration();
        },
        /**
         * 设置拖动头的位置
         *
         * @method setDraggerPos
         * @protected
         * @param {elements} ele 拖动头.
         * @param {Number} v px值.
         * */
        setDraggerPos: function(ele, v) {
            if (this.options.direction == 'v') {
                ele.style.top = v + 'px';
            } else {
                ele.style.left = v + 'px';
            }
        },
        /**
         * 更新duration样式，并执行回调
         *
         * @method updataDuration
         * @protected
         * */
        updataDuration: function() {
            var me = this
                , opt = me.options
                , css
                , arr = [];
            $.each(me.ranger, function(i, item) {
                var v = opt.direction == 'v' ? parseInt(item.style.top) >> 0 : parseInt(item.style.left) >> 0;
                arr.push(v);
            });
            arr[1] = arr[1] || 0;
            arr = arr.sort(function(a, b) { return a - b});
            css = opt.direction == 'v' ? {top: arr[0] + 'px', height: arr[1] - arr[0] + 'px'} : {left: arr[0] + 'px', width: arr[1] - arr[0] + 'px'};
            $(me.rangeContainer).children('.' + opt.classPrefix + '-' + 'duration').css(css);
            opt.callback && opt.callback(me.getDuration());
        },
        /**
         * 设置区间值，更新拖动头位置
         *
         * @method setRangeValue
         * @protected
         * */
        setRangeValue: function() {
            var me = this
                , opt = me.options
                , total = opt.range[1] - opt.range[0];
            $.each(me.ranger, function(i, item) {
                me.exchangeRate();
                var v = (opt.duration[i] - opt.range[0]) / total * (me.containerWidth - me.rangerWidth * 2);
                me.setDraggerPos(item, v);
            });
            $(me.rangeContainer).uuiDrag({
                direction: opt.direction,
                dragger: '.' + opt.classPrefix + '-ranger',
                enable: opt.enable,
                dragMove: function() {
                    me.updataDuration();
                },
                dragEnd: function() {
                    //me.updataDuration();
                },
                range: opt.container
            });
            me.updataDuration();
        },
        /**
         * 获取点击事件的位置
         *
         * @method getPos
         * @protected
         * @param {event} e 事件.
         * */
        getPos: function(e) {
            var me = this
                , opt = me.options
                , direction = opt.direction;
                me.exchangeRate();
            epos = direction == 'v' ? $.UUIBase.getEPos(e).top - me.containerOffset.top - me.rangerWidth : $.UUIBase.getEPos(e).left - me.containerOffset.left - me.rangerWidth;
            if (epos < 0) ep = 0;
            if (epos > me.containerWidth - me.rangerWidth * 2) epos = me.containerWidth - me.rangerWidth * 2;
            return epos;
        },
        /**
         * 计算父容器和拖动头的宽度，并进行转换
         *
         * @method exchangeRate
         * @protected
         * */
        exchangeRate: function() {
            var me = this
                , opt = me.options
                , direction = opt.direction;
            me.containerOffset = $(me.rangeContainer).offset();
            me.containerWidth = direction == 'v' ? $(me.rangeContainer).outerHeight() : $(me.rangeContainer).outerWidth();
            me.rangerWidth = direction == 'v' ? me.ranger.outerHeight() / 2 : me.ranger.outerWidth() / 2;
        },
        /**
         * 获取选中区间，并转换为range内的有效值
         *
         * @method getDuration
         * @protected
         * @return {Array} 选中的区间值.
         * */
        getDuration: function() {
            var me = this
                , opt = me.options;
            opt.duration = [];
            $.each(me.ranger, function(i, item) {
                var v = (opt.direction == 'v' ? parseInt(item.style.top) >> 0 : parseInt(item.style.left) >> 0) / ((me.containerWidth - me.rangerWidth * 2) || 1) * (opt.range[1] - opt.range[0]) + opt.range[0];
                opt.duration.push(v);
            });
            return opt.duration.sort(function(a, b) {return a - b});
        },
        /**
         更新实例实现，请通过$('.uuiRange').uuiRange({xxxx})调用

         @method update
         @param {Object} options 参数配置，可以update参数direction, range, duration, callback.
         @example $('.uuiRange').uuiRange().excUUICMD('update', {enable:1 }) = $('.uuiRange').uuiRange({enable: 1});
         * */
        update: function(options) {
            this.options = $.extend(this.options, options);
            this.options.range = this.options.range.sort(function(a, b) {return a - b});
            this.options.duration = this.options.duration.sort(function(a, b) {return a - b});
            this.ranger && this.setRangeValue();
        }
        /*
        \/**
         实例内部自我销毁的接口，可以不实现，如未实现，destroy操作会被定为到继承的_destroy上，但是不能销毁和dom的绑定，不建议调用，请使用$('.uuiRange').uuiRange({destroy: 1})

         @method destroy
         @param {Object} options 参数配置
         @example $('.uuiRange').uuiRange().excUUICMD('destroy');
         * *\/
        destroy: function(options) {
            // 组件自有的特殊的自我销毁逻辑
        }
        */
    };
    $.UUIBase.create('uuiRange', uuiRange);
    // 创建css
    $($.UUIBase.init);
})(jQuery);
