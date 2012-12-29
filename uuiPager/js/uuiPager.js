/**
 * 分页组件
 * @module uuiPager
 * @author sogou ufo team
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
     * @example $('.uuiPager').uuiPager({enable:0})
     * */
    // default setting
    var _options = {
        currentPage: 1,
        totalPage: 1,
        pageSize: 7,
        nextPage: "下一页",
        prePage: "上一页"
    };
    
    function uuiPager($this, options) {
        var me = this;
        // extend default setting        
        me.opt = {
            currentPage: Math.max(options.currentPage, 1),
            totalPage: Math.max(options.totalPage, 1),
            pageSize: options.pageSize || 10,
            nextPage: options.nextPage || _options.nextPage,
            prePage: options.prePage || _options.prePage,    
            target: options.target,
            prePageCss: options.prePageCss,
            nextPageCss:  options.nextPageCss,
            currentPageCss:  options.currentPageCss,
            morePageCss:  options.morePageCss,
            normalPageCss:  options.normalPageCss,
            process: options.process
        },
        // links setting 
        me.link = {
           start: "<a class=" + me.opt.prePageCss + " href='#'>" + me.opt.prePage + "</a>",
           end: "<a class=" + me.opt.nextPageCss + " href='#'>" + me.opt.nextPage + "</a>",
           first: "<a class=" + me.opt.normalPageCss + " href='#'>" + 1 + "</a>",
           last: "<a class=" + me.opt.normalPageCss + " href='#'>" + me.opt.totalPage + "</a>",
           more: "<a class=" + me.opt.morePageCss + " >" + "..." + "</a>"
        },
        me.update(me.opt);
    };
    uuiPager.prototype = {
		/**
         * @method getInterval
		 * Calculate start and end point of pagination pages depending on 
		 * currentPage, pageSize and totalPage.
		 * @returns {Array}
		 */
		getInterval: function(currentPage) {
			var ne_half = Math.floor(this.opt.pageSize/2);
			var upper_limit = this.opt.totalPage - this.opt.pageSize;
			var start = currentPage > ne_half ? Math.max( Math.min(currentPage - ne_half, upper_limit), 1 ) : 1;
			var end = currentPage > ne_half ? Math.min(Number(currentPage) + Number(ne_half), this.opt.totalPage) : Math.min(this.opt.pageSize, this.opt.totalPage);
			return {start: start, end: end};
		},
        /**
         * 返回创建的节点
		 * @param {Number} page_id 
		 * @param {Number} current_page 
		 * @returns {object} object containing the node
		 */
        createLink:function(page_id, current_page) {
			var lnk, np = this.opt.totalPage;
			page_id = page_id < 1 ? 1 : (page_id < np ? page_id : np);
			if(page_id == current_page) {
				lnk = $("<a class=" + this.opt.currentPageCss + ">" + page_id + "</a>");
			}
			else {
				lnk = $("<a class=" + this.opt.normalPageCss + ">" + page_id + "</a>").attr('href', "#");
			}
			return lnk;
		},
        /**
         * 给container添加子节点
         * @param {Object} container 
		 * @param {Number} current_page
		 * @param {Number} start 
		 * @param {Number} end 
		 */
		appendRange:function(container, current_page, start, end) {
			var i;
			if(this.opt.currentPage != 1) {
                $(this.link.start).appendTo(container);
            }			
			if(start != 1) {
				$(this.link.first).appendTo(container);	
				if(start > 2) {
					$(this.link.more).appendTo(container);	
				}
			}
			for(i = start; i<= end; i++) {
				this.createLink(i, current_page).appendTo(container);
			}
			if(Number(this.opt.totalPage) - Number(end) >= Math.floor(this.opt.pageSize/2)) {
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
		selectPage:function(currentPage) {
			$(this.opt.target).empty();
			var interval = this.getInterval(currentPage);
			this.appendRange($(this.opt.target), currentPage, interval.start, interval.end);
			that=this;
			$(this.opt.target + " a").on("click","",function() {
				var className = $(this).attr("class");
				if(className == that.opt.prePageCss) {
                    --that.opt.currentPage;
                    that.selectPage(that.opt.currentPage);
                }
				else if(className == that.opt.nextPageCss) {
                    ++that.opt.currentPage; 
                    that.selectPage(that.opt.currentPage)
                }
				else if(className == that.opt.normalPageCss) {
                    that.opt.currentPage = this.innerHTML; 
                    that.selectPage(this.innerHTML);
                }
				that.opt.process(that.opt.currentPage);
				return false;		
			});
		},
        /**
         * 更新实例实现，请通过$('.uuiPager').uuiPager({xxxx})调用
         * @method update
         * */
        update: function(options) {
            this.selectPage(options.currentPage);
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
