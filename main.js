if(typeof(page_onstart)=='undefined') {
    var page_onstart=[];
    var www_design='https://lleo.me/dnevnik/design/';
    var useropt={
	i: true, // для ошибки при загрузки картинок
	ani: true // animation
    };
    var wintempl_cls='pop2';
    var wintempl="<div id='{id}_body'>{s}</div><i id='{id}_close' title='Close' class='can4'></i>";
}



// Copy text to keyboard buffer
cpbuf=function(e){ if(typeof(e)=='object') e=e.innerHTML;
    var area = document.createElement('textarea');
    document.body.appendChild(area);
    area.value = e;
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    salert('Copypasted:<p><b>'+h(e)+'</b>',500);
};

function idd(id){ return (typeof(id)=='object' ? id : ( document.getElementById(id) || false ) ) }
function zabil(id,text) { if(idd(id)) { idd(id).innerHTML=text; init_tip(idd(id)); } }
function ifclass(id,l){ return in_array(l,idd(id).className.split(' ')); }
function classAdd(id,l){ var e=idd(id).className.split(' '); e.push(l); idd(id).className=e.join(' '); }
function classDel(id,l){ var i,e=idd(id).className.split(' '); for(i in e) if(e[i]==l) delete e[i]; idd(id).className=e.join(' '); }
function vzyal(id) { return idd(id)?idd(id).innerHTML:''; }
function zakryl(id) { if(!idd(id)) return; idd(id).style.display='none'; if(id!='tip') zakryl('tip'); }
function otkryl(id) { if(idd(id)) idd(id).style.display='block'; }
function tudasuda(id) { if(idd(id)&&idd(id).style.display=='none') otkryl(id); else zakryl(id); }
function dobavil(id,s,ara) { newdiv(s,ara,idd(id),'last'); }
function dobavil1(id,s,ara) { newdiv(s,ara,idd(id),'first'); }

var zindexstart=100; // начало отсчета слоев для окон
var activid=false; // id активного окна
var hid=1; // счетчик окон
var mHelps={}; // массив для окон: id:[hotkey,zindex]
var hotkey=[]; // [code,(ctrlKey,shiftKey,altKey,metaKey),func]
var hotkey_def=[]; // хоткеи главного окна
var nonav=0; // отключить навигацию и буквенные хоткеи И СИСТЕМУ ОПЕЧАТОК

//========================================================
if(typeof(hotkey_default)!='function') hotkey_default=function(){
    hotkey=[];
    setkey('Escape','',function(e){ clean(isHelps())},true,1); // закрыть последнее окно
    setkey('Enter','ctrl',function(e){if(!isHelps()) helper_go()},true,1); // если не открыто окон - окно правки
};
page_onstart.push("hotkey_default()");
//========================================================

keykeys={ctrl:8,shift:4,alt:2,meta:1};

function setkey(k,v,f,o,nav){ nav=nav?1:0; if(typeof(k)!='object') k=[k];
 for(var i=0;i<k.length;i++) {
	    setkey0(k[i],v,f,o,nav);
	    if(mHelps[activid]) mHelps[activid][0]=hotkey.slice(); else hotkey_def=hotkey.slice(); // и запомнить в массиве
 }
}

function setkey0(k,v,f,o,nav){ // повесить функцию на нажатие клавиши
    var e=0; for(var i in keykeys) if(v.indexOf(i)==0) e+=keykeys[i]; // сетка всяких шифтов-контролов
    for(var i in hotkey) if(hotkey[i][0]==k && hotkey[i][1]==e){ // если уже есть - изменить
	if(!f || f=='') delete hotkey[i]; else hotkey[i]=[k,e,f,o,nav];
	return;
    }
    if(!f || f=='') return; // если нет, и не задана функция, - просто выйти
    if(e) hotkey.push([k,e,f,o,nav]); else hotkey.unshift([k,e,f,o,nav]); // иначе - задать с конца списк или с начала
}


///////// ЭТУ ВСЮ ХУЙНЮ ПЕРЕДЕЛАТЬ БЫ
function cphash(a) {
    var b={}; for(var i in a) {
    if(typeof(a[i])!='undefined'){
    if(typeof(a[i])=='object' && typeof(a[i]['innerHTML'])!='string') b[i]=cphash(a[i]); else b[i]=a[i];}
    }
    b.push=a.push; b.unshift=a.unshift; // йобаный патч!
    return b;
}

function cpmas(a) { var b=[]; for(var i=0;i<a.length;i++){
    if(typeof(a[i])!='undefined'){
    if(typeof(a[i])=='object' && typeof(a[i]['innerHTML'])!='string') b[i]=cphash(a[i]); else b[i]=a[i];}
} return b; }

function isHelps(){ var max=0,id=false; for(var k in mHelps){ if(mHelps[k][1]>=max){max=mHelps[k][1];id=k;} } return id; }// найти верхнее окно или false

var print_r_id=0;
var print_rid={};

function printr_f(ev,e,i){ ev.stopPropagation(); print_r(print_rid[i]);
    if(e.className!='ll') { e.innerHTML="[Object]"; e.className='ll'; return; }
    e.className=''; e.style.marginLeft='30px'; e.innerHTML=print_r(print_rid[i],0,1)+'\n';
}

function print_r(a,n,skoka) {
 if(skoka===0) return '@'; if(!skoka) skoka=10;
    var s='',t='',v,tp,vl; if(!n)n=0; for(j=0;j<n*10;j++) t+=' ';
    if(typeof(a)!='object') return a;

    for(var j in a){
	if(typeof(j)=='undefined') { s='\nundefined'+s; continue; }
	tp=typeof(a[j]); v=a[j];
	if(tp=='function') vl="<div style='color:orange;display:inline-table'>function</div>";

	else if(tp=='number' || tp=='boolean') vl="<span style='color:lightgreen'>"+v+'</span>';
	else if(tp=='undefined') vl="<span style='color:#ccc'>"+tp+"</span>";
	else if(tp=='string') vl="<div style='color:green;display:inline-table;'>"+v+'</div>';
	else if(tp=='object' && !v) vl="<span style='color:#ccc'>null</span>";
	else if(tp=='object') {
	    var z=(print_r_id++); print_rid[z]=v; // cphash(v); // {}; Object.assign(print_rid[z],v);
	    vl = "<div onclick=\"printr_f(event,this,'"+z+"')\" class='ll'>"+v+"</div>";
	}
	else vl='['+v+"] <span style='color:green'>"+typeof(v)+'</span>';
	s='\n'+t+j+' = '+vl+s;
    }
    return s;
}

function in_array(s,a){ for(var l in a) if(a[l]==s) return l; return false; }

clean=function(id) {
    if(id===null||id===undefined) return;

    if(typeof(id)=='object') {
        if(typeof(id.id)!='undefined'&&id.id!='') id=id.id; // если есть имя, то взять имя
        else { var t='tmp_'+(hid++); id.id=t; id=t; } // иначе блять присвоить
    }

    if(mHelps[id]!=undefined) { // окно было
        delete(mHelps[id]); // удалить окно
        mHelps_sort(top); // пересортировать
        if(!isHelps()) { hotkey=hotkey_def.slice(); nonav=0; } // восстановить дефаулты
    }

    if(idd(id)) {
	var clen=function(){ var s=idd(id); if(s) s.parentNode.removeChild(s); };
        if( in_array(id,['tenek','ajaxgif']) ) { zakryl(id); setTimeout(clen,40); }
        else { anim(idd(id),'izoomOut',clen); /*setTimeout(clen,2500);*/ }
    }
    zakryl('tip');
};

var JSload={};

function mHelps_sort(top) { // сортировка окон по слоям возрастания с предлежащим окном тени
    if(top=='salert') return;

    var mam=[],k=zindexstart,id=0; for(var i in mHelps) mam.push([i,mHelps[i][1]]);
    if(!mam.length){ // если нету распахнутых окошек
	clean('tenek');
	hotkey=hotkey_def.slice();
	activid=false;
	return;
    }
    mam.sort(function(i,j){return i[1]>j[1]?1:0});

    for(var i=0;i<mam.length;i++){
	id=mam[i][0];
	if(id==top || !top && (i+1)==mam.length) continue;
	mHelps[id][1]=k; idd(id).style.zIndex=k++;
    } if(top) id=top;

    if(!mHelps[id]) { clean('tenek'); return; }

    if(typeof(document.body.style.pointerEvents)=='string') {
	var T=idd('tenek'); if(!T) { newdiv('',{id:'tenek',cls:'tenek'}); T=idd('tenek'); }
	T.style.zIndex=k++;
    }

    mHelps[id][1]=k; idd(id).style.zIndex=k;
    hotkey=mHelps[id][0].slice();
    activid=id;
}

var LOADES={};
// умная подгрузка
// первый аргумент - имя файлы js или css или массив ['1.js','2.js','1.css']
// второй необязательный аргумент - фанкция, запускаемая по окончании удачной загрузке ВСЕХ перечисленных
// третий необязательный - функция при ошибке
function LOADS(u,f,err) { if(typeof(u)=='string') u=[u];
    var h,s;
    for(var i in u) { if(LOADES[u[i]]) continue;
     if(/\.css($|\?.+?$)/.test(u[i])) { s=document.createElement('link'); s.type='text/css'; s.rel='stylesheet'; s.href=u[i]; s.media='screen'; }
     else { s=document.createElement('script'); s.type='text/javascript'; s.src=u[i]; }
     s.setAttribute('orign',u[i]);
     // s.async=false;
    // s.onreadystatechange=
     if(!err) s.onerror=function(e){ idie('Not found: '+e.target.getAttribute('orign')); }; else if(typeof(err)=='function')err();
     s.onload=function(e){ var k=1,x=e.target.getAttribute('orign'); LOADES[x]=1; for(var i in u){ if(!LOADES[u[i]]){k=0;break;}} if(k && f)f(x); };
     h=document.getElementsByTagName('head').item(0);
     h.insertBefore(s,h.firstChild);
    }
    if(!s && f)f(1);
}

// создать новый <DIV class='cls' id='id'>s</div> в элементе paren (если не указан - то просто в документе)
// если указан relative - то следующим за relative
// если relative=='first'(или 0) - в начало
// если relative==['before',relative] - то перед relative
// иначе (рекомндуется писать 'last') - в конец
rootElement=false;
function mkdiv(id,s,cls,paren,relative,display){ if(idd(id)) { zabil(id,s); idd(id).className=cls; return; }
    var div=document.createElement('DIV');
    if(cls) div.className=cls;
    if(id) div.id=id;
    if(s) div.innerHTML=s;
    if(!display) div.style.display='none';
    if(!paren) paren = document.body;

    if(relative===undefined) {
	try { paren.appendChild(div); }
	catch(u) {}
    }
    else if(relative===0||relative=='first') paren.insertBefore(div,paren.firstChild);
    else if(typeof(relative)=='object' && relative[0]=='before') paren.insertBefore(div,relative[1]);
    else paren.insertBefore(div,relative.nextSibling);
    return div;
}

function newdiv(s,ara,paren,relative){ if(typeof(ara)!='object') ara={};
    var div=mkdiv(ara.id,s,(ara.cls?ara.cls:ara.class),paren,relative,1);
    if(ara.attr) for(var i in ara.attr) div.setAttribute(i,ara.attr[i]);
    return div;
}

function posdiv(id,x,y) { // позиционирование с проверкой на вылет, если аргумент '-1' - по центру экрана
    var e=idd(id),W,w,H,h,SW,SH,DW,DH;
    if(e.className=='newin') e=idd(id+'_body');
    e.style.position='absolute';
    w=e.clientWidth; h=e.clientHeight;
    e.style.display='none'; // перед измерением убрать
    W=getWinW(); H=getWinH(); SW=getScrollW(); SH=getScrollH();
    e.style.display='block';
    var es=e.currentStyle||window.getComputedStyle(e);
    var mL=1*es.marginLeft.replace(/px/,''),mR=1*es.marginRight.replace(/px/,'');
    if(x==-1) x=(W-w)/2+SW+mL-mR;
    if(y==-1) y=(H-h)/2+SH;
    DW=W-10; if(w<DW && x+w>DW) x=DW-w; if(x<0) x=0;
    if(y<0) y=0;
    if(idd(id).className!='newin') e.style.top=y+'px';
    e.style.left=(x-6)+'px';
}

function center(id) { otkryl(id); posdiv(id,-1,-1); }

function addEvent(e,evType,fn) {
    if(e.addEventListener) { e.addEventListener(evType,fn,false); return true; }
    if(e.attachEvent) { var r = e.attachEvent('on' + evType, fn); return r; }
    e['on' + evType] = fn;
}

function removeEvent(e,evType,fn){
    if(e.removeEventListener) { e.removeEventListener(evType,fn,false); return true; }
    if(e.detachEvent) { e.detachEvent('on'+evType, fn) };
}

function hel(s,t) { ohelpc('id_'+(++hid),(t==undefined?'':s),s); }
function helps_cancel(id,f) { idd(id).querySelector('.can').onclick=f; }
function helpc(id,s) { helps(id,s); center(id); setTimeout(function(x){center(id)},500); }
function ohelpc(id,z,s) { helpc(id,mk_helpbody(z,s)); }
function ohelp(id,z,s) { helps(id,mk_helpbody(z,s)); }
function mk_helpbody(z,s) { return (z==''?'':"<div class='legend'>"+z+"</div>")+"<div class='textbody'>"+s+"</div>"; }

function idie(s,t) {
    var e=typeof(s); if(e=='object') s="<pre style='max-width:"+(getWinW()-200)+"px'>"+print_r(s,0,3)+'</pre>';
    var header='';
    if(t!=undefined) { if(t.length < 120) header=h(''+t); else s=t+'<p>'+s; }
    var p=idd('idie'); if(p) { p=p.querySelector('.textbody'); if(p) return p.innerHTML=p.innerHTML+'<hr>'+s; }
    ohelpc('idie',header,s);
}
dier=idie;


var addEventListenerSet=0;

function helps(id,s,pos,cls,wt) {

    if(!idd(id)) {

	if(!wt) wt=wintempl;
	mkdiv(id,wt.replace(/\{id\}/g,id).replace(/\{s\}/g,s),wintempl_cls+(cls?' '+cls:''));
	if(idd(id+'_close')) idd(id+'_close').onclick=function(e){clean(id)};
	init_tip(idd(id));

	// (c)mkm Вот рецепт локального счастья, проверенный в Опера10, ИЕ6, ИЕ8, FF3, Safari, Chrome.
	// Таскать окно можно за 'рамку' - элементы от id до id+'_body', исключая body (и всех его детей).
	var e_body=idd(id+'_body'); // За тело не таскаем
	var hmov=false; // Предыдущие координаты мыши
	// var hmov2=1; // тащим
	var e=idd(id);

	var pnt=e; while(pnt.parentNode) pnt=pnt.parentNode; //Ищем Адама

			var mmFunc=function(ev) { ev=ev||window.event; if(hmov) {
				e.style.left = parseFloat(e.style.left)+ev.clientX-hmov.x+'px';
				e.style.top = parseFloat(e.style.top)+ev.clientY-hmov.y+'px';
				hmov={ x:ev.clientX, y:ev.clientY };
				if(ev.preventDefault) ev.preventDefault();
				return false;
			    }
			};

			var muFunc=function(){ if(hmov){
			    hmov=false;
			    removeEvent(pnt,'mousemove',mmFunc);
			    removeEvent(pnt,'mouseup',muFunc);
			    e.style.cursor='auto';
			    }
			};

		addEvent(e,'mousedown', function(ev){ if(hmov) return;

			ev=ev||window.event;
			var lbtn=(window.addEventListener?0:1); //Если ИЕ, левая кнопка=1, иначе 0
			if(!ev.target) ev.target=ev.srcElement;
			if((lbtn!==ev.button)) return; //Это была не левая кнопка или 'тело' окна, ничего не делаем
			var tgt=ev.target;
			while(tgt){
			    if(tgt.className=='legend') { tgt=e; break; } // и за заголовок class='legend' можно тоже таскать
			    if(tgt==e_body) return;
			    if(tgt==e) break;
			    tgt=tgt.parentNode;
			};
			//Начинаем перетаскивать
			e.style.cursor='move';
			// hmov2=0;
			hmov={ x:ev.clientX, y:ev.clientY };
			addEvent(pnt,'mousemove',mmFunc);
			addEvent(pnt,'mouseup',muFunc);
			if(ev.preventDefault) ev.preventDefault();
			return false;
		});
    // ===========================================================================

    ++hid;

    if(!pos) posdiv(id,mouse_x,mouse_y);

    mHelps[id]=[hotkey.slice(),999999]; // сделать самым верхним

    if(addEventListenerSet && window.history && window.history.pushState) {
	    window.history.pushState({win:id},'win2-'+id,'?win2_'+id);
	    window.history.pushState({win:id},'win-'+id,'?win_'+id);
    }

  } else zabil(id+'_body',s);

  hotkey=hotkey_def.slice(); // обнулить для окна все шоткеи
  setTimeout("mHelps_sort('"+id+"');",10); // пересортировать
  addEvent(idd(id),'click',function(){ mHelps_sort(this.id); });
}

// координаты мыши
var mouse_x=mouse_y=0;
document.onmousemove = function(e){ e=e||window.event;
  if(e.pageX || e.pageY) { mouse_x=e.pageX; mouse_y=e.pageY; }
  else if(e.clientX || e.clientY) {
    mouse_x = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
    mouse_y = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
  }
};
// ---------------------

function getScrollH(){ return document.documentElement.scrollTop || document.body.scrollTop; }
function getScrollW(){ return document.documentElement.scrollLeft || document.body.scrollLeft; }

function getWinW(){ return window.innerWidth || (document.compatMode=='CSS1Compat' && !window.opera ? document.documentElement.clientWidth : document.body.clientWidth); }
function getWinH(){ return window.innerHeight || (document.compatMode=='CSS1Compat' && !window.opera ? document.documentElement.clientHeight : document.body.clientHeight); }

function getDocH(){ return document.compatMode!='CSS1Compat' ? document.body.scrollHeight : document.documentElement.scrollHeight; }
function getDocW(){ return document.compatMode!='CSS1Compat' ? document.body.scrollWidth : document.documentElement.scrollWidth; }

var scrollTop=0;
function GetCaretPosition(e) { var p=0; // IE Support
    if(document.selection){ e.focus(); var s=document.selection.createRange(); s.moveStart('character',-e.value.length); p=s.text.length; } // Firefox support
    else if(e.selectionStart || e.selectionStart=='0') p=e.selectionStart;
    scrollTop=e.scrollTop; return p;
}

function setCaretPosition(e,p) {
    if(e.setSelectionRange){ e.focus(); e.setSelectionRange(p,p); }
    else if(e.createTextRange){ var r=e.createTextRange(); r.collapse(true); r.moveEnd('character',p); r.moveStart('character',p); r.select(); }
    e.scrollTop = scrollTop;
}

//======================================== jog
var jog=false,f5s=false;

c_read=function(n) { var a=' '+document.cookie+';'; var c=a.indexOf(' '+n+'='); if(c==-1) return false; a=a.substring(c+n.length+2);
return decodeURIComponent(a.substring(0,a.indexOf(';')))||false; };
fc_read=fc_save=function(n,v){ return false; };
f_read=function(n){ return f5_read(n)||c_read(n); };

f_save=f5_save=l_save=function(k,v){
    if(k.length>500) idie('f_save error k.length='+k.length);
    if(v.length>20000) idie('f_save error v.length='+v.length);
    try { return window.localStorage&&window.localStorage.setItem?window.localStorage.setItem(k,v):false; } catch(e) { return err_store(e,arguments.callee.name); }
};

f5_read=l_read=function(k){
    try { return window.localStorage&&window.localStorage.getItem?window.localStorage.getItem(k):false; } catch(e) {  return err_store(e,arguments.callee.name); }
};

l_del=function(k){
    try { return window.localStorage&&window.localStorage.removeItem?window.localStorage.removeItem(k):false; } catch(e) { return err_store(e,arguments.callee.name); }
};

err_store=function(e,fnam) { // да блять, иногда даже они рушатся

if(e.name=='NS_ERROR_FILE_CORRUPTED') alert("\
Опс, да у вас ебанулось браузерное хранилище!\nУ меня такое было, когда я скопировал папку от старого Firefox в новый.\
\n\nНе думаю, что проблема ограничится лишь этим сайтом. Надо найти и ручками ёбнуть файлы типа:\
\n~/.mozilla/firefox/3t20ifl1.default/webappsstore.sqlite\
\n~/.mozilla/firefox/3t20ifl1.default/webappsstore.sqlite-wal");

else alert('Error '+fnam+'(): '+e.name);

return false;
}

time=function(){ return new Date().getTime(); };

// bigfoto - заебался отдельно пристыковывать
// BigLoadImg("http://lleo.aha.ru/tmp/img.php?text="+Math.random());
// Два варианта вызова: либо модулем для серии фоток, либо без второго параметра просто bigfoto('somepath/file.jpg')
// <img style='border:1px solid #ccc' onclick="return bigfoto('/backup/kniga_big.gif')" src="/backup/kniga_small.gif">

var BigImgMas={},bigtoti=0,bigtotp=0;
function bigfoto(i,p){ if(typeof(i)=='object') i=i.href;
var TDATA=(p!=undefined && isNaN(p) ? p : false); // переданы ли полезные слова вторым аргументом?

var Z=( p==undefined || TDATA!==false ); var n=Z?i:i+','+p;

if(typeof(BigImgMas[n])=='undefined'){
    if(!Z && !idd("bigfot"+p+"_"+i)) return false;
    BigImgMas[n]=new Image();
    BigImgMas[n].src=Z?n:idd("bigfot"+p+"_"+i).href;
}

if(!Z) { bigtoti=i; bigtotp=p; }
if(BigImgMas[n].width*BigImgMas[n].height==0) { setTimeout('bigfoto('+(Z ? '"'+n+'"' : n)+')',200); return false; }

if(Z) var tt="<div id='bigfostr' class=r>"+(TDATA===false?n:TDATA)+"</div>";
else {
    var g=i; while(idd('bigfot'+p+'_'+g)) g++;
    var tt=(g>1?(i+1)+" / "+g:'')+(idd('bigfott'+p+'_'+i)?"    <div style='display:inline;' title='nexпредыдущая/следующая: стрелки клавиатуры' id='bigfottxt'>"+vzyal('bigfott'+p+'_'+i)+'</div>':'');
}
var navl=Z?'':"<div id='bigfotol' style='position:absolute;top:0px;left:0px;'"+((!i)?'>':" title='prev' onclick='bigfoto(bigtoti-1,bigtotp)' onmouseover=\"otkryl('bigfotoli')\" onmouseout=\"zakryl('bigfotoli')\"><i id='bigfotoli' style='position:absolute;top:0px;left:3px;display:none;' class='e_DiKiJ_l'></i>")+"</div>";
var navr=Z?'':"<div id='bigfotor' style='position:absolute;top:0px;right:0px;'"+((g==i+1)?'>':" title='next' onclick='bigfoto(bigtoti+1,bigtotp)' onmouseover=\"otkryl('bigfotori')\" onmouseout=\"zakryl('bigfotori')\"><i id='bigfotori' style='position:absolute;right:3px;display:none;' class='e_DiKiJ_r'></i>")+"</div>";

helps('bigfoto',"<div style='position:relative'>"+navl+"<img id='bigfotoimg' src='"+BigImgMas[n].src+"' onclick=\"clean('bigfoto')\">"+navr+"</div>"+tt,1);

var w=BigImgMas[n].width,h=BigImgMas[n].height,e=idd('bigfotoimg');
var H=(getWinH()-20); if(h>H && H>480) { w=w*(H/h); h=H; e.style.height=H+'px'; }
var W=(getWinW()-50); if(w>W && W>640) { h=h*(W/w); w=W; e.style.width=W+'px'; }
if(idd('bigfostr')) idd('bigfostr').style.width=w+'px';

if(!Z){
    idd('bigfotol').style.width=idd('bigfotor').style.width=w/4+'px';
    idd('bigfotol').style.height=idd('bigfotor').style.height=h+'px';
    if(idd('bigfotoli')) idd('bigfotoli').style.top=(h-16)/2+'px';
    if(idd('bigfotori')) idd('bigfotori').style.top=(h-16)/2+'px';
    setkey(['ArrowLeft','4'],'',function(){bigfoto(bigtoti-1,bigtotp)},false);
    setkey(['ArrowRight','7'],'',function(){bigfoto(bigtoti+1,bigtotp)},false);
}
center('bigfoto');
return false;
}

// tip

function init_tip(w) { w=w||document;
    if(!idd('tip')) mkdiv('tip','','tip');
    if(w.id=='tip') return;

    var attr,j,i,a,s,e,t,el=['a','label','input','img','span','div','textarea','area','select','i','td'];
    for(j=0;j<el.length;j++){ t=el[j]; e=w.getElementsByTagName(t); if(e){ for(i=0;i<e.length;i++){ a=e[i];

    if(t=='img' && user_opt('i')) { // для ошибки при загрузки картинок
	a.setAttribute('onerror','erimg(this)');
        a.setAttribute('src',a.getAttribute('src'));
    } else if(t=='input'||t=='textarea'||t=='select') { // и отключить навигацию для INPUT и TEXTAREA
	if( (t=='input'||t=='textarea') && a.onFocus==undefined) addEvent(a,'focus',function(){nonav=1});
	attr=a.getAttribute('ramsave');
	if(attr!==null && !a.defaultValue) { // если указан атрибут ramsave='name', то сохранять в памяти браузера эту переменную и восстанавливать
		if(attr=='') {
		    attr=(a.id?a.id:(a.name?a.name:attr)); // если =1, то имя такое же, как id или name
		    a.setAttribute('ramsave',attr);
		}
		var vv=f5_read(attr) || a.getAttribute('placeholder') || '';
		    if(a.type=='checkbox') a.checked=vv;
		    else if(a.type=='radio') a.checked=(a.value==vv?1:0);
		    else a.value=vv;
		addEvent(a,'change',function(){
		    f5_save(this.getAttribute('ramsave'), ( this.type=='checkbox' || (this.type!='radio' && this.checked) ? (this.checked?1:0) : this.value ) );
		});
	}
    }

    attr=a.getAttribute('title')||a.getAttribute('alt');

    if(attr=='play') {
	var za=a.innerHTML,url=za.split(' ')[0],text=za.substring(url.length+1),cls;
	if(text=='') text=url;
	if(/(mp3|ogg|wav|flac)$/.test(url)) { // mp3
	    cls='ll pla';
	    if(text.indexOf('<')<0) text="<img style='vertical-align:middle;padding-right:10px;' src='"+www_design+"img/play.png' width='22' height='22'>"+text;
	} else {
	    cls='ll plv';
	    if(text.indexOf('<')<0) text="<i style='vertical-align:middle;padding-right:10px;' class='e_play-youtube'></i>"+text;
	}
	a.className=cls;
	a.setAttribute('media-url',url);
	a.setAttribute('media-text',text);
	addEvent(a,'click',function(){ changemp3x('','',this); });
	zabil(a,text);
	a.style.margin='10px';
	tip_a_set(a,'Play Media');
	a.style.display='block';
    }
    else tip_a_set(a,attr);
}}}
}

function erimg(e){ e.onerror='';
    tip_a_set(e,'image error<br>'+h(e.src));
    e.src=www_design+'img/kgpg_photo.png';
}

function tip_pos(){ posdiv('tip',mouse_x-35,mouse_y+25); }

function tip_a_set(a,s) { if(s && a.onMouseOver==undefined) {
    a.setAttribute('tiptitle',s); a.removeAttribute('title'); a.removeAttribute('alt');
    addEvent(a,'mouseover',function(){ idd('tip').innerHTML=s; tip_pos(); });
    addEvent(a,'mouseout',function(){ zakryl('tip') });
    addEvent(a,'mousemove',function(){ tip_pos() });
    addEvent(a,'dblclick',function(){ salert(this.getAttribute('tiptitle'),15000); });
}}

page_onstart.push("init_tip()");

//==========
window.onload=function(e) { e=e||window.event;

  document.onkeydown = function(e) { e=e||window.event;
    var kod=(e.code?e.code:null),ct=e.metaKey+2*e.altKey+4*e.shiftKey+8*e.ctrlKey;
    for(var i in hotkey) if( hotkey[i][0]==kod && hotkey[i][1]==(hotkey[i][1]&ct)) {
        if(nonav && !hotkey[i][4]) return true; // навигация отключена для навигационных
        setTimeout("hotkey["+i+"][2]('"+kod+" "+ct+"')",50);
        return hotkey[i][3];
    }
  };

  // === / KEYBOARD ===
  window.onresize=function(){ screenWidth=document.body.clientWidth; };
  window.onresize();

  for(var inok=page_onstart.length-1;inok>=0;inok--) { var F=page_onstart[inok],TF=typeof(F);
    try{
	if(TF=='function') F();
	else if(TF=='string') eval(F);
	else ErrorUnknownOnstartCallFunction();
    } catch(e){ salert('Error ostart: '+h(e.name+":"+e.message)+"<br>"+h(e.stack)+'<p>'+h(page_onstart[inok])+"<hr>"+F); }
  }
  page_onstart=[];
};
// end window.onload

onstart=function(F) { page_onstart.push(F); return page_onstart.length-1; }

salert_to=false; // таймаут
function salert(l,t) {
    var p=document.querySelector('#salert .textbody');
    if(p) p.innerHTML=p.innerHTML+'<hr>'+l;
    else helpc('salert',"<div style='padding:20px' class='textbody'>"+l+"</div>");
    if(salert_to) clearTimeout(salert_to);
    if(t) salert_to=setTimeout("salert_to=false;clean('salert');",t);
    return false;
}

function talert(s,t){ mkdiv('talert',s,'qTip'); posdiv('talert',-1,-1); if(t) setTimeout("clean('talert')",t); }

function gethash_c(){ return 1*document.location.href.replace(/^.*?#(\d+)$/g,'$1'); }

var playsid=0;
function plays(url,silent){ // silent: 1 - только загрузить, 0 - петь, 2 - петь НЕПРЕМЕННО, невзирая на настройки
    newdiv("<audio style='position:absolute;width:1px;height:1px;overflow:hidden;left:-40px;top:0;opacity:0'"+(silent==1?'':" autoplay='autoplay'")+" src=\""+url+"\"></audio>",{id:'plays'+(silent==1?playsid++:'')});
}

function user_opt(s) { return typeof(useropt[s])=='undefined'?0:useropt[s]; };
function go(s) { window.top.location=s; }

function h(s){
    return (''+s).replace(/\&/g,'&'+'amp;').replace(/\</g,'&'+'lt;').replace(/\>/g,'&'+'gt;').replace(/\'/g,'&'+'#039;').replace(/\"/g,'&'+'#034;'); // '
}
function uh(s){ return s.replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>').replace(/\&\#039\;'/g,"'").replace(/\&\#034\;"/g,'"').replace(/\&amp\;/g,'&'); }

// {_PLAY:

var youtubeapiloaded=0;
var mp3imgs={play:www_design+'img/play.png',pause:www_design+'img/play_pause.png',playing:www_design+'img/play_go.gif'};

stopmp3x=function(ee){ ee.src=mp3imgs.play; setTimeout("clean('audiosrcx_win')",50); };

changemp3x=function(url,name,ee,mode,viewurl,download_name) { //  // strt

    if(url=='') url=ee.getAttribute('media-url');
    if(name=='') name=ee.getAttribute('media-text'); if(!name) name='';

    if(-1!=name.indexOf('</i>')) name=name.substring(name.split('</i>')[0].length+4);
    name=name.replace(/<[^>]+>/gi,'');

    var start=0,e;
    var s=name.replace(/^\s*([\d\:]+)\s.*$/gi,'$1'); if(s!=name&&-1!=s.indexOf(':')) { s=s.split(':'); for(var i=0;i<s.length;i++) start=60*start+1*s[i]; }

    var WWH="style='width:"+(Math.floor((getWinW()-50)*0.9))+"px;height:"+(Math.floor((getWinH()-50)*0.9))+"px;'";

    if(/(youtu\.be\/|youtube\.com\/)/.test(url) || (url.indexOf('.')<0 && /(^|\/)(watch\?v\=|)([^\s\?\/\&]+)($|\"|\'|\?.*|\&.*)/.test(url))) { // "

 	var tt=url.split('?start='); if(tt[1]) { start=1*tt[1]; url=tt[0]; } // ?start=1232343 в секундах
	else {
	  var exp2=/[\?\&]t=([\dhms]+)$/gi; if(exp2.test(url)) { var tt=url.match(exp2)[0]; // ?t=7m40s -> 460 sec
	    if(/\d+s/.test(tt)) start+=1*tt.replace(/^.*?(\d+)s.*?$/gi,"$1");
	    if(/\d+m/.test(tt)) start+=60*tt.replace(/^.*?(\d+)m.*?$/gi,"$1");
	    if(/\d+h/.test(tt)) start+=3600*tt.replace(/^.*?(\d+)h.*?$/gi,"$1");
	  }
	}

	if(-1!=url.indexOf('://youtu') || -1!=url.indexOf('://www.youtu')) url=url.match(/(youtu\.be\/|youtube\.com\/)(embed\/|watch\?v\=|)([^\?\/]+)/)[3];

	return ohelpc('audiosrcx_win','YouTube '+h(name),"<div id=audiosrcx><center>\
<iframe "+WWH+" src=\"https://www.youtube.com/embed/"+h(url)+"?rel=0&autoplay=1"+(start?'&start='+start:'')+"\" frameborder='0' allowfullscreen></iframe>\
</center></div>");
    }

    if(/([0-9a-z]{8}\-[0-9a-z]{4}\-[0-9a-z]{4}\-[0-9a-z]{4}\-[0-9a-z]{12})/.test(url)) { // Peertube
	return ohelpc('audiosrcx_win','PeerTube '+h(name),"<div id=audiosrcx><center>\
<iframe "+WWH+" sandbox='allow-same-origin allow-scripts allow-popups' src=\""+h(url)+"\" frameborder='0' allowfullscreen></iframe>\
</div>");
    }

    if(/\.(mp4|avi|webm|mkv)$/.test(url)) s='<div>'+name+'</div><div><center><video controls autoplay id="audiidx" src="'+h(url)+
'" width="640" height="480"><span style="border:1px dotted red">ВАШ БРАУЗЕР НЕ ПОДДЕРЖИВАЕТ MP4, МЕНЯЙТЕ ЕГО</span></video></center></div>';

if(!viewurl) viewurl=url.replace(/^.*\//g,'');
if(!download_name) download_name=url.replace(/^.*\//g,'');

if(e=idd('audiidx')) {
    if(ee && ee.src && -1!=ee.src.indexOf('play_pause')){ ee.src=mp3imgs.playing; return e.play(); }
    if(ee && ee.src && -1!=ee.src.indexOf('play_go')){ ee.src=mp3imgs.pause; return e.pause(); }
    zabil('audiosrcx',s);
    posdiv('audiosrcx_win',-1,-1);
    e=idd('audiidx');
    e.currentTime=start;
} else {
    ohelpc('audiosrcx_win','<a class=r href="'+h(url)+'" title="Download: '+h(download_name)+'" download="'+h(download_name)+'">'+h(viewurl)+'</a>','<div id=audiosrcx>'+s+'</div>');
    e=idd('audiidx');
    e.currentTime=start;
}

if(ee) addEvent(e,'ended',function(){ stopmp3x(ee) });
if(ee) addEvent(e,'pause',function(){ if(e.currentTime==e.duration) stopmp3x(ee); else ee.src=mp3imgs.pause; });
if(ee) addEvent(e,'play',function(){ ee.src=mp3imgs.playing; });
}

/*********************** majax ***********************/
progress=function(name,now,total,text) { name='progress'+(name?'_'+name:'');
    if(!idd(name)) { if(!total) return;
            helpc(name,"\
<div id='"+name+"_proc' style='text-align:center;font-size:23px;font-weight:bold;color:#555;'>0 %</div>\
<div id='"+name+"_tab' style='width:"+Math.floor(getWinW()/2)+"px;border:1px solid #666;'>\
<div id='"+name+"_bar' style='width:0;height:10px;background-color:red;'></div></div>");
    } else if(!total) return clean(name);
    var proc=Math.floor(1000*(now/total))/10;
    var W=1*idd(name+'_tab').style.width.replace(/[^\d]+/g,'');
    idd(name+'_bar').style.width=Math.floor(proc*(W/100))+'px';
    if(!text) text=''+proc+' %'; else text=text.replace(/\%\%/g,proc);
    zabil(name+'_proc',text);
};

function sizer(x) {  var i=0; for(;x>=1024;x/=1024,i++){} return Math.round(x,2)+['b','Kb','Mb','Gb','Tb','Pb'][i]; } // если отправка более 30кб - показывать прогресс

// ProgressFunc=function(e){ progress('ajax',e.loaded,e.total,sizer(e.total)+': %% %'); };


/// animate
function anim(e,effect,fn) { if(!e) return 1;
    e.classList.remove("animated");
    e.classList.add(effect);
    e.classList.add("animated");
    var anend=function(){
        removeEvent(e,'animationend',anend);
        e.classList.remove('animated');
        e.classList.remove(effect);
        if(fn) fn();
    };
    addEvent(e,'animationend', anend);
    return 1;
}


// AJAX from ESP8266
function AJAX(url,opt,s) { if(!opt) opt={};
  var async=(opt.async!==undefined?opt.async:true);
  try{
    if(!async && !opt.callback) opt.callback=function(){};
    var xhr=new XMLHttpRequest(); xhr.onreadystatechange=function(){ if(this.readyState==4 && this.status==200 && this.responseText!=null)
       try{
            progress('ajax');
	    if(opt.callback) opt.callback(this.responseText,url,s);
	    else eval(this.responseText);
       }catch(e){alert('Error Ajax: '+this.responseText);}
	else if(this.status==500) { if(opt.callback) opt.callback(false,url,s); }
    };
    xhr.open((opt.method?opt.method:(s?'POST':'GET')),url,async);
    if(s) {
	if(typeof(s)=='object') {
	  var formData = new FormData();
	  for(var i in s) formData.append(i,s[i]);
	  var k=0; Array.from(formData.entries(),([key,D])=>(k+=(typeof(D)==='string'?D.length:D.size)));
	  if(k>20*1024) xhr.upload.onprogress=ProgressFunc;
	  xhr.send(formData);
	} else xhr.send(s);
    } else xhr.send();
    if(!async) return (xhr.statusText=='OK'?xhr.responseText:false);
  } catch(e) { if(!async) return false; }
}

function AGET(url,s) { return AJAX(url,{noajax:1,async:false},s); } // асинхронно просто вернуть результат

function AJ(url,callback,s) { AJAX(url,{callback:callback,noajax:1},s); }

// ==============================================
function mpers(s,a) {
    return s.replace(/\{([^\{\}]+)\}/g,function(t0,t1){
        if(typeof(a[t1])!='undefined') return a[t1]; // есть есть такое {значение} - вернуть его
        if(t1.match(/[\s\,\.]+/g)!==null) return t0; // если и имена переменных что-то через запятую - то просто вернуть
	var f=t1.substring(0,1),i=t1.substring(1);
	if(f=='#') return (typeof(a[i])=='undefined'?'': h(a[i]) );
        return '';
    });
}

// ==============================================

function at_get(id,key) { return idd(id).getAttribute(key); }
function at_set(id,key,value) { return idd(id).setAttribute(key,value); }
