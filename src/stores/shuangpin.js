/**
* 双拼方案状态管理
* 管理双拼输入方案、键位映射、自定义方案等
*/

import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'

// 完整的双拼方案配置
const SHUANGPIN_SCHEMES = {
  xiaohe: {
    name: '小鹤双拼',
    description: '小鹤双拼是一种形码双拼方案，键位布局科学合理',
    author: '何海峰',
    version: '2.0',
    category: 'mainstream',
    popularity: 95,
    shengmu: {
      b: 'b', p: 'p', m: 'm', f: 'f',
      d: 'd', t: 't', n: 'n', l: 'l',
      g: 'g', k: 'k', h: 'h',
      j: 'j', q: 'q', x: 'x',
      zh: 'v', ch: 'i', sh: 'u', r: 'r',
      z: 'z', c: 'c', s: 's',
      y: 'y', w: 'w'
    },
    yunmu: {
      a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
      ai: 'd', ei: 'w', ui: 'v',
      ao: 'c', ou: 'z', iu: 'q',
      ie: 'x', ue: 't', ve: 't',
      an: 'j', en: 'f', in: 'n', un: 'p',
      ang: 'h', eng: 'g', ing: 'k', ong: 's',
      ia: 'w', iao: 'k', ian: 'm', iang: 'l',
      iong: 's', ua: 'w', uai: 'y', uan: 'r', uang: 'l',
      uo: 'o'
    }
  },
  microsoft: {
    name: '微软双拼',
    description: '微软 Windows 系统内置的双拼方案',
    author: 'Microsoft',
    version: '2.0',
    category: 'standard',
    popularity: 85,
    shengmu: {
      b: 'b', p: 'p', m: 'm', f: 'f',
      d: 'd', t: 't', n: 'n', l: 'l',
      g: 'g', k: 'k', h: 'h',
      j: 'j', q: 'q', x: 'x',
      zh: 'v', ch: 'i', sh: 'u', r: 'r',
      z: 'z', c: 'c', s: 's',
      y: 'y', w: 'w'
    },
    yunmu: {
      a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
      ai: 'l', ei: 'z', ui: 'v',
      ao: 'k', ou: 'b', iu: 'q',
      ie: 'x', ue: 't', ve: 't',
      an: 'j', en: 'f', in: 'n', un: 'y',
      ang: 'h', eng: 'g', ing: ';', ong: 's',
      ia: 'w', iao: 'c', ian: 'm', iang: 'd',
      iong: 's', ua: 'w', uai: 'y', uan: 'r', uang: 'd',
      uo: 'o'
    }
  },
  ziranma: {
    name: '自然码双拼',
    description: '自然码输入法的双拼方案，历史悠久',
    author: '周志农',
    version: '1.0',
    category: 'classic',
    popularity: 75,
    shengmu: {
      b: 'b', p: 'p', m: 'm', f: 'f',
      d: 'd', t: 't', n: 'n', l: 'l',
      g: 'g', k: 'k', h: 'h',
      j: 'j', q: 'q', x: 'x',
      zh: 'v', ch: 'i', sh: 'u', r: 'r',
      z: 'z', c: 'c', s: 's',
      y: 'y', w: 'w'
    },
    yunmu: {
      a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
      ai: 'l', ei: 'z', ui: 'v',
      ao: 'k', ou: 'b', iu: 'q',
      ie: 'x', ue: 't', ve: 't',
      an: 'j', en: 'f', in: 'n', un: 'y',
      ang: 'h', eng: 'g', ing: ';', ong: 's',
      ia: 'w', iao: 'c', ian: 'm', iang: 'd',
      iong: 's', ua: 'w', uai: 'y', uan: 'r', uang: 'd',
      uo: 'o'
    }
  },
  sougou: {
    name: '搜狗双拼',
    description: '搜狗输入法的双拼方案',
    author: '搜狗',
    version: '1.0',
    category: 'modern',
    popularity: 80,
    shengmu: {
      b: 'b', p: 'p', m: 'm', f: 'f',
      d: 'd', t: 't', n: 'n', l: 'l',
      g: 'g', k: 'k', h: 'h',
      j: 'j', q: 'q', x: 'x',
      zh: 'v', ch: 'i', sh: 'u', r: 'r',
      z: 'z', c: 'c', s: 's',
      y: 'y', w: 'w'
    },
    yunmu: {
      a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
      ai: 'l', ei: 'z', ui: 'v',
      ao: 'k', ou: 'b', iu: 'q',
      ie: 'x', ue: 't', ve: 't',
      an: 'j', en: 'f', in: 'n', un: 'y',
      ang: 'h', eng: 'g', ing: ';', ong: 's',
      ia: 'w', iao: 'c', ian: 'm', iang: 'd',
      iong: 's', ua: 'w', uai: 'y', uan: 'r', uang: 'd',
      uo: 'o'
    }
  },
  zhineng: {
    name: '智能ABC双拼',
    description: '智能ABC输入法的双拼方案',
    author: '智能ABC',
    version: '1.0',
    category: 'classic',
    popularity: 60,
    shengmu: {
      b: 'b', p: 'p', m: 'm', f: 'f',
      d: 'd', t: 't', n: 'n', l: 'l',
      g: 'g', k: 'k', h: 'h',
      j: 'j', q: 'q', x: 'x',
      zh: 'a', ch: 'e', sh: 'v', r: 'r',
      z: 'z', c: 'c', s: 's',
      y: 'y', w: 'w'
    },
    yunmu: {
      a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
      ai: 'l', ei: 'q', ui: 'v',
      ao: 'k', ou: 'b', iu: 'q',
      ie: 'x', ue: 't', ve: 't',
      an: 'j', en: 'f', in: 'n', un: 'y',
      ang: 'h', eng: 'g', ing: ';', ong: 's',
      ia: 'w', iao: 'c', ian: 'm', iang: 'd',
      iong: 's', ua: 'w', uai: 'y', uan: 'r', uang: 'd',
      uo: 'o'
    }
  },
  pinyin_jiajia: {
    name: '拼音加加双拼',
    description: '拼音加加输入法的双拼方案',
    author: '拼音加加',
    version: '1.0',
    category: 'alternative',
    popularity: 50,
    shengmu: {
      b: 'b', p: 'p', m: 'm', f: 'f',
      d: 'd', t: 't', n: 'n', l: 'l',
      g: 'g', k: 'k', h: 'h',
      j: 'j', q: 'q', x: 'x',
      zh: 'v', ch: 'u', sh: 'i', r: 'r',
      z: 'z', c: 'c', s: 's',
      y: 'y', w: 'w'
    },
    yunmu: {
      a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
      ai: 's', ei: 'w', ui: 'v',
      ao: 'd', ou: 'z', iu: 'r',
      ie: 'x', ue: 't', ve: 't',
      an: 'f', en: 'g', in: 'h', un: 'j',
      ang: 'k', eng: 'l', ing: ';', ong: 'q',
      ia: 'b', iao: 'n', ian: 'm', iang: 'p',
      iong: 'q', ua: 'b', uai: 'n', uan: 'm', uang: 'p',
      uo: 'o'
    }
  }
}

// 生成键盘布局数据
function generateKeyboardLayout(scheme) {
  const layout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ]

  return layout.map((row, rowIndex) => ({
    row: rowIndex + 1,
    keys: row.map(key => {
      const keyData = { key, display: key === ';' ? '分号' : key.toUpperCase() }
      
      // 查找这个键位上的声母
      for (const [shengmu, k] of Object.entries(scheme.shengmu)) {
        if (k === key) {
          keyData.type = 'shengmu'
          keyData.shengmu = shengmu
          keyData.display = key.toUpperCase()
          keyData.labels = keyData.labels || []
          keyData.labels.push({ type: 'shengmu', value: shengmu })
          break
        }
      }

      // 查找这个键位上的韵母
      for (const [yunmu, k] of Object.entries(scheme.yunmu)) {
        if (k === key) {
          keyData.type = keyData.type === 'shengmu' ? 'both' : 'yunmu'
          keyData.yunmu = yunmu
          keyData.labels = keyData.labels || []
          keyData.labels.push({ type: 'yunmu', value: yunmu })
        }
      }

      // 设置键位类型样式
      if (!keyData.type) {
        keyData.type = 'normal'
      }

      return keyData
    })
  }))
}

// 验证双拼方案的完整性
function validateScheme(scheme) {
  const errors = []
  
  // 检查必需字段
  if (!scheme.name) errors.push('缺少方案名称')
  if (!scheme.shengmu) errors.push('缺少声母映射')
  if (!scheme.yunmu) errors.push('缺少韵母映射')
  
  // 检查声母完整性
  const requiredShengmu = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w']
  const missingShengmu = requiredShengmu.filter(sm => !scheme.shengmu[sm])
  if (missingShengmu.length > 0) {
    errors.push(`缺少声母: ${missingShengmu.join(', ')}`)
  }
  
  // 检查韵母完整性
  const requiredYunmu = ['a', 'o', 'e', 'i', 'u', 'v', 'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'ue', 've', 'an', 'en', 'in', 'un', 'ang', 'eng', 'ing', 'ong']
  const missingYunmu = requiredYunmu.filter(ym => !scheme.yunmu[ym])
  if (missingYunmu.length > 0) {
    errors.push(`缺少韵母: ${missingYunmu.join(', ')}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const useShuangpinStore = defineStore('shuangpin', {
  state: () => ({
    // 当前选择的双拼方案
    currentSchemeKey: 'xiaohe',
    
    // 自定义方案存储
    customSchemes: {},
    
    // 方案学习进度
    schemeProgress: {},
    
    // 键位熟练度
    keyMastery: {},
    
    // 方案比较数据
    comparisonData: null
  }),

  getters: {
    // 获取当前双拼方案
    currentScheme() {
      return SHUANGPIN_SCHEMES[this.currentSchemeKey] || this.customSchemes[this.currentSchemeKey] || SHUANGPIN_SCHEMES.xiaohe
    },
    
    // 获取所有可用的双拼方案
    availableSchemes() {
      const builtinSchemes = Object.entries(SHUANGPIN_SCHEMES).map(([key, scheme]) => ({
        key,
        ...scheme,
        isBuiltin: true
      }))
      
      const customSchemes = Object.entries(this.customSchemes).map(([key, scheme]) => ({
        key,
        ...scheme,
        isBuiltin: false
      }))
      
      return [...builtinSchemes, ...customSchemes].sort((a, b) => b.popularity - a.popularity)
    },
    
    // 获取方案分类
    schemesByCategory() {
      const schemes = this.availableSchemes
      const categories = {
        mainstream: { name: '主流方案', schemes: [] },
        standard: { name: '标准方案', schemes: [] },
        classic: { name: '经典方案', schemes: [] },
        modern: { name: '现代方案', schemes: [] },
        alternative: { name: '其他方案', schemes: [] },
        custom: { name: '自定义方案', schemes: [] }
      }
      
      schemes.forEach(scheme => {
        const category = scheme.isBuiltin ? scheme.category : 'custom'
        if (categories[category]) {
          categories[category].schemes.push(scheme)
        }
      })
      
      return categories
    },
    
    // 获取当前方案的键盘布局
    currentKeyboardLayout() {
      return generateKeyboardLayout(this.currentScheme)
    },
    
    // 获取当前方案信息
    currentSchemeInfo() {
      const scheme = this.currentScheme
      const validation = validateScheme(scheme)
      
      return {
        ...scheme,
        isValid: validation.isValid,
        errors: validation.errors,
        totalKeys: Object.keys(scheme.shengmu).length + Object.keys(scheme.yunmu).length,
        keyboardLayout: this.currentKeyboardLayout
      }
    },
    
    // 获取键位映射统计
    keyMappingStats() {
      const scheme = this.currentScheme
      const stats = {
        shengmuCount: Object.keys(scheme.shengmu).length,
        yunmuCount: Object.keys(scheme.yunmu).length,
        conflictKeys: [],
        unusedKeys: []
      }
      
      // 检查键位冲突
      const usedKeys = new Set()
      const conflictKeys = new Set()
      
      Object.values(scheme.shengmu).forEach(key => {
        if (usedKeys.has(key)) {
          conflictKeys.add(key)
        }
        usedKeys.add(key)
      })
      
      Object.values(scheme.yunmu).forEach(key => {
        if (usedKeys.has(key)) {
          conflictKeys.add(key)
        }
        usedKeys.add(key)
      })
      
      stats.conflictKeys = Array.from(conflictKeys)
      
      // 检查未使用的键位
      const allKeys = 'abcdefghijklmnopqrstuvwxyz;'.split('')
      stats.unusedKeys = allKeys.filter(key => !usedKeys.has(key))
      
      return stats
    },
    
    // 获取学习建议
    learningRecommendations() {
      const progress = this.schemeProgress[this.currentSchemeKey]
      const mastery = this.keyMastery
      
      if (!progress) {
        return {
          phase: 'beginner',
          recommendations: [
            '建议先学习常用声母：b、p、m、f、d、t、n、l',
            '重点掌握基础韵母：a、o、e、i、u',
            '每天练习15-20分钟，保持连续性'
          ]
        }
      }
      
      const weakKeys = Object.entries(mastery)
        .filter(([, level]) => level < 0.8)
        .map(([key]) => key)
        .slice(0, 5)
      
      return {
        phase: progress.masteredKeys?.length > 15 ? 'advanced' : 'intermediate',
        recommendations: [
          weakKeys.length > 0 ? `重点练习薄弱键位: ${weakKeys.join(', ')}` : '继续巩固已掌握的键位',
          '增加词组和句子练习',
          '尝试提高打字速度和准确率'
        ]
      }
    }
  },

  actions: {
    // 切换双拼方案
    changeScheme(schemeKey) {
      if (SHUANGPIN_SCHEMES[schemeKey] || this.customSchemes[schemeKey]) {
        this.currentSchemeKey = schemeKey
        
        // 初始化方案进度
        if (!this.schemeProgress[schemeKey]) {
          this.schemeProgress[schemeKey] = {
            startDate: Date.now(),
            practiceTime: 0,
            masteredKeys: [],
            totalPractices: 0
          }
        }
        
        return true
      }
      return false
    },
    
    // 创建自定义方案
    createCustomScheme(schemeData) {
      const validation = validateScheme(schemeData)
      if (!validation.isValid) {
        return { success: false, errors: validation.errors }
      }
      
      const schemeKey = `custom_${Date.now()}`
      this.customSchemes[schemeKey] = {
        ...schemeData,
        category: 'custom',
        popularity: 0,
        createdAt: Date.now()
      }
      
      return { success: true, schemeKey }
    },
    
    // 更新自定义方案
    updateCustomScheme(schemeKey, updates) {
      if (this.customSchemes[schemeKey]) {
        const updatedScheme = { ...this.customSchemes[schemeKey], ...updates }
        const validation = validateScheme(updatedScheme)
        
        if (validation.isValid) {
          this.customSchemes[schemeKey] = updatedScheme
          return { success: true }
        } else {
          return { success: false, errors: validation.errors }
        }
      }
      
      return { success: false, errors: ['方案不存在'] }
    },
    
    // 删除自定义方案
    deleteCustomScheme(schemeKey) {
      if (this.customSchemes[schemeKey]) {
        delete this.customSchemes[schemeKey]
        
        // 如果删除的是当前方案，切换到默认方案
        if (this.currentSchemeKey === schemeKey) {
          this.currentSchemeKey = 'xiaohe'
        }
        
        return true
      }
      return false
    },
    
    // 导出方案
    exportScheme(schemeKey) {
      const scheme = SHUANGPIN_SCHEMES[schemeKey] || this.customSchemes[schemeKey]
      if (scheme) {
        return {
          ...scheme,
          exportDate: new Date().toISOString(),
          version: '2.0'
        }
      }
      return null
    },
    
    // 导入方案
    importScheme(schemeData) {
      try {
        const validation = validateScheme(schemeData)
        if (!validation.isValid) {
          return { success: false, errors: validation.errors }
        }
        
        const result = this.createCustomScheme(schemeData)
        if (result.success) {
          return { success: true, message: '方案导入成功', schemeKey: result.schemeKey }
        } else {
          return result
        }
      } catch (error) {
        return { success: false, errors: ['导入数据格式错误'] }
      }
    },
    
    // 更新键位熟练度
    updateKeyMastery(key, accuracy, speed) {
      if (!this.keyMastery[key]) {
        this.keyMastery[key] = {
          accuracy: 0,
          speed: 0,
          practiceCount: 0,
          lastPractice: 0
        }
      }
      
      const mastery = this.keyMastery[key]
      mastery.practiceCount += 1
      mastery.accuracy = (mastery.accuracy * (mastery.practiceCount - 1) + accuracy) / mastery.practiceCount
      mastery.speed = (mastery.speed * (mastery.practiceCount - 1) + speed) / mastery.practiceCount
      mastery.lastPractice = Date.now()
      
      // 计算综合熟练度 (0-1)
      const level = (mastery.accuracy * 0.7 + Math.min(mastery.speed / 100, 1) * 0.3)
      mastery.level = level
      
      return level
    },
    
    // 获取键位对应的拼音元素
    getKeyMapping(key) {
      const scheme = this.currentScheme
      const result = { key, mappings: [] }
      
      // 查找声母
      for (const [shengmu, k] of Object.entries(scheme.shengmu)) {
        if (k === key) {
          result.mappings.push({ type: 'shengmu', value: shengmu })
        }
      }
      
      // 查找韵母
      for (const [yunmu, k] of Object.entries(scheme.yunmu)) {
        if (k === key) {
          result.mappings.push({ type: 'yunmu', value: yunmu })
        }
      }
      
      return result
    },

    // 获取键位详细信息 (Learning页面需要)
    getKeyInfo(key) {
      const mapping = this.getKeyMapping(key)
      if (!mapping || mapping.mappings.length === 0) {
        return {
          key: key,
          type: 'unknown',
          pinyin: '',
          description: '未知键位',
          examples: []
        }
      }

      const mainMapping = mapping.mappings[0]
      const examples = this.getExamplesForKey(key)
      
      return {
        key: key,
        type: mainMapping.type,
        pinyin: mainMapping.value,
        description: `${mainMapping.type === 'shengmu' ? '声母' : '韵母'} ${mainMapping.value}`,
        examples: examples,
        allMappings: mapping.mappings
      }
    },

    // 获取键位示例字符
    getExamplesForKey(key) {
      const exampleMap = {
        'q': ['曲', '全', '去'],
        'w': ['我', '问', '为'],
        'e': ['额', '恶', '鹅'], 
        'r': ['人', '如', '然'],
        't': ['他', '天', '太'],
        'y': ['有', '一', '要'],
        'u': ['是', '上', '时'],
        'i': ['在', '中', '之'],
        'o': ['的', '了', '到'],
        'p': ['不', '把', '被'],
        'a': ['啊', '安', '案'],
        's': ['三', '十', '说'],
        'd': ['大', '对', '都'],
        'f': ['发', '分', '非'],
        'g': ['个', '国', '过'],
        'h': ['和', '会', '还'],
        'j': ['就', '家', '见'],
        'k': ['可', '看', '开'],
        'l': ['来', '老', '了'],
        'z': ['这', '知', '只'],
        'x': ['小', '下', '想'],
        'c': ['从', '出', '长'],
        'v': ['很', '和', '或'],
        'b': ['本', '比', '别'],
        'n': ['那', '你', '年'],
        'm': ['没', '么', '们']
      }
      
      return exampleMap[key] || []
    },
    
    // 比较两个方案
    compareSchemes(schemeKey1, schemeKey2) {
      const scheme1 = SHUANGPIN_SCHEMES[schemeKey1] || this.customSchemes[schemeKey1]
      const scheme2 = SHUANGPIN_SCHEMES[schemeKey2] || this.customSchemes[schemeKey2]
      
      if (!scheme1 || !scheme2) {
        return null
      }
      
      const comparison = {
        schemes: [scheme1, scheme2],
        differences: {
          shengmu: [],
          yunmu: []
        },
        similarities: {
          shengmu: [],
          yunmu: []
        }
      }
      
      // 比较声母
      const allShengmu = new Set([...Object.keys(scheme1.shengmu), ...Object.keys(scheme2.shengmu)])
      allShengmu.forEach(sm => {
        const key1 = scheme1.shengmu[sm]
        const key2 = scheme2.shengmu[sm]
        
        if (key1 === key2) {
          comparison.similarities.shengmu.push({ element: sm, key: key1 })
        } else {
          comparison.differences.shengmu.push({ element: sm, keys: [key1, key2] })
        }
      })
      
      // 比较韵母
      const allYunmu = new Set([...Object.keys(scheme1.yunmu), ...Object.keys(scheme2.yunmu)])
      allYunmu.forEach(ym => {
        const key1 = scheme1.yunmu[ym]
        const key2 = scheme2.yunmu[ym]
        
        if (key1 === key2) {
          comparison.similarities.yunmu.push({ element: ym, key: key1 })
        } else {
          comparison.differences.yunmu.push({ element: ym, keys: [key1, key2] })
        }
      })
      
      this.comparisonData = comparison
      return comparison
    },
    
    // 清除比较数据
    clearComparison() {
      this.comparisonData = null
    },
    
    // 重置方案学习数据
    resetSchemeProgress(schemeKey) {
      if (this.schemeProgress[schemeKey]) {
        this.schemeProgress[schemeKey] = {
          startDate: Date.now(),
          practiceTime: 0,
          masteredKeys: [],
          totalPractices: 0
        }
      }
    },
    
    // 更新方案学习进度
    updateSchemeProgress(practiceData) {
      const schemeKey = this.currentSchemeKey
      if (!this.schemeProgress[schemeKey]) {
        this.schemeProgress[schemeKey] = {
          startDate: Date.now(),
          practiceTime: 0,
          masteredKeys: [],
          totalPractices: 0
        }
      }
      
      const progress = this.schemeProgress[schemeKey]
      progress.practiceTime += practiceData.duration || 0
      progress.totalPractices += 1
      
      // 更新掌握的键位
      if (practiceData.masteredKeys) {
        practiceData.masteredKeys.forEach(key => {
          if (!progress.masteredKeys.includes(key)) {
            progress.masteredKeys.push(key)
          }
        })
      }
    }
  }
})