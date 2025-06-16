use std::collections::HashMap;
use lazy_static::lazy_static;

lazy_static! {
    pub static ref SHUANGPIN_SCHEMES: HashMap<&'static str, ShuangpinScheme> = {
        let mut m = HashMap::new();
        
        // 微软双拼
        m.insert("microsoft", ShuangpinScheme {
            name: "微软双拼",
            shengmu: microsoft_shengmu(),
            yunmu: microsoft_yunmu(),
            special_yunmu: microsoft_special_yunmu(),
        });

        // 小鹤双拼
        m.insert("xiaohe", ShuangpinScheme {
            name: "小鹤双拼",
            shengmu: xiaohe_shengmu(),
            yunmu: xiaohe_yunmu(),
            special_yunmu: xiaohe_special_yunmu(),
        });

        // 自然码
        m.insert("ziranma", ShuangpinScheme {
            name: "自然码",
            shengmu: ziranma_shengmu(),
            yunmu: ziranma_yunmu(),
            special_yunmu: ziranma_special_yunmu(),
        });

        // 搜狗双拼
        m.insert("sougou", ShuangpinScheme {
            name: "搜狗双拼",
            shengmu: sougou_shengmu(),
            yunmu: sougou_yunmu(),
            special_yunmu: sougou_special_yunmu(),
        });

        m
    };
}

pub struct ShuangpinScheme {
    pub name: &'static str,
    pub shengmu: HashMap<char, &'static str>,
    pub yunmu: HashMap<char, &'static str>,
    pub special_yunmu: HashMap<&'static str, &'static str>,
}

// 小鹤双拼方案配置
fn xiaohe_shengmu() -> HashMap<char, &'static str> {
    let mut m = HashMap::new();
    m.insert('b', "b");
    m.insert('c', "c");
    m.insert('d', "d");
    m.insert('f', "f");
    m.insert('g', "g");
    m.insert('h', "h");
    m.insert('j', "j");
    m.insert('k', "k");
    m.insert('l', "l");
    m.insert('m', "m");
    m.insert('n', "n");
    m.insert('p', "p");
    m.insert('q', "q");
    m.insert('r', "r");
    m.insert('s', "s");
    m.insert('t', "t");
    m.insert('w', "w");
    m.insert('x', "x");
    m.insert('y', "y");
    m.insert('z', "z");
    m
}

fn xiaohe_yunmu() -> HashMap<char, &'static str> {
    let mut m = HashMap::new();
    m.insert('a', "a");
    m.insert('b', "ou");
    m.insert('c', "iao");
    m.insert('d', "uang");
    m.insert('e', "e");
    m.insert('f', "en");
    m.insert('g', "eng");
    m.insert('h', "ang");
    m.insert('i', "i");
    m.insert('j', "an");
    m.insert('k', "ao");
    m.insert('l', "ai");
    m.insert('m', "ian");
    m.insert('n', "in");
    m.insert('o', "o");
    m.insert('p', "un");
    m.insert('q', "iu");
    m.insert('r', "uan");
    m.insert('s', "ong");
    m.insert('t', "ue");
    m.insert('u', "u");
    m.insert('v', "v");
    m.insert('w', "ei");
    m.insert('x', "ie");
    m.insert('y', "ing");
    m.insert('z', "ong");
    m
}

fn xiaohe_special_yunmu() -> HashMap<&'static str, &'static str> {
    let mut m = HashMap::new();
    m.insert("ua", "ua");
    m.insert("ia", "ia");
    m.insert("uo", "uo");
    m.insert("ui", "ui");
    m.insert("ue", "ue");
    m.insert("ve", "ve");
    m.insert("er", "er");
    m.insert("ng", "ng");
    m
}

// ... 其他方案配置保持不变 ... 