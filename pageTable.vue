<template>
  <div>
    <el-row style="padding: 20px 0">
      <el-table :data="datalist" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
        />
        <template v-for="col in columns">
          <el-table-column
            :prop="col.prop"
            :label="col.label"
          >
            <template v-if="col.formate" v-slot="scope">
              {{ col.formate(scope.row) }}
            </template>
          </el-table-column>
        </template>

      </el-table>
    </el-row>

    <el-row style="padding: 20px 0">
      <el-pagination
        :current-page.sync="pageParam.pageNum"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="pageParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParam.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>

  </div>
</template>

<script>
export default {
  props: {
    /* {label,prop,formate} */
    columns: {
      type: Array,
      default: () => []
    },
    datalist: {
      type: Array,
      default: () => []
    },
    /*
    表单参数
    pageParam: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        key: null
      } */
    pageParam: {

    },
    loadData: Function,
    selection: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageParam.pageSize = val
      this.pageParam.pageNum = 1
      this.loadData()
    },
    handleCurrentChange(val) {
      this.pageParam.pageNum = val
      this.loadData()
    },
    handleSelectionChange(val) {
      // this.selection=[]
      // 第一步清空
      this.selection.splice(0, this.selection.length)
      val.forEach(e => {
        this.selection.push(e)
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
