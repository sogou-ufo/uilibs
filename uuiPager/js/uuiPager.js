/**
 * 分页组件
 * @module uuiPager
 * @author tanngliang
 **/
(function($) {
    /**
     * 实现元素的可拖动功能
     * @class $.fn.uuiPager
     * @constructor 分页
     * @param {jQuery} $this .
     * @param {Object} options 默认配置.
     * @param {Number} options.currentPage 当前页，也即初始化后所处的页面.
     * @param {Number} options.totalPage 总页数.
     * @param {Number} options.pageSize 每页显示的页码数，如pageSize为9时，初始页面能够显示1-9页和最末页的页码，其他页码需要往下翻才能看见.
     * @param {String} options.nextPage 下一页.
     * @param {String} options.prePage 上一页.
     * @param {String} options.prePageClassName 上一页的ClassName.
     * @param {String} options.nextPageClassName 下一页的ClassName.
     * @param {String} options.currentPageClassName 当前页的ClassName.
     * @param {String} options.normalPageClassName 普通页的ClassName.
     * @param {String} options.morePageClassName 省略符的ClassName.
     * @param {Function} options.pageChange 页码改变时的响应函数.
     * @example $('.uuiPager').uuiPager({enable:0}).
     * */
    // 默认配置
    var _options = {
        currentPage: 1,
        totalPage: 1,
        pageSize: 7,
        nextPage: "下一页",
        prePage: "上一页"
    };
    
    function uuiPager($this, options) {
        // 拓展默认配置        
        this.opt = {
            currentPage: Math.max(options.currentPage, 1),
            totalPage: Math.max(options.totalPage, 1),
            pageSize: options.pageSize || 10,
            nextPage: options.nextPage || _options.nextPage,
            prePage: options.prePage || _options.prePage,    
            target: options.target,
            prePageClassName: options.prePageClassName,
            nextPageClassName: options.nextPageClassName,
            currentPageClassName: options.currentPageClassName,
            morePageClassName: options.morePageClassName,
            normalPageClassName: options.normalPageClassName,
            pageChange: options.pageChange
        },
        //生成链接
        this.returnLink = function(classaName, href, innerHTML) {
            if (href == "") return  $("<span class=" + classaName + " >" + innerHTML + "</span>");
            else return  $("<a class=" + classaName + " href=" +  href +">" + innerHTML + "</a>");        
        },
        // 链接配置 
        this.link = {
           start: this.returnLink(this.opt.prePageClassName, "#", this.opt.prePage),
           end: this.returnLink(this.opt.nextPageClassName, "#", this.opt.nextPage),
           first: this.returnLink(this.opt.normalPageClassName, "#", 1),
           last: this.returnLink(this.opt.normalPageClassName, "#", this.opt.totalPage),
           more: this.returnLink(this.opt.morePageClassName, "", "...")
        },
        this.update(this.opt);
    };
    uuiPager.prototype = {
		/**
         * 计算页码的起始和结束值
         * @method getRange
		 * @returns {Array}
		 */
		getRange: function() {
			var ne_half = Math.floor(this.opt.pageSize/2);
			var upper_limit = this.opt.totalPage - this.opt.pageSize;
			var start = this.opt.currentPage > ne_half ? Math.max( Math.min(this.opt.currentPage - ne_half, upper_limit), 1 ) : 1;
			var end = this.opt.currentPage > ne_half ? Math.min(parseInt(this.opt.currentPage) + parseInt(ne_half), this.opt.totalPage) : Math.min(this.opt.pageSize, this.opt.totalPage);
			return {start: start, end: end};
		},
        /**
         * 返回创建的节点
		 * @param {Number} page_id 
		 * @returns {object} 返回创建的链接
		 */
        createLink: function(page_id) {
			var lnk, np = this.opt.totalPage, current_page = this.opt.currentPage;
			page_id = page_id < 1 ? 1 : (page_id < np ? page_id : np);
			if(page_id == current_page) {
				return this.returnLink(this.opt.currentPageClassName, "", page_id); 
			}
			else {
                return this.returnLink(this.opt.normalPageClassName, "#", page_id); 
			}
		},
        /**
         * 给container添加子节点
         * @param {Object} container 
		 * @param {Number} current_page
		 * @param {Number} start 
		 * @param {Number} end 
		 */
		appendRange:function(start, end) {
			var i, container = $(this.opt.target);
			if(this.opt.currentPage != 1) {
                $(this.link.start).appendTo(container);
            }			
			if(start != 1) {
				$(this.link.first).appendTo(container);	
				if(start > 2) {
					$(this.returnLink(this.opt.morePageClassName, "", "...")).appendTo(container);	
				}
			}
			for(i = start; i<= end; i++) {
				this.createLink(i).appendTo(container);
			}
			if(parseInt(this.opt.totalPage) - parseInt(end) >= Math.floor(this.opt.pageSize/2)) {
				$(this.link.more).appendTo(container);				
			}
			if(end != this.opt.totalPage){
				$(this.link.last).appendTo(container);
			}
			if(this.opt.currentPage != this.opt.totalPage) {
                $(this.link.end).appendTo(container);
            }				
		},
        /**
         * 翻页操作          
		 * @param {Number} currentPage
		 */
		selectPage:function() {
			$(this.opt.target).empty();
			var range = this.getRange();
			this.appendRange(range.start, range.end);
			that=this;
            //this.on(jQueryThis, eventName, query, handler)
            this.on(this.opt.target + " a", "",
            function() {
			//$(this.opt.target + " a").on("click","",function() {
				var className = $(this).attr("class");
				if(className == that.opt.prePageClassName) {
                    --that.opt.currentPage;
                    that.selectPage();
                }
				else if(className == that.opt.nextPageClassName) {
                    ++that.opt.currentPage; 
                    that.selectPage();
                }
				else if(className == that.opt.normalPageClassName) {
                    that.opt.currentPage = this.innerHTML; 
                    that.selectPage();
                }
				that.opt.pageChange(that.opt.currentPage);
				return false;		
			});
		},
        /**
         * 更新实例实现，请通过$('.uuiPager').uuiPager({xxxx})调用
         * @method update
         * */
        update: function(options) {
            this.selectPage();
        },
        /**
         * @method destroy
         * */
        destroy: function() {            
        	$(this.opt.target).empty();
        }
    };
    $.UUIBase.create('uuiPager', uuiPager);
    // 创建css
	    $($.UUIBase.init);
})(jQuery);
