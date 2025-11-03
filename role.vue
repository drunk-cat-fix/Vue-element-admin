<script>
import PageSearch from '@/views/murray-component/pageSearch.vue'
import PageTable from '@/views/murray-component/pageTable.vue'
import { getList, del, add, edit, loadingAuth, authUpdate } from '@/api/api/roles'
import { tree } from '@/api/api/menu'
import FormDialog from '@/views/murray-component/formDialog.vue'
import permission from '@/directive/permission/index.js'

export default {
  components: {
    FormDialog,
    PageSearch,
    PageTable
  },
  directives: {
    permission
  },
  data() {
    return {
      authShow: false,
      authTree: [],
      checkedKeys: [],
      editDialog: {
        title: '编辑角色/Edit Role',
        rules: {
          name: [{ required: true, trigger: 'blur', message: '角色名不能为空/The name of roles Cannot be empty' }]
        },
        addForm: {},
        successHandler: this.getList,
        fields: [{ name: 'name', label: '角色名/Name Of Role' }],
        submit: edit
      },
      dialogData: {
        title: '添加角色/Add Roles',
        rules: {
          name: [{ required: true, trigger: 'blur', message: '角色名不能为空/The name of roles Cannot be empty' }]
        },
        addForm: {},
        successHandler: this.getList,
        fields: [{ name: 'name', label: '角色名/Name Of Role' }],
        submit: add

      },
      tableColumns: [
        {
          prop: 'name',
          label: '角色名/Role Name'
        }
      ],
      selections: [],
      dataList: [],
      searchFields: [
        {
          name: 'name',
          placeholder: '请输入角色名/Please enter the name of roles'
        }
      ],
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
    getMenuTree() {
      tree().then(res => {
        this.authTree = res.data
        console.log(this.authTree)
      })
    },
    getList() {
      getList(this.pageParam).then(res => {
        this.pageParam.total = res.data.total
        this.dataList = res.data.list
      })
    },
    handleDel() {
      this.$ask({ message: '确认删除？/ Confirm To Delete?' }).then(() => {
        const roleIds = []
        this.selections.forEach(e => {
          roleIds.push(e.roleId)
        })
        del(roleIds.join(',')).then(res => {
          this.$messageOk(res.message)
          this.getList()
        })
      })
    },
    openAdding() {
      this.$refs.addDialog.show()
    },
    openEditing() {
      this.editDialog.addForm = JSON.parse(JSON.stringify(this.selections[0]))
      this.$refs.editDialog.show()
    },
    openAuth() {
      this.getMenuTree()
      this.authShow = true
      loadingAuth(this.selections[0].roleId).then(res => {
        this.checkedKeys = res.data.filter(
          (item) =>
            this.$refs.authTree.getNode(item) &&
            this.$refs.authTree.getNode(item).isLeaf
        )
      })
    },

    handleAuthSubmit() {
      const menuIds = [
        ...this.$refs.authTree.getCheckedKeys(),
        ...this.$refs.authTree.getHalfCheckedKeys()
      ]
      authUpdate({ menuIds, roleId: this.selections[0].roleId })
        .then(res => {
          this.$messageOk(res.message)
          this.authShow = false
          this.checkedKeys = []
        })
    }

  }
}
</script>

<template>
  <div class="container">
    <el-card>
      <page-search
        v-permission="`get:/sys/role/list`"
        :search-fields="searchFields"
        :load-data="getList"
        :page-param="pageParam"
      />

      <el-row style="display: inline-flex;" :gutter="20">
        <el-col>

          <el-button
            v-permission="`post:/sys/role/add`"
            type="primary"
            icon="el-icon-plus"
            plain
            @click.native.prevent="openAdding"
          >
            添加/Add
          </el-button>

          <el-button
            v-permission="`post:/sys/role/delete`"
            type="danger"
            icon="el-icon-delete"
            :disabled="selections.length===0"
            plain
            @click.native.prevent="handleDel"
          >
            删除/Delete
          </el-button>

          <el-button
            v-permission="`post:/sys/role/edite`"
            type="success"
            icon="el-icon-edit"
            :disabled="selections.length!==1"
            plain
            @click.native.prevent="openEditing"
          >
            编辑/Edit
          </el-button>

          <el-button
            v-permission="`post:/sys/role/auth/update`"
            type="success"
            icon="el-icon-edit"
            :disabled="selections.length!==1"
            plain
            @click.native.prevent="openAuth"
          >
            授权/Auth
          </el-button>

        </el-col>

      </el-row>

      <page-table
        v-permission="`get:/sys/role/list`"
        :page-param="pageParam"
        :load-data="getList"
        :selection="selections"
        :columns="tableColumns"
        :datalist="dataList"
      />

      <form-dialog
        ref="addDialog"
        :submit="dialogData.submit"
        :title="dialogData.title"
        :fields="dialogData.fields"
        :rules="dialogData.rules"
        :add-form="dialogData.addForm"
        :success-handler="dialogData.successHandler"
      />

      <form-dialog
        ref="editDialog"
        :submit="editDialog.submit"
        :title="editDialog.title"
        :fields="editDialog.fields"
        :rules="editDialog.rules"
        :add-form="editDialog.addForm"
        :success-handler="editDialog.successHandler"
      />

      <el-dialog width="450px" title="授权/Auths" :visible.sync="authShow" @close="checkedKeys=[]">
        <el-tree
          ref="authTree"
          :data="authTree"
          show-checkbox
          default-expand-all
          node-key="menuId"
          highlight-current
          :default-expanded-keys="checkedKeys"
          :props="{label:'name',children:'children'}"
        />

        <span slot="footer" class="dialog-footer">
          <el-button @click="authShow = false">取消/Cancel</el-button>
          <el-button @click="handleAuthSubmit">确定/Confirm</el-button>
        </span>

      </el-dialog>

    </el-card>
  </div>
</template>

<style lang="less" scoped>

</style>
