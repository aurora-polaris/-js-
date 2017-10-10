(function(w){
	
	w.transformCss = function (node,name,value){
			//检测node 上有没有transform属性，如果没有，我需要填上去
			if(!node.transform){
				node.transform = {};
			};
			
			//arguments实参
			if(arguments.length > 2){
				//写
				//把name和value，写道node.transform = {};
				node.transform[name] = value;
				
				var result = '';
				//for...in循环，遍历对象中每一个属性名
				for (var a in node.transform) {
					switch (a){
						case 'rotate':
						case 'skew':
						case 'skewX':
						case 'skewY':
							result += a + '('+ node.transform[a] +'deg) ';
							break;
						case 'scale':
						case 'scaleX':
						case 'scaleY':
							result += a + '('+ node.transform[a] +') ';
							break;
						case 'translate':
						case 'translateX':
						case 'translateY':
						case 'translateZ':
							result += a + '('+ node.transform[a] +'px) ';
							break;
					};
				};
				
				node.style.transform = result;
				
			}else{
				//读
				if(typeof node.transform[name] == 'undefined'){
					//默认情况
					if(name == 'scale' || name == 'scaleX' || name == 'scaleY'){
						value = 1;
					}else{
						value = 0;
					};
										
				}else{
					//正常值
					value = node.transform[name];
				}
							
			
				return value;
			};
			
			
		};
	
	
})(window);

	
		