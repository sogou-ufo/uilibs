/**
 * 组件

 * @module uuiTab
 * @authoer sogou ufo team
 **/
(function($) {
    /**
     * 构造器

     * @class $.fn.uuiTab
     * @constructor
     * @param {Object} options
     * @example $('.uuiTab').uuiTab({enable:0})
     * */
    // default setting
    var _options = {
        
    };
    function uuiTab($this, options) {
        var me = this;
        // extend default setting
        var opt = me.options = $.extend({}, _options);
        me.guid = $.UUIBase.guid();
        me.update(options || {});
    };
    // 如果不需要，可以删除
    uuiTab.prototype = {
        /**
         * 更新实例实现，请通过$('.uuiTab').uuiTab({xxxx})调用

         * @method update
         * @param {Object} options 参数配置
         * @example $('.uuiTab').uuiTab().excUUICMD('update', {enable:1 }) = $('.uuiTab').uuiTab({enable: 1});
         * */
        update: function(options) {
            this.options = $.extend(this.options, options);
        }
        /*
        \/**
         * 实例内部自我销毁的接口，可以不实现，如未实现，destroy操作会被定为到继承的medestroy上，但是不能销毁和dom的绑定，不建议调用，请使用$('.uuiTab').uuiTab({destroy: 1})

         * @method destroy
         * @param {Object} options 参数配置
         * @example $('.uuiTab').uuiTab().excUUICMD('destroy');
         * *\/
        destroy: function(options) {
            // 组件自有的特殊的自我销毁逻辑
        }
        */
    };
    $.UUIBase.create('uuiTab', uuiTab);
    // 创建css
    $($.UUIBase.init);
})(jQuery);
