jQuery.UUIBase.css.push(".uuiModal-main{position:absolute;background:#333;width:100%;left:0;top:0}.uuiModal-main iframe{width:100%;position:absolute;z-index:-1;left:0;top:0;background:transparent}");/**
 * 组件

 * @module uuiModal
 * @authoer sogou ufo team
 **/
(function($) {
    /**
     * 给制定的元素盖上一个遮罩

     * @class $.fn.uuiModal
     * @constructor
     * @param {Object} options
     * @param {String|query} options.container 放置遮罩的元素
     * @param {Number} options.opacity 透明度，所有css
     * @param {Number} options.z-index z-index
     * @param {Boolean} options.enable 激活
     * @example $('.uuiModal').uuiModal({enable:0})
     * */
    // default setting
    var _options = {
        opacity: 1
    };
    function uuiModal($this, options) {
        var me = this;
        // extend default setting
        var opt = me.options = $.extend({}, _options);
        me.guid = $.UUIBase.guid();
        // 放置遮罩的元素
        opt.container = options.container ? options.container : $this[0];
        // 绑定遮罩的元素
        opt.target = $this;
        $(opt.container).prepend(this.tpl());
        me.update(options || {});
    };
    // 如果不需要，可以删除
    uuiModal.prototype = {
        /**
         * 生成遮罩代码
         *
         * @method tpl
         * @protected
         * @return {String}
         * */
        tpl: function() {
           return '<div class="uuiModal-main uuiModal-part" id="uuiModal-' + this.guid + '">' + 
                  '<iframe allowtransparency="true" class="uuiModal-part" frameborder="no" src="about:blank"/>' + 
                  // 必须在iframe上面再罩一个div，防止丢mousemove事件
                  '<div class="uuiModal-main uuiModal-part" style="z-index:-1"></div>' +
                  '</div>' 
        },
        /**
         * 更新实例实现，请通过$('.uuiModal').uuiModal({xxxx})调用

         * @method update
         * @param {Object} options 参数配置
         * @example $('.uuiModal').uuiModal().excUUICMD('update', {enable:1 }) = $('.uuiModal').uuiModal({enable: 1});
         * */
        update: function(options) {
            var me = this
                , opt = me.options
                , containerChange = options.container && options.container != opt.container;
            opt = $.extend(opt, options);
            opt.filter = 'progid:DXImageTransform.Microsoft.alpha(opacity=' + opt.opacity * 100 + ')';
            opt.height = ($.UUIBase.offset($(opt.container)).height) + 'px';
            opt.display = opt.enable ? 'block' : 'none';
            containerChange && $('#uuiModal-' + me.guid).remove().prependTo($(opt.container));   
            me.changeModel();
        },
        /**
         * 改变遮罩状态
         *
         * @method changeModel
         * @protected
         * */
        changeModel: function() {
            $('#uuiModal-' + this.guid).css(this.options);    
            $('#uuiModal-' + this.guid + ' .uuiModal-part').css({height: this.options.height});    
        },
        /**
         * 实例内部自我销毁的接口，可以不实现，如未实现，destroy操作会被定为到继承的medestroy上，但是不能销毁和dom的绑定，不建议调用，请使用$('.uuiModal').uuiModal({destroy: 1})

         * @method destroy
         * @param {Object} options 参数配置
         * @example $('.uuiModal').uuiModal().excUUICMD('destroy');
         * */
        destroy: function(options) {
            // 组件自有的特殊的自我销毁逻辑
            $('#uuiModal-' + this.guid).remove(); 
        }
    };
    $.UUIBase.create('uuiModal', uuiModal);
    // 创建css
    $($.UUIBase.init);
})(jQuery);
