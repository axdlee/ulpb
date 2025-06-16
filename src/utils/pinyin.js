import { pinyin } from 'pinyin-pro'

// 声母映射表
const initialMap = {
  'b': 'b', 'p': 'p', 'm': 'm', 'f': 'f',
  'd': 'd', 't': 't', 'n': 'n', 'l': 'l',
  'g': 'g', 'k': 'k', 'h': 'h',
  'j': 'j', 'q': 'q', 'x': 'x',
  'zh': 'v', 'ch': 'i', 'sh': 'u', 'r': 'r',
  'z': 'z', 'c': 'c', 's': 's',
  'y': 'y', 'w': 'w'
}

// 韵母映射表
const finalMap = {
  'a': 'a', 'o': 'o', 'e': 'e', 'i': 'i', 'u': 'u', 'v': 'v',
  'ai': 'd', 'ei': 'w', 'ui': 'v',
  'ao': 'c', 'ou': 'z', 'iu': 'q',
  'ie': 'x', 'ue': 't', 've': 't',
  'an': 'j', 'en': 'f', 'in': 'n', 'un': 'p',
  'ang': 'h', 'eng': 'g', 'ing': 'k', 'ong': 's',
  'ia': 'w', 'iao': 'k', 'ian': 'm', 'iang': 'l',
  'iong': 's', 'ua': 'w', 'uai': 'y', 'uan': 'r', 'uang': 'l',
  'uo': 'o'
}

/**
 * 获取汉字的双拼编码
 * @param {string} char 单个汉字
 * @returns {{shengmu: string, yunmu: string}} 返回双拼编码对象
 */
export function getShuangpinCode(char) {
  try {
    // 获取完整拼音
    const pinyinResult = pinyin(char, { 
      toneType: 'none',
      type: 'array',
      pattern: 'initial'
    })[0]

    // 分离声母和韵母
    const { initial, final } = pinyinResult

    // 转换为双拼编码
    const shengmu = initialMap[initial] || ''
    const yunmu = finalMap[final] || ''

    return { shengmu, yunmu }
  } catch (error) {
    console.error(`转换汉字"${char}"为双拼编码时出错:`, error)
    return { shengmu: '', yunmu: '' }
  }
}

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

/**
 * 检查输入的按键是否匹配目标双拼编码
 * @param {string} key 输入的按键
 * @param {string} targetShengmu 目标声母
 * @param {string} targetYunmu 目标韵母
 * @returns {boolean} 是否匹配
 */
export function checkKeyMatch(key, targetShengmu, targetYunmu) {
  return key === targetShengmu || key === targetYunmu
}

/**
 * 生成练习文本
 * @param {Array<string>} chars 待选汉字数组
 * @param {number} length 生成文本长度
 * @returns {string} 练习文本
 */
export function generatePracticeText(chars, length = 10) {
  const result = []
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result.push(chars[randomIndex])
  }
  return result.join('')
}

// 常用汉字集合（按声母分组）
export const commonChars = {
  b: ['把', '爸', '百', '白', '办', '半', '帮', '包', '报', '北', '本', '比', '笔', '边', '便', '变'],
  p: ['怕', '拍', '排', '派', '判', '旁', '跑', '朋', '片', '品', '平', '评', '破', '普'],
  m: ['马', '妈', '买', '卖', '满', '慢', '忙', '毛', '么', '没', '每', '美', '门', '们', '面', '民'],
  f: ['发', '法', '反', '饭', '方', '房', '放', '非', '费', '分', '风', '封', '夫', '服', '府', '父'],
  d: ['大', '打', '带', '但', '当', '到', '道', '的', '得', '等', '地', '第', '点', '定', '东', '都'],
  t: ['他', '她', '太', '谈', '汤', '堂', '套', '特', '提', '题', '体', '天', '条', '听', '同', '头'],
  n: ['那', '南', '难', '脑', '呢', '能', '你', '年', '念', '您', '农', '弄', '女'],
  l: ['来', '老', '了', '累', '冷', '离', '里', '理', '力', '利', '连', '凉', '两', '亮', '了', '路'],
  g: ['改', '该', '干', '刚', '高', '告', '哥', '歌', '格', '个', '给', '工', '公', '共', '够', '关'],
  k: ['看', '靠', '科', '可', '课', '空', '口', '哭', '快', '块', '况', '困'],
  h: ['还', '孩', '海', '喊', '好', '号', '喝', '和', '河', '黑', '很', '红', '后', '候', '忽', '护'],
  j: ['家', '加', '假', '间', '见', '件', '建', '江', '讲', '教', '接', '街', '节', '结', '解', '姐'],
  q: ['其', '起', '气', '汽', '前', '钱', '千', '强', '桥', '切', '亲', '轻', '清', '情', '请', '秋'],
  x: ['下', '先', '现', '想', '向', '小', '笑', '些', '写', '新', '心', '信', '星', '行', '学', '样'],
  zh: ['这', '着', '找', '照', '者', '真', '正', '知', '直', '指', '纸', '止', '只', '中', '种', '重'],
  ch: ['差', '常', '场', '唱', '车', '成', '城', '吃', '出', '处', '穿', '传', '窗', '床', '春', '词'],
  sh: ['山', '上', '少', '谁', '身', '深', '什', '生', '师', '十', '时', '识', '实', '始', '世', '事'],
  r: ['然', '让', '热', '人', '认', '日', '容', '肉', '如', '入', '软', '弱'],
  z: ['在', '再', '咱', '早', '怎', '增', '展', '站', '张', '找', '照', '者', '这', '真', '正', '走'],
  c: ['才', '菜', '参', '草', '层', '茶', '查', '差', '常', '场', '唱', '车', '成', '城', '吃', '出'],
  s: ['三', '色', '森', '杀', '山', '上', '少', '谁', '身', '深', '什', '生', '师', '十', '时', '识'],
  y: ['也', '业', '夜', '一', '以', '已', '义', '艺', '易', '意', '因', '音', '印', '应', '用', '有'],
  w: ['外', '玩', '完', '晚', '万', '王', '望', '为', '位', '文', '问', '我', '无', '五', '物', '务']
}

// 常用词组（用于词组练习）
export const commonPhrases = [
  '你好', '早上好', '晚上好', '谢谢你', '不客气',
  '再见', '明天见', '很高兴', '认识你', '对不起',
  '没关系', '请问', '知道了', '好的', '现在',
  '今天', '明天', '昨天', '时间', '地点',
  '学习', '工作', '生活', '朋友', '家人',
  '北京', '上海', '广州', '深圳', '成都',
  '中国', '美国', '日本', '英国', '法国',
  '电脑', '手机', '互联网', '软件', '程序',
  '音乐', '电影', '运动', '旅游', '美食',
  '春天', '夏天', '秋天', '冬天', '季节'
] 