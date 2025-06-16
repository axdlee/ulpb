import { getShuangpinCode } from '../utils/pinyin'

// 课程数据
export const lessons = [
  // 声母课程
  {
    id: 1,
    type: 'initial',
    title: '声母键位学习 - b、p、m、f',
    description: '这节课我们将学习声母 b、p、m、f 的键位。这些声母都在键盘的左手区域,分别由左手的不同手指负责。',
    initials: ['b', 'p', 'm', 'f'],
    examples: [
      { char: '把', ...getShuangpinCode('把') },
      { char: '爸', ...getShuangpinCode('爸') },
      { char: '马', ...getShuangpinCode('马') },
      { char: '法', ...getShuangpinCode('法') }
    ]
  },
  {
    id: 2,
    type: 'initial',
    title: '声母键位学习 - d、t、n、l',
    description: '这节课我们将学习声母 d、t、n、l 的键位。这些声母位于键盘中间区域,需要注意手指的自然伸展。',
    initials: ['d', 't', 'n', 'l'],
    examples: [
      { char: '大', ...getShuangpinCode('大') },
      { char: '天', ...getShuangpinCode('天') },
      { char: '你', ...getShuangpinCode('你') },
      { char: '来', ...getShuangpinCode('来') }
    ]
  },
  {
    id: 3,
    type: 'initial',
    title: '声母键位学习 - g、k、h',
    description: '这节课我们将学习声母 g、k、h 的键位。这些声母位于键盘右手区域,由右手食指和中指负责。',
    initials: ['g', 'k', 'h'],
    examples: [
      { char: '高', ...getShuangpinCode('高') },
      { char: '看', ...getShuangpinCode('看') },
      { char: '好', ...getShuangpinCode('好') },
      { char: '话', ...getShuangpinCode('话') }
    ]
  },
  {
    id: 4,
    type: 'initial',
    title: '声母键位学习 - j、q、x',
    description: '这节课我们将学习声母 j、q、x 的键位。这些声母是一组相关的音,位于键盘右手区域。',
    initials: ['j', 'q', 'x'],
    examples: [
      { char: '家', ...getShuangpinCode('家') },
      { char: '去', ...getShuangpinCode('去') },
      { char: '下', ...getShuangpinCode('下') },
      { char: '学', ...getShuangpinCode('学') }
    ]
  },
  {
    id: 5,
    type: 'initial',
    title: '声母键位学习 - zh、ch、sh、r',
    description: '这节课我们将学习声母 zh、ch、sh、r 的键位。这些是双拼特有的映射,需要特别记忆。',
    initials: ['zh', 'ch', 'sh', 'r'],
    examples: [
      { char: '中', ...getShuangpinCode('中') },
      { char: '吃', ...getShuangpinCode('吃') },
      { char: '是', ...getShuangpinCode('是') },
      { char: '人', ...getShuangpinCode('人') }
    ]
  },
  {
    id: 6,
    type: 'initial',
    title: '声母键位学习 - z、c、s',
    description: '这节课我们将学习声母 z、c、s 的键位。这些声母位于键盘左下角,由左手负责。',
    initials: ['z', 'c', 's'],
    examples: [
      { char: '在', ...getShuangpinCode('在') },
      { char: '从', ...getShuangpinCode('从') },
      { char: '思', ...getShuangpinCode('思') },
      { char: '送', ...getShuangpinCode('送') }
    ]
  },
  {
    id: 7,
    type: 'initial',
    title: '声母键位学习 - y、w',
    description: '这节课我们将学习声母 y、w 的键位。这两个声母用于处理一些特殊的拼音组合。',
    initials: ['y', 'w'],
    examples: [
      { char: '一', ...getShuangpinCode('一') },
      { char: '要', ...getShuangpinCode('要') },
      { char: '我', ...getShuangpinCode('我') },
      { char: '问', ...getShuangpinCode('问') }
    ]
  },

  // 韵母课程
  {
    id: 8,
    type: 'final',
    title: '韵母键位学习 - a、o、e、i、u、v',
    description: '这节课我们将学习基本韵母 a、o、e、i、u、v 的键位。这些是最基础的韵母,也是其他韵母的组成部分。',
    finals: ['a', 'o', 'e', 'i', 'u', 'v'],
    examples: [
      { char: '啊', ...getShuangpinCode('啊') },
      { char: '哦', ...getShuangpinCode('哦') },
      { char: '饿', ...getShuangpinCode('饿') },
      { char: '一', ...getShuangpinCode('一') }
    ]
  },
  {
    id: 9,
    type: 'final',
    title: '韵母键位学习 - ai、ei、ui',
    description: '这节课我们将学习复韵母 ai、ei、ui 的键位。这些韵母在双拼中有特定的映射键位。',
    finals: ['ai', 'ei', 'ui'],
    examples: [
      { char: '爱', ...getShuangpinCode('爱') },
      { char: '美', ...getShuangpinCode('美') },
      { char: '会', ...getShuangpinCode('会') },
      { char: '对', ...getShuangpinCode('对') }
    ]
  },
  {
    id: 10,
    type: 'final',
    title: '韵母键位学习 - ao、ou、iu',
    description: '这节课我们将学习复韵母 ao、ou、iu 的键位。这些韵母在发音和书写上都有一定规律。',
    finals: ['ao', 'ou', 'iu'],
    examples: [
      { char: '好', ...getShuangpinCode('好') },
      { char: '走', ...getShuangpinCode('走') },
      { char: '就', ...getShuangpinCode('就') },
      { char: '有', ...getShuangpinCode('有') }
    ]
  },
  {
    id: 11,
    type: 'final',
    title: '韵母键位学习 - ie、ue、ve',
    description: '这节课我们将学习复韵母 ie、ue、ve 的键位。这些韵母在双拼中共用同一个键位。',
    finals: ['ie', 'ue', 've'],
    examples: [
      { char: '写', ...getShuangpinCode('写') },
      { char: '学', ...getShuangpinCode('学') },
      { char: '月', ...getShuangpinCode('月') },
      { char: '约', ...getShuangpinCode('约') }
    ]
  },
  {
    id: 12,
    type: 'final',
    title: '韵母键位学习 - an、en、in、un',
    description: '这节课我们将学习前鼻韵母 an、en、in、un 的键位。这些韵母的发音都带有鼻音。',
    finals: ['an', 'en', 'in', 'un'],
    examples: [
      { char: '安', ...getShuangpinCode('安') },
      { char: '恩', ...getShuangpinCode('恩') },
      { char: '心', ...getShuangpinCode('心') },
      { char: '春', ...getShuangpinCode('春') }
    ]
  },
  {
    id: 13,
    type: 'final',
    title: '韵母键位学习 - ang、eng、ing、ong',
    description: '这节课我们将学习后鼻韵母 ang、eng、ing、ong 的键位。这些韵母的发音都带有鼻音。',
    finals: ['ang', 'eng', 'ing', 'ong'],
    examples: [
      { char: '长', ...getShuangpinCode('长') },
      { char: '等', ...getShuangpinCode('等') },
      { char: '明', ...getShuangpinCode('明') },
      { char: '中', ...getShuangpinCode('中') }
    ]
  },
  {
    id: 14,
    type: 'final',
    title: '韵母键位学习 - ia、iao、ian、iang',
    description: '这节课我们将学习以 i 开头的复韵母 ia、iao、ian、iang 的键位。',
    finals: ['ia', 'iao', 'ian', 'iang'],
    examples: [
      { char: '家', ...getShuangpinCode('家') },
      { char: '小', ...getShuangpinCode('小') },
      { char: '见', ...getShuangpinCode('见') },
      { char: '想', ...getShuangpinCode('想') }
    ]
  },
  {
    id: 15,
    type: 'final',
    title: '韵母键位学习 - ua、uai、uan、uang',
    description: '这节课我们将学习以 u 开头的复韵母 ua、uai、uan、uang 的键位。',
    finals: ['ua', 'uai', 'uan', 'uang'],
    examples: [
      { char: '瓜', ...getShuangpinCode('瓜') },
      { char: '快', ...getShuangpinCode('快') },
      { char: '关', ...getShuangpinCode('关') },
      { char: '光', ...getShuangpinCode('光') }
    ]
  }
]

// 获取课程信息
export function getLesson(id) {
  return lessons.find(lesson => lesson.id === id)
}

// 获取课程进度
export function getLessonProgress(id) {
  const lesson = getLesson(id)
  if (!lesson) return 0
  
  const totalLessons = lessons.filter(l => l.type === lesson.type).length
  const currentIndex = lessons.findIndex(l => l.id === id)
  
  return Math.round((currentIndex / totalLessons) * 100)
} 