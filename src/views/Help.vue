<!-- Help 帮助页面 - 使用指南和常见问题 -->
<template>
  <div class="help">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">❓ 帮助中心</h1>
          <p class="page-subtitle">学习指南、常见问题和使用技巧</p>
        </div>
      </div>
    </section>

    <!-- 帮助内容 -->
    <section class="help-content">
      <div class="container">
        <div class="help-grid">
          <!-- 快速开始 -->
          <div class="help-section">
            <h2 class="section-title">🚀 快速开始</h2>
            <div class="help-cards">
              <div class="help-card">
                <div class="card-icon">1️⃣</div>
                <div class="card-content">
                  <h3 class="card-title">选择双拼方案</h3>
                  <p class="card-description">
                    在设置中选择您喜欢的双拼方案，推荐小鹤双拼或自然码。
                  </p>
                </div>
              </div>

              <div class="help-card">
                <div class="card-icon">2️⃣</div>
                <div class="card-content">
                  <h3 class="card-title">学习键位</h3>
                  <p class="card-description">
                    从键位学习开始，逐步掌握声母、韵母和整句的输入方法。
                  </p>
                </div>
              </div>

              <div class="help-card">
                <div class="card-icon">3️⃣</div>
                <div class="card-content">
                  <h3 class="card-title">练习打字</h3>
                  <p class="card-description">通过练习模式提高打字速度和准确率，培养肌肉记忆。</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 常见问题 -->
          <div class="help-section">
            <h2 class="section-title">❓ 常见问题</h2>
            <div class="faq-list">
              <div class="faq-item" @click="toggleFaq(0)">
                <div class="faq-question">
                  <span>什么是双拼输入法？</span>
                  <span class="faq-toggle" :class="{ active: activeFaq === 0 }">▼</span>
                </div>
                <div class="faq-answer" v-show="activeFaq === 0">
                  <p>
                    双拼是一种中文输入法，每个汉字的拼音最多只需要两次按键就能输入完成。
                    相比全拼输入法，双拼能够显著提高输入速度和效率。
                  </p>
                </div>
              </div>

              <div class="faq-item" @click="toggleFaq(1)">
                <div class="faq-question">
                  <span>如何选择合适的双拼方案？</span>
                  <span class="faq-toggle" :class="{ active: activeFaq === 1 }">▼</span>
                </div>
                <div class="faq-answer" v-show="activeFaq === 1">
                  <p>
                    推荐初学者选择小鹤双拼或自然码，这两种方案使用人数较多，
                    学习资料丰富。可以根据个人习惯和键位分布来选择。
                  </p>
                </div>
              </div>

              <div class="faq-item" @click="toggleFaq(2)">
                <div class="faq-question">
                  <span>学习双拼需要多长时间？</span>
                  <span class="faq-toggle" :class="{ active: activeFaq === 2 }">▼</span>
                </div>
                <div class="faq-answer" v-show="activeFaq === 2">
                  <p>
                    一般来说，掌握基本的双拼键位需要1-2周时间，
                    达到熟练水平需要1-2个月的持续练习。关键是要坚持每天练习。
                  </p>
                </div>
              </div>

              <div class="faq-item" @click="toggleFaq(3)">
                <div class="faq-question">
                  <span>如何提高打字速度？</span>
                  <span class="faq-toggle" :class="{ active: activeFaq === 3 }">▼</span>
                </div>
                <div class="faq-answer" v-show="activeFaq === 3">
                  <p>
                    提高打字速度的关键是：1. 正确的指法；2. 熟练掌握键位； 3. 大量练习常用词汇；4.
                    保持练习的连贯性。避免过分追求速度而忽略准确率。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 功能介绍 -->
          <div class="help-section">
            <h2 class="section-title">✨ 功能介绍</h2>
            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-icon">⌨️</div>
                <div class="feature-content">
                  <h3 class="feature-title">键位学习</h3>
                  <p class="feature-description">
                    系统化学习双拼键位，从声母到韵母，循序渐进掌握每个按键。
                  </p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">✍️</div>
                <div class="feature-content">
                  <h3 class="feature-title">打字练习</h3>
                  <p class="feature-description">
                    提供多种练习模式，包括单字、词组、文章练习，满足不同需求。
                  </p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">📊</div>
                <div class="feature-content">
                  <h3 class="feature-title">数据统计</h3>
                  <p class="feature-description">
                    详细记录练习数据，包括速度、准确率、错误分析等，帮助改进。
                  </p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">🎮</div>
                <div class="feature-content">
                  <h3 class="feature-title">趣味游戏</h3>
                  <p class="feature-description">
                    游戏化的练习方式，让学习过程更加有趣，提高学习动力。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 快捷键 -->
          <div class="help-section">
            <h2 class="section-title">⌨️ 快捷键</h2>
            <div class="shortcut-list">
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + 1</span>
                <span class="shortcut-desc">返回首页</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + 2</span>
                <span class="shortcut-desc">进入学习</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + 3</span>
                <span class="shortcut-desc">开始练习</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Ctrl + ,</span>
                <span class="shortcut-desc">打开设置</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">F1</span>
                <span class="shortcut-desc">打开帮助</span>
              </div>
              <div class="shortcut-item">
                <span class="shortcut-key">Esc</span>
                <span class="shortcut-desc">关闭弹窗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  // 响应式数据
  const activeFaq = ref(-1)

  // 方法
  const toggleFaq = index => {
    activeFaq.value = activeFaq.value === index ? -1 : index
  }
</script>

<style scoped>
  .help {
    @apply min-h-screen bg-gray-50;
  }

  .app--dark .help {
    @apply bg-gray-900;
  }

  .page-header {
    @apply py-8 bg-white border-b border-gray-200;
  }

  .app--dark .page-header {
    @apply bg-gray-800 border-gray-700;
  }

  .container {
    @apply max-w-4xl mx-auto px-4;
  }

  .header-content {
    @apply text-center;
  }

  .page-title {
    @apply text-3xl font-bold text-gray-900 mb-2;
  }

  .app--dark .page-title {
    @apply text-gray-100;
  }

  .page-subtitle {
    @apply text-lg text-gray-600;
  }

  .app--dark .page-subtitle {
    @apply text-gray-400;
  }

  .help-content {
    @apply py-8;
  }

  .help-grid {
    @apply space-y-8;
  }

  .help-section {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }

  .app--dark .help-section {
    @apply bg-gray-800 border-gray-700;
  }

  .section-title {
    @apply text-xl font-semibold text-gray-900 mb-6;
  }

  .app--dark .section-title {
    @apply text-gray-100;
  }

  /* 帮助卡片 */
  .help-cards {
    @apply grid grid-cols-1 md:grid-cols-3 gap-4;
  }

  .help-card {
    @apply flex items-start space-x-3 p-4 bg-gray-50 rounded-lg;
  }

  .app--dark .help-card {
    @apply bg-gray-700;
  }

  .card-icon {
    @apply text-2xl;
  }

  .card-content {
    @apply flex-1;
  }

  .card-title {
    @apply font-medium text-gray-900 mb-1;
  }

  .app--dark .card-title {
    @apply text-gray-100;
  }

  .card-description {
    @apply text-sm text-gray-600;
  }

  .app--dark .card-description {
    @apply text-gray-400;
  }

  /* FAQ */
  .faq-list {
    @apply space-y-2;
  }

  .faq-item {
    @apply border border-gray-200 rounded-lg overflow-hidden cursor-pointer;
  }

  .app--dark .faq-item {
    @apply border-gray-600;
  }

  .faq-question {
    @apply flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors;
  }

  .app--dark .faq-question {
    @apply bg-gray-700 hover:bg-gray-600;
  }

  .faq-question span:first-child {
    @apply font-medium text-gray-900;
  }

  .app--dark .faq-question span:first-child {
    @apply text-gray-100;
  }

  .faq-toggle {
    @apply text-gray-500 transition-transform duration-200;
  }

  .faq-toggle.active {
    @apply transform rotate-180;
  }

  .faq-answer {
    @apply p-4 bg-white border-t border-gray-200;
  }

  .app--dark .faq-answer {
    @apply bg-gray-800 border-gray-600;
  }

  .faq-answer p {
    @apply text-gray-600 leading-relaxed;
  }

  .app--dark .faq-answer p {
    @apply text-gray-400;
  }

  /* 功能列表 */
  .feature-list {
    @apply space-y-4;
  }

  .feature-item {
    @apply flex items-start space-x-4;
  }

  .feature-icon {
    @apply text-2xl;
  }

  .feature-content {
    @apply flex-1;
  }

  .feature-title {
    @apply font-medium text-gray-900 mb-1;
  }

  .app--dark .feature-title {
    @apply text-gray-100;
  }

  .feature-description {
    @apply text-gray-600;
  }

  .app--dark .feature-description {
    @apply text-gray-400;
  }

  /* 快捷键 */
  .shortcut-list {
    @apply grid grid-cols-1 md:grid-cols-2 gap-3;
  }

  .shortcut-item {
    @apply flex items-center justify-between p-3 bg-gray-50 rounded-lg;
  }

  .app--dark .shortcut-item {
    @apply bg-gray-700;
  }

  .shortcut-key {
    @apply font-mono text-sm bg-gray-200 px-2 py-1 rounded;
  }

  .app--dark .shortcut-key {
    @apply bg-gray-600 text-gray-100;
  }

  .shortcut-desc {
    @apply text-gray-600;
  }

  .app--dark .shortcut-desc {
    @apply text-gray-400;
  }
</style>
