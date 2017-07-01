
import conf from './conf';
import wx from 'weixin-js-sdk';
import axios from 'axios';
var oproto = Object.prototype;
var serialize = oproto.toString;
var Rxports = {
	/**
	  * 封装axios，减少学习成本，参数基本跟jq ajax一致
	  * @param {String} type			请求的类型，默认post
	  * @param {String} url				请求地址
	  * @param {String} time			超时时间
	  * @param {Object} data			请求参数
	  * @param {String} dataType		预期服务器返回的数据类型，xml html json ...
	  * @param {Object} headers			自定义请求headers
	  * @param {Function} success		请求成功后，这里会有两个参数,服务器返回数据，返回状态，[data, res]
	  * @param {Function} error		发送请求前
	  * @param return
	*/
	ajax:function (opt){
		var opts = opt || {};
		if (!opts.url) {
			alert('请填写接口地址');
			return false;
		}
		axios({
			method: opts.type || 'post',
			url: opts.url,
			params: opts.data || {},
			headers: opts.headers || {
			  	'Content-Type':'application/x-www-form-urlencoded'
			},
			// `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  			// 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
			//baseURL:'http://192.168.1.48:8080',
			//baseURL:'http://192.168.1.111:8080',
			baseURL:'http://192.168.1.110',
			//baseURL:'http://'+location.host,
			timeout: opts.time || 10*100000,
			responseType: opts.dataType || 'json'
		}).then(function(res){
			if(res.status == 200 ){
				if(opts.success){
					opts.success(res.data,res);
				}
			}else{
				if (data.error) {
					opts.error(error);
				}else{
					console.log('好多人在访问呀，请重新试试[timeout]');
				}
			}
		}).catch(function (error){
			console.log(error);
			if (opts.error) {
				opts.error(error);
			}else{
				console.log('好多人在访问呀，请重新试试[timeout]');
			}
		});
	},
	/*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
	isArrayLike:function(obj) {
    if (!obj)
        return false
    var n = obj.length
    if (n === (n >>> 0)) { //检测length属性是否为非负整数
        var type = serialize.call(obj).slice(8, -1)
        if (/(?:regexp|string|function|window|global)$/i.test(type))
            return false
        if (type === "Array")
            return true
        try {
            if ({}.propertyIsEnumerable.call(obj, "length") === false) { //如果是原生对象
                return /^\s?function/.test(obj.item || obj.callee)
            }
            return true
        } catch (e) { //IE的NodeList直接抛错
            return !obj.window //IE6-8 window
        }
    }
    return false
	},
	/*遍历数组与对象,回调的第一个参数为索引或键名,第二个或元素或键值*/
    each: function (obj, fn) {
    	var That = this;
        if (obj) { //排除null, undefined
            var i = 0
            if (That.isArrayLike(obj)) {
                for (var n = obj.length; i < n; i++) {
                    if (fn(i, obj[i]) === false)
                        break
                }
            } else {
                for (i in obj) {
                    if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
                        break
                    }
                }
            }
        }
    },
	/**
	  * 获取url传过来的参数
	  * @param name 	获取的参数
	  * @param Url 		自定义获取参数的链接
	  * @param return
	*/
	getUrlQuery:function (name,Url){
	   //URL GET 获取值
　　   const reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i"),
             url = Url || location.href;
　　     if (reg.test(url))
　　     return decodeURI(RegExp.$2.replace(/\+/g, " "));
　　     return "";
	},
	//字数过滤器
	filterString : function (str,len) {
		if(str==null){
			return ' ';
		}else{
			if(str.length>len){
				return str.substring(0,len)+"...";
			}else if(!str.length){
				return '无';
			}else{
				return str;
			}
		}
	},
	baseFn:function () {
		if(location.href.indexOf("www.")!=-1){
			location.href = location.href.replace("www.","m.");
		}
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
	},
	baseDomFn:function () {
		const topBtn=document.querySelectorAll(".top_back");
		if(topBtn){
			for(let i=0;i<topBtn.length;i++){
				topBtn[i].onclick=function () {
					if(history.length>=2){
					history.back(-2);
					}else if(history.length==1&&document.referrer.length>0){
						history.back(-1);
					}else{
						location.href='/index.html';
					}
				}
			}
		}
		const closeBtn=document.querySelectorAll(".top_close");
		if(closeBtn.length){
			let ua = navigator.userAgent.toLowerCase();
			for(let i=0;i<closeBtn.length;i++){
				closeBtn[i].onclick=function () {
					console.log('test');
					if(ua.indexOf('micromessenger') != -1){
						WeixinJSBridge.call('closeWindow');
					}else{
						location.href="/";
					}
				}
			}
		};
	},
	addHandler: function (element, type, handler) {
       if (element.addEventListener) {
           element.addEventListener(type, handler, false);
       } else if (element.attachEvent) {
           element.attachEvent("on" + type, handler);
       } else {
           element["on" + type] = handler;
       }
	},
	getCookie:function (name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			return unescape(arr[2]);
		}else{
			return null;
		}
	},
	isLogin:function (type) {
		if(localStorage.meiyi_user){
			let meiyi_user=JSON.parse(localStorage.meiyi_user);
			return meiyi_user;
		}else{
			let meiyi_user={
				uid:'0',
				token:'0'
			}
			return meiyi_user;
			//alert("请登录后继续访问！")
			// if(type){
			// 	return false;
			// }
			// location.href="/login/login.html";
		}
	},
	checkPhone:function(phone,error){
	  if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(phone))){
	    return error;
	  }else{
	   	return false;
	  }
	},
	isCardNo:function(idCard,error){
	   // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
	   let reg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/;
	   if(reg.test(idCard) === false){
	        return  error;
	   }else{
	   		return false;
	   }
	},
	compare:function(val,type='desc'){ //type等于desc的时候为降序,默认是降序。
		return function (obj1,obj2) {
			const val1=obj1[val],val2=obj2[val];
			if(type=='desc'){
				return val1 <= val2?1:-1;
			}else{
				return val1 <= val2?-1:1;
			}
		}
	}
};
export default Rxports;