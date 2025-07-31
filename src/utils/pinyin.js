import { pinyin } from 'pinyin-pro'

// 声母映射表
const initialMap = {
  b: 'b',
  p: 'p',
  m: 'm',
  f: 'f',
  d: 'd',
  t: 't',
  n: 'n',
  l: 'l',
  g: 'g',
  k: 'k',
  h: 'h',
  j: 'j',
  q: 'q',
  x: 'x',
  zh: 'v',
  ch: 'i',
  sh: 'u',
  r: 'r',
  z: 'z',
  c: 'c',
  s: 's',
  y: 'y',
  w: 'w'
}

// 韵母映射表
const finalMap = {
  a: 'a',
  o: 'o',
  e: 'e',
  i: 'i',
  u: 'u',
  v: 'v',
  ai: 'd',
  ei: 'w',
  ui: 'v',
  ao: 'c',
  ou: 'z',
  iu: 'q',
  ie: 'x',
  ue: 't',
  ve: 't',
  an: 'j',
  en: 'f',
  in: 'n',
  un: 'p',
  ang: 'h',
  eng: 'g',
  ing: 'k',
  ong: 's',
  ia: 'w',
  iao: 'k',
  ian: 'm',
  iang: 'l',
  iong: 's',
  ua: 'w',
  uai: 'y',
  uan: 'r',
  uang: 'l',
  uo: 'o'
}

/**
 * 获取汉字的双拼编码
 * @param {string} char 单个汉字
 * @returns {{shengmu: string, yunmu: string}} 返回双拼编码对象
 */
export function getShuangpinCode(char) {
  try {
    // 获取声母
    const initialResult = pinyin(char, {
      toneType: 'none',
      type: 'array',
      pattern: 'initial'
    })

    // 获取韵母
    const finalResult = pinyin(char, {
      toneType: 'none',
      type: 'array',
      pattern: 'final'
    })

    const initial = initialResult[0] || ''
    const final = finalResult[0] || ''

    // 转换为双拼编码
    const shengmu = initialMap[initial] || initial.toLowerCase()
    const yunmu = finalMap[final] || final.toLowerCase()

    return {
      shengmu,
      yunmu,
      pinyin: initial + final
    }
  } catch (error) {
    console.error(`转换汉字"${char}"为双拼编码时出错:`, error)
    return { shengmu: '', yunmu: '', pinyin: '' }
  }
}

/**
 * 获取完整拼音
 * @param {string} char 单个汉字
 * @returns {string} 完整拼音
 */
export function getFullPinyin(char) {
  try {
    const result = pinyin(char, {
      toneType: 'none',
      type: 'string'
    })
    return result.toLowerCase()
  } catch (error) {
    console.error(`获取汉字"${char}"拼音时出错:`, error)
    return ''
  }
}

/**
 * 验证双拼输入是否正确
 * @param {string} char 汉字
 * @param {string} input 用户输入的双拼
 * @returns {boolean} 是否正确
 */
export function validateShuangpinInput(char, input) {
  const { shengmu, yunmu } = getShuangpinCode(char)
  return input.toLowerCase() === (shengmu + yunmu).toLowerCase()
}

/**
 * 生成练习文本
 * @param {Object} lesson 课程信息
 * @returns {Array} 练习文本数组
 */
export function generatePracticeText(lesson) {
  if (!lesson || !lesson.examples) return []

  const practiceChars = []

  // 从课程例子中生成练习文本
  lesson.examples.forEach(example => {
    const code = getShuangpinCode(example.char)
    practiceChars.push({
      char: example.char,
      shengmu: code.shengmu,
      yunmu: code.yunmu,
      pinyin: code.pinyin
    })
  })

  // 重复几次增加练习量
  const repeatedChars = []
  for (let i = 0; i < 3; i++) {
    repeatedChars.push(...practiceChars)
  }

  // 随机打乱
  return repeatedChars.sort(() => Math.random() - 0.5)
}

/**
 * 检查按键是否匹配
 * @param {string} char 当前汉字
 * @param {string} key 按下的键
 * @returns {Object} 匹配结果
 */
export function checkKeyMatch(char, key) {
  const { shengmu, yunmu } = getShuangpinCode(char)

  return {
    isShengmu: key === shengmu,
    isYunmu: key === yunmu,
    isCorrect: key === shengmu || key === yunmu
  }
}

/**
 * 常用汉字列表
 */
export const commonChars = [
  '的',
  '一',
  '是',
  '了',
  '我',
  '不',
  '人',
  '在',
  '他',
  '有',
  '这',
  '个',
  '上',
  '们',
  '来',
  '到',
  '时',
  '大',
  '地',
  '为',
  '子',
  '中',
  '你',
  '说',
  '生',
  '国',
  '年',
  '着',
  '就',
  '那',
  '和',
  '要',
  '她',
  '出',
  '也',
  '得',
  '里',
  '后',
  '自',
  '以',
  '会',
  '家',
  '可',
  '下',
  '而',
  '过',
  '天',
  '去',
  '能',
  '对'
]

/**
 * 获取一段文本中所有汉字的双拼编码
 * @param {string} text 文本
 * @returns {Array<{char: string, shengmu: string, yunmu: string}>} 双拼编码数组
 */
export function getTextShuangpin(text) {
  return Array.from(text).map(char => ({
    char,
    ...getShuangpinCode(char)
  }))
}
