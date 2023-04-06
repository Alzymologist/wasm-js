extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    // do alert(s)
    pub fn alert(text: &str);
    // do salert-window width text for x ms
    pub fn salert(text: &str, x: u32);
    // set element id visible
    pub fn otkryl(id: &str);
    // set element id unvisible
    pub fn zakryl(id: &str);
    // put text in element id
    pub fn zabil(id: &str,text: &str);
    // add text to element id (below)
    pub fn dobavil(id: &str,text: &str);
    // add text to element id (above)
    pub fn dobavil1(id: &str,text: &str);
    // get test from element id
    pub fn vzyal(id: &str) -> JsValue;
    // set element id position to X,Y
    pub fn posdiv(id: &str, x: u32, y: u32);
    // move element id to the center of screen
    pub fn center(id: &str);
    // open window with id, header and text
    pub fn ohelpc(id: &str, header: &str, text: &str);
    // open/add window with text
    pub fn idie(text: &str);
    // delete element id
    pub fn clean(id: &str);
    // copy text to clipboard
    pub fn cpbuf(s: &str);
    // play mp3 sample from url
    pub fn plays(url: &str);
    // View photo (url)
    pub fn bigfoto(url: &str);
    // Get browser scroll X / Y
    pub fn getScrollW() -> JsValue;
    pub fn getScrollH() -> JsValue;
    // Get visual part of screen X / Y
    pub fn getWinW() -> JsValue;
    pub fn getWinH() -> JsValue;
    // Get full page X / Y
    pub fn getDocH() -> JsValue;
    pub fn getDocW() -> JsValue;
    // Save to LocalStorage: key = value
    pub fn f5_save(key: &str, value: &str);
    // Read from LocalStorage key = ?
    pub fn f5_read(key: &str) -> JsValue;
    // progressbar
    pub fn progress(id: &str, now: f64, total: f64, text: &str);
    // get the file
    pub fn AGET(url: &str) -> JsValue;
    // get attribute key=? from element id
    pub fn at_get(id: &str, key: &str) -> JsValue;
    // set attribute key=value to element id
    pub fn at_set(id: &str, key: &str, value: &str);
}

/*
JsValue:
https://rustwasm.github.io/wasm-bindgen/api/wasm_bindgen/struct.JsValue.html

under constructions:

function setkey(k,v,f,o,nav){ nav=nav?1:0; if(typeof(k)!='object') k=[k];}
function dom=idd(id){ }
function print_r(a,n,skoka) { a,0,10 }

// умная подгрузка
// первый аргумент - имя файлы js или css или массив ['1.js','2.js','1.css']
// второй необязательный аргумент - фанкция, запускаемая по окончании удачной загрузке ВСЕХ перечисленных
// третий необязательный - функция при ошибке
function LOADS(u,f,err) { }

// создать новый <DIV class='cls' id='id'>s</div> в элементе paren (если не указан - то просто в документе)
// если указан relative - то следующим за relative
// если relative=='first'(или 0) - в начало
// если relative==['before',relative] - то перед relative
// иначе (рекомндуется писать 'last') - в конец
function newdiv(s,ara,paren,relative){ if(typeof(ara)!='object') ara={};}
function helps(id,s,pos,cls,wt) {};
function init_tip(w) { w=w||document; }
function AJAX(url,opt,s) { if(!opt) opt={}; }
function AGET(url,s) { return AJAX(url,{noajax:1,async:false},s); } // асинхронно просто вернуть результат
function AJ(url,callback,s) { AJAX(url,{callback:callback,noajax:1},s); }
*/