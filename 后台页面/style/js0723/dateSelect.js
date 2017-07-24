/*
 * @插件名 dateSelect
 * @作者 小白
 * @日期 2015-06-27
 * @Version 1.0
 * */


$.fn.dateSelect = function(options) {
		
	var date_config = {
		offTop:32,
		format:"yyyy-MM-dd"
	}
	
	var settings = $.extend({}, date_config, options);
	
	var obj = this;		      
	var elem_id = $(obj).attr("id");
	
	var isShow = false;
	var _shown = false;
	
	var pos=getElementPos(elem_id);
	
	var top = pos.y;
	var left = pos.x;
	
	var tz_y, tz_m, tz_d, tz_y_s, tz_y_e;
	var input_y,input_m,input_d;
	var con_min_hieght;
	
	var _dateBody = "<div class='tz-datepicker' id='datepicker_"+elem_id+"'>" +
			"<div class='year-month' id='ym"+elem_id+"'><span class='left'><</span>" +
			"<span class='month'><span>6月</span><div class='month-list' id='mlist_"+elem_id+"'><ul><li data-id='1'>一月</li><li data-id='2'>二月</li><li data-id='3'>三月</li><li data-id='4'>四月</li><li data-id='5'>五月</li><li data-id='6'>六月</li>" +
								"<li data-id='7'>七月</li><li data-id='8'>八月</li><li data-id='9'>九月</li><li data-id='10'>十月</li><li data-id='11'>十一</li><li data-id='12'>十二</li></ul></div></span>" +
			"<span class='year'><span class='span-year'>2015</span><div class='year-list' id='ylist_"+elem_id+"'><ul></ul><div class='year-change'><span class='year-left'></span><span class='year-right'></span></div></div></span><span class='right'>></span></div>" +
			"<div class='week'><ul><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul></div>" +
			"<div class='day'><ul></ul></div><div class='action'><span>清空日期</span></div>" +
			"</div>";
	
	$(_dateBody).appendTo("body");
	
    $("#datepicker_" + elem_id).css({
        "left": left,
        "top": top + settings.offTop
    });
	
    $(obj).next("span").click(function(){
    	var pos=getElementPos(elem_id);    	
    	var top = pos.y;
    	var left = pos.x;    	
    	$("#datepicker_" + elem_id).css({
    	        "left": left,
    	        "top": top + settings.offTop
    	});   	
    	
    	var d =getFocusDate($(obj).val());	
    	tz_m = d.getMonth() + 1;
    	tz_y = d.getFullYear();
    	tz_d = d.getDate();
    	
    	input_m = d.getMonth() + 1;
    	input_y = d.getFullYear();
    	input_d = d.getDate();
    	
    	$("#mlist_"+elem_id).prev("span").text(tz_m+"月");
    	$("#ylist_"+elem_id).prev("span").text(tz_y);
    	
    	dayListReload();
    	
    	hideYearmonth();						//隐藏年月选择
  	
    	if(_shown)
    	{
    		$("#datepicker_" + elem_id).slideUp("noraml",function(){
    			_shown = false;
    			$(".content").css({"height": ""});
    		});
    	}
    	else
    	{
    		$("#datepicker_" + elem_id).slideDown("noraml",function(){
    			_shown = true;;
    			
    			con_min_hieght = $(".content").height();    	    	
    	    	if(top + settings.offTop + 234 - 61 - 60> con_min_hieght)
    	    	{
    	    		 $(".content").css({"height": top + settings.offTop + 234 - 61 + 10});
    	    	}
    		});
    	}
    	
    	
    	var d =getFocusDate($(obj).val());	
    	$(obj).focus();
    	$(this).addClass("span-ex").removeClass("span-col");
    	isShow = true;

    });
    
    $(obj).click(function(){
    	
    	//点击时获取控件位置
    	var pos=getElementPos(elem_id);    	
    	var top = pos.y;
    	var left = pos.x;    	
    	$("#datepicker_" + elem_id).css({
    	        "left": left,
    	        "top": top + settings.offTop
    	});
    	
    	
    	
    	var d =getFocusDate($(this).val());	
    	
    	tz_m = d.getMonth() + 1;
    	tz_y = d.getFullYear();
    	tz_d = d.getDate();
    	
    	input_m = d.getMonth() + 1;
    	input_y = d.getFullYear();
    	input_d = d.getDate();
    	
    	$("#mlist_"+elem_id).prev("span").text(tz_m+"月");
    	$("#ylist_"+elem_id).prev("span").text(tz_y);
    	
    	dayListReload();
    	
    	hideYearmonth();						//隐藏年月选择
    	
    	if(_shown)
    	{
    		$("#datepicker_" + elem_id).slideUp("noraml",function(){
    			_shown = false;
    			$(".content").css({"height": ""});
    		});
    	}
    	else
    	{
    		$("#datepicker_" + elem_id).slideDown("noraml",function(){
    			_shown = true;
    			
    			con_min_hieght = $(".content").height();    	    	
    	    	if(top + settings.offTop + 234 - 61 - 60> con_min_hieght)
    	    	{
    	    		 $(".content").css({"height": top + settings.offTop + 234 - 61 + 10});
    	    	}
    		});
    	}    	
    	
    	isShow = true;
    });
    
    $(obj).blur(function(){
    	$(obj).next("span").addClass("span-col").removeClass("span-ex");
    });
    
    //点击月份
    $("#datepicker_" + elem_id ).on("click",".month span",function(){
    	
    	$(this).addClass("active");
    	$(this).next(".month-list").slideToggle("normal");
    	
    	$("#ylist_"+elem_id).slideUp("fast");
    	$("#ylist_"+elem_id).prev("span").removeClass("active");
    	
    });
    
    //选择月
    $("#datepicker_" + elem_id ).on("click",".month li",function(){
    	
    	tz_m = parseInt($(this).attr("data-id"));
    	
    	$("#datepicker_" + elem_id).find(".month span").text(tz_m+"月");
    	
    	dayListReload();
    	
    	$(this).addClass("active").siblings("li").removeClass("active");
    	
    	$(this).parents(".month-list").slideUp("fast");
    	$(this).parents(".month-list").prev("span").removeClass("active");
    	
    });
    
    
    //点击年
    $("#datepicker_" + elem_id ).on("click",".year .span-year",function(){
    	
    	var c_y = $(this).text();
    	
    	tz_y_s = parseInt(c_y.substring(0,3) + "0");
    	tz_y_e = tz_y_s + 9;
    	
    	$("#datepicker_" + elem_id + " .year-list li").remove();
    	for(tz_y_s; tz_y_s <= tz_y_e; tz_y_s++)
    	{
    		var y_a="";
    		(parseInt(c_y) == tz_y_s)?y_a = "active" : y_a = "";
    		$("#datepicker_" + elem_id + " .year-list ul").append("<li class='"+y_a+"'>"+tz_y_s+"</li>");
    	}	
    	
    	$(this).addClass("active");
    	$(this).next(".year-list").slideToggle("normal");
    	
    	$("#mlist_"+elem_id).slideUp("fast");
    	$("#mlist_"+elem_id).prev("span").removeClass("active");
    	
    });
    
    //选择年
    $("#datepicker_" + elem_id ).on("click",".year li",function(){
    	
    	tz_y = parseInt($(this).text());	
    	
    	$(this).parents(".year-list").prev("span").text(tz_y);
    	
    	dayListReload();
    	
    	$(this).addClass("active").siblings("li").removeClass("active");
    	
    	$(this).parents(".year-list").slideUp("fast");
    	$(this).parents(".year-list").prev("span").removeClass("active");
    	
    });
    
    //切换年
    $("#datepicker_" + elem_id ).on("click",".year-change span",function(){
    	
    	if($(this).hasClass("year-left"))
    	{
    		tz_y_s = tz_y_e - 19;
        	
    	}
    	else if($(this).hasClass("year-right"))
    	{
    		tz_y_s = tz_y_e + 1;
    	}
    	else
    	{
    		return;
    	}    	
    	
    	tz_y_e = tz_y_s + 9;
    	$("#datepicker_" + elem_id + " .year-list li").remove();
    	for(tz_y_s; tz_y_s <= tz_y_e; tz_y_s++)
    	{
    		var y_a="";
    		(input_y == tz_y_s)?y_a = "active" : y_a = "";
    		$("#datepicker_" + elem_id + " .year-list ul").append("<li class='"+y_a+"'>"+tz_y_s+"</li>");
    	}	
    	
    });
    
    
    //选择天
    $("#datepicker_" + elem_id +" .day").on("click","li",function(){	
    	
    	tz_d = parseInt($(this).attr("data-id"));	
    	
    	var tz_m_str,tz_d_str;    
    	
    	(tz_m < 10 ) ? tz_m_str = "0" + tz_m : tz_m_str = tz_m;
    	
    	(tz_d < 10 ) ? tz_d_str = "0" + tz_d : tz_d_str = tz_d;    	
    	    	
    	var date_sel = tz_y + "-" + tz_m_str + "-" + tz_d_str;
    	
    	$(obj).val(date_sel);
    	
    	$(this).parents("#datepicker_" + elem_id).slideUp("noraml",function(){
    		_shown = false;
    		$(".content").css({"height": ""});
    	});
    	
    });
	    
	//减一月
    $("#datepicker_" + elem_id+" .left").click(function(){
    	
    	tz_m = parseInt(tz_m);
    	tz_m  -- ;
    	if(tz_m == 0)
    	{
    		tz_m = 12;
    		tz_y --;
    	}    	
    	
    	$("#datepicker_" + elem_id+" .month span").text(tz_m+"月");
    	$("#datepicker_" + elem_id+" .year .span-year").text(tz_y);
    	
    	dayListReload();    	
    	
    	
    });

    //加一月
    $("#datepicker_" + elem_id+" .right").click(function(){
    	
    	tz_m = parseInt(tz_m);
    	tz_m = tz_m + 1;
    	if(tz_m == 13)
    	{
    		tz_m = 1;
    		tz_y ++;
    	}    	
    	
    	$("#datepicker_" + elem_id+" .month span").text(tz_m+"月");
    	$("#datepicker_" + elem_id+" .year .span-year").text(tz_y);
    	
    	dayListReload();    	  	
    	
    });    
    
    
    $("#datepicker_" + elem_id).on("click",".action span",function(){
    	$(obj).val("");
    	 $("#datepicker_" + elem_id).slideUp("normal");
    });
    
    
    //加载天
    function dayListReload()
    {	
    	var days = getDaysOfMonth(tz_m,tz_y);
    	
    	var dayOfWeek = new Date(tz_y+"/"+tz_m+"/01").getDay();
    	
    	$("#datepicker_" + elem_id +" .day li").remove();
    	for(var i=1;i<=days;i++)
    	{
    		var a_str ="";
    		if(tz_y == input_y && tz_m == input_m && tz_d == i)
    		{
    			a_str = "active";
    		}
    		$("#datepicker_" + elem_id +" .day ul").append("<li data-id="+i+" class='"+a_str+"'>"+i+"</li>");
    	}
    	$("#datepicker_" + elem_id +" .day li").first().css({"margin-left":30*dayOfWeek});
    }
	    
    //获取每个月多少天
    function getDaysOfMonth(m,y)
    {
    	switch(m)
    	{
    		case 1:
    			return 31;
    		case 2:
    			if(y%4 == 0)
    			{
    				return 29;
    			}
    			else
    			{
    				return 28;
    			}			
    		case 3:
    			return 31;
    		case 4:
    			return 30;
    		case 5:
    			return 31;
    		case 6:
    			return 30;
    		case 7:
    			return 31;
    		case 8:
    			return 31;
    		case 9:
    			return 30;
    		case 10:
    			return 31;
    		case 11:
    			return 30;
    		case 12:
    			return 31;
    	}
    }
    
    //隐藏年、月显示
    function hideYearmonth()
    {
    	$("#ylist_"+elem_id).slideUp("fast");
    	$("#ylist_"+elem_id).prev("span").removeClass("active");
    	
    	$("#mlist_"+elem_id).slideUp("fast");
    	$("#mlist_"+elem_id).prev("span").removeClass("active");
    }
    
    //获取选中时间
    function getFocusDate(date)
    {
    	if(date == "")
    	{
    		return new Date();
    	}	
    	else
    	{
    		try
    		{
    			return new Date(date);
    		}
    		catch (e)
    		{
    			return new Date();
    		}    		
    	}
    }
    
	    
    // 点击div外面关闭列表
    $(document).bind("click", function(event) {
       var e = event || window.event;
       var elem = e.srcElement || e.target;
       if (elem.id == "datepicker_" + elem_id || $(elem).parent()[0].id == "datepicker_" + elem_id || $(elem).parent().parent()[0].id == "datepicker_" + elem_id) {
          return;
       } 
       else if(elem.id == "ym"+elem_id || $(elem).parent()[0].id == "ym"+elem_id || $(elem).parent().parent()[0].id == "ym"+elem_id)
       {
    	   return;
       }
       else if(elem.id == "mlist_"+elem_id || $(elem).parent()[0].id == "mlist_"+elem_id || $(elem).parent().parent()[0].id == "mlist_"+elem_id)
       {
    	   return;
       }
       else if(elem.id == "ylist_"+elem_id || $(elem).parent()[0].id == "ylist_"+elem_id || $(elem).parent().parent()[0].id == "ylist_"+elem_id)
       {
    	   return;
       }
       else {
    	   if(isShow)
    	   {
    		   isShow = false;
    		   return;
    	   }
    	   $("#datepicker_" + elem_id).slideUp("normal",function(){
    		   _shown = false;
    		   $(".content").css({"height": ""});
    	   });   
       }
    });
        
    
  //返回一个元素相对于整个文档左上角的坐标
    function getElementPos(elementId) {
    	var ua = navigator.userAgent.toLowerCase();
    	var isOpera = (ua.indexOf('opera') != -1);
    	var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
    	var el = document.getElementById(elementId);
    	if (el.parentNode === null || el.style.display == 'none') {
    		return false;
    	}
    	var parent = null;
    	var pos = [];
    	var box;
    	if (el.getBoundingClientRect) //IE
    	{
    		box = el.getBoundingClientRect();
    		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    		return {
    			x : box.left + scrollLeft,
    			y : box.top + scrollTop
    		};
    	} else if (document.getBoxObjectFor) // gecko
    	{
    		box = document.getBoxObjectFor(el);
    		var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
    		var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
    		pos = [box.x - borderLeft, box.y - borderTop];
    	} else // safari & opera
    	{
    		pos = [el.offsetLeft, el.offsetTop];
    		parent = el.offsetParent;
    		if (parent != el) {
    			while (parent) {
    				pos[0] += parent.offsetLeft;
    				pos[1] += parent.offsetTop;
    				parent = parent.offsetParent;
    			}
    		}
    		if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {
    			pos[0] -= document.body.offsetLeft;
    			pos[1] -= document.body.offsetTop;
    		}
    	}
    	if (el.parentNode) {
    		parent = el.parentNode;
    	} else {
    		parent = null;
    	}
    	while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
    		pos[0] -= parent.scrollLeft;
    		pos[1] -= parent.scrollTop;
    		if (parent.parentNode) {
    			parent = parent.parentNode;
    		} else {
    			parent = null;
    		}
    	}
    	return {
    		x : pos[0],
    		y : pos[1]
    	};
    }
    
}