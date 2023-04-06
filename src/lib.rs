// #![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

mod mainjs;
use crate::mainjs::*;

#[wasm_bindgen]
pub fn greet(name: &str) {
    // open window with some info for 1000 ms
    salert(&format!("Alert 2 sec: <b>{}</b>",name),2000);
}

#[wasm_bindgen]
pub fn toclip(name: &str) {
    // copy to clipboard
    cpbuf(name);
}

#[wasm_bindgen]
pub fn do_plays() {

    // view window with photo
    bigfoto("https://lleo.me/dnevnik/2023/04/04/0.webp");

    // play sound
    plays("https://lleo.me/dnevnik/design/sound/bbm_tone.mp3");

}

#[wasm_bindgen]
pub fn do_resolutions() {

    let s: String = format!("
<p>Window: {}x{}
<p>Document: {}x{}
<p>Scroll: {}x{}
",
    getWinW().as_f64().unwrap(), getWinH().as_f64().unwrap(),
    getDocW().as_f64().unwrap(), getDocH().as_f64().unwrap(),
    getScrollW().as_f64().unwrap(), getScrollH().as_f64().unwrap()
);

    // create window id='myid'
    ohelpc("myid", "Screen Resolutions", &s);
}

#[wasm_bindgen]
pub fn do_progress() {
    let max: f64 = 100.0;

    // get from globals
    let mut x: f64 = get("x").parse().unwrap_or(0.0);

    if x > max {
	progress("progr", 0.0, 0.0, "" );
	x = 0.0;
    } else {
        progress("progr", x, max, &format!("Working... progress={}% Press again!",&x) );
        x += 5.0;
    }

    // set to globals
    set("x", &x.to_string() );
}

// wget JSON (by JS), parse and view
use serde_json::{Value};
#[wasm_bindgen]
pub fn btc() {
    let x: u32 = get("xbit").parse().unwrap_or(0) + 1;
    set("xbit", &x.to_string() );

    let s: String = AGET("https://www.blockchain.com/ru/ticker").as_string().unwrap_or("".to_string());
    let v: Value = serde_json::from_str(&s).unwrap();
    dobavil1("BTC", &format!("{:03}) BTC = {} USD", x, v["USD"]["last"]) );
}

// lifehack to store Globals in <body> attributes
fn get(key: &str) -> String { at_get("globals", key).as_string().unwrap_or("".to_string()) }
fn set(key: &str, value: &str) { at_set("globals", key, value); }
