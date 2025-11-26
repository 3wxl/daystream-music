<template>
  <div class="flex items-start">
    <div class="bg-white mb-4 duration-[.2s] rounded-xl  overflow-hidden shadow-lg backdrop-blur-sm w-240 py-[15px] px-[30px] pb-10">
      <div class="">
        <h1 class="text-[black] font-[600] text-[36px]">我是一个普普通通的标题</h1>
        <div class="my-3">
          <p class="text-[#666] text-[13px]">
            2022-01-01 00:00:00 · 白昼音流
          </p>
        </div>
        <div class="mt-[20px] text-black">    <!-- 动态详情内容 -->
          <!-- 动态详细内容 ---->    <!-- 文本部分 -->
          <p class="indent-[2em] break-words break-all text-[16px] my-[2px] text-[#ff5100]">
            #四个大人喜人第四赛段第一#
          </p>
          <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
            感谢大家抬爱啊啊啊啊啊！
          </p>
          <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
            [泪][泪][泪][努力][努力][努力]好开心！
          </p>
          <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
            我们一定会继续努力的！！
          </p>
          <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
            冲啊！！！！！！！！！！！！！！！
          </p>
          <p class="indent-[2em] break-words break-all text-[16px] my-[2px] text-[#55ff00]">
            #喜人奇妙夜# ​
          </p>
          <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
            11月21日，中国常驻联合国代表傅聪致函联合国秘书长古特雷斯，就日本首相高市早苗涉华错误言行阐明中国政府立场。该函将作为联合国大会正式文件，向全体会员国散发。
          </p>
          <img src="../../../../public/头像.png" alt="文章图片" class="mx-auto w-[80%] my-3 rounded-[16px] cursor-pointer">
          <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
            中国国际问题研究院副研究员苏晓晖表示，日本希望在亚太地区安全当中来提升自身的地位，同时推动大国竞争和战略博弈，在试图形成更强的阵营对抗。而在这个过程当中，所谓打“台湾牌”来实现日本的目标，甚至形成“多海联动”，就成了日本在政策方面的危险的态势。不过，高市早面的这番错误言论在日本国内也遭遇了强烈的反弹，很多人指向的是高市早苗此番言论背后的意图，以及对中日关系所造成的影响和日本承受的损失。
          </p>
        </div>
      </div>
    </div>
    <div class="bg-white ml-10 mb-4 duration-[.2s] rounded-xl overflow-hidden shadow-lg backdrop-blur-sm w-100 p-[15px]">
      <!-- 右侧作者栏 -->
      <div class="flex flex-col items-center">
        <div class="w-30 h-30 md:w-30 md:h-30 rounded-full border-4 border-white/20 overflow-hidden shadow-lg">
          <img
            :src="'http://39.96.214.163:9000/file/70567a01-09d0-443b-9d8a-bab6e5623967.png'"
            class="cursor-pointer w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            @click="router.push('/User/PersonalCenter')"
          />
        </div>
        <p class="text-[black] text-[18px] font-[600] mt-2">蔡徐坤</p>
        <p class="text-[#666] mt-[2px] text-[12px]">坤坤音乐创作者</p>
        <div class="flex mt-6 text-[#666] mb-2">
          <span>
            <span class="mr-[2px]">111</span>
            粉丝
          </span>
          <span class="mx-14">
            <span class="mr-[2px]">111</span>
            点赞
          </span>
          <span>
            <span class="mr-[2px]">111</span>
            关注
          </span>
        </div>
        <div class="flex mt-3 gap-4">        <!-- 审核按钮 -->
          <button class="primary-btn">
            <IconFontSymbol name="qianshoushenpitongguo-xianxing" size="17px" class="mr-1"></IconFontSymbol>
            通过
          </button>
          <button class="primary-btn" style="background-color: #ff4d4f;">
            <IconFontSymbol name="bohui" size="16px" class="mr-1">
            </IconFontSymbol>
            驳回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  let commentWords = ref(0);
  let commentInput = ref(null);
  let router = useRouter();
  let isAttent = ref(false);
  function updateWords(event) {
    commentWords.value = event.target.value.length;
  }
  onMounted(() => {
    watch(commentWords, (value) => {
      if (value > 100) {
        commentInput.value.value = commentInput.value.value.substring(0, 100);
        commentWords.value = 100;
      }
    })
  })
</script>

<style scoped>
  .primary-btn {
    border: none;
    color: #fff;
    background-image: linear-gradient(30deg, #0400ff, #4ce3f7);
    border-radius: 20px;
    background-size: 100% auto;
    font-family: inherit;
    font-size: 17px;
    padding: 0.4em 1.3em;
    cursor: pointer;
  }

  .primary-btn:hover {
    background-position: right center;
    background-size: 200% auto;
    -webkit-animation: pulse 2s infinite;
    animation: pulse512 1.5s infinite;
  }

  @keyframes pulse512 {
  0% {
    box-shadow: 0 0 0 0 #05bada66;
  }

  70% {
    box-shadow: 0 0 0 10px rgb(218 103 68 / 0%);
  }

  100% {
    box-shadow: 0 0 0 0 rgb(218 103 68 / 0%);
  }
  }
</style>
