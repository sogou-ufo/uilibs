/**
 * 组件

 * @module uuiDialog
 * @authoer sogou ufo team
 **/
(function($) {
    /**
     * 构造器

     * @class $.fn.uuiDialog
     * @constructor
     * @param {Object} options
     * @param {Boolean} options.draggable 是否可拖动
     * @param {Boolean} options.modal 是否显示遮罩
     * @param {Number} options.width 宽度
     * @param {Number} options.height 高度
     * @param {Function} options.dialogShow 显示dialog后的回调传递参数实例this
     * @param {Function} options.dialogClose 关闭dialog后的回调，相比于其他回调会多一个参数fromConfirm，表示是否是由于点击确定按钮造成的按钮关闭
     * @param {function} options.dialogConfirm 点击确定按钮的回调
     * @example $('.uuiDialog').uuiDialog({enable:0})
     * */
    // default setting
    var _options = {
        draggable: false,
        modal: true,    
        titleText: '',
        width: 400,
        height: 300,
        type: 'alert',
        content: '',
        foot: true,
        opacity: 0.3,
        id: false,
        confirmText: '确定',
        abortText: '取消',
        classPrefix: 'uui'
    };
    function uuiDialog($this, options) {
        var me = this;
        // extend default setting
        var opt = me.options = $.extend({}, _options);
        me.guid = $.UUIBase.guid();
        me.update(options || {});
        // 默认元素被点击触发dialog
        me.on($this, 'click', function() {
            me.show();
        });
        uuiDialog.count += 1;
    };
    // 记录当前最大的z-index
    uuiDialog.maxIndex = 1000;
    uuiDialog.count = 0;
    // 如果不需要，可以删除
    uuiDialog.prototype = {
        /**
         * 初始化
         *
         * @method init
         * */
        init: function() {
            var me = this
                , opt = me.options;    
            if(opt.id) {
                me.dialog = $(opt.id); 
            } else {
                if(!$('#uuiDialog-' + me.guid)[0]) $(document.body).append(me.tpl());
                me.dialog = $('#uuiDialog-' + me.guid);
            }
            me.setContent();
            me.setTitle();
            me.setFoot();
            // 所有close元素将关闭dialog
            me.on(me.dialog, 'click', '.uuiDialog-close', function(e) {
                $.UUIBase.stopPropagation(e);
                me.hide(); 
            });
            // 所有confirm元素
            me.on(me.dialog, 'click', '.uuiDialog-confirm', function(e) {
                $.UUIBase.stopPropagation(e);
                opt.dialogConfirm && opt.dialogConfirm(me); 
                me.hide('fromConfirm');
            });
            // 点击dialog将增大其z-index
            me.on(me.dialog, 'mousedown', function() {
                me.getIndex();
                me.dialog.css({'z-index': me.zIndex});
            });
        },
        /**
         * 生成html片段
         *
         * @method tpl
         * */
        tpl: function(){
            var me = this
                , opt = me.options
                , id = me.guid;
            return '<div id="uuiDialog-' + id + '" class="uuiDialog-main ' + opt.classPrefix + '-dialog" style="display:none;">' +
                    '<div class="uuiDialog-background"><div class="uuiDialog-background-inner"></div></div>' +
                    // head
                    '<div class="uuiDialog-head ' + opt.classPrefix + '-dialog-head">' + 
                    '<a class="uuiDialog-close" onmousedown="event.stopPropagation && event.stopPropagation(); event.cancelBubble = true; return false;" onclick="return false" href="#">X</a>' +
                    '<span class="uuiDialog-title">' + 
                    //opt.titleText +
                    '</span>' +
                    '</div>' +
                    // content
                    '<div class="uuiDialog-content ' + opt.classPrefix + '-dialog-content">' + 
                    //opt.contentHTML +
                    '</div>' +
                    // bottom
                    '<div class="uuiDialog-foot ' + opt.classPrefix + '-dialog-foot">' + 
                    //(opt.footHTML || '') + 
                    '</div>' +
                    '</div>'
        },
        /**
         * 更新实例实现，请通过$('.uuiDialog').uuiDialog({xxxx})调用

         * @method update
         * @param {Object} options 参数配置
         * @example $('.uuiDialog').uuiDialog().excUUICMD('update', {enable:1 }) = $('.uuiDialog').uuiDialog({enable: 1});
         * */
        update: function(options) {
            var me = this
                , opt = me.options
                , contentChange = options.content != opt.content
                , titleChange = options.titleText != opt.titleText
                , footChange = options.foot != opt.foot;
            opt = $.extend(opt, options);
            switch(opt.type){
                // iframe
                case 'iframe':
                    opt.contentHTML = '<iframe frameborder="no" src="' + opt.content + '"></iframe>';
                break;
                case 'confirm':
                    opt.contentHTML = opt.content;
                    opt.foot && (opt.footHTML = '<a class="uuiDialog-confirm" href="#" onclick="return false;">' + opt.confirmText + '</a><a onclick="return false;" href="#" class="uuiDialog-close">' + opt.abortText + '</a>');
                break;
                default:
                    opt.contentHTML = opt.content;
                    opt.foot && (opt.footHTML = '<a class="uuiDialog-confirm" href="#" onclick="return false;">' + opt.confirmText + '</a>');
                break;
            }
            if(!me.dialog) return;
            // 展示modal，enable状态，并且可见
            me.modal(opt.modal && opt.enable && me.isshown, opt.modal);
            me.drag();
            // 更新content
            contentChange && me.setContent(); 
            // 更新title
            titleChange && me.setTitle(); 
            // 更新foot
            footChange && me.setFoot(); 
            // 更新样式
            var css = {};
            me.getStyle(css, me, options);
            me.dialog.css(css);
        },
        setContent: function(options) {
            var html = options && options.html;
            this.dialog.find('.uuiDialog-content').html(html || this.options.contentHTML);
        },
        setTitle: function(options) {
            var html = options && options.html;
            this.dialog.find('.uuiDialog-title').html(html || this.options.titleText);
        },
        setFoot: function(options) {
            var html = options && options.html;
            this.dialog.find('.uuiDialog-foot').html(html || this.options.footHTML);
        },
        /**
         * 拖动
         *
         * @method drag
         * */
        drag: function() {
            var me = this
                , opt = me.options;
            // 是否可以拖动
            if(opt.draggable) {
                me.dragger = me.dialog.uuiDrag({
                    trigger: '.uuiDialog-head',
                    enable: true,
                    range: document.body    
                });
                me.dragger.find('.uuiDialog-head').addClass('uuiDialog-draggable');
            } else if(me.dragger) {
                me.dragger.uuiDrag({enable: false}).find('.uuiDialog-head').removeClass('uuiDialog-draggable');
            }
        },
        /**
         * 遮罩不公用
         *
         * @method modal
         * @param {Boolean} enable 是否显示遮罩
         * @param {Boolean} modal 是否显示全局遮罩，true表示盖住这个页面，false表示只盖住区域下元素
         * */
        modal: function(enable, modal){
            var me =this
                , opt = me.options;
            if(modal){
                me.dialog.uuiModal({
                    enable: enable,    
                    'z-index': me.zIndex,
                    container: document.body,
                    opacity: opt.opacity
                }); 
            } else {
                me.dialog.uuiModal({
                    opacity: opt.opacity,
                    container: me.dialog[0],
                    enable: enable, 
                    'z-index': -1
                }); 
            }
        },
        /**
         * 计算z-index
         *
         * @method getIndex
         * */
        getIndex: function() {
            var me = this;
            // 多个dialog，并且当前需要显示的dialog的z-index不是最大
            (uuiDialog.count > 1 && me.zIndex != uuiDialog.maxIndex) && (uuiDialog.maxIndex += 1);
            me.zIndex = uuiDialog.maxIndex;
        },
        /**
         * 展示dialog，并提升其z-index
         *
         * @method show 
         * */
        show: function() {
            var me = this
                , opt = me.options
                , css
                , offset;
            if(!me.dialog){
                me.init();
            }
            me.getIndex();
            css = {
               'z-index': me.zIndex,
               display: 'block' 
            };
            me.getStyle(css, me, opt);
            me.dialog.css(css);
            if(opt.shadow) {
                me.dialog.addClass('uuiDialog-shadow');    
            } else {
                me.dialog.removeClass('uuiDialog-shadow');    
            };
            me.modal(opt.enable, opt.modal);
            me.drag();
            me.isshown = 1;
            opt.dialogShow && opt.dialogShow(me);
        },
        /**
         * 计算css
         *
         * @method getStyle
         * @param {Object} css css对象
         * */
        getStyle: function(css, me, opt) {
            offset = $.UUIBase.offset(me.dialog);
            if(opt.left) {
                css.left = opt.left + 'px';    
            // 未展示的时候update，再打开，如果未配置left，top，默认让dialog居中
            } else if(!me.isshown) {
                css.left = '50%';
                css['margin-left'] = -(opt.width || offset.width) / 2 + 'px';    
            }
            if(opt.top) {
                css.top = opt.top + 'px';     
            } else if(!me.isshown) {
                css.top = '50%';
                css['margin-top'] = -(opt.height || offset.height) / 2 + 'px';
            }
            opt.height && (css.height = opt.height + 'px');
            opt.width && (css.width = opt.width + 'px');
        },
        /**
         * 隐藏dialog
         *
         * @method hide
         * */
        hide: function(fromConfirm) {
            var me = this
                , opt = me.options;
            me.isshown = 0;
            me.dialog.hide();
            me.modal(0, opt.modal);
            opt.dialogClose && opt.dialogClose(me, fromConfirm);
        },
        /*
         * 实例内部自我销毁的接口，可以不实现，如未实现，destroy操作会被定为到继承的medestroy上，但是不能销毁和dom的绑定，不建议调用，请使用$('.uuiDialog').uuiDialog({destroy: 1})

         * @method destroy
         * @param {Object} options 参数配置
         * @example $('.uuiDialog').uuiDialog().excUUICMD('destroy');
         * */
        destroy: function(options) {
            // 组件自有的特殊的自我销毁逻辑
            // 销毁拖动
            $('#uuiDialog-' + this.guid).uuiDrag({destroy: 1});
            // 销毁遮罩
            $('#uuiDialog-' + this.guid).uuiModal({destroy: 1});
            // 销毁元素
            $('#uuiDialog-' + this.guid).remove();
            // dialog计数器-1
            uuiDialog.count -= 1;
        }
    };
    $.UUIBase.create('uuiDialog', uuiDialog);
    // 创建css
    $($.UUIBase.init);
})(jQuery);
/**
 * 组件

 * @module uuiDialog
 * @authoer sogou ufo team
 **/
(function($) {
    /**
     * 构造器

     * @class $.fn.uuiDialog
     * @constructor
     * @param {Object} options
     * @param {Boolean} options.draggable 是否可拖动
     * @param {Boolean} options.modal 是否显示遮罩
     * @param {Number} options.width 宽度
     * @param {Number} options.height 高度
     * @param {Function} options.dialogShow 显示dialog后的回调传递参数实例this
     * @param {Function} options.dialogClose 关闭dialog后的回调，相比于其他回调会多一个参数fromConfirm，表示是否是由于点击确定按钮造成的按钮关闭
     * @param {function} options.dialogConfirm 点击确定按钮的回调
     * @example $('.uuiDialog').uuiDialog({enable:0})
     * */
    // default setting
    var _options = {
        draggable: false,
        modal: true,    
        titleText: '',
        type: 'alert',
        content: '',
        foot: true,
        opacity: 0.3,
        id: false,
        confirmText: '确定',
        abortText: '取消',
        classPrefix: 'uui'
    };
    function uuiDialog($this, options) {
        var me = this;
        // extend default setting
        var opt = me.options = $.extend({}, _options);
        me.guid = $.UUIBase.guid();
        me.update(options || {});
        // 默认元素被点击触发dialog
        me.on($this, 'click', function() {
            me.show();
        });
        uuiDialog.count += 1;
    };
    // 记录当前最大的z-index
    uuiDialog.maxIndex = 1000;
    uuiDialog.count = 0;
    // 如果不需要，可以删除
    uuiDialog.prototype = {
        /**
         * 初始化
         *
         * @method init
         * */
        init: function() {
            var me = this
                , opt = me.options;    
            if(opt.id) {
                me.dialog = $(opt.id); 
            } else {
                if(!$('#uuiDialog-' + me.guid)[0]) $(document.body).append(me.tpl());
                me.dialog = $('#uuiDialog-' + me.guid);
            }
            me.setContent();
            me.setTitle();
            me.setFoot();
            // 所有close元素将关闭dialog
            me.on(me.dialog, 'click', '.uuiDialog-close', function(e) {
                $.UUIBase.stopPropagation(e);
                me.hide(); 
            });
            // 所有confirm元素
            me.on(me.dialog, 'click', '.uuiDialog-confirm', function(e) {
                $.UUIBase.stopPropagation(e);
                opt.dialogConfirm && opt.dialogConfirm(me); 
                me.hide('fromConfirm');
            });
            // 点击dialog将增大其z-index
            me.on(me.dialog, 'mousedown', function() {
                me.getIndex();
                me.dialog.css({'z-index': me.zIndex});
            });
        },
        /**
         * 生成html片段
         *
         * @method tpl
         * */
        tpl: function(){
            var me = this
                , opt = me.options
                , id = me.guid;
            return '<div id="uuiDialog-' + id + '" class="uuiDialog-main ' + opt.classPrefix + '-dialog" style="display:none;">' +
                    // head
                    '<div class="uuiDialog-head ' + opt.classPrefix + '-dialog-head">' + 
                    '<a class="uuiDialog-close" onmousedown="event.stopPropagation && event.stopPropagation(); event.cancelBubble = true; return false;" onclick="return false" href="#"></a>' +
                    '<span class="uuiDialog-title">' + 
                    //opt.titleText +
                    '</span>' +
                    '</div>' +
                    // content
                    '<div class="uuiDialog-content ' + opt.classPrefix + '-dialog-content">' + 
                    //opt.contentHTML +
                    '</div>' +
                    // bottom
                    '<div class="uuiDialog-foot ' + opt.classPrefix + '-dialog-foot">' + 
                    //(opt.footHTML || '') + 
                    '</div>' +
                    '</div>'
        },
        /**
         * 更新实例实现，请通过$('.uuiDialog').uuiDialog({xxxx})调用

         * @method update
         * @param {Object} options 参数配置
         * @example $('.uuiDialog').uuiDialog().excUUICMD('update', {enable:1 }) = $('.uuiDialog').uuiDialog({enable: 1});
         * */
        update: function(options) {
            var me = this
                , opt = me.options
                , contentChange = options.content != opt.content
                , titleChange = options.titleText != opt.titleText
                , footChange = options.foot != opt.foot;
            opt = $.extend(opt, options);
            switch(opt.type){
                // iframe
                case 'iframe':
                    opt.contentHTML = '<iframe frameborder="no" src="' + opt.content + '"></iframe>';
                break;
                case 'confirm':
                    opt.contentHTML = opt.content;
                    opt.foot && (opt.footHTML = '<a class="uuiDialog-confirm" href="#" onclick="return false;">' + opt.confirmText + '</a><a onclick="return false;" href="#" class="uuiDialog-close">' + opt.abortText + '</a>');
                break;
                default:
                    opt.contentHTML = opt.content;
                    opt.foot && (opt.footHTML = '<a class="uuiDialog-confirm" href="#" onclick="return false;">' + opt.confirmText + '</a>');
                break;
            }
            if(!me.dialog) return;
            // 展示modal，enable状态，并且可见
            me.modal(opt.modal && opt.enable && me.isshown, opt.modal);
            me.drag();
            // 更新content
            contentChange && me.setContent(); 
            // 更新title
            titleChange && me.setTitle(); 
            // 更新foot
            footChange && me.setFoot(); 
            // 更新样式
            var css = {};
            me.getStyle(css, me, options);
            me.dialog.css(css);
        },
        setContent: function(options) {
            var html = options && options.html;
            this.dialog.find('.uuiDialog-content').html(html || this.options.contentHTML);
        },
        setTitle: function(options) {
            var html = options && options.html;
            this.dialog.find('.uuiDialog-title').html(html || this.options.titleText);
        },
        setFoot: function(options) {
            var html = options && options.html;
            this.dialog.find('.uuiDialog-foot').html(html || this.options.footHTML);
        },
        /**
         * 拖动
         *
         * @method drag
         * */
        drag: function() {
            var me = this
                , opt = me.options;
            // 是否可以拖动
            if(opt.draggable) {
                me.dragger = me.dialog.uuiDrag({
                    trigger: '.uuiDialog-head',
                    enable: true,
                    range: document.body    
                });
                me.dragger.find('.uuiDialog-head').addClass('uuiDialog-draggable');
            } else if(me.dragger) {
                me.dragger.uuiDrag({enable: false}).find('.uuiDialog-head').removeClass('uuiDialog-draggable');
            }
        },
        /**
         * 遮罩不公用
         *
         * @method modal
         * @param {Boolean} enable 是否显示遮罩
         * @param {Boolean} modal 是否显示全局遮罩，true表示盖住这个页面，false表示只盖住区域下元素
         * */
        modal: function(enable, modal){
            var me =this
                , opt = me.options;
            if(modal){
                me.dialog.uuiModal({
                    enable: enable,    
                    'z-index': me.zIndex,
                    container: document.body,
                    opacity: opt.opacity
                }); 
            } else {
                me.dialog.uuiModal({
                    opacity: opt.opacity,
                    container: me.dialog[0],
                    enable: enable, 
                    'z-index': -1
                }); 
            }
        },
        /**
         * 计算z-index
         *
         * @method getIndex
         * */
        getIndex: function() {
            var me = this;
            // 多个dialog，并且当前需要显示的dialog的z-index不是最大
            (uuiDialog.count > 1 && me.zIndex != uuiDialog.maxIndex) && (uuiDialog.maxIndex += 1);
            me.zIndex = uuiDialog.maxIndex;
        },
        /**
         * 展示dialog，并提升其z-index
         *
         * @method show 
         * */
        show: function() {
            var me = this
                , opt = me.options
                , css
                , offset;
            if(!me.dialog){
                me.init();
            }
            me.getIndex();
            css = {
               'z-index': me.zIndex,
               display: 'block' 
            };
            me.getStyle(css, me, opt);
            me.dialog.css(css);
            me.modal(opt.enable, opt.modal);
            me.drag();
            me.isshown = 1;
            opt.dialogShow && opt.dialogShow(me);
        },
        /**
         * 计算css
         *
         * @method getStyle
         * @param {Object} css css对象
         * */
        getStyle: function(css, me, opt) {
            offset = $.UUIBase.offset(me.dialog);
            if(opt.left) {
                css.left = opt.left + 'px';    
            // 未展示的时候update，再打开，如果未配置left，top，默认让dialog居中
            } else if(!me.isshown) {
                css.left = '50%';
                css['margin-left'] = -(opt.width || offset.width) / 2 + 'px';    
            }
            if(opt.top) {
                css.top = opt.top + 'px';     
            } else if(!me.isshown) {
                css.top = '50%';
                css['margin-top'] = -(opt.height || offset.height) / 2 + 'px';
            }
            opt.height && (css.height = opt.height + 'px');
            opt.width && (css.width = opt.width + 'px');
        },
        /**
         * 隐藏dialog
         *
         * @method hide
         * */
        hide: function(fromConfirm) {
            var me = this
                , opt = me.options;
            me.isshown = 0;
            me.dialog.hide();
            me.modal(0, opt.modal);
            opt.dialogClose && opt.dialogClose(me, fromConfirm);
        },
        /*
         * 实例内部自我销毁的接口，可以不实现，如未实现，destroy操作会被定为到继承的medestroy上，但是不能销毁和dom的绑定，不建议调用，请使用$('.uuiDialog').uuiDialog({destroy: 1})

         * @method destroy
         * @param {Object} options 参数配置
         * @example $('.uuiDialog').uuiDialog().excUUICMD('destroy');
         * */
        destroy: function(options) {
            // 组件自有的特殊的自我销毁逻辑
            // 销毁拖动
            $('#uuiDialog-' + this.guid).uuiDrag({destroy: 1});
            // 销毁遮罩
            $('#uuiDialog-' + this.guid).uuiModal({destroy: 1});
            // 销毁元素
            $('#uuiDialog-' + this.guid).remove();
            // dialog计数器-1
            uuiDialog.count -= 1;
        }
    };
    $.UUIBase.create('uuiDialog', uuiDialog);
    // 创建css
    $($.UUIBase.init);
})(jQuery);
