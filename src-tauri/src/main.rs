// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod shuangpin;

use serde::{Deserialize, Serialize};
use shuangpin::ShuangpinScheme;
use std::sync::Mutex;
use tauri::State;

// 用户状态
struct UserState {
    scheme: Mutex<ShuangpinScheme>,
}

#[derive(Debug, Serialize, Deserialize)]
struct PinyinResult {
    initial: String,
    final_part: String,
    is_valid: bool,
}

// 获取当前使用的双拼方案
#[tauri::command]
fn get_current_scheme(state: State<UserState>) -> ShuangpinScheme {
    state.scheme.lock().unwrap().clone()
}

// 切换双拼方案
#[tauri::command]
fn switch_scheme(scheme_name: &str, state: State<UserState>) -> bool {
    let mut scheme = state.scheme.lock().unwrap();
    match scheme_name {
        "microsoft" => {
            *scheme = ShuangpinScheme::microsoft();
            true
        }
        // 添加其他方案...
        _ => false,
    }
}

// 获取拼音的双拼编码
#[tauri::command]
fn get_shuangpin_code(pinyin: &str, state: State<UserState>) -> PinyinResult {
    let scheme = state.scheme.lock().unwrap();
    if let Some((initial, final_part)) = scheme.get_initial_final(pinyin) {
        PinyinResult {
            initial,
            final_part,
            is_valid: true,
        }
    } else {
        PinyinResult {
            initial: String::new(),
            final_part: String::new(),
            is_valid: false,
        }
    }
}

fn main() {
    tauri::Builder::default()
        .manage(UserState {
            scheme: Mutex::new(ShuangpinScheme::microsoft()),
        })
        .invoke_handler(tauri::generate_handler![
            get_current_scheme,
            switch_scheme,
            get_shuangpin_code
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
