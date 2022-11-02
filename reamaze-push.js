ReamazePushAgent={initialize:function(){window.ReamazePushData&&(this.data=window.ReamazePushData,this.handleSubscription()),window.addEventListener("ReamazePushDataInit",function(){this.data=window.ReamazePushData,this.handleSubscription()}.bind(this))},handleSubscription:function(){var e="serviceWorker"in navigator&&"PushManager"in window,t="undefined"!=typeof Notification?Notification.permission:null;"undefined"!=typeof this.data.customVapidToken?this.data.customVapidToken&&this.saveVapidToken(this.data.customVapidToken):e&&"granted"==t&&this._nonReamazeDomain()&&this.registerServiceWorker()},saveVapidToken:function(e){httpRequest=new XMLHttpRequest,httpRequest.open("POST",this.data.baseDataUrl+"/data/push_tokens.json",!0),httpRequest.setRequestHeader("Content-Type","application/json");var t=JSON.stringify({sso:this.data.currentUser.ssoData(),push_token:{token:e,token_name:null,device_id:null,platform:"vapid",status:this.data.subscribed?"active":"paused"}});httpRequest.send(t)},applicationKey:function(){return this.urlB64ToUint8Array(this.data.publicKey?this.data.publicKey:"BB4X1o9wQvuF7xVsk1NSgSLQlw-UB-NvdYvpc67vxa9GuHOKCBhXM9QyJUiaAAtSILVblrunLrQeuMOYImJuoI8")},resetSubscription:function(n){n.pushManager.getSubscription().then(function(e){var t=this.applicationKey(),i=e?new Uint8Array(e.options.applicationServerKey):[];!e||!this.data.enabled||t.length===i.length&&t.every(function(e,t){return e===i[t]})?e||this.subscribeToken(n):e.unsubscribe().then(function(){this.subscribeToken(n)})}.bind(this))},registerServiceWorker:function(){var e=function(t){worker=null,t.installing?worker=t.installing:t.waiting?worker=t.waiting:t.active&&(worker=t.active),worker&&("activated"==worker.state?this.resetSubscription(t):worker.addEventListener("statechange",function(e){"activated"==e.target.state&&this.resetSubscription(t)}.bind(this)))}.bind(this);navigator.serviceWorker.register("/apps/reamaze/sdks/rmzServiceWorker.js").then(e)["catch"](function(){navigator.serviceWorker.register("/sdks/rmzServiceWorker.js").then(e)["catch"](function(){navigator.serviceWorker.register("/content/rmzServiceWorker.js").then(e)["catch"](function(){navigator.serviceWorker.register("/rmzServiceWorker.js").then(e)["catch"](function(){})})})}),navigator.serviceWorker.ready.then(function(e){this.subscribeToken(e)}.bind(this))},subscribeToken:function(e){e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.applicationKey()}).then(function(e){this.saveVapidToken(JSON.stringify(e.toJSON()))}.bind(this))},urlB64ToUint8Array:function(e){for(var t=(e+"=".repeat((4-e.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),i=window.atob(t),n=new Uint8Array(i.length),a=0;a<i.length;++a)n[a]=i.charCodeAt(a);return n},_nonReamazeDomain:function(){return!window.location.href.match(/reamaze\.com/)}},ReamazePushAgent.initialize();