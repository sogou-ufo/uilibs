/**
*组件
*@module uuiTab
*/
(function($) {
    /**
     *构造器
     *@class $.fn.uuiTab
     *@constructor
     *@param {Object} options 参数配置
     *@param {jQuery} options.title        tab头部列表 默认null
     *@param {jQuery} options.content      tab内容列表 默认null
     *@param {Number} options.index        默认索引 默认0
     *@param {String} options.evt          触发事件 默认mouseover
     *@param {String} options.className    切换触发className 默认空
     *@param {Object} options.cacheItem    缓存上一个dom 默认{title:null,content:null}
     *@param {Object} options.onPlay       切换时的回调
     *@param {Object} options.onInit       初始化回调
     *@example $('.uuiTab').uuiTab({enable:0})
     */
     
    var _cacheKeyTab = {};//保存所有触发键盘切换开关
    function uuiTab($this, options) {
        this.options = $.extend({
            title: $([]),
            content: $([]),
            index: 0,
            //默认索引
            evt: 'mouseover click',
            //触发事件
            className: '',
            //切换触发className
            cacheItem: {
                title: null,
                content: null
            },
            //切换时的回调
            onPlay: function() {},
            //初始化回调
            onInit: function() {}
        },
        options || {});
        
        this.guid = $.UUIBase.guid();
        _cacheKeyTab[this.guid] = false;
        
    };
    uuiTab.prototype = {
        /**
         *切换
         *@method play
         *@param {Object} options 参数配置
         *@param {Number} options.index 切换到的索引
         *@example $('.uuiTab').excUUICMD('play', {enable:0})
         */
        play: function(options) {
            var opts = this.options;
            var index = this.getIndex({
                index: options.index || 0
            });
            var $title = opts.title.eq(index);
            var $content = opts.content.eq(index);
            opts.cacheItem.title.removeClass(opts.className);
            opts.cacheItem.content.hide();
            $title.addClass(opts.className);
            $content.show();
            //update
            this.update({
                index: index,
                cacheItem: {
                    title: $title,
                    content: $content
                }
            });
            opts.onPlay();
        },
        /**
         *切换到上一个
         *@method prev
         *@example $('.uuiTab').excUUICMD('prev', {enable:0})
         */
        prev: function() {
            var index = this.options.index -= 1;
            this.play({
                index: index
            });
        },
        /**
         *切换到下一个
         *@method next
         *@example $('.uuiTab').excUUICMD('next', {enable:0})
         */
        next: function() {
            var index = this.options.index += 1;
            this.play({
                index: index
            });
        },
        /**
         *获取index（容错处理）
         *@method getIndex
         *@example $('.uuiTab').excUUICMD('getIndex', {enable:0})
         */
        getIndex: function(options) {
            var opts = this.options;
            var index = options.index;
            var len = Math.max(opts.title.length, opts.title.length) - 1; //索引从0开始
            return index = (index > len) ? 0 : (index < 0) ? len: index;
        },
        /**
         *初始化,设置默认显示，绑定触发事件
         *@method init
         *@example $('.uuiTab').excUUICMD('init', {enable:0})
         */
        init: function() {
            var _this = this;
            var options = this.options;
            var $title = options.title;
            var $content = options.content;
            var index = _this.getIndex({
                index: options.index
            });
            var className = options.className;
            var evt = options.evt;
            var cacheItem = options.cacheItem;
            //设置默认
            $title.each(function(i) {
                var $this = $(this);
                if (index == i) {
                    $this.addClass(className);
                    $content.eq(i).show();
                    //缓存默认
                    _this.update({
                        cacheItem: {
                            title: $title,
                            content: $content
                        }
                    });
                } else {
                    $this.removeClass(className);
                    $content.eq(i).hide();
                }
            });
            
            //绑定事件
            _this._destroy();
            _this.on($title, evt, function(e) {
                e.stopPropagation();
                var index = $(this).index();
                _this.play({
                    index: index
                });
               _this._setKeyTabClose();//关闭所有键盘监听
               _cacheKeyTab[_this.guid] = true;//打开当前键盘监听
               
            });
            _this.on($(document),{
                keydown : function(e){
                    if ((e.which == 37 || e.which == 38) && _cacheKeyTab[_this.guid]){
                        e.preventDefault();
                        _this.prev();
                    }else if ((e.which == 39 || e.which == 40) && _cacheKeyTab[_this.guid]){
                        e.preventDefault();
                        _this.next();
                    }
                },
                click : function(e){
                    _this._setKeyTabClose();
                }
            });
            options.onInit();
        },
        /**
         *更新实例
         *@method update
         *@param {Object} options 参数配置
         *@example $('.uuiTab').uuiTab({xxxx})
         */
        update: function(options) {
            this.options = $.extend(this.options, options);
        },
        _setKeyTabClose : function(){
            $.each(_cacheKeyTab,function(i){
                _cacheKeyTab[i] = false;
            });
        }
    };
    $.UUIBase.create('uuiTab', uuiTab);
    // 创建css
    $($.UUIBase.init);
})(jQuery);