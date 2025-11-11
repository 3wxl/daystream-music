一、Daystream Music（白昼音流）
一款专注于高品质音乐体验的 Web 音乐平台，支持音乐播放、歌单管理、音乐人入驻、社区互动等核心功能，采用 Vue 3 + Tailwind CSS 构建，界面简洁优雅，交互流畅自然。

二、依赖说明：
前端框架：Vue 3
状态管理：Pinia
样式框架：Tailwind CSS
图标库：阿里 Iconfont
网络请求：Axios
构建工具：Vite

三、命名规范：1.文件命名：
组件文件：采用 PascalCase，首字母大写，如 ProfileHeader.vue
工具 / 配置文件：采用 kebab-case（短横线命名法），全小写，如 format-time.js
状态管理文件：采用 kebab-case，如 player.js
样式文件：采用 kebab-case，如 iconfont.css
图片资源：采用 kebab-case，如 logo-dark.png

2. 变量 / 函数命名
   普通变量 / 函数：采用 camelCase（驼峰命名法，首字母小写），例如：currentSong
   常量（常量值不可变）：采用 UPPER_SNAKE_CASE（大写蛇形命名法），例如：API_BASE_URL

3. 组件 props/emit 命名
   props（组件属性）：采用 camelCase，与组件内变量命名一致，例如：userInfo
   emit 事件（组件触发的事件）：采用 kebab-case（短横线分隔），例如：update-avatar

4. CSS 类名命名
   采用 kebab-case（与 Tailwind 工具类风格一致），例如：
   playlist-card

5. 分支命名规范
   见名知意
   说明：
   功能描述用短横线分隔，小写英文，避免过于宽泛的描述，需明确具体功能

6. 提交信息规范
   1）feat 新功能 eg:feat: 新增歌单创建功能
   2）fix Bug 修复 eg:fix: 修复播放器进度条不更新问题
   3）refactor 代码重构 eg:refactor: 优化 API 请求逻辑
   4）docs 文档更新 eg:docs: 完善 README 命名规范
   5）style 样式 / 格式调整 eg:style: 统一代码缩进为 2 空格
   6）chore 工程配置 / 依赖变更 rg:chore: 升级 axios 到 v1.0
   说明：描述首字母小写，用中文时结尾不加标点，若需更详细说明，可在描述后空一行，添加多行补充内容
