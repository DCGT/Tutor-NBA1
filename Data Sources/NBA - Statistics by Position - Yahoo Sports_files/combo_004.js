
/* af-beacon.js 4e5a259 */ YUI.add("af-beacon",function(e,j){var w=300,q=999,d="[object String]",s="[object Error]",c="[object Object]",l=window,f={once:false},u={enable:true,beaconUncaughtErr:false,beaconPageLoadPerf:false,pathPrefix:"/_td_api/beacon",sampleSize:1,batch:true,batchInterval:5},D=["rid","bucket","device","site"],E=["ActionScript","Decompress fail"],m=["^resource://"],n,k,y={},r=[],o,F=false,C=e.merge(u,YUI.Env.Af&&YUI.Env.Af.settings&&YUI.Env.Af.settings.beacon,l.Af&&l.Af.config&&l.Af.config.beacon),i=e.merge(YUI.Env.Af&&YUI.Env.Af.settings&&YUI.Env.Af.settings.context,l.Af&&l.Af.context),z={os:e.UA&&e.UA.os},x;function h(H,G){return Math.floor(Math.random()*(G-H+1))+H}function p(H,J,I){if(!H||!J||!I){return false}var G=H+":"+J+":"+I;if(y[G]){return true}y[G]=true;return false}function g(G){G=parseInt(G,10);if(!isNaN(G)&&G!==x){if(G>0){k=(G===1)||(h(1,G)===1)}else{k=false}x=G}return k}g(C.sampleSize);e.Array.each(D,function(G){if(i[G]){z[G]=i[G]}});z=e.merge(z,C.meta||{});e.namespace("Af").Beacon={enable_beaconrterr:C.beaconUncaughtErr,beaconPageLoadPerf:C.beaconPageLoadPerf,enable_batching:C.batch,batch_interval:C.batchInterval,meta:z,pathPrefix:C.pathPrefix,setSampleSize:g,send:function(L,K,N){if(!L){e.log("invalid beacon path: "+L,"info",j);if(N){N("invalid beacon path")}return}var G=new Image(),I;function J(P,O){if(P&&!I){I=true;P(O)}}G.onerror=function(P){var O=P instanceof Error?P.toString():P;e.log("beacon failed:"+O,"info",j);J(N,O)};G.onload=function(){e.log("beacon success","info",j);J(N)};try{if(K&&e.Object.size(K)){K._rdn=new Date().getTime().toString().substr(7);L+="?"+e.QueryString.stringify(K)}G.src=L;if(N){setTimeout(function M(){J(N,"aborted")},4000)}return}catch(H){e.log("querystring stringify failed","info",j);J(N,"path failed")}},_enqueue:function(G,H,I){r.push({beacon:{type:G,data:H},cb:I})},_dequeueAll:function(){return r.splice(0,r.length)},_sendBatch:function(){if(r.length===0){return}function K(M,O){var N,L=M.length;for(N=0;N<L;N++){if(M[N]&&M[N].cb){M[N].cb(O)}}return}var I=this._dequeueAll(),J=this.pathPrefix+"/batch",H;try{H={method:"POST",timeout:4000,data:e.JSON.stringify(I),headers:{"Content-Type":"application/json"},on:{success:function(L){e.log("beacon batch "+L+" succeeded","info",j);K(I)},failure:function(M,L){e.log("beacon batch "+M+" failed | status: "+L.status+L.statusText+" resp: "+L.responseText,"info",j);K(I,L.status+":"+L.statusText)}}};e.io(J,H)}catch(G){e.log("json stringify failed","info",j);K(I,"path failed")}},xhr:function(J,I,K){if(!J){e.log("invalid xhr path: "+J,"info",j);if(K){K("invalid xhr path")}return}var G;I=I||{};G={method:"GET",timeout:I.timeout||2000,headers:I.headers||{},on:{success:function(M,L){e.log("xhr success "+M,"info",j);if(K){K({statusCode:L.status})}},failure:function(M,L){e.log("xhr failed "+M,"info",j);if(K){K({statusCode:L.status,statusText:L.statusText,respText:L.responseText})}}}};try{J+="?"+e.QueryString.stringify(I.query);e.io(J,G)}catch(H){e.log("querystring stringify failed","info",j);if(K){K("querystring stringify failed")}}},error:function(L,K,H,G){G=e.merge(f,G);var N=G.callback;if(!H){N&&N("missing error");return}if(!k||this._shouldIgnoreError(H)||(G.once===true&&H.code&&p("error",L,H.code))){N&&N();return}var J,I=Object.prototype.toString.call(H);if(H){switch(I){case d:J={code:q,message:H};break;case s:J={code:H.code||H.name||q,message:H.message,line:H.lineNumber||"",file:H.fileName||""};break;case c:J=H;break;default:try{J={code:q,message:e.JSON.stringify(H)}}catch(M){}}J.message=(J.message&&J.message.substring(0,w))||""}this._send("error",L,e.merge(this.meta,K,J),N)},info:function(I,H,G){G=e.merge(f,G);var J=G.callback;if(!H||!H.code){J&&J("missing data.code");return}if(!k||(G.once===true&&p("info",I,H.code))){J&&J();return}this._send("info",I,e.merge(this.meta,H),J)},perf:function(I,H,G){G=e.merge(f,G);var J=G.callback;if(!H||!H.code||!e.Object.owns(H,"time")){J&&J("missing data.code or data.time");return}if(!k||(G.once===true&&p("perf",I,H.code))){J&&J();return}this._send("perf",I,e.merge(this.meta,H),J)},ignoreError:function(G){if(G){E.push(G)}},ignoreURL:function(G){if(G){m.push(G)}},_shouldIgnoreError:function(H){if(!H){return true}var I,G,J;if(typeof H==="string"){J=H}else{J=H.message}if(!J){return false}for(I=0,G=E.length;I<G;I++){if(J.match(E[I])){return true}}return false},_shouldIgnoreURL:function(H){if(!H){return false}var I,G;for(I=0,G=m.length;I<G;I++){if(H.match(m[I])){return true}}return false},_send:function(H,K,J,L){if(!C.enable){L&&L();return}var G=this,I=this.pathPrefix;if(!I){L&&L("no beacon pathPrefix");return}if(!H){L&&L("no beacon type");return}if(!J){L&&L("no beacon data");return}if(K){J.src=K}if(G.enable_batching){G._enqueue(H,J,L)}else{G.send(I+"/"+H,J,L)}}};n=l.onerror;l.onerror=function A(I,H,G){var K=e.Af.Beacon,J;try{if(K.enable_beaconrterr&&!K._shouldIgnoreURL(H)){J={code:I.name,message:I.message,url:H&&H.substring(0,w),line:I.lineNumber||G||"",file:I.fileName||""};K.error("rt",{},J)}}catch(L){}return typeof n==="function"?n(I,H,G):false};function b(G){o=setInterval(function H(){e.Af.Beacon._sendBatch()},G*1000);return o}function v(){clearTimeout(o);e.Af.Beacon._sendBatch()}if(C.enable&&e.Af.Beacon.enable_batching){b(e.Af.Beacon.batch_interval)}function B(){if(F||!e.Af.Beacon.beaconPageLoadPerf){return}F=true;var I,H,G,M=l.performance||l.webkitPerformance||l.msPerformance||l.mozPerformance||l.Performance||{},K={},J,L;if(M&&M.timing&&M.navigation){J=M.navigation;L=M.timing;I=L.navigationStart;K={navT:J.type,navS:I,fetS:L.fetchStart-I,dluS:L.domainLookupStart-I,dluE:L.domainLookupEnd-I,conS:L.connectStart-I,conE:L.connectEnd-I,reqS:L.requestStart-I,resS:L.responseStart-I,resE:L.responseEnd-I,domL:L.domLoading-I,domI:L.domInteractive-I,domS:L.domContentLoadedEventStart-I,domE:L.domContentLoadedEventEnd-I,domC:L.domComplete-I,lodS:L.loadEventStart-I,lodE:L.loadEventEnd-I};if(L.linkNegotiationStart&&L.linkNegotiationEnd){K.lnkS=L.linkNegotiationStart-I;K.lnkE=L.linkNegotiationEnd-I}if(L.unloadEventStart){K.uldS=L.unloadEventStart-I;K.uldE=L.unloadEventEnd-I}if(L.redirectStart){K.redC=J.redirectCount;K.redS=L.redirectStart-I;K.redE=L.redirectEnd-I}if(typeof L.secureConnectionStart==="number"){K.secS=L.secureConnectionStart>0?Math.max(1,L.secureConnectionStart-I):0}}else{I=l.afPerfHeadStart;H=l.afPerfPageEnd;G=l.afPerfPageLoad;if(I&&G){K.lodE=G-I}if(I&&H){K.pagE=H-I}}if(!K.lodE){return}K.code="pageload";K.time=K.lodE;e.Af.Beacon.perf(j,K)}function t(){B();v();l.removeEventListener("unload",t,false)}function a(){l.addEventListener("load",B,false);l.addEventListener("unload",t,false)}if(l.addEventListener){l.addEventListener("pageshow",a,false);a()}else{if(l.attachEvent){l.attachEvent("onload",B);l.attachEvent("onunload",B);l.attachEvent("onunload",v)}}},"0.0.1",{requires:["json-stringify","querystring-stringify-simple","io-base"]});/*
YUI 3.16.0 (build 76f0e08)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("json-stringify",function(e,t){var n=":",r=e.config.global.JSON;e.mix(e.namespace("JSON"),{dateToString:function(e){function t(e){return e<10?"0"+e:e}return e.getUTCFullYear()+"-"+t(e.getUTCMonth()+1)+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+n+t(e.getUTCMinutes())+n+t(e.getUTCSeconds())+"Z"},stringify:function(){return r.stringify.apply(r,arguments)},charCacheThreshold:100})},"3.16.0",{requires:["yui-base"]});

/* rapid-tracking.js 913be2c */ YUI.add("media-rapid-tracking",function(b){var f="rapid-tracker:",i=f+"click",h=f+"event",g=f+"reinit",e=f+"destroy-instance";var d;var a=null;function c(j){c.superclass.constructor.apply(this,arguments)}c.NAME="RapidTracking";c.ATTRS={};b.extend(c,b.Base,{config:null,rapidConfig:null,_globalEvents:{},moduleQueue:null,beaconQueue:[],initializer:function(k){var j=this;a=a||k.instance||null;j.moduleQueue=j.moduleQueue||k.moduleQueue||[];j.config=j.config||k.config||{};j.rapidConfig=j.rapidConfig||k.rapidConfig||{};j._initEventListeners();j._initPublish();if(a){j._processQueue()}},initRapid:function(){var j=this;j._initRapid();j._processQueue()},_initRapid:function(k){var j=this;if(a&&!k){return}if(a){a.destroy()}j.updateRequestAttributes();j.rapidConfig.tracked_mods=j._getTrackedMods();if(typeof YAHOO.i13n.Rapid!=="undefined"){a=new YAHOO.i13n.Rapid(j.rapidConfig);if(YAHOO&&YAHOO.i13n){YAHOO.i13n.currentSID=j.getCurrentSID()}}else{b.log("Could not create rapid instance","error",j.name)}},getCurrentSID:function(j){return(a&&a.getCurrentSID)?a.getCurrentSID():null},_getTrackedMods:function(){var j=this,l=j.rapidConfig&&j.rapidConfig.tracked_mods||[],k=[];if(b.Lang.isArray(l)){k=j._getModulesArrayFromQueue(true);l=k.concat(l);l=b.Array.dedupe(l)}return l},_initPublish:function(){b.publish("rapid:init",{fireOnce:true}).fire()},_initEventListeners:function(){var j=this;if(!j._globalEvents[i]){b.Global.on(i,j._handleBeaconing,j,"click");j._globalEvents[i]=true}if(!j._globalEvents[h]){b.Global.on(h,j._handleBeaconing,j,"event");j._globalEvents[h]=true}if(!j._globalEvents[g]){b.Global.on(g,j._handleReInit,j);j._globalEvents[g]=true}if(!j._globalEvents[e]){b.Global.on(e,j._handleDestroyInstance,j);j._globalEvents[e]=true}},updateRequestAttributes:function(){var j=this;if(window.YMEDIA_REQ_ATTR&&typeof YMEDIA_REQ_ATTR.instr==="object"){j.rapidConfig.keys=j.rapidConfig.keys||{};j.rapidConfig.keys.authfb=YMEDIA_REQ_ATTR.instr.authfb;j.rapidConfig.keys.rid=YMEDIA_REQ_ATTR.instr.request_id}},addModules:function(j,m,l){var k=this;if(a){a.addModules(j,m,l)}else{k._addModulesQueue(j);b.log("No rapid instance available for adding modules ... adding module id ["+j+"] to queue.","info",this.name)}},refreshModule:function(n,m,l,k){var j=this;if(a){a.refreshModule(n,m,l,k)}else{b.log("No rapid instance available for refreshing module #"+n+" ... initialize RapidTracking first.","error",this.name)}},refreshModuleAsRichView:function(k,j){if(a){if(b.Lang.isFunction(a.refreshModuleAsRichView)){a.refreshModuleAsRichView(k,j)}else{this.refreshModule(k)}}else{b.log("No rapid instance available for refreshing module #"+k+" as rich view... initialize RapidTracking first.","error",this.name)}},removeModule:function(k){var j=this;if(a){a.removeModule(k)}else{b.log("No rapid instance available for removing module #"+k+" ... initialize RapidTracking first.","error",this.name)}},isModuleTracked:function(k){var j=this;if(a){return a.isModuleTracked(k)}else{b.log("No rapid instance available for checking if module #"+k+" exists ... initialize RapidTracking first.","info",this.name)}},setRapidAttribute:function(j){if(a){if("function"===typeof a.setRapidAttribute){a.setRapidAttribute(j)}else{b.log("Rapid instance has no setRapidAttribute function ... upgrade to Rapid 3.20 or later to use this.","info",this.name)}}else{b.log("No rapid instance available for setting rapid attributes ... initialize RapidTracking first.","info",this.name)}},clearRapidAttribute:function(j){if(a){if("function"===typeof a.clearRapidAttribute){a.clearRapidAttribute(j)}else{b.log("Rapid instance has no clearRapidAttribute function ... upgrade to Rapid 3.20 or later to use this.","info",this.name)}}else{b.log("No rapid instance available for clearing rapid attributes ... initialize RapidTracking first.","info",this.name)}},beaconPageview:function(k){var j=this;if(a){a.beaconPageview(k)}else{b.log("No rapid instance available for beaconing pageview","error",this.name)}},beaconClick:function(l,j,p,n,m){var k=this,o={};o.sec=l||"";o.linkname=j||"";o.pos=p&&typeof p==="number"?p:0;o.keys=typeof n==="object"?n:{};o.outcome=m||"";if(!o.sec){b.log("beaconClick called with insufficient data","error",this.name);return}if(!a){k._addBeaconQueue(o,"click");b.log("No rapid instance available for beaconing ... adding beacon click to queue.","info",this.name);return}if(o.outcome){a.beaconClick(o.sec,o.linkname,o.pos,o.keys,o.outcome)}else{a.beaconClick(o.sec,o.linkname,o.pos,o.keys)}b.log("beaconClick "+o.linkname,"info",this.name);b.log(o)},beaconLinkViews:function(l,k,j){if(a&&a.beaconLinkViews){a.beaconLinkViews(l,k,j)}},beaconEvent:function(k){var j=this;if(arguments.length>1){k={name:arguments[0],keys:arguments[1]};if(arguments.length>2&&arguments[2]){k.outcome=arguments[2]}}if(!a){j._addBeaconQueue(k,"event");b.log("No rapid instance available for beaconing ... adding beacon event to queue.","info",this.name);return}if(!k.name||!k.keys){b.log("beaconEvent called with insufficient data","error",this.name);return}k.keys=typeof k.keys==="object"?k.keys:{};if(k.outcome){a.beaconEvent(k.name,k.keys,k.outcome)}else{a.beaconEvent(k.name,k.keys)}b.log("beaconEvent "+k.name,"info",this.name);b.log(k)},updateConfig:function(j){if(a){a.reInit(j)}},_addModulesQueue:function(j){var k=this;if(j){k.moduleQueue.push(j)}},_addBeaconQueue:function(l,k){var j=this;j.beaconQueue.push({data:l,type:k})},_processQueue:function(){var j=this,m=j.beaconQueue.length,o,k,n=[],l;if(!a){b.log("No rapid instance available for queue processing ... initialize RapidTracking first.","error",j.name);return}n=j._getModulesArrayFromQueue(true);if(n.length>0){j.addModules(n)}o=j.moduleQueue.length;for(l=0;l<o;l++){if(typeof j.moduleQueue[l]==="object"){k=b.merge(k,j.moduleQueue[l])}}if(k){j.addModules(k)}for(l=0;l<m;l++){j._handleBeaconing(j.beaconQueue[l].data,j.beaconQueue[l].type)}j.moduleQueue=[];j.beaconQueue=[]},_getModulesArrayFromQueue:function(n){var k=this,o=k.moduleQueue.length,m=[],j=[],l;for(l=0;l<o;l++){if(b.Lang.isArray(k.moduleQueue[l])){m=m.concat(k.moduleQueue[l])}else{if(typeof k.moduleQueue[l]==="object"&&n){j.push(k.moduleQueue[l])}else{m.push(k.moduleQueue[l])}}}if(m.length>0&&n){k.moduleQueue=j}return m},_handleBeaconing:function(m,k){var j=this,l=m&&typeof m.data==="object"?m.data:null,n=m.mod_id?m.mod_id:"";if(!a){b.log("No rapid instance available.  Adding beacon["+k+"] to queue.","info",j.name);j._addBeaconQueue(m,k);return}if(!l){b.log("received no data for beaconing from #"+n,"warn",j.name);return}l.keys=j._addMpos(l.keys,n);if(k==="click"){j.beaconClick(l.sec,l.linkname,l.pos,l.keys,l.outcome)}else{j.beaconEvent(l)}},_handleDestroyInstance:function(){var j=this;if(a){j.rapidConfig={};a.destroy();a=null}else{b.log("No rapid instance available to destroy","error",this.name)}},_handleReInit:function(k){var j=this,l=true;j.rapidConfig=k;j._initRapid(l)},_addMpos:function(n,o){var k=this,l=k.config.selectors,m,j;if(!o||!n||n.mpos){return n}d=d||(l&&b.one(l.bd));m=d&&d.all(l.mods);j=o&&m?m.indexOf(b.one("#"+o))+1:0;if(typeof n==="object"){n.mpos=j}else{n={mpos:j}}return n}});b.namespace("Media").RapidTracking=c},"0.1",{requires:["event-custom","base","node"]});/*
YUI 3.16.0 (build 76f0e08)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("base-pluginhost",function(e,t){var n=e.Base,r=e.Plugin.Host;e.mix(n,r,!1,null,1),n.plug=r.plug,n.unplug=r.unplug},"3.16.0",{requires:["base-base","pluginhost"]});
/*
YUI 3.16.0 (build 76f0e08)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add("base-build",function(e,t){function f(e,t,n){n[e]&&(t[e]=(t[e]||[]).concat(n[e]))}function l(e,t,n){n._ATTR_CFG&&(t._ATTR_CFG_HASH=null,f.apply(null,arguments))}function c(e,t,r){n.modifyAttrs(t,r.ATTRS)}var n=e.BaseCore,r=e.Base,i=e.Lang,s="initializer",o="destructor",u=["_PLUG","_UNPLUG"],a;r._build=function(t,n,i,u,a,f){var l=r._build,c=l._ctor(n,f),h=l._cfg(n,f,i),p=l._mixCust,d=c._yuibuild.dynamic,v,m,g,y,b,w;for(v=0,m=i.length;v<m;v++)g=i[v],y=g.prototype,b=y[s],w=y[o],delete y[s],delete y[o],e.mix(c,g,!0,null,1),p(c,g,h),b&&(y[s]=b),w&&(y[o]=w),c._yuibuild.exts.push(g);return u&&e.mix(c.prototype,u,!0),a&&(e.mix(c,l._clean(a,h),!0),p(c,a,h)),c.prototype.hasImpl=l._impl,d&&(c.NAME=t,c.prototype.constructor=c,c.modifyAttrs=n.modifyAttrs),c},a=r._build,e.mix(a,{_mixCust:function(t,n,r){var s,o,u,a,f,l;r&&(s=r.aggregates,o=r.custom,u=r.statics),u&&e.mix(t,n,!0,u);if(s)for(l=0,f=s.length;l<f;l++)a=s[l],!t.hasOwnProperty(a)&&n.hasOwnProperty(a)&&(t[a]=i.isArray(n[a])?[]:{}),e.aggregate(t,n,!0,[a]);if(o)for(l in o)o.hasOwnProperty(l)&&o[l](l,t,n)},_tmpl:function(t){function n(){n.superclass.constructor.apply(this,arguments)}return e.extend(n,t),n},_impl:function(e){var t=this._getClasses(),n,r,i,s,o,u;for(n=0,r=t.length;n<r;n++){i=t[n];if(i._yuibuild){s=i._yuibuild.exts,o=s.length;for(u=0;u<o;u++)if(s[u]===e)return!0}}return!1},_ctor:function(e,t){var n=t&&!1===t.dynamic?!1:!0,r=n?a._tmpl(e):e,i=r._yuibuild;return i||(i=r._yuibuild={}),i.id=i.id||null,i.exts=i.exts||[],i.dynamic=n,r},_cfg:function(t,n,r){var i=[],s={},o=[],u,a=n&&n.aggregates,f=n&&n.custom,l=n&&n.statics,c=t,h,p;while(c&&c.prototype)u=c._buildCfg,u&&(u.aggregates&&(i=i.concat(u.aggregates)),u.custom&&e.mix(s,u.custom,!0),u.statics&&(o=o.concat(u.statics))),c=c.superclass?c.superclass.constructor:null;if(r)for(h=0,p=r.length;h<p;h++)c=r[h],u=c._buildCfg,u&&(u.aggregates&&(i=i.concat(u.aggregates)),u.custom&&e.mix(s,u.custom,!0),u.statics&&(o=o.concat(u.statics)));return a&&(i=i.concat(a)),f&&e.mix(s,n.cfgBuild,!0),l&&(o=o.concat(l)),{aggregates:i,custom:s,statics:o}},_clean:function(t,n){var r,i,s,o=e.merge(t),u=n.aggregates,a=n.custom;for(r in a)o.hasOwnProperty(r)&&delete o[r];for(i=0,s=u.length;i<s;i++)r=u[i],o.hasOwnProperty(r)&&delete o[r];return o}}),r.build=function(e,t,n,r){return a(e,t,n,null,null,r)},r.create=function(e,t,n,r,i){return a(e,t,n,r,i)},r.mix=function(e,t){return e._CACHED_CLASS_DATA&&(e._CACHED_CLASS_DATA=null),a(null,e,t,null,null,{dynamic:!1})},n._buildCfg={aggregates:u.concat(),custom:{ATTRS:c,_ATTR_CFG:l,_NON_ATTRS_CFG:f}},r._buildCfg={aggregates:u.concat(),custom:{ATTRS:c,_ATTR_CFG:l,_NON_ATTRS_CFG:f}}},"3.16.0",{requires:["base-base"]});
