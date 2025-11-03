<template>
  <el-upload
    class="avatar-uploader"
    :action="`${baseUrl}`+'/file/upload'"
    :headers="headers()"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="url" :style="{width,height}" :src="url" class="avatar">
    <i v-else :style="{width,height,lineHeight:height}" class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'ImageUploader',
  props: {
    height: { type: String, default: '150px' },
    width: { type: String, default: '150px' },
    url: { type: String, default: null },
    path: { type: String, default: null }
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_API_HOST
    }
  },
  methods: {
    headers() {
      return {
        Authorization: getToken()
      }
    },
    handleAvatarSuccess(res, file) {
      this.$emit('ok', res.data)
    },
    beforeAvatarUpload() {
      return true
    }
  }
}
</script>

<style  scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
