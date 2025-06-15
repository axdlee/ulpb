use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ShuangpinScheme {
    pub name: String,
    pub description: String,
    pub initials: HashMap<String, String>,
    pub finals: HashMap<String, String>,
    pub special_finals: HashMap<String, String>,
}

impl ShuangpinScheme {
    pub fn microsoft() -> Self {
        let mut initials = HashMap::new();
        initials.insert("b".to_string(), "b".to_string());
        initials.insert("p".to_string(), "p".to_string());
        initials.insert("m".to_string(), "m".to_string());
        initials.insert("f".to_string(), "f".to_string());
        initials.insert("d".to_string(), "d".to_string());
        initials.insert("t".to_string(), "t".to_string());
        initials.insert("n".to_string(), "n".to_string());
        initials.insert("l".to_string(), "l".to_string());
        initials.insert("g".to_string(), "g".to_string());
        initials.insert("k".to_string(), "k".to_string());
        initials.insert("h".to_string(), "h".to_string());
        initials.insert("j".to_string(), "j".to_string());
        initials.insert("q".to_string(), "q".to_string());
        initials.insert("x".to_string(), "x".to_string());
        initials.insert("zh".to_string(), "v".to_string());
        initials.insert("ch".to_string(), "i".to_string());
        initials.insert("sh".to_string(), "u".to_string());
        initials.insert("r".to_string(), "r".to_string());
        initials.insert("z".to_string(), "z".to_string());
        initials.insert("c".to_string(), "c".to_string());
        initials.insert("s".to_string(), "s".to_string());
        initials.insert("y".to_string(), "y".to_string());
        initials.insert("w".to_string(), "w".to_string());

        let mut finals = HashMap::new();
        finals.insert("a".to_string(), "a".to_string());
        finals.insert("o".to_string(), "o".to_string());
        finals.insert("e".to_string(), "e".to_string());
        finals.insert("i".to_string(), "i".to_string());
        finals.insert("u".to_string(), "u".to_string());
        finals.insert("v".to_string(), "v".to_string());
        finals.insert("ai".to_string(), "l".to_string());
        finals.insert("ei".to_string(), "z".to_string());
        finals.insert("ui".to_string(), "v".to_string());
        finals.insert("ao".to_string(), "k".to_string());
        finals.insert("ou".to_string(), "b".to_string());
        finals.insert("iu".to_string(), "q".to_string());
        finals.insert("ie".to_string(), "x".to_string());
        finals.insert("ue".to_string(), "t".to_string());
        finals.insert("er".to_string(), "r".to_string());
        finals.insert("an".to_string(), "j".to_string());
        finals.insert("en".to_string(), "f".to_string());
        finals.insert("in".to_string(), "n".to_string());
        finals.insert("un".to_string(), "p".to_string());
        finals.insert("ang".to_string(), "h".to_string());
        finals.insert("eng".to_string(), "g".to_string());
        finals.insert("ing".to_string(), "y".to_string());
        finals.insert("ong".to_string(), "s".to_string());
        finals.insert("iang".to_string(), "d".to_string());
        finals.insert("uang".to_string(), "d".to_string());
        finals.insert("iong".to_string(), "s".to_string());
        finals.insert("ua".to_string(), "w".to_string());
        finals.insert("ia".to_string(), "w".to_string());
        finals.insert("uan".to_string(), "r".to_string());
        finals.insert("ian".to_string(), "m".to_string());
        finals.insert("zhang".to_string(), "vh".to_string());
        finals.insert("chang".to_string(), "ih".to_string());
        finals.insert("shang".to_string(), "uh".to_string());

        let mut special_finals = HashMap::new();
        special_finals.insert("zhi".to_string(), "v".to_string());
        special_finals.insert("chi".to_string(), "i".to_string());
        special_finals.insert("shi".to_string(), "u".to_string());
        special_finals.insert("zi".to_string(), "zi".to_string());
        special_finals.insert("ci".to_string(), "ci".to_string());
        special_finals.insert("si".to_string(), "si".to_string());

        ShuangpinScheme {
            name: "微软双拼".to_string(),
            description: "微软双拼输入法方案".to_string(),
            initials,
            finals,
            special_finals,
        }
    }

    pub fn get_initial_final(&self, pinyin: &str) -> Option<(String, String)> {
        // 处理特殊情况
        if let Some(special) = self.special_finals.get(pinyin) {
            return Some((pinyin[0..1].to_string(), special.to_string()));
        }

        // 普通情况处理
        let mut chars = pinyin.chars();
        let first = chars.next()?;
        let second = chars.next();

        // 判断是否是双字母声母
        let initial = if let Some(second_char) = second {
            let possible_initial = format!("{}{}", first, second_char);
            if self.initials.contains_key(&possible_initial) {
                possible_initial
            } else {
                first.to_string()
            }
        } else {
            first.to_string()
        };

        // 获取韵母部分
        let final_part = if initial.len() == 2 {
            &pinyin[2..]
        } else {
            &pinyin[1..]
        };

        // 查找对应的双拼码
        let initial_code = self.initials.get(&initial)?;
        let final_code = self.finals.get(final_part)?;

        Some((initial_code.to_string(), final_code.to_string()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_microsoft_scheme() {
        let scheme = ShuangpinScheme::microsoft();
        
        // 测试普通拼音
        let result = scheme.get_initial_final("pin").unwrap();
        assert_eq!(result, ("p".to_string(), "n".to_string()));

        // 测试双声母
        let result = scheme.get_initial_final("zhang").unwrap();
        assert_eq!(result, ("v".to_string(), "h".to_string()));

        // 测试特殊韵母
        let result = scheme.get_initial_final("zhi").unwrap();
        assert_eq!(result, ("z".to_string(), "v".to_string()));
    }
} 