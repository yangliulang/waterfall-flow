/**
*瀑布流插件
*本插件局域JQ
*在每次数据初始化前必须在服务器端设置好图片区域的宽高，也就是说在图片的外包装DIV上按照比例设置上宽高属性
*才能顺畅的运行在各个浏览器(因为图片在没有加载完毕前是没有宽高的)
*name:杨永
*QQ:377746756
*/
;(function($){
	//构建瀑布流构造函数
	var WaterFlowlayout=function(iTarget,loading,settings) {
		//保存自身
		var _this_=this;
		//初始配置参数
		this.opts={
				  colSize:5
				  };
		//如果配置了参数就扩展
		settings&&$.extend(this.opts,settings);

		//保存瀑布流容器、初始出现在容器里面的盒子、其中一个盒子的宽度
		this.insertBox=iTarget;
		this.insertBoxW=this.insertBox.width();
		this.itemBoxs=this.insertBox.find(".item-box");
		this.colW=this.itemBoxs.eq(0).outerWidth();
		//保存钩子loading加载状态
		this.loading=loading;
		this.isLoad=true;
		this.winHeight=$(window).height();
		this.scrollTop=$(document.documentElement).offset().top||window.pageYOffset;
		this.timer=null;
		//初始化一下
		this.init();
		//绑定窗口事件
		$(window).scroll(function(){
			_this_.scrollTop=$(document).scrollTop();
			_this_.isLoadingStatus();
		}).resize(function(){
			_this_.winHeight=$(window).height();
			_this_.isLoadingStatus();
		});
	};
	WaterFlowlayout.prototype={
		isLoadingStatus:function(){//判断loading是否出现在视口中
			var self=this;
			window.clearTimeout(self.timer);
			self.timer=window.setTimeout(function(){
				if(self.isLoad){
					if(self.loading.offset().top<(self.winHeight+self.scrollTop)){
						self.isLoad=false;
						self.loading.css("visibility","visible");
						self.opts.callBack&&self.opts.callBack();
					}else{
						self.loading.css("visibility","hidden");
					};
				};
			},300);
		},
		reloadView:function(dataList){//刷新新添加进来的元素
			var self=this;
			//创建一组数据到里面
			self.createItems(dataList);	
			//设置下容器的宽高
			self.setInsertBoxHeight(self.colsArr);
			//渲染完成后可以加载
			self.isLoad=true;
			self.loading.css("visibility","hidden");
		},
		createItems:function(dataList){
			var self=this;
				self.createArr=[];
		   /*<div class="item-box"><div class="pic"><img src="images/10.jpg"></div></div>*/
			$(dataList).each(function(i, elem) {
				var itemBox=$('<div class="item-box" style="display:none;">');
					itemBox.html('<div class="pic" style="width:'+elem.width+'px;height:'+elem.height+'px"><img src="'+elem.src+'"></div>');
				self.createArr.push(itemBox);
				self.insertBox.append(itemBox);
            });
			//设置位置
			$(self.createArr).each(function(i,elem){
				elem.fadeIn();
				self.setOtherPos(self.colsArr,elem);
			});
		},
		init:function(){//设置容器的宽度、居中
			var self=this;
			//记录一下几列
			this.colSize=Math.floor(this.insertBoxW/this.colW);
			//设置一个数组记录
			this.colsArr=[];
			
			//将前8个元素高度插入到数组中
			this.itemBoxs.each(function(i,elem){
				if(i<self.colSize){//添加到数组中
					self.colsArr.push($(elem).outerHeight());
					$(elem).css({left:i*self.colW,top:0});
				}else{
					//设置剩余的元素位置
					self.setOtherPos(self.colsArr,$(elem));
				};
			});
			//设置下容器的宽高
			self.setInsertBoxHeight(self.colsArr);
			self.insertBox.width(self.colW*self.colSize);
		},
		setOtherPos:function(colArr,curElem){
			//获取最小的值
			var minV=Math.min.apply(null,colArr);
			var index=this.getIndex(colArr,minV);
			curElem.css({
						top:minV,
						left:index*this.colW
						});
			//重置一下原来的值
			colArr[index]+=curElem.outerHeight();
		},
		getIndex:function(arr,val){//匹配数组中最小的值
			for(var i=0;i<arr.length;i++){
				if(arr[i]==val){return i;break;};
			};	
		},
		setInsertBoxHeight:function(arr){
			//设置一下容器的高度
			this.insertBox.height(Math.max.apply(null,arr));
		}
	};
	//注册到全局对象上
	window.WaterFlowlayout=WaterFlowlayout;
})(jQuery);

