<template>
  <div>
    <!--  搜索行    -->
    <el-row :gutter="20" style="display: inline-flex;padding: 20px 0">
      <el-col v-for="item in searchFields" style="min-width: 240px">
        <el-input
          v-if="item.type!=='select'"
          v-model="pageParam[item.name]"
          :type="item.type?item.type:'text'"
          :placeholder="item.placeholder?item.placeholder:'请输入内容/Please enter contents'"
          @keyup.enter.native="loadData"
        />
        <el-select
          v-if="item.type==='select'"
          v-model="pageParam[item.name]"
          clearable
          :multiple="item.multiple"
          :placeholder="item.placeholder"
        >
          <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-col>
      <el-col>
        <el-button type="primary" icon="el-icon-search" @click.native.prevent="loadData">搜索</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  props: {
    searchFields: {
      type: Array,
      default: () => []
    },
    loadData: {
      type: Function,
      default: () => {
        console.log('加载数据的方法')
      }
    },
    pageParam: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
