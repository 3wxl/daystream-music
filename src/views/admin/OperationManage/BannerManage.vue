<template>
  <div class="min-h-screen shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
    <header class="mb-3">
      <h1 class="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-gray-800 flex items-center gap-3">
        <IconFontSymbol name="lunbotuguanli" class="text-[#363636]" size="45px"></IconFontSymbol>
        <span>轮播图管理</span>
      </h1>
    </header>

    <div class="bg-gray-50 rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex flex-wrap gap-3">
        <el-button
          type="primary"
          @click="openAddDialog"
          class="bg-blue-500 hover:bg-blue-600 text-white transition-all"
        >
          <IconFontSymbol name="tianjia" class="text-[white] mr-1" size="16px" ></IconFontSymbol>
          添加轮播图
        </el-button>
        <el-button
          type="default"
          @click="refreshData"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all hover:text-blue-600 relative"
        >
          <IconFontSymbol name="refresh" class="text-[#363636] mr-1"  size="15px" ></IconFontSymbol>
          刷新
        </el-button>
        <el-button
          type="default"
          @click="isPreview = true"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all hover:text-blue-600 relative"
        >
          <IconFontSymbol name="print-view" class="text-[#363636] mr-1 relative top-[1px]" size="13px" ></IconFontSymbol>
          预览
        </el-button>
        <BannerPreview v-model="isPreview" :bannerData="currentDisplayBanners"></BannerPreview>
      </div>
      <div class="w-[250px]">
        <AdminInput
          v-model="searchKeyword"
          placeholder="搜索轮播图名称"
          prefix="&#xe65c;"
          width="250px"
        ></AdminInput>
      </div>
    </div>

    <!-- 轮播图状态提示 -->
    <div class="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100 flex items-start gap-3">
      <IconFontSymbol name="jieshi" class="text-blue-500"></IconFontSymbol>
      <div>
        <h3 class="font-medium text-blue-800">轮播图展示规则</h3>
        <p class="text-sm text-blue-700 mt-1">
          系统将始终保持4个轮播图同时展示。当当前时间段的轮播图少于4个时，会自动从未来时间段的轮播图中补充；
          当超过4个时，将按创建时间排序，仅展示最新的4个。默认轮播图不可删除，仅可编辑。
        </p>
      </div>
    </div>

    <!-- 轮播图列表 -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <IconFontSymbol name="liebiao" ></IconFontSymbol>
        <span>轮播图列表</span>
      </h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">轮播图名称</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">类型</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">点击类型</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">开始时间</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">结束时间</th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(bannerObj, index) in filteredBanners"
              :key="bannerObj.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="py-3 px-4 border-b border-gray-100 font-medium">
                {{ bannerObj.name }}
                <el-tag size="mini" v-if="bannerObj.isDefault" class="ml-2 bg-gray-200 text-gray-700">默认</el-tag>
              </td>
              <td class="py-3 px-4 border-b border-gray-100">
                <el-tag :type="bannerObj.isDefault ? 'default' : 'primary'">
                  {{ bannerObj.isDefault ? '系统默认' : '自定义' }}
                </el-tag>
              </td>
              <td class="py-3 px-4 border-b border-gray-100">
                <el-tag :type="getClickTypeTagType(bannerObj.clickType)">
                  {{ getClickTypeText(bannerObj.clickType) }}
                </el-tag>
                <div class="text-xs text-gray-500 mt-1 truncate">
                  {{ bannerObj.clickType === 'link' ? bannerObj.linkUrl :
                     bannerObj.clickType === 'music' ? bannerObj.musicName :
                     bannerObj.clickType === 'playlist' ? bannerObj.playlistName : '无' }}
                </div>
              </td>
              <td class="py-3 px-4 border-b border-gray-100">{{ formatDate(bannerObj.startTime) }}</td>
              <td class="py-3 px-4 border-b border-gray-100">{{ formatDate(bannerObj.endTime) }}</td>
              <td class="py-3 px-4 border-b border-gray-100">
                <el-tag
                  :type="isCurrentlyDisplayed(bannerObj) ? 'success' : (isActive(bannerObj) ? 'info' : 'warning')"
                >
                  {{ isCurrentlyDisplayed(bannerObj) ? '当前展示' : (isActive(bannerObj) ? '展示' : '未生效') }}
                </el-tag>
              </td>
            </tr>
            <tr v-if="filteredBanners.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500">
                <el-empty description="暂无轮播图数据" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 当前展示的轮播图 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
      <div class="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-lg font-semibold flex items-center gap-2">
          <IconFontSymbol name="gongzuotai-dongtaishenhe"></IconFontSymbol>
          <span>当前展示的轮播图（共4个）</span>
        </h2>
        <span class="text-sm text-gray-500">更新时间: {{ formatDate(currentDisplayUpdateTime) }}</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div
          v-for="(banner, index) in currentDisplayBanners"
          :key="banner.id"
          class="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all group relative"
        >
          <div class="absolute top-2 left-2 flex gap-1">
            <el-tag type="success" size="mini">展示中</el-tag>
            <el-tag v-if="banner.isDefault" size="mini" class="bg-gray-200 text-gray-700">默认</el-tag>
          </div>
          <div class="relative aspect-video bg-gray-50">
            <img
              :src="banner.imageUrl"
              alt="轮播图"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
              <h3 class="font-medium text-sm truncate">{{ banner.name }}</h3>
              <div class="text-xs mt-1 opacity-90 flex flex-wrap gap-1">
                <el-tag size="mini" :type="getClickTypeTagType(banner.clickType)" class="mr-1">
                  {{ getClickTypeText(banner.clickType) }}
                </el-tag>
              </div>
              <div class="text-xs mt-1 opacity-80 truncate">
                {{ banner.clickType === 'link' ? `链接: ${banner.linkUrl}` :
                   banner.clickType === 'music' ? `音乐: ${banner.musicName}` :
                   banner.clickType === 'playlist' ? `歌单: ${banner.playlistName}` : '无点击行为' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 所有轮播图列表 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div class="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-lg font-semibold flex items-center gap-2">
          <IconFontSymbol name="sandian"></IconFontSymbol>
          <span>所有轮播图</span>
        </h2>
        <span class="text-sm text-gray-500">共 {{ banners.length }} 张轮播图（1张默认 + {{ banners.length - 1 }} 张自定义）</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        <div
          v-for="(banner, index) in filteredBanners"
          :key="banner.id"
          class="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all group relative"
        >
          <div class="relative aspect-video bg-gray-50">
            <img
              :src="banner.imageUrl"
              alt="轮播图"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute top-2 right-2 flex gap-1">
              <el-tooltip content="编辑">
                <el-button
                  size="mini"
                  circle
                  @click.stop="openEditDialog(banner)"
                  class="bg-white/80 hover:bg-white text-gray-700 shadow-sm"
                >
                  <IconFontSymbol name="bianji"></IconFontSymbol>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" v-if="!banner.isDefault">
                <el-button
                  size="mini"
                  circle
                  @click.stop="handleDelete(banner.id)"
                  class="bg-white/80 hover:bg-red-500/80 hover:text-red-500 text-red-500 shadow-sm"
                >
                  <IconFontSymbol name="shanchu"></IconFontSymbol>
                </el-button>
              </el-tooltip>
              <el-tooltip content="默认轮播图不可删除" v-else>
                <el-button
                  size="mini"
                  circle
                  disabled
                  class="bg-white/50 text-gray-400 shadow-sm cursor-not-allowed"
                >
                  <IconFontSymbol name="shanchu"></IconFontSymbol>
                </el-button>
              </el-tooltip>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
              <h3 class="font-medium text-sm truncate">{{ banner.name }}</h3>
              <div class="text-xs mt-1 opacity-90 flex flex-wrap gap-1">
                <el-tag size="mini" :type="banner.isDefault ? 'default' : 'primary'" class="mr-1">
                  {{ banner.isDefault ? '系统默认' : '自定义' }}
                </el-tag>
                <el-tag size="mini" :type="getClickTypeTagType(banner.clickType)" class="mr-1">
                  {{ getClickTypeText(banner.clickType) }}
                </el-tag>
                <el-tag size="mini" :type="isCurrentlyDisplayed(banner) ? 'success' : (isActive(banner) ? 'info' : 'warning')">
                  {{ isCurrentlyDisplayed(banner) ? '当前展示' : (isActive(banner) ? '展示中' : '未生效') }}
                </el-tag>
              </div>
              <div class="text-xs mt-1 opacity-80 flex items-center gap-1">
                <el-icon size="12"><Clock /></el-icon>
                {{ formatDate(banner.startTime) }} 至 {{ formatDate(banner.endTime) }}
              </div>
            </div>
            <el-tag v-if="banner.isDefault" class="absolute top-2 left-2 text-xs bg-gray-200 text-gray-700">
              默认轮播图
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑轮播图对话框 -->
    <AdminConfirm
      :title="isEditMode ? (form.isDefault ? '编辑默认轮播图' : '编辑轮播图') : '添加轮播图'"
      v-model="isDialogOpen"
      width="600px"
      :close-on-click-modal="false"
      isCustom=true
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="formRef"
        label-width="100px"
        class="space-y-4"
      >
        <el-form-item label="轮播图名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入轮播图名称"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="轮播图图片" prop="imageUrl">
          <div class="flex flex-col gap-2">
            <el-upload
              class="upload-demo"
              :auto-upload="false"
              :on-change="handleImageChange"
              list-type="picture-card"
              :file-list="uploadFileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <p class="text-xs text-gray-500">支持 JPG、PNG 格式，建议尺寸 1920×500px</p>
          </div>
          <div
            v-if="form.imageUrl"
            class="mt-3 w-full h-40 bg-gray-50 rounded flex items-center justify-center overflow-hidden"
          >
            <img
              :src="form.imageUrl"
              alt="预览图"
              class="max-w-full max-h-full object-contain"
            />
          </div>
        </el-form-item>
        <el-form-item label="点击交互" prop="clickType">
          <el-select
            v-model="form.clickType"
            placeholder="选择点击后行为"
            class="w-full"
            @change="handleClickTypeChange"
          >
            <el-option key=" " label="无" value=""></el-option>
            <el-option key="link" label="跳转链接" value="link"></el-option>
            <el-option key="music" label="播放音乐" value="music"></el-option>
            <el-option key="playlist" label="播放歌单" value="playlist"></el-option>
          </el-select>
          <div class="mt-2">
            <el-button
              type="text"
              @click="openActionSettingDrawer"
              v-if="form.clickType"
              class="text-blue-500 p-0 h-auto"
            >
              <el-icon size="14" class="mr-1"><Setting /></el-icon>
              {{ form.clickType === 'link' ? '设置链接' :
                 form.clickType === 'music' ? '选择音乐' : '选择歌单' }}
            </el-button>
            <div v-if="form.clickType && (form.linkUrl || form.musicId || form.playlistId)" class="text-sm text-gray-600 mt-1">
              当前设置:
              <span class="font-medium">
                {{ form.clickType === 'link' ? form.linkUrl :
                   form.clickType === 'music' ? form.musicName : form.playlistName }}
              </span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="展示规则提示">
          <div class="bg-gray-50 p-3 rounded-md text-sm">
            <p class="text-gray-600">
              系统将自动维持4个轮播图同时展示。您设置的时间段仅用于优先级排序，
              最终展示数量由系统自动调节。
            </p>
          </div>
        </el-form-item>
      </el-form>
      <div class="mt-1 flex justify-center gap-12">
        <el-button @click="closeDialog" class="w-25">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm"
          :loading="isSubmitting"
          class="bg-blue-500 hover:bg-blue-600 text-white w-25"
        >
          确认
        </el-button>
      </div>
    </AdminConfirm>

    <!-- 点击行为设置抽屉 -->
    <el-drawer
      title="点击行为设置"
      v-model="isActionDrawerOpen"
      direction="rtl"
      size="50%"
      :close-on-click-modal="false"
    >
      <div class="h-full flex flex-col">
        <el-tabs
          v-model="activeTab"
          type="card"
          class="mb-4"
        >
          <el-tab-pane label="链接设置" name="link" v-if="form.clickType === 'link' || form.clickType === ''" />
          <el-tab-pane label="音乐选择" name="music" v-if="form.clickType === 'music' || form.clickType === ''" />
          <el-tab-pane label="歌单选择" name="playlist" v-if="form.clickType === 'playlist' || form.clickType === ''" />
        </el-tabs>

        <!-- 类型选择 -->
        <div class="flex-1 overflow-auto">
          <!-- 链接 -->
          <div v-if="activeTab === 'link'">
            <el-form-item label="跳转链接" class="mb-4">
              <AdminInput
                v-model="form.linkUrl"
                placeholder="请输入完整链接地址（http:// 或 https:// 开头）"
                class="w-full"
                width="100%"
              ></AdminInput>
              <p class="text-xs text-gray-500 mt-1">示例：https://www.example.com</p>
            </el-form-item>
            <el-form-item label="打开方式">
              <el-radio-group v-model="form.linkTarget">
                <el-radio label="_blank">新窗口打开</el-radio>
                <el-radio label="_self">当前窗口打开</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <!-- 音乐选择 -->
          <div v-if="activeTab === 'music'">
            <div class="mb-4">
              <AdminInput
                v-model="musicSearchKeyword"
                placeholder="搜索音乐名称或歌手"
                prefix="&#xe65c;"
                width="100%"
              ></AdminInput>
            </div>
            <div class="rounded-md overflow-hidden">
              <el-table
                :data="filteredMusics"
                height="590"
                @row-click="selectMusic"
                :row-class-name="(row) => row.id === form.musicId ? 'bg-blue-50' : ''"
                stripe
              >
                <el-table-column label="音乐名称" width="130" align="center">
                  <template #default="scope">
                    <div class="group flex justify-center relative cursor-pointer">
                      <img src="../../../../public/头像.png" alt="头像" class="m-1 w-[45px] h-[45px] rounded-[6px]">
                      <div class="w-[45px] h-[45px] rounded-[6px] absolute m-1 bg-[rgba(0,0,0,0.5)] duration-[0.3s] opacity-0 group-hover:opacity-100">
                        <IconFontSymbol name="bofang" class="text-[white] relative top-[10px]" size="20px"></IconFontSymbol>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="音乐名称" prop="name" width="200" />
                <el-table-column label="歌手" prop="singer" width="150" />
                <el-table-column label="专辑" prop="album" />
                <el-table-column label="时长" prop="duration" width="100" />
              </el-table>
              <div class="admin-page mt-2 mb-4 flex justify-end mr-12">
                <el-pagination
                  background
                  layout="prev, pager, next ,jumper"
                  :total="100"
                  :default-page-size="8"
                />
              </div>
            </div>
          </div>

          <!-- 歌单选择 -->
          <div v-if="activeTab === 'playlist'">
            <div class="mb-4">
              <AdminInput
                v-model="playlistSearchKeyword"
                placeholder="搜索歌单名称"
                prefix="&#xe65c;"
                width="100%"
              ></AdminInput>
            </div>
            <div class="rounded-md overflow-hidden h-[calc(100%-40px)] gedanSelect">
              <el-table
                :data="filteredPlaylists"
                :height="600"
                @row-click="selectPlaylist"
                :row-class-name="(row) => row.id === form.playlistId ? 'bg-blue-50' : ''"
                stripe
                class=""
              >
                <el-table-column label="歌单名称" prop="name" width="200"/>
                <el-table-column label="歌曲数量" prop="songCount" width="100" />
                <el-table-column label="创建时间" prop="createTime" width="180" />
                <el-table-column label="描述" prop="description" />
              </el-table>
              <div class="admin-page mt-2 mb-4 flex justify-end mr-12">
                <el-pagination
                  background
                  layout="prev, pager, next ,jumper"
                  :total="100"
                  :default-page-size="8"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="mt-4 flex justify-end gap-3">
          <el-button @click="isActionDrawerOpen = false">取消</el-button>
          <el-button
            type="primary"
            @click="confirmActionSetting"
            class="bg-blue-500 hover:bg-blue-600 text-white"
          >
            确认选择
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 删除确认对话框 -->
    <AdminConfirm
      title="删除轮播图"
      v-model="isDeleteDialogOpen"
      width="500px"
      :close-on-click-modal="false"
      isCustom=true
    >
      <p class="text-gray-700 indent-0.5">确定要删除这张轮播图吗？删除后会自动补充其他轮播图以保持4个展示。</p>
      <div class="mt-1 flex justify-end gap-5 px-10">
        <el-button @click="isDeleteDialogOpen = false" class="w-[100px]">取消</el-button>
        <el-button
          type="danger"
          @click="confirmDelete"
          :loading="isDeleting"
        >
          确认删除
        </el-button>
      </div>
    </AdminConfirm>
  </div>
</template>

<script setup>
import AdminInput from '@/components/admin/AdminInput.vue';
import AdminConfirm from '@/components/admin/AdminConfirm.vue';
import BannerPreview from '@/components/admin/OperationManage/BannerPreview.vue';
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { ElMessage, ElEmpty, ElTag, ElTooltip, ElTable, ElTableColumn , ElOption } from 'element-plus';
import {
  Picture, Plus, Refresh, Edit, Delete, Clock, Calendar, Grid,
  Check, Warning, Setting, Link,
  // 将 Music 替换为 Headset 或其他可用图标
  Headset,
  List, InfoFilled
} from '@element-plus/icons-vue';

// 模拟音乐数据
const mockMusics = ref([
  { id: 1, name: '晴天', singer: '周杰伦', album: '叶惠美', duration: '4:29', url: 'music/1.mp3' },
  { id: 2, name: '七里香', singer: '周杰伦', album: '七里香', duration: '4:59', url: 'music/2.mp3' },
  { id: 3, name: '告白气球', singer: '周杰伦', album: '周杰伦的床边故事', duration: '3:35', url: 'music/3.mp3' },
  { id: 4, name: '小幸运', singer: '田馥甄', album: '我的少女时代 电影原声带', duration: '4:04', url: 'music/4.mp3' },
  { id: 5, name: '光年之外', singer: '邓紫棋', album: '光年之外', duration: '3:59', url: 'music/5.mp3' },
  { id: 6, name: '起风了', singer: '买辣椒也用券', album: '起风了', duration: '5:23', url: 'music/6.mp3' },
  { id: 7, name: '水星记', singer: '郭顶', album: '飞行器的执行周期', duration: '5:25', url: 'music/7.mp3' },
  { id: 8, name: '消愁', singer: '毛不易', album: '平凡的一天', duration: '5:13', url: 'music/8.mp3' },
]);

// 模拟歌单数据
const mockPlaylists = ref([
  { id: 1, name: '华语流行精选', songCount: 30, createTime: '2025-10-01', description: '汇集当下最热门的华语流行歌曲' },
  { id: 2, name: '经典老歌回顾', songCount: 45, createTime: '2025-09-15', description: '那些年我们一起听过的经典老歌' },
  { id: 3, name: '轻音乐合集', songCount: 28, createTime: '2025-09-20', description: '放松心情的纯音乐精选' },
  { id: 4, name: '摇滚精选', songCount: 36, createTime: '2025-10-05', description: '热血沸腾的摇滚歌曲集合' },
  { id: 5, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' },
  { id: 6, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' },
  { id: 7, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' },
  { id: 8, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' },
]);

// 轮播图数据（包含1个默认轮播图，不可删除）
const banners = ref([
  {
    id: 0, // 默认轮播图ID固定为0
    name: '默认轮播图',
    imageUrl: 'https://picsum.photos/id/1005/1920/500',
    startTime: new Date('2025-01-01 00:00:00'),
    endTime: new Date('2030-12-31 23:59:59'),
    isDefault: true, // 标记为默认轮播图
    clickType: 'link',
    linkUrl: 'https://www.example.com',
    linkTarget: '_blank',
    musicId: '',
    musicName: '',
    playlistId: '',
    playlistName: ''
  },
  {
    id: 1,
    name: '首页顶部轮播1',
    imageUrl: 'https://picsum.photos/id/237/1920/500',
    startTime: new Date('2025-11-28 00:00:00'),
    endTime: new Date('2025-12-05 23:59:59'),
    isDefault: false,
    clickType: 'link',
    linkUrl: 'https://www.example.com/promotion',
    linkTarget: '_blank',
    musicId: '',
    musicName: '',
    playlistId: '',
    playlistName: ''
  },
  {
    id: 2,
    name: '首页顶部轮播2',
    imageUrl: 'https://picsum.photos/id/238/1920/500',
    startTime: new Date('2025-11-28 00:00:00'),
    endTime: new Date('2025-12-05 23:59:59'),
    isDefault: false,
    clickType: 'music',
    linkUrl: '',
    linkTarget: '_blank',
    musicId: 3,
    musicName: '告白气球',
    playlistId: '',
    playlistName: ''
  },
  {
    id: 3,
    name: '首页顶部轮播3',
    imageUrl: 'https://picsum.photos/id/239/1920/500',
    startTime: new Date('2025-11-28 00:00:00'),
    endTime: new Date('2025-12-05 23:59:59'),
    isDefault: false,
    clickType: 'playlist',
    linkUrl: '',
    linkTarget: '_blank',
    musicId: '',
    musicName: '',
    playlistId: 1,
    playlistName: '华语流行精选'
  }
]);

// 状态管理
const searchKeyword = ref('');      // 搜索关键字
const isDialogOpen = ref(false);        // 弹窗状态
const isDeleteDialogOpen = ref(false);  // 删除弹窗状态
const isActionDrawerOpen = ref(false);    // 动作抽屉状态
const isEditMode = ref(false);        // 是否激活编辑弹窗
const isSubmitting = ref(false);      // 提交状态
const isDeleting = ref(false);        // 删除状态
const isPreview = ref(false);         // 是否预览
const deleteId = ref(null);           // 待删除的轮播图ID
const formRef = ref(null);            // 表单引用
const uploadFileList = ref([]);       // 上传文件列表
const activeTab = ref('link');        // 当前激活的标签页
const musicSearchKeyword = ref('');   // 音乐搜索关键字
const playlistSearchKeyword = ref('');
const currentDisplayUpdateTime = ref(new Date());   // 当前显示的更新时间

// 表单数据
const form = ref({
  id: '',
  name: '',
  imageUrl: '',
  startTime: new Date(),
  endTime: new Date(new Date().setDate(new Date().getDate() + 7)),
  isDefault: false,
  clickType: '',
  linkUrl: '',
  linkTarget: '_blank',
  musicId: '',
  musicName: '',
  playlistId: '',
  playlistName: ''
});

// 表单校验规则
const formRules = ref({
  name: [
    { required: true, message: '请输入轮播图名称', trigger: 'blur' },
    { max: 50, message: '名称不能超过50个字符', trigger: 'blur' }
  ],
  imageUrl: [
    { required: true, message: '请上传轮播图', trigger: 'change' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (form.value.startTime && new Date(value) <= new Date(form.value.startTime)) {
          callback(new Error('结束时间必须晚于开始时间'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  clickType: [
    { required: false, message: '请选择点击类型', trigger: 'change' }
  ],
  linkUrl: [
    {
      required: (() => form.value.clickType === 'link'),
      message: '请输入跳转链接',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (form.value.clickType === 'link' && value) {
          const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;
          if (!urlRegex.test(value)) {
            callback(new Error('请输入有效的链接地址'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    }
  ],
  musicId: [
    {
      required: (() => form.value.clickType === 'music'),
      message: '请选择音乐',
      trigger: 'change'
    }
  ],
  playlistId: [
    {
      required: (() => form.value.clickType === 'playlist'),
      message: '请选择歌单',
      trigger: 'change'
    }
  ]
});

// 过滤后的轮播图列表
const filteredBanners = computed(() => {
  if (!searchKeyword.value) return banners.value;
  const keyword = searchKeyword.value.toLowerCase();
  return banners.value.filter(banner =>
    banner.name.toLowerCase().includes(keyword)
  );
});

// 过滤后的音乐列表
const filteredMusics = computed(() => {
  if (!musicSearchKeyword.value) return mockMusics.value;
  const keyword = musicSearchKeyword.value.toLowerCase();
  return mockMusics.value.filter(music =>
    music.name.toLowerCase().includes(keyword) ||
    music.singer.toLowerCase().includes(keyword) ||
    music.album.toLowerCase().includes(keyword)
  );
});

// 过滤后的歌单列表
const filteredPlaylists = computed(() => {
  if (!playlistSearchKeyword.value) return mockPlaylists.value;
  const keyword = playlistSearchKeyword.value.toLowerCase();
  return mockPlaylists.value.filter(playlist =>
    playlist.name.toLowerCase().includes(keyword) ||
    playlist.description.toLowerCase().includes(keyword)
  );
});

// 当前展示的4个轮播图（核心逻辑）
const currentDisplayBanners = computed(() => {
  const now = new Date();
  const allBanners = [...banners.value];

  // 步骤1：分离默认轮播图和自定义轮播图
  const defaultBanner = allBanners.find(b => b.isDefault) || null;
  const customBanners = allBanners.filter(b => !b.isDefault);

  // 步骤2：筛选当前时间段内的轮播图（包括默认轮播图）
  const activeBanners = allBanners.filter(b => {
    const start = new Date(b.startTime);
    const end = new Date(b.endTime);
    return start <= now && end >= now;
  });

  // 步骤3：如果当前活跃轮播图少于4个，从未来轮播图中补充
  let displayBanners = [...activeBanners];

  if (displayBanners.length < 4) {
    // 筛选未来的轮播图（未开始但已创建的）
    const futureBanners = allBanners.filter(b => {
      const start = new Date(b.startTime);
      return start > now && !displayBanners.some(d => d.id === b.id);
    });

    // 按开始时间排序，优先选择最近要开始的
    futureBanners.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    // 补充到4个
    const needCount = 4 - displayBanners.length;
    displayBanners = [...displayBanners, ...futureBanners.slice(0, needCount)];
  }

  // 步骤4：如果仍然少于4个（极端情况），用默认轮播图补充
  if (displayBanners.length < 4 && defaultBanner && !displayBanners.some(b => b.isDefault)) {
    displayBanners.push(defaultBanner);

    // 如果还不够，复制默认轮播图（仅前端展示用，不实际存储）
    while (displayBanners.length < 4) {
      displayBanners.push({
        ...defaultBanner,
        id: `default_${displayBanners.length}`,
        name: `默认轮播图(${displayBanners.length})`
      });
    }
  }

  // 步骤5：如果超过4个，按创建时间排序，取最新的4个
  if (displayBanners.length > 4) {
    displayBanners.sort((a, b) => {
      // 默认轮播图优先级最低
      if (a.isDefault && !b.isDefault) return 1;
      if (!a.isDefault && b.isDefault) return -1;
      // 自定义轮播图按ID排序（ID越大越新）
      return b.id - a.id;
    });
    displayBanners = displayBanners.slice(0, 4);
  }

  return displayBanners;
});

// 挂载时初始化当前展示轮播图
onMounted(() => {
  updateCurrentDisplayBanners();

  // 监听轮播图数据变化，自动更新当前展示列表
  watch(banners, updateCurrentDisplayBanners, { deep: true });

  // 监听点击类型变化，自动切换选项卡
  watch(() => form.value.clickType, (newVal) => {
    if (newVal) {
      activeTab.value = newVal;
    }
  }, { immediate: true });

  // 每小时自动更新一次当前展示列表
  setInterval(updateCurrentDisplayBanners, 3600000);
});

// 更新当前展示轮播图
const updateCurrentDisplayBanners = () => {
  currentDisplayUpdateTime.value = new Date();
  nextTick(() => {
    ElMessage.success('当前展示轮播图已更新');
  });
};

// 格式化日期时间
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 检查轮播图是否正在其设置的时间段内
const isActive = (banner) => {
  const now = new Date();
  return new Date(banner.startTime) <= now && new Date(banner.endTime) >= now;
};

// 检查轮播图是否当前正在展示（在4个展示位中）
const isCurrentlyDisplayed = (banner) => {
  return currentDisplayBanners.value.some(d =>
    d.id === banner.id || (d.isDefault && banner.isDefault)
  );
};

// 获取点击类型文本
const getClickTypeText = (type) => {
  switch(type) {
    case 'link': return '跳转链接';
    case 'music': return '播放音乐';
    case 'playlist': return '播放歌单';
    default: return '无';
  }
};

// 获取点击类型标签样式
const getClickTypeTagType = (type) => {
  switch(type) {
    case 'link': return 'primary';
    case 'music': return 'success';
    case 'playlist': return 'warning';
    default: return 'default';
  }
};

// 打开添加对话框
const openAddDialog = () => {
  isEditMode.value = false;
  form.value = {
    id: '',
    name: '',
    imageUrl: '',
    startTime: new Date(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 7)),
    isDefault: false,
    clickType: '',
    linkUrl: '',
    linkTarget: '_blank',
    musicId: '',
    musicName: '',
    playlistId: '',
    playlistName: ''
  };
  uploadFileList.value = [];
  activeTab.value = 'link';
  musicSearchKeyword.value = '';
  playlistSearchKeyword.value = '';
  isDialogOpen.value = true;
};

// 打开编辑对话框
const openEditDialog = (banner) => {
  isEditMode.value = true;
  form.value = { ...banner };   // 更新form数据
  uploadFileList.value = banner.imageUrl ? [{ url: banner.imageUrl }] : [];
  activeTab.value = banner.clickType || 'link';
  musicSearchKeyword.value = '';
  playlistSearchKeyword.value = '';
  isDialogOpen.value = true;
};

// 关闭对话框
const closeDialog = () => {
  isDialogOpen.value = false;
  formRef.value?.resetFields();
  uploadFileList.value = [];
};

// 处理图片上传变化
const handleImageChange = (uploadFile) => {
  // 模拟上传，实际项目中应替换为真实上传接口
  form.value.imageUrl = uploadFile.url;
  uploadFileList.value = [uploadFile];
};

// 处理点击类型变化
const handleClickTypeChange = (value) => {
  if (value) {
    activeTab.value = value;
    // 清空其他类型的选择
    if (value !== 'link') {
      form.value.linkUrl = '';
    }
    if (value !== 'music') {
      form.value.musicId = '';
      form.value.musicName = '';
    }
    if (value !== 'playlist') {
      form.value.playlistId = '';
      form.value.playlistName = '';
    }
  }
};

// 打开点击行为设置抽屉
const openActionSettingDrawer = () => {
  isActionDrawerOpen.value = true;
};

// 选择音乐
const selectMusic = (music) => {
  form.value.musicId = music.id;
  form.value.musicName = music.name;
};

// 选择歌单
const selectPlaylist = (playlist) => {
  form.value.playlistId = playlist.id;
  form.value.playlistName = playlist.name;
};

// 确认点击行为设置
const confirmActionSetting = () => {
  // 简单校验
  if (form.value.clickType === 'link' && !form.value.linkUrl) {
    ElMessage.warning('请输入跳转链接');
    return;
  }
  if (form.value.clickType === 'music' && !form.value.musicId) {
    ElMessage.warning('请选择音乐');
    return;
  }
  if (form.value.clickType === 'playlist' && !form.value.playlistId) {
    ElMessage.warning('请选择歌单');
    return;
  }

  ElMessage.success('设置成功');
  isActionDrawerOpen.value = false;
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate();

    isSubmitting.value = true;

    if (isEditMode.value) {
      // 编辑轮播图
      const index = banners.value.findIndex(b => b.id === form.value.id);
      if (index !== -1) {
        banners.value[index] = { ...form.value };
        ElMessage.success(`${form.value.isDefault ? '默认' : ''}轮播图编辑成功`);
      }
    } else {
      // 检查是否超过最大自定义轮播图数量（建议限制，避免数据过多）
      const customCount = banners.value.filter(b => !b.isDefault).length;
      if (customCount >= 20) {
        ElMessage.error('自定义轮播图数量已达上限，请删除不需要的轮播图后再添加');
        isSubmitting.value = false;
        return;
      }

      // 添加轮播图
      const newBanner = {
        ...form.value,
        id: Date.now(),
        isDefault: false
      };
      banners.value.push(newBanner);
      ElMessage.success('轮播图添加成功');
    }

    closeDialog();
  } catch (error) {
    console.error('表单提交失败:', error);
    ElMessage.error('表单验证失败，请检查填写内容');
  } finally {
    isSubmitting.value = false;
  }
};

// 处理删除
const handleDelete = (id) => {
  // 检查是否是默认轮播图
  const banner = banners.value.find(b => b.id === id);
  if (banner?.isDefault) {
    ElMessage.error('默认轮播图不可删除');
    return;
  }

  deleteId.value = id;
  isDeleteDialogOpen.value = true;
};

// 确认删除
const confirmDelete = () => {
  try {
    isDeleting.value = true;

    // 删除轮播图
    const beforeCount = banners.value.length;
    banners.value = banners.value.filter(banner => banner.id !== deleteId.value);

    // 检查删除后是否还有至少1个轮播图（默认轮播图始终存在）
    if (banners.value.length === 1 && banners.value[0].isDefault) {
      ElMessage.warning('已删除最后一个自定义轮播图，系统将仅展示默认轮播图');
    }

    ElMessage.success('轮播图删除成功');
    isDeleteDialogOpen.value = false;
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error('删除失败，请重试');
  } finally {
    isDeleting.value = false;
  }
};

// 刷新数据
const refreshData = () => {
  updateCurrentDisplayBanners();
  ElMessage.success('数据已刷新');
};
</script>

<style scoped>
/* 自定义动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.el-dialog),
:deep(.el-card),
:deep(.el-table),
:deep(.el-drawer),
:deep(.el-tag) {
  animation: fadeIn 0.3s ease-out;
}

/* 图片悬停效果优化 */
img {
  transition: all 0.3s ease;
}

/* 自定义滚动条 */
:deep(::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}

/* 表格选中行样式 */
:deep(.el-table__row.bg-blue-50) {
  background-color: #eff6ff !important;
}

:deep(.el-table__row.bg-blue-50:hover > td) {
  background-color: #eff6ff !important;
}

/* 当前展示轮播图卡片样式 */
:deep(.current-display-card) {
  border-color: #1989fa !important;
}

/* 提示框样式 */
:deep(.el-message) {
  transition: all 0.3s ease;
}
:deep(.el-tabs__nav){
  border-radius: 8px;
}
:deep(.el-tabs__item){
  border-radius: 8px;
}
::v-deep .admin-page .btn-prev{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .btn-prev:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .btn-prev .el-icon{
    font-size: 16px;
    position: relative;
    left: 5px;
  }
  ::v-deep .admin-page .btn-next{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .btn-next:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .btn-next .el-icon{
    font-size: 16px;
    position: relative;
    left: 5px;
  }
  ::v-deep .admin-page .el-pager .number{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .el-pager .number:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .el-pager .more{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .el-pager .more:hover{
    border-color: #0084ff;
  }
  ::v-deep .user-table .el-table__header-wrapper th{
    background-color: #F5F7F9;
  }
  ::v-deep .gedanSelect .el-table__row{
    height: 70px;
  }
</style>
