<script>
import { getCategoryList, add, del, edit } from '@/api/goods/category'
import FormDialog from '@/views/murray-component/formDialog.vue'
import { getToken } from '@/utils/auth'
import permission from '@/directive/permission/index.js'
import ImageUploader from '@/views/murray-component/ImageUploader.vue'

export default {
  components: { ImageUploader, FormDialog },
  directives: { permission },
  data() {
    return {
      commonFormShow: false,
      selections: [],
      activeTab: 'first',
      recommendationList: [],
      normalList: [],
      width: '380px',
      labelWidth: '90px',
      reAddDialog: {
        fields: [
          { name: 'typeName', label: '分类类型/Category Type', disabled: true },
          { name: 'name', label: '分类名称/Category Name' },
          { name: 'enName', label: '英文名/English Name' }
        ],
        addForm: {},
        submit: add,
        rules: {},
        key: undefined
      },

      reEditionDialog: {
        editionForm: {},
        submit: edit,
        rules: {},
        fields: [
          { name: 'typeName', label: '分类类型/Category Type', disabled: true },
          { name: 'name', label: '分类名称/Category Name' },
          { name: 'enName', label: '英文名/English Name' }
        ]
      },

      normalAddingDialog: {
        addForm: {
          icoUrl: undefined,
          ifNav: false
        },
        rules: {},
        title: '添加分类/Edit Category',
        submit: add,
        key: undefined
      }
    }
  },

  computed: {
    headers() {
      return {
        Authorization: getToken()
      }
    },
    recommendationListComputed() {
      if (!this.reAddDialog.key) {
        return this.recommendationList
      }

      return this.recommendationList.filter(e => {
        return (e.name && e.name.includes(this.reAddDialog.key)) || (e.enName && e.enName.toLowerCase().includes(this.reAddDialog.key.toLowerCase()))
      })
    },
    normalListComputed() {
      if (!this.normalAddingDialog.key) {
        return this.normalList
      }
      return this.normalList.filter(e => {
        return (e.name && e.name.includes(this.normalAddingDialog.key)) ||
          (e.enName && e.enName.toLowerCase().includes(this.normalAddingDialog.key.toLowerCase()))
      })
    }
  },
  mounted() {
    this.getRecommendCategoryList()
    this.getCommonCategoryList()
  },

  methods: {
    converterIntegerToBoolean(value) {
      if (value === 1) {
        return true
      }
      if (value === 0) {
        return false
      }
      return value
    },
    handleTabClick(tab, event) {
      console.log(tab, event)
      this.selections = []
      this.$refs.recommendationTable.clearSelection()
      this.$refs.normalTable.clearSelection()
    },

    getRecommendCategoryList() {
      getCategoryList(2).then(res => {
        this.recommendationList = res.data.list
      })
    },

    getCommonCategoryList() {
      getCategoryList(1).then(res => {
        this.normalList = res.data.list
      })
    },

    handleSelectionChange(val) {
      this.selections = val
    },
    openRecommendedAdd() {
      this.reAddDialog.addForm['type'] = 2
      this.reAddDialog.addForm['typeName'] = '推荐分类/Recommended Category'
      this.$refs.reAddDialog.show()
    },
    openRecommendedDel() {
      this.$ask({ message: '确定删除?/Are you sure to Delete' }).then(() => {
        const ids = []
        this.selections.forEach(e => {
          ids.push(e.cateId)
        })

        del(ids.join(',')).then(res => {
          this.$messageOk(res.message)
          this.getRecommendCategoryList()
          this.getCommonCategoryList()
        }
        )
      })
    },
    openRecommendedEdition() {
      this.reEditionDialog.editionForm = JSON.parse(JSON.stringify(this.selections[0]))
      this.reEditionDialog.editionForm['typeName'] = '推荐分类/Recommended Category'
      this.$refs.reEditionDialog.show()
    },

    openCommonAdding() {
      this.normalAddingDialog.submit = add
      this.normalAddingDialog.title = '添加分类/Add Category'
      this.commonFormShow = true
    },

    handleNormalSubmit() {
      this.normalAddingDialog.addForm['type'] = 1
      this.normalAddingDialog.submit(this.normalAddingDialog.addForm).then(res => {
        this.$messageOk(res.message)
        this.getCommonCategoryList()
        this.commonFormShow = false
      })
    },

    handleAvatarSuccess(res, file) {
      this.normalAddingDialog.addForm['icoUrl'] = res.data.url
      this.normalAddingDialog.addForm['ico'] = res.data.path
    },
    beforeAvatarUpload(file) {
      return true
    },

    openCommonEdition() {
      this.commonFormShow = true
      this.normalAddingDialog.title = '编辑分类/Edit Category'
      this.normalAddingDialog.submit = edit
      this.normalAddingDialog.addForm = JSON.parse(JSON.stringify(this.selections[0]))
      this.normalAddingDialog.addForm['ifNav'] = this.converterIntegerToBoolean(this.selections[0].ifNav)
    }

  }

}
</script>

<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="普通分类/Common Category" name="first">

          <div>
            <el-row :gutter="20" style="padding: 20px 0;display:inline-flex">
              <el-col style="min-width: 240px">
                <el-input
                  v-model="normalAddingDialog.key"
                  v-permission="`get:/categorize/list`"
                  placeholder="请输入搜索内容/Please enter the search content"
                />

              </el-col>
            </el-row>
          </div>

          <el-col>
            <el-row style="display:inline-flex;padding: 20px 0" :gutter="20">
              <el-col>
                <el-button
                  v-permission="`post:/categorize/add`"
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  @click.native.prevent="openCommonAdding"
                >
                  添加分类/Add Category
                </el-button>
              </el-col>

              <el-col>
                <el-button
                  v-permission="`post:/categorize/edite`"
                  type="success"
                  plain
                  icon="el-icon-edit"
                  :disabled="selections.length !== 1"
                  @click.native.prevent="openCommonEdition"
                >
                  编辑分类/Edit Category
                </el-button>
              </el-col>

              <el-col>
                <el-button
                  v-permission="`post:/categorize/delete`"
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  :disabled="selections.length === 0"
                  @click.native.prevent="openRecommendedDel"
                >
                  删除分类/Delete Category
                </el-button>
              </el-col>
            </el-row>
            <el-row style="padding: 20px 0">
              <el-table
                ref="normalTable"
                v-permission="`get:/categorize/list`"
                :data="normalListComputed"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                />

                <el-table-column label="分类名称/Category Name">
                  <template slot-scope="scope">
                    {{ scope.row.name }} / {{ scope.row.enName }}
                  </template>
                </el-table-column>

                <el-table-column v-slot="scope" label="是否导航?/Whether Navigate?">
                  <template>
                    {{ scope.row.ifNav ? "是/Yes" : "否/No" }}
                  </template>
                </el-table-column>

                <el-table-column v-slot="scope" label="图标/Icon">
                  <img v-if="scope.row.icoUrl" :src="scope.row.icoUrl" alt="" style="width: 48px;height: 48px">
                </el-table-column>

              </el-table>
            </el-row>

          </el-col>
        </el-tab-pane>

        <el-tab-pane label="推荐分类/Recommended Category" name="second">
          <div>
            <el-row :gutter="20" style="padding: 20px 0;display:inline-flex">
              <el-col style="min-width: 240px">
                <el-input
                  v-model="reAddDialog.key"
                  v-permission="`get:/categorize/list`"
                  placeholder="请输入搜索内容/Please enter the search content"
                />

              </el-col>
            </el-row>
          </div>
          <div>
            <el-row style="display:inline-flex;padding: 20px 0" :gutter="20">
              <el-col>
                <el-button
                  v-permission="`post:/categorize/add`"
                  type="primary"
                  plain
                  icon="el-icon-plus"
                  @click.native.prevent="openRecommendedAdd"
                >
                  添加配置/Add Configuration
                </el-button>
              </el-col>

              <el-col>
                <el-button
                  v-permission="`post:/categorize/delete`"
                  type="danger"
                  plain
                  icon="el-icon-delete"
                  :disabled="selections.length === 0"
                  @click.native.prevent="openRecommendedDel"
                >
                  删除配置/Delete Configuration
                </el-button>
              </el-col>

              <el-col>
                <el-button
                  v-permission="`post:/categorize/edite`"
                  type="success"
                  plain
                  icon="el-icon-edit"
                  :disabled="selections.length !== 1"
                  @click.native.prevent="openRecommendedEdition"
                >
                  编辑配置/Edit Configuration
                </el-button>
              </el-col>

            </el-row>
          </div>
          <el-row style="padding: 20px 0" :gutter="20">
            <el-table
              ref="recommendationTable"
              v-permission="`get:/categorize/list`"
              :data="recommendationListComputed"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />

              <el-table-column label="分类名称/Category Name">
                <template slot-scope="scope">
                  {{ scope.row.name }} / {{ scope.row.enName }}
                </template>
              </el-table-column>

            </el-table>
            <el-row />
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <form-dialog
        ref="reAddDialog"
        :fields="reAddDialog.fields"
        :add-form="reAddDialog.addForm"
        :success-handler="getRecommendCategoryList"
        :submit="reAddDialog.submit"
        :rules="reAddDialog.rules"
        title="添加框/Adding Prompt"
      />

      <form-dialog
        ref="reEditionDialog"
        :fields="reEditionDialog.fields"
        :add-form="reEditionDialog.editionForm"
        :success-handler="getRecommendCategoryList"
        :submit="reEditionDialog.submit"
        :rules="reEditionDialog.rules"
        title="编辑框/Edit Prompt"
      />

      <el-dialog
        :width="width"
        :title="normalAddingDialog.title"
        :visible.sync="commonFormShow"
      >
        <el-form
          ref="addCommonForm"
          :model="normalAddingDialog.addForm"
          :rules="normalAddingDialog.rules"
          :label-width="labelWidth"
        >

          <el-form-item prop="typeName" label="分类类型/Category Type">
            <el-input
              value="推荐分类/Recommended Category"
              disabled
            />
          </el-form-item>

          <el-form-item prop="name" label="分类名称/Category Name">
            <el-input
              v-model="normalAddingDialog.addForm.name"
              placeholder="请输入分类名称/Please enter the category name"
            />
          </el-form-item>

          <el-form-item prop="enName" label="英文分类名/English Category Name">
            <el-input
              v-model="normalAddingDialog.addForm.enName"
              placeholder="请输入英文名/Please enter the category English name"
            />
          </el-form-item>

          <el-form-item prop="isNav" label="是否导航?/Whether Navigate?">
            <el-radio v-model="normalAddingDialog.addForm.ifNav" :label="true">是/Yes</el-radio>
            <el-radio v-model="normalAddingDialog.addForm.ifNav" :label="false">否/No</el-radio>
          </el-form-item>

          <el-form-item prop="ico" label="图标/Icon">
            <!--            <el-upload-->
            <!--              :headers="headers"-->
            <!--              class="avatar-uploader"-->
            <!--              action="http://localhost:8080/file/upload"-->
            <!--              :show-file-list="false"-->
            <!--              :on-success="handleAvatarSuccess"-->
            <!--              :before-upload="beforeAvatarUpload">-->
            <!--              <img v-if="normalAddingDialog.addForm.icoUrl"-->
            <!--                   :src="normalAddingDialog.addForm.icoUrl"-->
            <!--                   class="avatar">-->
            <!--              <i v-else class="el-icon-plus avatar-uploader-icon">-->

            <!--              </i>-->
            <!--            </el-upload>-->
            <image-uploader
              :url="normalAddingDialog.addForm.icoUrl"
              :path="normalAddingDialog.addForm.ico"
              width="48px"
              height="48px"
              @ok="function(data){
                normalAddingDialog.addForm.icoUrl = data.url;
                normalAddingDialog.addForm.ico = data.path;
              }"
            />

          </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="commonFormShow=false">取消/Cancel</el-button>
          <el-button type="primary" @click="handleNormalSubmit">
            确定/Confirm
          </el-button>
        </span>

      </el-dialog>

    </el-card>
  </div>
</template>

<style>
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
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
}

.avatar {
  width: 48px;
  height: 48px;
  display: block;
}
</style>
