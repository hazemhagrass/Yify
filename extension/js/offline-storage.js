 var OfflineStorage = {
 	
 	saveLocal: function(key, value){
 		localStorage.setItem(key, value);
 	},
 	
 	getLocal: function(key){
 		return localStorage.getItem(key);
 	},

 	removeLocal: function(key){
 		localStorage.removeItem(key);
 	},

 	clearLocal: function(){
 		localStorage.clear();
 	},

 	saveSession: function(key, value){
 		sessionStorage.setItem(key, value);
 	},

 	getSession: function(key){
 		return sessionStorage.getItem(key);
 	},

 	removeSession: function(key){
 		sessionStorage.removeItem(key);
 	},

 	clearSession: function(){
 		sessionStorage.clear();
 	},
 }