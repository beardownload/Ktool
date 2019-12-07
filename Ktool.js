(function(){
  //日期转换扩展
  Date.prototype.Format = function (fmt) { //author: meizz 
    var cNumber=["日","一","二","三","四","五","六"];
    var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒
      'w+': cNumber[this.getUTCDay()], //星期
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }


  var Ktool = {
    //检测数组中是否有某一值
    karrayin:function(arr,v){
      var r = false;

      for(var i=0;i<arr.length;i++){
        if(arr[i] == v){
          r = true;
          break;
        }
      }

      return r;
    },

    /**
     * 从数组或对象中按条件检索数据返回
     * c条件 可传对象 或者字符串 x1=v1&x2=v2
    */
    karrayquery:function(arr,c,v){
      var condition = {};
      var result    = [];

      var getResult = function(list,p){
        var r = [];
        for(var i in list){
          if(list[i][p[0]] == p[1]){
            if(v == true){
              r.push(list[i]);
            }else{
              r.push(list[i][v]);
            }
          }
        }

        return r;
      }

      //条件为字符串 x1=v1&x2=v2
      if(typeof(c) == typeof("")){
        var c1 = c.split("&");

        for(var i in c1){
          var c2 = c1.split("=");
          condition[c2[0]] = c2[1] ? c2[1] : "";
        }
      }else if(typeof(c) == typeof({})){
        condition = c;
      }

      //console.log([arr,condition,c,v]);

      var start = false;

      for(var j in condition){
        var _condition = [j,condition[j]];
        result = getResult(start ? result : arr,_condition);
        start = true;
      }

      return result;
    },

    /* 
      二维数组中获取键值的一列
      k 返回 [arr[k]]
      k和v 返回{k:v} 不存在的键值对会被过滤掉
      m = true时 表示一对多 k:[v,v,v]
    */
    karrayget:function(arr,k,v,m){
      if(v){

        var result = {};
        
        for(var i in arr){

          if(v == true){
            
            if(m){
              if(!result[arr[i][k]]){result[arr[i][k]] = [];}

              result[arr[i][k]].push(arr[i]);
            }else{
              result[arr[i][k]] = arr[i];
            }
            
          }else{

            if(m){
              if(!result[arr[i][k]]){result[arr[i][k]] = [];}
              result[arr[i][k]].push(arr[i][v]);
            }else{
              if(arr[i][k]){result[arr[i][k]] = arr[i][v] ? arr[i][v] : "";}
            }
            
          }
        }

      }else{

        var result = [];

        for(var i in arr){
          result.push( arr[i][k] );
        }

      }
      
      return result;
    },

    /**
     * 解析url 为对象
    */
    kgetUrlinfo:function(hash){
      var list = hash.split("#");

      var r = {}, arr = list[0].split("?");

      if(arr.length>1){
        arr=arr[1].split("&");
      }else{
        arr=[];
      }
      
      for(var i=0;i<arr.length;i++){
        var s=arr[i].split("=");
        
        if(s.length>0 && s[0]!="" && s[1]!=""){
          if(s.length==1){
            s[1]="";
          }
          
          r[s[0]] = decodeURIComponent( s[1] );
        }
      }

      if(list.length > 1){
        r.URLHASH = kgetUrlinfo(list[1]);
      }
      
      return r;
    },

    /**
     * 删除数组中的某一项
    */
    karrayremove:function(arr,index){
      var r = [];

      for(var i=0;i<arr.length;i++){
        if(i!=index){ r.push(arr[i]); }
      }

      return r;
    },

    //base64加解签 仅针对字符串
    Base64:{_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){e=encodeURIComponent(e);var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return decodeURIComponent(t)},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}},

    //layui laytpl封装
    krender:function(dom){
      dom = typeof(dom) == typeof("") ? document.querySelector(dom) : dom;

      var render = {
        //渲染html模板
        aim:dom,

        jqaim:$(dom),

        //刷入html
        html:function(html){
          this.clear();
          this.jqaim.html(html);
        },

        //清理dom 内存
        clear:function(){
          var list = this.aim.querySelectorAll("*");

          for(var i = 0;i<list.length;i++){
            list[i].parentNode.removeChild(list[i]);
          }
        },

        //走模版
        _template:false,

        //渲染模式 1为刷入 2追加
        mode:1,

        //数据存储
        _data:false,

        rend:function(){
          if(!this._template || !this._data){
            //console.log("无数据或未设置模版");
            return false;
          }

          layui.laytpl(this._template).render(this._data,function(html){
            if(render.mode == 1){
              render.clear();
              render.jqaim.html(html);
              return false;
            }
            
            if(render.mode == 2){
              render.jqaim.append(html);
              return false;
            }
          });
        }
      };

      Object.defineProperties(render,{
        t:{
          get:function(){
            return this._template;
          },
          set:function(v){
            this._template = v;
            this.rend();
          }
        },
        d:{
          get:function(){
            return this._data;
          },
          set:function(v){
            this._data = v;
            this.rend();
          }
        }
      });

      return render;
    }
  }

  window.Ktool = Ktool;
})();