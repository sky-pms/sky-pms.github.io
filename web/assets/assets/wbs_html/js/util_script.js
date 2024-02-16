	Map = function(){
		this.map = new Object();
	};   
	Map.prototype = {   
		put : function(key, value){   
			this.map[key] = value;
		},   
		get : function(key){   
			return this.map[key];
		},
		containsKey : function(key){    
			return key in this.map;
		},
		containsValue : function(value){    
			for(var prop in this.map){
				if(this.map[prop] == value) return true;
			}
			return false;
		},
		isEmpty : function(key){    
			return (this.size() == 0);
		},
		clear : function(){   
			for(var prop in this.map){
				delete this.map[prop];
			}
		},
		remove : function(key){    
			delete this.map[key];
		},
		keys : function(){   
			var keys = new Array();   
			for(var prop in this.map){   
				keys.push(prop);
			}   
			return keys;
		},
		values : function(){   
			var values = new Array();   
			for(var prop in this.map){   
				values.push(this.map[prop]);
			}   
			return values;
		},
		size : function(){
			var count = 0;
			for (var prop in this.map) {
				count++;
			}
			return count;
		}
	};

	
	//URL 파라메터 받은걸 변수로 저장
	function getUrlVars() { 
	  var params = new Map(); 
	  var parameters = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'); 
	  for(var i = 0; i < parameters.length; i++){ 
		  var param = parameters[i].split('='); 
	      var param_key = param[0];
	      var param_value = param[1];
	      params.put(param_key, param_value);
		}
		return params; 
	}

	/**
	 * 안드로이드, 아이폰 연동 호출
	 * @param param
	 * @returns
	 */
	function reqMobileInterface(param) {
		console.log("reqMobileInterface jsonObj ::: " + JSON.stringify(param));
		var message = JSON.stringify(param);

		var androidBridge = window.androidBridge;
		if(androidBridge !== undefined) {
			androidBridge.androidPostMessage(message);
		}

		var iosHandler = window.webkit;
		if(iosHandler) {
			iosHandler.messageHandlers.callbackHandler.postMessage(message);
		}
	}

	function getSessionStorageInfo(sessionKey) {
		return (sessionStorage.getItem(sessionKey) == null || sessionStorage.getItem(sessionKey) == undefined) ? "" : sessionStorage.getItem(sessionKey);
	}

	function setSessionStorageInfo(sessionKey, sessionValue) {
		if(getSessionStorageInfo(sessionKey) == sessionValue) {
			return;
		}

		sessionStorage.setItem(sessionKey, sessionValue);
	}

	function clearSessionStorageInfo(sessionKey, sessionOption) {
		if(sessionOption == "all") {
			sessionStorage.clear();
		} else {
			if(getSessionStorageInfo(sessionKey) != "") {
				sessionStorage.removeItem(sessionKey);
			}
		}
	}