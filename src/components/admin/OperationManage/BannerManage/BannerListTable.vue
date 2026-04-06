<template>
  <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <IconFontSymbol name="liebiao"></IconFontSymbol>
      <span>轮播图列表</span>
      <div class="w-[300px] ml-auto flex items-center">
        <input
          placeholder="请输入轮播图名称"
          v-model="searchKeywordT"
          @input="search"
          class="tinput mr-6"
        >
        <el-tooltip content="删除所选轮播图" >
          <IconFontSymbol @click="isShowDelList=true" name="shanchu" class="font-500 relative top-[3px] cursor-pointer hover:text-red-700 mr-20"></IconFontSymbol>
        </el-tooltip>
      </div>
    </h2>
    <el-table
      v-loading="false"
      :data="BannerList"
      style="width:100%;min-height: 200px"
      @selection-change="handleSelectionChange"
    >
      <!-- 全选列 -->
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="图片" prop="imageUrl" align="center" width="300">
        <template #default="scope">
          <div class="flex justify-center">
            <a :href="scope.row.imageUrl" target="_blank" >
              <img :src="scope.row.imageUrl" alt="轮播图" class="max-h-[200px] text-center object-cover rounded-[6px]">
            </a>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="轮播图名称" prop="title" align="center">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="权重" prop="sortOrder" align="center" width="100">
        <template #default="scope">
          <el-tag type="warning" size="mini">{{ scope.row.sortOrder || 0 }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="点击类型" prop="actionType" align="center" width="200">
        <template #default="scope">
          <!-- <el-tag :type="getClickTypeTagType(scope.row.actionType)">
            {{ getClickTypeText(scope.row.actionType) }}
          </el-tag> -->
          <div class="text-xs text-gray-500 mt-1 truncate">
            {{
              scope.row.actionType === 0 ? '无' :
              scope.row.actionType === 4 ? `跳转链接: ${scope.row.linkUrl}` :
              scope.row.actionType === 2 ? `跳转歌曲` :
              scope.row.actionType === 1 ? `跳转歌单` :
              scope.row.actionType === 3 ? `跳转秒杀活动` :
              '未知类型'
            }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250" >
        <template #default="scope">
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
            @click.prevent="updateBannerInfo(scope.row.id);"
          >
            <IconFontSymbol name="xiugai" size="18px"></IconFontSymbol>
            修改
          </span>
          <span class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
            @click="isShowDel=true;nowId=scope.row.id">
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
      <el-pagination
        background
        layout="prev, pager, next ,jumper"
        :default-page-size="8"
        :total="total"
        @current-change="pageSkip"
        @prev-click="preSkip"
        @next-click="nextSkip"
      />
    </div>
    <AdminConfirm
      v-model="isShowDel"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否删除该轮播图？操作执行后将无法撤销。`"
      @confirmClick="DeleteBannerFun"
    ></AdminConfirm>
    <AdminConfirm
      v-model="isShowDelList"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否删除所选轮播图？操作执行后将无法撤销。`"
      @confirmClick="deleteSelect"
    ></AdminConfirm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {debounce} from "@/utils/debounceThrottle"
import {DeleteBannerAPI,BatchDeleteBannerAPI,GetBannerDetailAPI} from "@/api/Admin/operation/banner";     // 删除轮播图API
import {useBannerStore} from '@/stores/admin/banner'

const props = defineProps({
  BannerList: { type: Array, default: () => [] },
  total:{ type: Number, default: 0 },
  searchKeyword:{ type: String, default: '' },
  page:{ type: Number, default: 1 }
})

const emit = defineEmits(['searchChange', 'prePage', 'clickPage', 'nextPage','refreshList','isEditModeFun','openUpdate'])

// 搜索关键字
const searchKeywordT = ref("")
let isShowDel = ref(false);         // 是否显示删除确认对话框
let isShowDelList = ref(false);     // 是否显示批量删除确认对话框
let nowId = ref(null);              // 当前删除的轮播图ID
let ids: number[] = [];                  // 批量删除的轮播图ID列表
// 全选事件（空实现）
const handleSelectionChange = (val: any[]) => {
  ids = val.map(item => item.id);
}

function preSkip(page:number){
  emit('prePage', page)
}
function nextSkip(page:number){
  emit('nextPage', page)
}
function pageSkip(page:number){
  emit('clickPage', page)
}
const search = debounce(() => {
  if(searchKeywordT.value.trim() === props.searchKeyword) return; // 避免重复搜索
  emit('searchChange', searchKeywordT.value)
}, 500)

async function DeleteBannerFun(){       // 删除轮播图
  await DeleteBannerAPI(nowId.value);
  isShowDel.value = false;
  emit('refreshList');
}
async function deleteSelect(){      // 批量删除轮播图
  if(ids.length === 0) {
    ElMessage.warning('请先选择要删除的轮播图');
    isShowDelList.value = false;
    return;
  }
  await BatchDeleteBannerAPI(ids);
  ElMessage.success('删除成功');
  isShowDelList.value = false;
  emit('refreshList');
}

async function updateBannerInfo(id:number){     // 修改轮播图信息
  const bannerInfo:any = await GetBannerDetailAPI(id);
  let form = useBannerStore()?.form;
  form.title = bannerInfo.data.title;
  form.imageUrl = bannerInfo.data.imageUrl;
  form.linkUrl = bannerInfo.data.linkUrl;
  form.sortOrder = bannerInfo.data.sortOrder;
  form.status = bannerInfo.data.status;
  form.actionType = bannerInfo.data.actionType;
  form.targetId = bannerInfo.data.targetId;
  form.id = id
  await emit('isEditModeFun', true);
  emit('openUpdate');
}

onMounted(()=>{
  document.querySelector('.el-pagination__goto').textContent = '跳转'
})
</script>

<style scoped>
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
  /* From Uiverse.io by ErzenXz */
.tinput {
  border: 2px solid transparent;
  width: 15em;
  height: 2.5em;
  padding-left: 0.8em;
  outline: none;
  overflow: hidden;
  background-color:rgba(0, 132, 255,0.1);
  border-radius: 10px;
  transition: all 0.5s;
  font-size:16px;
  font-weight: 500;
  color:black
}

.tinput:hover {
  border: 2px solid #4A9DEC;
  box-shadow: 0px 0px 0px 7px rgb(74, 157, 236, 20%);
  background-color: white;
}
.tinput:focus {
  border: 2px solid #4A9DEC;
  box-shadow: 0px 0px 0px 7px rgb(74, 157, 236, 20%);
  background-color: white;
}
</style>
