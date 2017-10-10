(function(w){
	
	w.wrapDrag = function (navs,callback){
//			var navs = document.getElementById('wrap');
//			var navsList = document.getElementById('content');

			var navsList = navs.children[0];
			
			transformCss(navsList,'translateZ',1);
			
			var startY = 0;
			var eleY = 0;
			
			//加速
			var beginValue = 0;
			var beginTime = 0;
			var endValue = 0;
			var endTime = 0;
			var disValue = 0;
			var disTime = 1;
			
			//tween
			var Tween = {
				//中间状态 --- 匀速
				Linear: function(t,b,c,d){ return c*t/d + b; },
				
				//回弹
				easeOut: function(t,b,c,d,s){
		            if (s == undefined) s = 5;
		            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		      }						
			};
			
			//定时器
//			var timer = 0;
			
			//防抖动
			var startX = 0;
			var isFirst = true;
			var isY = true;
			
						
			navs.addEventListener('touchstart',function(event){
				var touch = event.changedTouches[0];
				
				//清除定时器,
				clearInterval(navs.timer);
				
				
				//清除过渡时间
				navsList.style.transition = '0s';
				
				startY = touch.clientY;
				startX = touch.clientX;
				eleY = transformCss(navsList,'translateY');
				
				//开始时间和距离
				beginValue = eleY;
				beginTime = new Date().getTime();   //毫秒
				
				//清空
				disValue = 0;
				
				if(callback&&callback['start']){
					callback['start']();
				};
				
				//重置
				isFirst = true;
				isY = true;
			});
			navs.addEventListener('touchmove',function(event){
				var touch = event.changedTouches[0];
				
				//看门狗
				if(!isY){
					return;
				};
				
				var nowY = touch.clientY;
				var disY = nowY-startY;
				var translateY = eleY+disY;
				
				var nowX =  touch.clientX;
				var disX = nowX - startX;
				
				if(isFirst){
					isFirst = false;
					if(Math.abs(disX)> Math.abs(disY)){
						isY = false;
						disY = 0;
					};
				};
				
				//范围限定    橡皮筋的拖的效果
//				var minY = document.documentElement.clientHeight-navsList.offsetHeight;
				var minY = navs.clientHeight - navsList.offsetHeight;
				
				if(translateY > 0){
//					translateY = 0;
					//translateY  留白区域
					var scale = 1 - translateY/document.documentElement.clientHeight;
					
					//scale 逐渐减小，减小速度特别快
					//translateY  逐渐增加，但是增加速度比较慢	
					//（1，0.9）（2，1.6） （3，2.1）（4，2.4）
					translateY = 0 + translateY * scale;
					//translateY 整体增加，增加速度比较慢
					
				}else if(translateY <minY ){					
					//留白区域
					var over = minY - translateY;  //over正值
					var scale = 1 - over/document.documentElement.clientHeight;
						
					//在minY基础上再加上over*scale产生的距离
					translateY = minY -over*scale;
					
				};
				
				transformCss(navsList,'translateY',translateY);
				
				//结束位置和时间
				endValue = translateY;
				endTime = new Date().getTime();   //毫秒
				
				//距离差和时间差
				disValue = endValue - beginValue;
				disTime = endTime - beginTime;
				
				if(callback&&callback['move']){
					callback['move']();
				};
			});
			//加速
			navs.addEventListener('touchend',function(){
				//速度 = 距离/时间
				var speed = disValue/disTime;
				
				//目标距离 = touchmove产生的距离+speed产生的距离
				var target = transformCss(navsList,'translateY') + speed*100;
				
//				console.log(target);
				
				//回弹效果
//				var minY = document.documentElement.clientHeight-navsList.offsetHeight;
				var minY = navs.clientHeight - navsList.offsetHeight;
				
				var type = 'Linear';
				if(target > 0){
					target = 0;
					type = 'easeOut';
				}else if(target < minY){
					target = minY;
					type = 'easeOut';
				};
				
				var time = '1';
				//即点即停，位置
				moveTween(target,type,time);
				
				if(callback&&callback['over']){
					callback['over']();
				};
				
			});
			function moveTween(target,type,time){
				//当前次数
				var t = 0;
				//初始位置
				var b = transformCss(navsList,'translateY');
				//初始位置与目标位置的距离差
				var c = target - b;
				//总次数
				var d = time/0.02;
				//var s = 5;
				
				//由于数据我需要源源不断得到每一步
				navs.timer = setInterval(function(){
					t++;
					
					if(t > d){
						//清除定时器
						clearInterval(navs.timer);
						if(callback&&callback['end']){
							callback['end']();
						};
					}else{
						//正常走
						var point = Tween[type](t,b,c,d);
//						console.log(point)
						transformCss(navsList,'translateY',point);
						
						if(callback&&callback['move']){
							callback['move']();
						};
					};
					
				},20);
								
			};
			
			
		};
		
		
	
	
})(window);
