// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri::Builder;

pub fn run() {
    Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
