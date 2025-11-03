<script>
import { getList, del, changeStatus } from '@/api/goods/goods'
import { getCategoryList } from '@/api/goods/category'
import permission from '@/directive/permission/index.js'

export default {
  directives: {
    permission
  },
  components: {
    PageSearch: () => import('@/views/murray-component/pageSearch')
  },
  data() {
    const cateOptions = []
    this.getCategoryList().then(res => {
      this.cateList = res.data.list
      res.data.list.forEach(e => {
        cateOptions.push({ label: e.name, value: e.cateId })
      })
    })
    // console.log(cateOptions)
    return {
      selections: [],
      cateList: [],
      searchFields: [
        { name: 'name', placeholder: '输入商品名/Please enter goods name', type: 'text' },
        { name: 'catId', placeholder: '选择类别/Select Category', type: 'select', options: cateOptions }

      ],
      dataList: [],
      pageParam: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    changeStatus(row) {
      changeStatus(row.goodsId).then(res => {
        this.$messageOk(res.message)
        this.getList()
      }).catch(() => {
        this.getList()
      })
    },
    handleDeletion() {
      this.$ask({
        message: '确定删除吗？/Are you sure to delete?'
      }).then(() => {
        const ids = []
        this.selections.forEach(e => {
          ids.push(e.goodsId)
        }
        )
        del(ids.join(',')).then(res => {
          this.$messageOk(res.message)
          this.getList()
        })
      })
    },
    handleSizeChange(val) {
      this.pageParam.pageSize = val
      this.pageParam.pageNum = 1
      this.loadData()
    },
    handleCurrentChange(val) {
      this.pageParam.pageNum = val
      this.loadData()
    },
    toAdd() {
      this.$router.push('/goods/add')
    },
    toEdit() {
      this.$router.push('/goods/edit?id=' + this.selections[0].goodsId)
    },
    getList() {
      getList(this.pageParam).then(res => {
        this.pageParam.total = res.data.total
        this.dataList = res.data.list
      })
    },
    async getCategoryList() {
      return await getCategoryList(null)
    },

    handleSelectionChange(val) {
      this.selections = val
    },
    getCateNames(row) {
      const names = []
      if (row.catIds) {
        row.catIds.forEach(e => {
          const cate = this.cateList.find(item => item.cateId === e)
          if (cate) {
            names.push(cate.name)
          }
        })
      }
      return names
    }

  }

}
</script>

<template>
  <div class="app-container">
    <el-card>
      <page-search
        v-permission="`get:/goods/list`"
        :search-fields="searchFields"
        :load-data="getList"
        :page-param="pageParam"
      />

      <el-row
        style="display: inline-flex;padding: 20px;"
        :gutter="20"
      >
        <el-col>
          <el-button
            v-permission="`post:/goods/add`"
            type="primary"
            plain
            icon="el-icon-plus"
            @click.native.prevent="toAdd"
          >
            添加/Adding
          </el-button>
        </el-col>

        <el-col>
          <el-button
            v-permission="`post:/goods/edite`"
            type="primary"
            plain
            icon="el-icon-edit"
            :disabled="selections.length!==1"
            @click.native.prevent="toEdit"
          >
            编辑/Edit
          </el-button>
        </el-col>

        <el-col>
          <el-button
            v-permission="`post:/goods/delete`"
            type="danger"
            plain
            icon="el-icon-delete"
            :disabled="selections.length===0"
            @click.native.prevent="handleDeletion"
          >
            删除/Del
          </el-button>
        </el-col>

      </el-row>

      <el-row style="padding:20px 0">
        <el-table
          v-permission="`get:/goods/list`"
          :data="dataList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />

          <el-table-column v-slot="scope" label="封面/Cover">
            <template>
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.cover"
                fit="fill"
              />
            </template>
          </el-table-column>

          <el-table-column v-slot="scope" label="类别/category">
            <template>
              <el-tag v-for="tag in getCateNames(scope.row)">
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="名称/Name" prop="name" />
          <el-table-column label="价格/Price" prop="price" />
          <el-table-column label="售后保障/Service" prop="ensure" />
          <el-table-column label="销量/Sold" prop="sales" />

          <el-table-column label="商品状态/Goods Status">
            <template v-slot="scope">
              {{ scope.row.status === 0 ? '已上架/Selling' : '已下架/Sold Out' }}
              <el-switch
                v-model="scope.row.status"
                :active-value="0"
                inactive-value="-1"
                @change="changeStatus(scope.row)"
              />
            </template>
          </el-table-column>

        </el-table>
      </el-row>

      <el-row v-permission="`get:/goods/list`" style="padding: 20px 0">
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

    </el-card>
  </div>
</template>

<style scoped>

</style>
