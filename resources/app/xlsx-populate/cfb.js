/* cfb.js (C) 2013-present SheetJS -- http://sheetjs.com */
var Base64=function e(){var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";return{encode:function(r){var t="";var i=0,n=0,a=0,f=0,s=0,h=0,l=0;for(var o=0;o<r.length;){i=r.charCodeAt(o++);f=i>>2;n=r.charCodeAt(o++);s=(i&3)<<4|n>>4;a=r.charCodeAt(o++);h=(n&15)<<2|a>>6;l=a&63;if(isNaN(n)){h=l=64}else if(isNaN(a)){l=64}t+=e.charAt(f)+e.charAt(s)+e.charAt(h)+e.charAt(l)}return t},decode:function r(t){var i="";var n=0,a=0,f=0,s=0,h=0,l=0,o=0;t=t.replace(/[^\w\+\/\=]/g,"");for(var u=0;u<t.length;){s=e.indexOf(t.charAt(u++));h=e.indexOf(t.charAt(u++));n=s<<2|h>>4;i+=String.fromCharCode(n);l=e.indexOf(t.charAt(u++));a=(h&15)<<4|l>>2;if(l!==64){i+=String.fromCharCode(a)}o=e.indexOf(t.charAt(u++));f=(l&3)<<6|o;if(o!==64){i+=String.fromCharCode(f)}}return i}}}();var has_buf=typeof Buffer!=="undefined"&&typeof process!=="undefined"&&typeof process.versions!=="undefined"&&process.versions.node;var Buffer_from=function(){};if(typeof Buffer!=="undefined"){var nbfs=!Buffer.from;if(!nbfs)try{Buffer.from("foo","utf8")}catch(e){nbfs=true}Buffer_from=nbfs?function(e,r){return r?new Buffer(e,r):new Buffer(e)}:Buffer.from.bind(Buffer);if(!Buffer.alloc)Buffer.alloc=function(e){return new Buffer(e)};if(!Buffer.allocUnsafe)Buffer.allocUnsafe=function(e){return new Buffer(e)}}function new_raw_buf(e){return has_buf?Buffer.alloc(e):new Array(e)}function new_unsafe_buf(e){return has_buf?Buffer.allocUnsafe(e):new Array(e)}var s2a=function r(e){if(has_buf)return Buffer_from(e,"binary");return e.split("").map(function(e){return e.charCodeAt(0)&255})};var chr0=/\u0000/g,chr1=/[\u0001-\u0006]/g;var __toBuffer=function(e){var r=[];for(var t=0;t<e[0].length;++t){r.push.apply(r,e[0][t])}return r};var ___toBuffer=__toBuffer;var __utf16le=function(e,r,t){var i=[];for(var n=r;n<t;n+=2)i.push(String.fromCharCode(__readUInt16LE(e,n)));return i.join("").replace(chr0,"")};var ___utf16le=__utf16le;var __hexlify=function(e,r,t){var i=[];for(var n=r;n<r+t;++n)i.push(("0"+e[n].toString(16)).slice(-2));return i.join("")};var ___hexlify=__hexlify;var __bconcat=function(e){if(Array.isArray(e[0]))return[].concat.apply([],e);var r=0,t=0;for(t=0;t<e.length;++t)r+=e[t].length;var i=new Uint8Array(r);for(t=0,r=0;t<e.length;r+=e[t].length,++t)i.set(e[t],r);return i};var bconcat=__bconcat;if(has_buf){__utf16le=function(e,r,t){if(!Buffer.isBuffer(e))return ___utf16le(e,r,t);return e.toString("utf16le",r,t).replace(chr0,"")};__hexlify=function(e,r,t){return Buffer.isBuffer(e)?e.toString("hex",r,r+t):___hexlify(e,r,t)};__toBuffer=function(e){return e[0].length>0&&Buffer.isBuffer(e[0][0])?Buffer.concat(e[0]):___toBuffer(e)};s2a=function(e){return Buffer_from(e,"binary")};bconcat=function(e){return Buffer.isBuffer(e[0])?Buffer.concat(e):__bconcat(e)}}var __readUInt8=function(e,r){return e[r]};var __readUInt16LE=function(e,r){return e[r+1]*(1<<8)+e[r]};var __readInt16LE=function(e,r){var t=e[r+1]*(1<<8)+e[r];return t<32768?t:(65535-t+1)*-1};var __readUInt32LE=function(e,r){return e[r+3]*(1<<24)+(e[r+2]<<16)+(e[r+1]<<8)+e[r]};var __readInt32LE=function(e,r){return(e[r+3]<<24)+(e[r+2]<<16)+(e[r+1]<<8)+e[r]};function ReadShift(e,r){var t,i,n=0;switch(e){case 1:t=__readUInt8(this,this.l);break;case 2:t=(r!=="i"?__readUInt16LE:__readInt16LE)(this,this.l);break;case 4:t=__readInt32LE(this,this.l);break;case 16:n=2;i=__hexlify(this,this.l,e);}this.l+=e;if(n===0)return t;return i}var __writeUInt32LE=function(e,r,t){e[t]=r&255;e[t+1]=r>>>8&255;e[t+2]=r>>>16&255;e[t+3]=r>>>24&255};var __writeInt32LE=function(e,r,t){e[t]=r&255;e[t+1]=r>>8&255;e[t+2]=r>>16&255;e[t+3]=r>>24&255};function WriteShift(e,r,t){var i=0,n=0;switch(t){case"hex":for(;n<e;++n){this[this.l++]=parseInt(r.slice(2*n,2*n+2),16)||0}return this;case"utf16le":var a=this.l+e;for(n=0;n<Math.min(r.length,e);++n){var f=r.charCodeAt(n);this[this.l++]=f&255;this[this.l++]=f>>8}while(this.l<a)this[this.l++]=0;return this;}switch(e){case 1:i=1;this[this.l]=r&255;break;case 2:i=2;this[this.l]=r&255;r>>>=8;this[this.l+1]=r&255;break;case 4:i=4;__writeUInt32LE(this,r,this.l);break;case-4:i=4;__writeInt32LE(this,r,this.l);break;}this.l+=i;return this}function CheckField(e,r){var t=__hexlify(this,this.l,e.length>>1);if(t!==e)throw new Error(r+"Expected "+e+" saw "+t);this.l+=e.length>>1}function prep_blob(e,r){e.l=r;e.read_shift=ReadShift;e.chk=CheckField;e.write_shift=WriteShift}function new_buf(e){var r=new_raw_buf(e);prep_blob(r,0);return r}var CRC32;(function(e){e(CRC32={})})(function(e){e.version="1.2.0";function r(){var e=0,r=new Array(256);for(var t=0;t!=256;++t){e=t;e=e&1?-306674912^e>>>1:e>>>1;e=e&1?-306674912^e>>>1:e>>>1;e=e&1?-306674912^e>>>1:e>>>1;e=e&1?-306674912^e>>>1:e>>>1;e=e&1?-306674912^e>>>1:e>>>1;e=e&1?-306674912^e>>>1:e>>>1;e=e&1?-306674912^e>>>1:e>>>1;e=e&1?-306674912^e>>>1:e>>>1;r[t]=e}return typeof Int32Array!=="undefined"?new Int32Array(r):r}var t=r();function i(e,r){var i=r^-1,n=e.length-1;for(var a=0;a<n;){i=i>>>8^t[(i^e.charCodeAt(a++))&255];i=i>>>8^t[(i^e.charCodeAt(a++))&255]}if(a===n)i=i>>>8^t[(i^e.charCodeAt(a))&255];return i^-1}function n(e,r){if(e.length>1e4)return a(e,r);var i=r^-1,n=e.length-3;for(var f=0;f<n;){i=i>>>8^t[(i^e[f++])&255];i=i>>>8^t[(i^e[f++])&255];i=i>>>8^t[(i^e[f++])&255];i=i>>>8^t[(i^e[f++])&255]}while(f<n+3)i=i>>>8^t[(i^e[f++])&255];return i^-1}function a(e,r){var i=r^-1,n=e.length-7;for(var a=0;a<n;){i=i>>>8^t[(i^e[a++])&255];i=i>>>8^t[(i^e[a++])&255];i=i>>>8^t[(i^e[a++])&255];i=i>>>8^t[(i^e[a++])&255];i=i>>>8^t[(i^e[a++])&255];i=i>>>8^t[(i^e[a++])&255];i=i>>>8^t[(i^e[a++])&255];i=i>>>8^t[(i^e[a++])&255]}while(a<n+7)i=i>>>8^t[(i^e[a++])&255];return i^-1}function f(e,r){var i=r^-1;for(var n=0,a=e.length,f,s;n<a;){f=e.charCodeAt(n++);if(f<128){i=i>>>8^t[(i^f)&255]}else if(f<2048){i=i>>>8^t[(i^(192|f>>6&31))&255];i=i>>>8^t[(i^(128|f&63))&255]}else if(f>=55296&&f<57344){f=(f&1023)+64;s=e.charCodeAt(n++)&1023;i=i>>>8^t[(i^(240|f>>8&7))&255];i=i>>>8^t[(i^(128|f>>2&63))&255];i=i>>>8^t[(i^(128|s>>6&15|(f&3)<<4))&255];i=i>>>8^t[(i^(128|s&63))&255]}else{i=i>>>8^t[(i^(224|f>>12&15))&255];i=i>>>8^t[(i^(128|f>>6&63))&255];i=i>>>8^t[(i^(128|f&63))&255]}}return i^-1}e.table=t;e.bstr=i;e.buf=n;e.str=f});var CFB=function t(){var e={};e.version="1.2.0";function r(e,r){var t=e.split("/"),i=r.split("/");for(var n=0,a=0,f=Math.min(t.length,i.length);n<f;++n){if(a=t[n].length-i[n].length)return a;if(t[n]!=i[n])return t[n]<i[n]?-1:1}return t.length-i.length}function t(e){if(e.charAt(e.length-1)=="/")return e.slice(0,-1).indexOf("/")===-1?e:t(e.slice(0,-1));var r=e.lastIndexOf("/");return r===-1?e:e.slice(0,r+1)}function i(e){if(e.charAt(e.length-1)=="/")return i(e.slice(0,-1));var r=e.lastIndexOf("/");return r===-1?e:e.slice(r+1)}function n(e,r){if(typeof r==="string")r=new Date(r);var t=r.getHours();t=t<<6|r.getMinutes();t=t<<5|r.getSeconds()>>>1;e.write_shift(2,t);var i=r.getFullYear()-1980;i=i<<4|r.getMonth()+1;i=i<<5|r.getDate();e.write_shift(2,i)}function a(e){var r=e.read_shift(2)&65535;var t=e.read_shift(2)&65535;var i=new Date;var n=t&31;t>>>=5;var a=t&15;t>>>=4;i.setMilliseconds(0);i.setFullYear(t+1980);i.setMonth(a-1);i.setDate(n);var f=r&31;r>>>=5;var s=r&63;r>>>=6;i.setHours(r);i.setMinutes(s);i.setSeconds(f<<1);return i}function f(e){prep_blob(e,0);var r={};var t=0;while(e.l<=e.length-4){var i=e.read_shift(2);var n=e.read_shift(2),a=e.l+n;var f={};switch(i){case 21589:{t=e.read_shift(1);if(t&1)f.mtime=e.read_shift(4);if(n>5){if(t&2)f.atime=e.read_shift(4);if(t&4)f.ctime=e.read_shift(4)}if(f.mtime)f.mt=new Date(f.mtime*1e3)}break;}e.l=a;r[i]=f}return r}var s;function h(){return s||(s=require("fs"))}function l(e,r){if(e[0]==80&&e[1]==75)return we(e,r);if((e[0]|32)==109&&(e[1]|32)==105)return Ie(e,r);if(e.length<512)throw new Error("CFB file size "+e.length+" < 512");var t=3;var i=512;var n=0;var a=0;var f=0;var s=0;var h=0;var l=[];var _=e.slice(0,512);prep_blob(_,0);var w=o(_);t=w[0];switch(t){case 3:i=512;break;case 4:i=4096;break;case 0:if(w[1]==0)return we(e,r);default:throw new Error("Major Version: Expected 3 or 4 saw "+t);}if(i!==512){_=e.slice(0,i);prep_blob(_,28)}var b=e.slice(0,i);u(_,t);var F=_.read_shift(4,"i");if(t===3&&F!==0)throw new Error("# Directory Sectors: Expected 0 saw "+F);_.l+=4;f=_.read_shift(4,"i");_.l+=4;_.chk("00100000","Mini Stream Cutoff Size: ");s=_.read_shift(4,"i");n=_.read_shift(4,"i");h=_.read_shift(4,"i");a=_.read_shift(4,"i");for(var y=-1,m=0;m<109;++m){y=_.read_shift(4,"i");if(y<0)break;l[m]=y}var x=c(e,i);d(h,a,x,i,l);var C=p(x,f,l,i);C[f].name="!Directory";if(n>0&&s!==B)C[s].name="!MiniFAT";C[l[0]].name="!FAT";C.fat_addrs=l;C.ssz=i;var I={},A=[],E=[],S=[];g(f,C,x,A,n,I,E,s);v(E,S,A);A.shift();var k={FileIndex:E,FullPaths:S};if(r&&r.raw)k.raw={header:b,sectors:x};return k}function o(e){if(e[e.l]==80&&e[e.l+1]==75)return[0,0];e.chk(S,"Header Signature: ");e.l+=16;var r=e.read_shift(2,"u");return[e.read_shift(2,"u"),r]}function u(e,r){var t=9;e.l+=2;switch(t=e.read_shift(2)){case 9:if(r!=3)throw new Error("Sector Shift: Expected 9 saw "+t);break;case 12:if(r!=4)throw new Error("Sector Shift: Expected 12 saw "+t);break;default:throw new Error("Sector Shift: Expected 9 or 12 saw "+t);}e.chk("0600","Mini Sector Shift: ");e.chk("000000000000","Reserved: ")}function c(e,r){var t=Math.ceil(e.length/r)-1;var i=[];for(var n=1;n<t;++n)i[n-1]=e.slice(n*r,(n+1)*r);i[t-1]=e.slice(t*r);return i}function v(e,r,t){var i=0,n=0,a=0,f=0,s=0,h=t.length;var l=[],o=[];for(;i<h;++i){l[i]=o[i]=i;r[i]=t[i]}for(;s<o.length;++s){i=o[s];n=e[i].L;a=e[i].R;f=e[i].C;if(l[i]===i){if(n!==-1&&l[n]!==n)l[i]=l[n];if(a!==-1&&l[a]!==a)l[i]=l[a]}if(f!==-1)l[f]=i;if(n!==-1&&i!=l[i]){l[n]=l[i];if(o.lastIndexOf(n)<s)o.push(n)}if(a!==-1&&i!=l[i]){l[a]=l[i];if(o.lastIndexOf(a)<s)o.push(a)}}for(i=1;i<h;++i)if(l[i]===i){if(a!==-1&&l[a]!==a)l[i]=l[a];else if(n!==-1&&l[n]!==n)l[i]=l[n]}for(i=1;i<h;++i){if(e[i].type===0)continue;s=i;if(s!=l[s])do{s=l[s];r[i]=r[s]+"/"+r[i]}while(s!==0&&-1!==l[s]&&s!=l[s]);l[i]=-1}r[0]+="/";for(i=1;i<h;++i){if(e[i].type!==2)r[i]+="/"}}function _(e,r,t){var i=e.start,n=e.size;var a=[];var f=i;while(t&&n>0&&f>=0){a.push(r.slice(f*E,f*E+E));n-=E;f=__readInt32LE(t,f*4)}if(a.length===0)return new_buf(0);return bconcat(a).slice(0,e.size)}function d(e,r,t,i,n){var a=B;if(e===B){if(r!==0)throw new Error("DIFAT chain shorter than expected")}else if(e!==-1){var f=t[e],s=(i>>>2)-1;if(!f)return;for(var h=0;h<s;++h){if((a=__readInt32LE(f,h*4))===B)break;n.push(a)}d(__readInt32LE(f,i-4),r-1,t,i,n)}}function w(e,r,t,i,n){var a=[],f=[];if(!n)n=[];var s=i-1,h=0,l=0;for(h=r;h>=0;){n[h]=true;a[a.length]=h;f.push(e[h]);var o=t[Math.floor(h*4/i)];l=h*4&s;if(i<4+l)throw new Error("FAT boundary crossed: "+h+" 4 "+i);if(!e[o])break;h=__readInt32LE(e[o],l)}return{nodes:a,data:__toBuffer([f])}}function p(e,r,t,i){var n=e.length,a=[];var f=[],s=[],h=[];var l=i-1,o=0,u=0,c=0,v=0;for(o=0;o<n;++o){s=[];c=o+r;if(c>=n)c-=n;if(f[c])continue;h=[];var _=[];for(u=c;u>=0;){_[u]=true;f[u]=true;s[s.length]=u;h.push(e[u]);var d=t[Math.floor(u*4/i)];v=u*4&l;if(i<4+v)throw new Error("FAT boundary crossed: "+u+" 4 "+i);if(!e[d])break;u=__readInt32LE(e[d],v);if(_[u])break}a[c]={nodes:s,data:__toBuffer([h])}}return a}function g(e,r,t,i,n,a,f,s){var h=0,l=i.length?2:0;var o=r[e].data;var u=0,c=0,v;for(;u<o.length;u+=128){var d=o.slice(u,u+128);prep_blob(d,64);c=d.read_shift(2);v=__utf16le(d,0,c-l);i.push(v);var p={name:v,type:d.read_shift(1),color:d.read_shift(1),L:d.read_shift(4,"i"),R:d.read_shift(4,"i"),C:d.read_shift(4,"i"),clsid:d.read_shift(16),state:d.read_shift(4,"i"),start:0,size:0};var g=d.read_shift(2)+d.read_shift(2)+d.read_shift(2)+d.read_shift(2);if(g!==0)p.ct=b(d,d.l-8);var F=d.read_shift(2)+d.read_shift(2)+d.read_shift(2)+d.read_shift(2);if(F!==0)p.mt=b(d,d.l-8);p.start=d.read_shift(4,"i");p.size=d.read_shift(4,"i");if(p.size<0&&p.start<0){p.size=p.type=0;p.start=B;p.name=""}if(p.type===5){h=p.start;if(n>0&&h!==B)r[h].name="!StreamData"}else if(p.size>=4096){p.storage="fat";if(r[p.start]===undefined)r[p.start]=w(t,p.start,r.fat_addrs,r.ssz);r[p.start].name=p.name;p.content=r[p.start].data.slice(0,p.size)}else{p.storage="minifat";if(p.size<0)p.size=0;else if(h!==B&&p.start!==B&&r[h]){p.content=_(p,r[h].data,(r[s]||{}).data)}}if(p.content)prep_blob(p.content,0);a[v]=p;f.push(p)}}function b(e,r){return new Date((__readUInt32LE(e,r+4)/1e7*Math.pow(2,32)+__readUInt32LE(e,r)/1e7-11644473600)*1e3)}function F(e,r){h();return l(s.readFileSync(e),r)}function y(e,r){switch(r&&r.type||"base64"){case"file":return F(e,r);case"base64":return l(s2a(Base64.decode(e)),r);case"binary":return l(s2a(e),r);}return l(e,r)}function m(e,r){var t=r||{},i=t.root||"Root Entry";if(!e.FullPaths)e.FullPaths=[];if(!e.FileIndex)e.FileIndex=[];if(e.FullPaths.length!==e.FileIndex.length)throw new Error("inconsistent CFB structure");if(e.FullPaths.length===0){e.FullPaths[0]=i+"/";e.FileIndex[0]={name:i,type:5}}if(t.CLSID)e.FileIndex[0].clsid=t.CLSID;x(e)}function x(e){var r="Sh33tJ5";if(CFB.find(e,"/"+r))return;var t=new_buf(4);t[0]=55;t[1]=t[3]=50;t[2]=54;e.FileIndex.push({name:r,type:2,content:t,size:4,L:69,R:69,C:69});e.FullPaths.push(e.FullPaths[0]+r);C(e)}function C(e,n){m(e);var a=false,f=false;for(var s=e.FullPaths.length-1;s>=0;--s){var h=e.FileIndex[s];switch(h.type){case 0:if(f)a=true;else{e.FileIndex.pop();e.FullPaths.pop()}break;case 1:;case 2:;case 5:f=true;if(isNaN(h.R*h.L*h.C))a=true;if(h.R>-1&&h.L>-1&&h.R==h.L)a=true;break;default:a=true;break;}}if(!a&&!n)return;var l=new Date(1987,1,19),o=0;var u=[];for(s=0;s<e.FullPaths.length;++s){if(e.FileIndex[s].type===0)continue;u.push([e.FullPaths[s],e.FileIndex[s]])}for(s=0;s<u.length;++s){var c=t(u[s][0]);f=false;for(o=0;o<u.length;++o)if(u[o][0]===c)f=true;if(!f)u.push([c,{name:i(c).replace("/",""),type:1,clsid:R,ct:l,mt:l,content:null}])}u.sort(function(e,t){return r(e[0],t[0])});e.FullPaths=[];e.FileIndex=[];for(s=0;s<u.length;++s){e.FullPaths[s]=u[s][0];e.FileIndex[s]=u[s][1]}for(s=0;s<u.length;++s){var v=e.FileIndex[s];var _=e.FullPaths[s];v.name=i(_).replace("/","");v.L=v.R=v.C=-(v.color=1);v.size=v.content?v.content.length:0;v.start=0;v.clsid=v.clsid||R;if(s===0){v.C=u.length>1?1:-1;v.size=0;v.type=5}else if(_.slice(-1)=="/"){for(o=s+1;o<u.length;++o)if(t(e.FullPaths[o])==_)break;v.C=o>=u.length?-1:o;for(o=s+1;o<u.length;++o)if(t(e.FullPaths[o])==t(_))break;v.R=o>=u.length?-1:o;v.type=1}else{if(t(e.FullPaths[s+1]||"")==t(_))v.R=s+1;v.type=2}}}function I(e,r){var t=r||{};if(t.fileType=="mad")return Ae(e,t);C(e);switch(t.fileType){case"zip":return ge(e,t);}var i=function(e){var r=0,t=0;for(var i=0;i<e.FileIndex.length;++i){var n=e.FileIndex[i];if(!n.content)continue;var a=n.content.length;if(a>0){if(a<4096)r+=a+63>>6;else t+=a+511>>9}}var f=e.FullPaths.length+3>>2;var s=r+7>>3;var h=r+127>>7;var l=s+t+f+h;var o=l+127>>7;var u=o<=109?0:Math.ceil((o-109)/127);while(l+o+u+127>>7>o)u=++o<=109?0:Math.ceil((o-109)/127);var c=[1,u,o,h,f,t,r,0];e.FileIndex[0].size=r<<6;c[7]=(e.FileIndex[0].start=c[0]+c[1]+c[2]+c[3]+c[4]+c[5])+(c[6]+7>>3);return c}(e);var n=new_buf(i[7]<<9);var a=0,f=0;{for(a=0;a<8;++a)n.write_shift(1,k[a]);for(a=0;a<8;++a)n.write_shift(2,0);n.write_shift(2,62);n.write_shift(2,3);n.write_shift(2,65534);n.write_shift(2,9);n.write_shift(2,6);for(a=0;a<3;++a)n.write_shift(2,0);n.write_shift(4,0);n.write_shift(4,i[2]);n.write_shift(4,i[0]+i[1]+i[2]+i[3]-1);n.write_shift(4,0);n.write_shift(4,1<<12);n.write_shift(4,i[3]?i[0]+i[1]+i[2]-1:B);n.write_shift(4,i[3]);n.write_shift(-4,i[1]?i[0]-1:B);n.write_shift(4,i[1]);for(a=0;a<109;++a)n.write_shift(-4,a<i[2]?i[1]+a:-1)}if(i[1]){for(f=0;f<i[1];++f){for(;a<236+f*127;++a)n.write_shift(-4,a<i[2]?i[1]+a:-1);n.write_shift(-4,f===i[1]-1?B:f+1)}}var s=function(e){for(f+=e;a<f-1;++a)n.write_shift(-4,a+1);if(e){++a;n.write_shift(-4,B)}};f=a=0;for(f+=i[1];a<f;++a)n.write_shift(-4,L.DIFSECT);for(f+=i[2];a<f;++a)n.write_shift(-4,L.FATSECT);s(i[3]);s(i[4]);var h=0,l=0;var o=e.FileIndex[0];for(;h<e.FileIndex.length;++h){o=e.FileIndex[h];if(!o.content)continue;l=o.content.length;if(l<4096)continue;o.start=f;s(l+511>>9)}s(i[6]+7>>3);while(n.l&511)n.write_shift(-4,L.ENDOFCHAIN);f=a=0;for(h=0;h<e.FileIndex.length;++h){o=e.FileIndex[h];if(!o.content)continue;l=o.content.length;if(!l||l>=4096)continue;o.start=f;s(l+63>>6)}while(n.l&511)n.write_shift(-4,L.ENDOFCHAIN);for(a=0;a<i[4]<<2;++a){var u=e.FullPaths[a];if(!u||u.length===0){for(h=0;h<17;++h)n.write_shift(4,0);for(h=0;h<3;++h)n.write_shift(4,-1);for(h=0;h<12;++h)n.write_shift(4,0);continue}o=e.FileIndex[a];if(a===0)o.start=o.size?o.start-1:B;var c=a===0&&t.root||o.name;l=2*(c.length+1);n.write_shift(64,c,"utf16le");n.write_shift(2,l);n.write_shift(1,o.type);n.write_shift(1,o.color);n.write_shift(-4,o.L);n.write_shift(-4,o.R);n.write_shift(-4,o.C);if(!o.clsid)for(h=0;h<4;++h)n.write_shift(4,0);else n.write_shift(16,o.clsid,"hex");n.write_shift(4,o.state||0);n.write_shift(4,0);n.write_shift(4,0);n.write_shift(4,0);n.write_shift(4,0);n.write_shift(4,o.start);n.write_shift(4,o.size);n.write_shift(4,0)}for(a=1;a<e.FileIndex.length;++a){o=e.FileIndex[a];if(o.size>=4096){n.l=o.start+1<<9;for(h=0;h<o.size;++h)n.write_shift(1,o.content[h]);for(;h&511;++h)n.write_shift(1,0)}}for(a=1;a<e.FileIndex.length;++a){o=e.FileIndex[a];if(o.size>0&&o.size<4096){for(h=0;h<o.size;++h)n.write_shift(1,o.content[h]);for(;h&63;++h)n.write_shift(1,0)}}while(n.l<n.length)n.write_shift(1,0);return n}function A(e,r){var t=e.FullPaths.map(function(e){return e.toUpperCase()});var i=t.map(function(e){var r=e.split("/");return r[r.length-(e.slice(-1)=="/"?2:1)]});var n=false;if(r.charCodeAt(0)===47){n=true;r=t[0].slice(0,-1)+r}else n=r.indexOf("/")!==-1;var a=r.toUpperCase();var f=n===true?t.indexOf(a):i.indexOf(a);if(f!==-1)return e.FileIndex[f];var s=!a.match(chr1);a=a.replace(chr0,"");if(s)a=a.replace(chr1,"!");for(f=0;f<t.length;++f){if((s?t[f].replace(chr1,"!"):t[f]).replace(chr0,"")==a)return e.FileIndex[f];if((s?i[f].replace(chr1,"!"):i[f]).replace(chr0,"")==a)return e.FileIndex[f]}return null}var E=64;var B=-2;var S="d0cf11e0a1b11ae1";var k=[208,207,17,224,161,177,26,225];var R="00000000000000000000000000000000";var L={MAXREGSECT:-6,DIFSECT:-4,FATSECT:-3,ENDOFCHAIN:B,FREESECT:-1,HEADER_SIGNATURE:S,HEADER_MINOR_VERSION:"3e00",MAXREGSID:-6,NOSTREAM:-1,HEADER_CLSID:R,EntryTypes:["unknown","storage","stream","lockbytes","property","root"]};function P(e,r,t){h();var i=I(e,t);s.writeFileSync(r,i)}function U(e){var r=new Array(e.length);for(var t=0;t<e.length;++t)r[t]=String.fromCharCode(e[t]);return r.join("")}function z(e,r){var t=I(e,r);switch(r&&r.type||"buffer"){case"file":h();s.writeFileSync(r.filename,t);return t;case"binary":return typeof t=="string"?t:U(t);case"base64":return Base64.encode(typeof t=="string"?t:U(t));case"buffer":if(has_buf)return Buffer.isBuffer(t)?t:Buffer_from(t);case"array":return typeof t=="string"?s2a(t):t;}return t}var D;function M(e){try{var r=e.InflateRaw;var t=new r;t._processChunk(new Uint8Array([3,0]),t._finishFlushFlag);if(t.bytesRead)D=e;else throw new Error("zlib does not expose bytesRead")}catch(i){console.error("cannot use native zlib: "+(i.message||i))}}function O(e,r){if(!D)return _e(e,r);var t=D.InflateRaw;var i=new t;var n=i._processChunk(e.slice(e.l),i._finishFlushFlag);e.l+=i.bytesRead;return n}function T(e){return D?D.deflateRawSync(e):te(e)}var N=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];var j=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];var H=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];function $(e){var r=(e<<1|e<<11)&139536|(e<<5|e<<15)&558144;return(r>>16|r>>8|r)&255}var J=typeof Uint8Array!=="undefined";var q=J?new Uint8Array(1<<8):[];for(var G=0;G<1<<8;++G)q[G]=$(G);function V(e,r){var t=q[e&255];if(r<=8)return t>>>8-r;t=t<<8|q[e>>8&255];if(r<=16)return t>>>16-r;t=t<<8|q[e>>16&255];return t>>>24-r}function X(e,r){var t=r&7,i=r>>>3;return(e[i]|(t<=6?0:e[i+1]<<8))>>>t&3}function W(e,r){var t=r&7,i=r>>>3;return(e[i]|(t<=5?0:e[i+1]<<8))>>>t&7}function Y(e,r){var t=r&7,i=r>>>3;return(e[i]|(t<=4?0:e[i+1]<<8))>>>t&15}function Z(e,r){var t=r&7,i=r>>>3;return(e[i]|(t<=3?0:e[i+1]<<8))>>>t&31}function K(e,r){var t=r&7,i=r>>>3;return(e[i]|(t<=1?0:e[i+1]<<8))>>>t&127}function Q(e,r,t){var i=r&7,n=r>>>3,a=(1<<t)-1;var f=e[n]>>>i;if(t<8-i)return f&a;f|=e[n+1]<<8-i;if(t<16-i)return f&a;f|=e[n+2]<<16-i;if(t<24-i)return f&a;f|=e[n+3]<<24-i;return f&a}function ee(e,r){var t=e.length,i=2*t>r?2*t:r+5,n=0;if(t>=r)return e;if(has_buf){var a=new_unsafe_buf(i);if(e.copy)e.copy(a);else for(;n<e.length;++n)a[n]=e[n];return a}else if(J){var f=new Uint8Array(i);if(f.set)f.set(e);else for(;n<e.length;++n)f[n]=e[n];return f}e.length=i;return e}function re(e){var r=new Array(e);for(var t=0;t<e;++t)r[t]=0;return r}var te=function(){var e=function(){return function e(r,t){var i=0;while(i<r.length){var n=Math.min(65535,r.length-i);var a=i+n==r.length;t.write_shift(1,+a);t.write_shift(2,n);t.write_shift(2,~n&65535);while(n-- >0)t[t.l++]=r[i++]}return t.l}}();return function(r){var t=new_buf(50+Math.floor(r.length*1.1));var i=e(r,t);return t.slice(0,i)}}();function ie(e,r,t){var i=1,n=0,a=0,f=0,s=0,h=e.length;var l=J?new Uint16Array(32):re(32);for(a=0;a<32;++a)l[a]=0;for(a=h;a<t;++a)e[a]=0;h=e.length;var o=J?new Uint16Array(h):re(h);for(a=0;a<h;++a){l[n=e[a]]++;if(i<n)i=n;o[a]=0}l[0]=0;for(a=1;a<=i;++a)l[a+16]=s=s+l[a-1]<<1;for(a=0;a<h;++a){s=e[a];if(s!=0)o[a]=l[s+16]++}var u=0;for(a=0;a<h;++a){u=e[a];if(u!=0){s=V(o[a],i)>>i-u;for(f=(1<<i+4-u)-1;f>=0;--f)r[s|f<<u]=u&15|a<<4}}return i}var ne=J?new Uint16Array(512):re(512);var ae=J?new Uint16Array(32):re(32);if(!J){for(var fe=0;fe<512;++fe)ne[fe]=0;for(fe=0;fe<32;++fe)ae[fe]=0}(function(){var e=[];var r=0;for(;r<32;r++)e.push(5);ie(e,ae,32);var t=[];r=0;for(;r<=143;r++)t.push(8);for(;r<=255;r++)t.push(9);for(;r<=279;r++)t.push(7);for(;r<=287;r++)t.push(8);ie(t,ne,288)})();var se=J?new Uint16Array(32768):re(32768);var he=J?new Uint16Array(32768):re(32768);var le=J?new Uint16Array(128):re(128);var oe=1,ue=1;function ce(e,r){var t=Z(e,r)+257;r+=5;var i=Z(e,r)+1;r+=5;var n=Y(e,r)+4;r+=4;var a=0;var f=J?new Uint8Array(19):re(19);var s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];var h=1;var l=J?new Uint8Array(8):re(8);var o=J?new Uint8Array(8):re(8);var u=f.length;for(var c=0;c<n;++c){f[N[c]]=a=W(e,r);if(h<a)h=a;l[a]++;r+=3}var v=0;l[0]=0;for(c=1;c<=h;++c)o[c]=v=v+l[c-1]<<1;for(c=0;c<u;++c)if((v=f[c])!=0)s[c]=o[v]++;var _=0;for(c=0;c<u;++c){_=f[c];if(_!=0){v=q[s[c]]>>8-_;for(var d=(1<<7-_)-1;d>=0;--d)le[v|d<<_]=_&7|c<<3}}var w=[];h=1;for(;w.length<t+i;){v=le[K(e,r)];r+=v&7;switch(v>>>=3){case 16:a=3+X(e,r);r+=2;v=w[w.length-1];while(a-- >0)w.push(v);break;case 17:a=3+W(e,r);r+=3;while(a-- >0)w.push(0);break;case 18:a=11+K(e,r);r+=7;while(a-- >0)w.push(0);break;default:w.push(v);if(h<v)h=v;break;}}var p=w.slice(0,t),g=w.slice(t);for(c=t;c<286;++c)p[c]=0;for(c=i;c<30;++c)g[c]=0;oe=ie(p,se,286);ue=ie(g,he,30);return r}function ve(e,r){if(e[0]==3&&!(e[1]&3)){return[new_raw_buf(r),2]}var t=0;var i=0;var n=new_unsafe_buf(r?r:1<<18);var a=0;var f=n.length>>>0;var s=0,h=0;while((i&1)==0){i=W(e,t);t+=3;if(i>>>1==0){if(t&7)t+=8-(t&7);var l=e[t>>>3]|e[(t>>>3)+1]<<8;t+=32;if(!r&&f<a+l){n=ee(n,a+l);f=n.length}if(typeof e.copy==="function"){e.copy(n,a,t>>>3,(t>>>3)+l);a+=l;t+=8*l}else while(l-- >0){n[a++]=e[t>>>3];t+=8}continue}else if(i>>>1==1){s=9;h=5}else{t=ce(e,t);s=oe;h=ue}if(!r&&f<a+32767){n=ee(n,a+32767);f=n.length}for(;;){var o=Q(e,t,s);var u=i>>>1==1?ne[o]:se[o];t+=u&15;u>>>=4;if((u>>>8&255)===0)n[a++]=u;else if(u==256)break;else{u-=257;var c=u<8?0:u-4>>2;if(c>5)c=0;var v=a+j[u];if(c>0){v+=Q(e,t,c);t+=c}o=Q(e,t,h);u=i>>>1==1?ae[o]:he[o];t+=u&15;u>>>=4;var _=u<4?0:u-2>>1;var d=H[u];if(_>0){d+=Q(e,t,_);t+=_}if(!r&&f<v){n=ee(n,v);f=n.length}while(a<v){n[a]=n[a-d];++a}}}}return[r?n:n.slice(0,a),t+7>>>3]}function _e(e,r){var t=e.slice(e.l||0);var i=ve(t,r);e.l+=i[1];return i[0]}function de(e,r){if(e){if(typeof console!=="undefined")console.error(r)}else throw new Error(r)}function we(e,r){var t=e;prep_blob(t,0);var i=[],n=[];var a={FileIndex:i,FullPaths:n};m(a,{root:r.root});var s=t.length-4;while((t[s]!=80||t[s+1]!=75||t[s+2]!=5||t[s+3]!=6)&&s>=0)--s;t.l=s+4;t.l+=4;var h=t.read_shift(2);t.l+=6;var l=t.read_shift(4);t.l=l;for(s=0;s<h;++s){t.l+=20;var o=t.read_shift(4);var u=t.read_shift(4);var c=t.read_shift(2);var v=t.read_shift(2);var _=t.read_shift(2);t.l+=8;var d=t.read_shift(4);var w=f(t.slice(t.l+c,t.l+c+v));t.l+=c+v+_;var p=t.l;t.l=d+4;pe(t,o,u,a,w);t.l=p}return a}function pe(e,r,t,i,n){e.l+=2;var s=e.read_shift(2);var h=e.read_shift(2);var l=a(e);if(s&8257)throw new Error("Unsupported ZIP encryption");var o=e.read_shift(4);var u=e.read_shift(4);var c=e.read_shift(4);var v=e.read_shift(2);var _=e.read_shift(2);var d="";for(var w=0;w<v;++w)d+=String.fromCharCode(e[e.l++]);if(_){var p=f(e.slice(e.l,e.l+_));if((p[21589]||{}).mt)l=p[21589].mt;if(((n||{})[21589]||{}).mt)l=n[21589].mt}e.l+=_;var g=e.slice(e.l,e.l+u);switch(h){case 8:g=O(e,c);break;case 0:break;default:throw new Error("Unsupported ZIP Compression method "+h);}var b=false;if(s&8){o=e.read_shift(4);if(o==134695760){o=e.read_shift(4);b=true}u=e.read_shift(4);c=e.read_shift(4)}if(u!=r)de(b,"Bad compressed size: "+r+" != "+u);if(c!=t)de(b,"Bad uncompressed size: "+t+" != "+c);var F=CRC32.buf(g,0);if(o>>0!=F>>0)de(b,"Bad CRC32 checksum: "+o+" != "+F);Be(i,d,g,{unsafe:true,mt:l})}function ge(e,r){var t=r||{};var i=[],a=[];var f=new_buf(1);var s=t.compression?8:0,h=0;var l=false;if(l)h|=8;var o=0,u=0;var c=0,v=0;var _=e.FullPaths[0],d=_,w=e.FileIndex[0];var p=[];var g=0;for(o=1;o<e.FullPaths.length;++o){d=e.FullPaths[o].slice(_.length);w=e.FileIndex[o];if(!w.size||!w.content||d=="Sh33tJ5")continue;var b=c;var F=new_buf(d.length);for(u=0;u<d.length;++u)F.write_shift(1,d.charCodeAt(u)&127);F=F.slice(0,F.l);p[v]=CRC32.buf(w.content,0);var y=w.content;if(s==8)y=T(y);f=new_buf(30);f.write_shift(4,67324752);f.write_shift(2,20);f.write_shift(2,h);f.write_shift(2,s);if(w.mt)n(f,w.mt);else f.write_shift(4,0);f.write_shift(-4,h&8?0:p[v]);f.write_shift(4,h&8?0:y.length);f.write_shift(4,h&8?0:w.content.length);f.write_shift(2,F.length);f.write_shift(2,0);c+=f.length;i.push(f);c+=F.length;i.push(F);c+=y.length;i.push(y);if(h&8){f=new_buf(12);f.write_shift(-4,p[v]);f.write_shift(4,y.length);f.write_shift(4,w.content.length);c+=f.l;i.push(f)}f=new_buf(46);f.write_shift(4,33639248);f.write_shift(2,0);f.write_shift(2,20);f.write_shift(2,h);f.write_shift(2,s);f.write_shift(4,0);f.write_shift(-4,p[v]);f.write_shift(4,y.length);f.write_shift(4,w.content.length);f.write_shift(2,F.length);f.write_shift(2,0);f.write_shift(2,0);f.write_shift(2,0);f.write_shift(2,0);f.write_shift(4,0);f.write_shift(4,b);g+=f.l;a.push(f);g+=F.length;a.push(F);++v}f=new_buf(22);f.write_shift(4,101010256);f.write_shift(2,0);f.write_shift(2,0);f.write_shift(2,v);f.write_shift(2,v);f.write_shift(4,g);f.write_shift(4,c);f.write_shift(2,0);return bconcat([bconcat(i),bconcat(a),f])}var be={htm:"text/html",xml:"text/xml",gif:"image/gif",jpg:"image/jpeg",png:"image/png",mso:"application/x-mso",thmx:"application/vnd.ms-officetheme",sh33tj5:"application/octet-stream"};function Fe(e,r){if(e.ctype)return e.ctype;var t=e.name||"",i=t.match(/\.([^\.]+)$/);if(i&&be[i[1]])return be[i[1]];if(r){i=(t=r).match(/[\.\\]([^\.\\])+$/);if(i&&be[i[1]])return be[i[1]]}return"application/octet-stream"}function ye(e){var r=Base64.encode(e);var t=[];for(var i=0;i<r.length;i+=76)t.push(r.slice(i,i+76));return t.join("\r\n")+"\r\n"}function me(e){var r=e.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF=]/g,function(e){var r=e.charCodeAt(0).toString(16).toUpperCase();return"="+(r.length==1?"0"+r:r)});r=r.replace(/ $/gm,"=20").replace(/\t$/gm,"=09");if(r.charAt(0)=="\n")r="=0D"+r.slice(1);r=r.replace(/\r(?!\n)/gm,"=0D").replace(/\n\n/gm,"\n=0A").replace(/([^\r\n])\n/gm,"$1=0A");var t=[],i=r.split("\r\n");for(var n=0;n<i.length;++n){var a=i[n];if(a.length==0){t.push("");continue}for(var f=0;f<a.length;){var s=76;var h=a.slice(f,f+s);if(h.charAt(s-1)=="=")s--;else if(h.charAt(s-2)=="=")s-=2;else if(h.charAt(s-3)=="=")s-=3;h=a.slice(f,f+s);f+=s;if(f<a.length)h+="=";t.push(h)}}return t.join("\r\n")}function xe(e){var r=[];for(var t=0;t<e.length;++t){var i=e[t];while(t<=e.length&&i.charAt(i.length-1)=="=")i=i.slice(0,i.length-1)+e[++t];r.push(i)}for(var n=0;n<r.length;++n)r[n]=r[n].replace(/=[0-9A-Fa-f]{2}/g,function(e){return String.fromCharCode(parseInt(e.slice(1),16))});return s2a(r.join("\r\n"))}function Ce(e,r,t){var i="",n="",a="",f;var s=0;for(;s<10;++s){var h=r[s];if(!h||h.match(/^\s*$/))break;var l=h.match(/^(.*?):\s*([^\s].*)$/);if(l)switch(l[1].toLowerCase()){case"content-location":i=l[2].trim();break;case"content-type":a=l[2].trim();break;case"content-transfer-encoding":n=l[2].trim();break;}}++s;switch(n.toLowerCase()){case"base64":f=s2a(Base64.decode(r.slice(s).join("")));break;case"quoted-printable":f=xe(r.slice(s));break;default:throw new Error("Unsupported Content-Transfer-Encoding "+n);}var o=Be(e,i.slice(t.length),f,{unsafe:true});if(a)o.ctype=a}function Ie(e,r){if(U(e.slice(0,13)).toLowerCase()!="mime-version:")throw new Error("Unsupported MAD header");var t=r&&r.root||"";var i=(has_buf&&Buffer.isBuffer(e)?e.toString("binary"):U(e)).split("\r\n");var n=0,a="";for(n=0;n<i.length;++n){a=i[n];if(!/^Content-Location:/i.test(a))continue;a=a.slice(a.indexOf("file"));if(!t)t=a.slice(0,a.lastIndexOf("/")+1);if(a.slice(0,t.length)==t)continue;while(t.length>0){t=t.slice(0,t.length-1);t=t.slice(0,t.lastIndexOf("/")+1);if(a.slice(0,t.length)==t)break}}var f=(i[1]||"").match(/boundary="(.*?)"/);if(!f)throw new Error("MAD cannot find boundary");var s="--"+(f[1]||"");var h=[],l=[];var o={FileIndex:h,FullPaths:l};m(o);var u,c=0;for(n=0;n<i.length;++n){var v=i[n];if(v!==s&&v!==s+"--")continue;if(c++)Ce(o,i.slice(u,n),t);u=n}return o}function Ae(e,r){var t=r||{};var i=t.boundary||"SheetJS";i="------="+i;var n=["MIME-Version: 1.0",'Content-Type: multipart/related; boundary="'+i.slice(2)+'"',"","",""];var a=e.FullPaths[0],f=a,s=e.FileIndex[0];for(var h=1;h<e.FullPaths.length;++h){f=e.FullPaths[h].slice(a.length);s=e.FileIndex[h];if(!s.size||!s.content||f=="Sh33tJ5")continue;f=f.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF]/g,function(e){return"_x"+e.charCodeAt(0).toString(16)+"_"}).replace(/[\u0080-\uFFFF]/g,function(e){return"_u"+e.charCodeAt(0).toString(16)+"_"});var l=s.content;var o=has_buf&&Buffer.isBuffer(l)?l.toString("binary"):U(l);var u=0,c=Math.min(1024,o.length),v=0;for(var _=0;_<=c;++_)if((v=o.charCodeAt(_))>=32&&v<128)++u;var d=u>=c*4/5;n.push(i);n.push("Content-Location: "+(t.root||"file:///C:/SheetJS/")+f);n.push("Content-Transfer-Encoding: "+(d?"quoted-printable":"base64"));n.push("Content-Type: "+Fe(s,f));n.push("");n.push(d?me(o):ye(o))}n.push(i+"--\r\n");return n.join("\r\n")}function Ee(e){var r={};m(r,e);return r}function Be(e,r,t,n){var a=n&&n.unsafe;if(!a)m(e);var f=!a&&CFB.find(e,r);if(!f){var s=e.FullPaths[0];if(r.slice(0,s.length)==s)s=r;else{if(s.slice(-1)!="/")s+="/";s=(s+r).replace("//","/")}f={name:i(r),type:2};e.FileIndex.push(f);e.FullPaths.push(s);if(!a)CFB.utils.cfb_gc(e)}f.content=t;f.size=t?t.length:0;if(n){if(n.CLSID)f.clsid=n.CLSID;if(n.mt)f.mt=n.mt;if(n.ct)f.ct=n.ct}return f}function Se(e,r){m(e);var t=CFB.find(e,r);if(t)for(var i=0;i<e.FileIndex.length;++i)if(e.FileIndex[i]==t){e.FileIndex.splice(i,1);e.FullPaths.splice(i,1);return true}return false}function ke(e,r,t){m(e);var n=CFB.find(e,r);if(n)for(var a=0;a<e.FileIndex.length;++a)if(e.FileIndex[a]==n){e.FileIndex[a].name=i(t);e.FullPaths[a]=t;return true}return false}function Re(e){C(e,true)}e.find=A;e.read=y;e.parse=l;e.write=z;e.writeFile=P;e.utils={cfb_new:Ee,cfb_add:Be,cfb_del:Se,cfb_mov:ke,cfb_gc:Re,ReadShift:ReadShift,CheckField:CheckField,prep_blob:prep_blob,bconcat:bconcat,use_zlib:M,_deflateRaw:te,_inflateRaw:_e,consts:L};return e}();if(typeof require!=="undefined"&&typeof module!=="undefined"&&typeof DO_NOT_EXPORT_CFB==="undefined"){
module.exports=CFB}