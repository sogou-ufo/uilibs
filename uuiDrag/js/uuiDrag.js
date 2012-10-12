/**
 * 组件

 * @module uuiDrag
 * @author sogou ufo team
 **/
(function($) {
    /**
     * 实现元素的可拖动功能

     * @class $.fn.uuiDrag
     * @constructor 拖动
     * @param {jQuery} $this 绑定拖动的元素，默认会成为被拖动的元素.
     * @param {Object} options 配置.
     * @param {dom | query} options.range 可拖动的范围，默认为document.body.
     * @param {Boolean} options.enable 是否可拖动.
     * @param {query | dom} options.trigger 拖动触发元素，默认为$this，如果指定了，trigger必须是dragger的子元素或者子query.
     * @param {query | dom} options.dragger 拖动元素，默认为$this，如指定了dragger，其必须是$this的子元素或者子query，表示是$this下所有符合dragger条件的元素都可以拖动.
     * @param {String} options.dir 拖动方向，默认不限定，h水平，v竖直.
     * @param {String} options.dragEvent 触发拖动的事件，默认mousedown.
     * @param {Function} options.dragStart 开始拖动.传递参数 (this)实例，可以通过实例.dragger获取当前被拖动的元素
     * @param {function} options.dragMove 正在拖动.
     * @param {Function} options.dragEnd 拖动结束.
     * @example $('.uuiDrag').uuiDrag({enable:0})
     * */
    // 配置
    var _options = {
        enable: true,
        dragable: false,
        dir: false,
        dragEvent: 'mousedown',
        range: null
    };
    function uuiDrag($this, options) {
        var me = this
            , opt;
        opt = me.options = $.extend({dragger: $this[0]}, _options);
        // default setting
        me.update(options || {});
        // start drag
        if (opt.dragger == opt.trigger) {
            me.on($this, opt.dragEvent, opt.dragger, function(e) {
                me.saveLast(e, this);
            });
        } else {
            // 指定了触发元素
            me.on($(opt.dragger), opt.dragEvent, opt.trigger, function(e) {
                me.saveLast(e, e.delegateTarget);
            });
        }
        //$(opt.dragger).addClass('uuiDrag-dragger');
        // end drag
        me.on($(document), 'mouseup', function(e) {
            opt.dragable = false;
            clearInterval(me.timer);
            $(me.dragger).removeClass('uuiDrag-dragger');
            opt.dragEnd && opt.dragEnd(me);
            $(document.body).removeClass('uuiDrag-main-dragging');
            document.onselectstart = function() {return true};
        });
    };
    // 如果不需要，可以删除
    uuiDrag.prototype = {
        /**
         * 存储上次事件发生的位置
         * @method saveLast
         * @protected
         * @param {event} e
         * */
        saveLast: function(e, dragger) {
            var me = this
                , opt = me.options;
            if(!opt.enable) return;
            // 现在正在拖动的元素
            me.dragger = dragger;
            $(me.dragger).addClass('uuiDrag-dragger');
            me.lastE = $.UUIBase.getEPos(e);
            // 清空选中
            $.UUIBase.empty();
            opt.dragable = true;
            // 计算range，主要是为了支持复杂的drag效果
            // range不是一个设置了left,top,width,height的区间
            if (opt.range && !(opt.range.left + 1)) {
                var range = $(opt.range).offset();
                range.width = $(opt.range).width() - $(opt.dragger).width();
                range.height = $(opt.range).height() - $(opt.dragger).height();
                me.range = range;
            } else {
                me.range = opt.range;     
            }
            // 禁止选中
            $(document.body).addClass('uuiDrag-main-dragging');
            document.onselectstart = function() {return false};
            // 修复chrome不能正确获取到computedstyle bug
            me.lastPos = $(me.dragger).offset();
            me.lastPos.width = $(me.dragger).width();
            me.lastPos.height = $(me.dragger).height();
            if(opt.range) {
                me.lastPos.left = me.lastPos.left - me.range.left;
                me.lastPos.top = me.lastPos.top - me.range.top;
            }
            setTimeout(function() {
                clearInterval(me.timer);
                me.timer = setInterval(function() {
                    me.setPos();    
                    opt.dragMove && opt.dragMove(me);
                }, 16);    
            }, 1);
            opt.dragStart && opt.dragStart(me);
        },
        /**
         * 更新实例实现，请通过$('.uuiDrag').uuiDrag({xxxx})调用

         * @method update
         * @param {Object} options 参数配置,可update参数:range, dir, enable, dragStart, dragEnd, drag,其他参数操作会造成意外
         * @example $('.uuiDrag').uuiDrag().excUUICMD('update', {enable:1 }) = $('.uuiDrag').uuiDrag({enable: 1});
         * */
        update: function(options) {
            var opt = this.options;
            opt = $.extend(this.options, options);
            opt.trigger = opt.trigger || opt.dragger;
        },
        /**
         * 事件发生时候更新被拖动元素位置
         *
         * @method setPos
         * @protected
         * */
        setPos: function() {
            // get the event
            var me = this
                , opt = me.options
                , offset = {}
                , doffset = $(me.dragger).offset()
                , tmp = me.lastE;
            me.lastE = $.UUIBase.getMousePos();
            tmp = tmp || me.lastPos;
            // 竖直方向可拖动
            if (opt.dir != 'h') {
                // 如果限定了拖动范围，鼠标超出范围会将元素拖动到边界线上，在鼠标的位置为达到拖动元素的中间位置，不再响应拖动【竖直方向】
                if(me.range && (me.lastE.top < me.range.top + me.lastPos.height / 2 && me.lastPos.top == 0 || (me.lastE.top > me.range.top + me.range.height + me.lastPos.height / 2 && me.lastPos.top == me.range.height))) {
                } else {
                    var y = me.lastE.top - tmp.top + me.lastPos.top;
                    if(opt.range) {
                        if (y < 0) {
                                y = 0;
                        } else if (y > me.range.height) {
                                y = me.range.height;
                        }
                    }
                    offset.top = y + 'px';
                }
            }

            // 水平防线可拖动
            if (opt.dir != 'v') {
                // 如果限定了拖动范围，鼠标超出范围会将元素拖动到边界线上，在鼠标的位置为达到拖动元素的中间位置，不再响应拖动【水平方向】
                if(me.range && (me.lastE.left < me.range.left + me.lastPos.width / 2 && me.lastPos.left == 0 || (me.lastE.left > me.range.left + me.range.width + me.lastPos.width / 2 && me.lastPos.left == me.range.width))) {
                } else {
                    var x = me.lastE.left - tmp.left + me.lastPos.left;
                    if(opt.range) {
                        if (x < 0) {
                            x = 0;
                        } else if (x > me.range.width) {
                            x = me.range.width;
                        }
                    }
                    offset.left = x + 'px';
                }
            }
            $(me.dragger).css(offset);
            me.lastPos.left = parseInt($(me.dragger).css('left')) >> 0;
            me.lastPos.top = parseInt($(me.dragger).css('top')) >> 0;
            opt.dragEnd && opt.dragEnd(me);
        },
        /**
         * 实例内部自我销毁的接口，可以不实现，如未实现，destroy操作会被定为到继承的medestroy上，但是不能销毁和dom的绑定，不建议调用，请使用$('.uuiDrag').uuiDrag({destroy: 1})

         * @method destroy
         * @param {Object} options 参数配置
         * @example $('.uuiDrag').uuiDrag().excUUICMD('destroy');
         * */
        destroy: function(options) {
            // 组件自有的特殊的自我销毁逻辑
            //$(this.options.dragger).removeClass('uuiDrag-dragger');
            clearInterval(this.timer)
        }
    };
    $.UUIBase.create('uuiDrag', uuiDrag);
    // 创建css
    $($.UUIBase.init);
})(jQuery);
