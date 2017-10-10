(function(w){
	
	w.gesTrue = function (box,callback){
		//标识
		var flag = false;
		
		var startD = 0;
		var startC = 0;
		
		//gesturestart 手指触碰当前元素，屏幕上有两个或者两个以上的手指	
		box.addEventListener('touchstart',function(event){
			var touch = event.touches;
			if(touch.length >= 2){
				
				flag = true;
				
				//第一个角度
				startD  = getD(touch[0],touch[1]);
				//第一条线段的长度
				startC = getC(touch[0],touch[1]);
				
				//相应事件
				if(callback && callback['start']){
					callback['start']();
				};
			};
		});
		//gesturechange 手指触碰当前元素，屏幕上有两个或者两个以上的手指位置在发生移动
		box.addEventListener('touchmove',function(event){
			var touch = event.touches;
			if(touch.length >= 2){
				
				//第二个角度
				var nowD  = getD(touch[0],touch[1]);
				//旋转度
				event.rotation = nowD - startD;
				
				//第二条线段的长度
				var nowC = getC(touch[0],touch[1]);
				//缩放比
				event.scale = nowC/startC;
				
				//相应事件
				if(callback && callback['change']){
					callback['change'](event);
				};
			};
			
		});
		//gestureend  在gesturestart后, 屏幕上只剩下两根以下（不包括两根）的手指
		box.addEventListener('touchend',function(event){
			var touch = event.touches;
			if(touch.length < 2){
				if(flag){
					//相应事件
					if(callback && callback['end']){
						callback['end']();
					};
				};
				//重置
				flag = false;
			};
			
		});
		
	};
	//角度
	w.getD = function (P1,P2){
		var Y = P1.clientY - P2.clientY;
		var X = P1.clientX - P2.clientX;
		
		var deg = Math.atan2(Y,X);
		
		deg = deg * 180 / Math.PI;
		
		return deg;
	}
	//线段长度
	w.getC = function (p1,p2){
		var a = p1.clientX - p2.clientX;
		var b = p1.clientY - p2.clientY;
		var c = Math.sqrt(a*a + b*b);
		
		return c;
		
	};
	
})(window);
