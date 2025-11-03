<script>
import { add, tree, del, edit } from '@/api/api/menu'
import FormDialog from '@/views/murray-component/formDialog.vue'
import permission from '@/directive/permission/index.js'

export default {
  components: {
    FormDialog
  },
  directives: {
    permission
  },
  data() {
    return {
      menuTree: [],
      selections: [],
      fields: [
        { name: 'pName', label: '父级/Parent', disabled: true },
        // {name: 'pid', label: 'pid', type: 'hidden'},
        { name: 'name', label: '名称/Name' },
        { name: 'route', label: '前端权限值/Frontend Auths` Value' },
        { name: 'api', label: '后端权限值/Backend Auths` Value' },
        // {
        //   name: 'type', label: '类型/type', type: 'select',
        //   options: [{label: '目录/Directory', value: 0},
        //     {label: '菜单/Menu', value: 1},
        //     {label: "功能/Function", value: 2},
        //   ]
        // },
        { name: 'sort', label: '排序值/Sorting Value', type: 'number' }
      ],
      addForm: {
        fields: [],
        submit: add,
        rules: {
          name: { required: true, trigger: 'blur', message: '菜单名不能为空/The Name Of Menu Cannot be empty' },
          type: { required: true, trigger: 'change', message: '类型不能为空/The Type Of Menu Cannot be empty' }
        },
        form: {}
      },

      editForm: {
        fields: [
          { name: 'name', label: '名称/Name' },
          { name: 'route', label: '前端权限值' },
          { name: 'menuId', type: 'hidden', label: 'menuId' },
          { name: 'api', label: '后端权限值' },
          { name: 'sort', label: '排序值', type: 'number' }

        ],
        submit: edit,
        rules: {
          name: [{ required: true, trigger: 'blur', message: '菜单名不为空/The name of menu cannot be empty' }],
          type: [{ required: true, trigger: 'change', message: '类型不能为空' }]
        },
        form: {}
      }

    }
  },
  mounted() {
    this.getTree()
  },
  methods: {
    getTree() {
      tree().then(res => {
        this.menuTree = res.data
      })
    },
    handleSelectionChange(val) {
      this.selections = val
    },
    openAdd(row) {
      if (row) {
        this.addForm.form['pName'] = row.name
        this.addForm.form['pid'] = row.menuId

        if (row.type === 0) {
          this.addForm.fields = [...this.fields, {
            name: 'type', label: '类型/Type', type: 'select',
            options: [
              { label: '目录/Directory', value: 0 },
              { label: '菜单/Menu', value: 1 },
              { label: '功能/Function', value: 2, disabled: true }
            ]
          }]
        }

        if (row.type === 1) {
          this.addForm.fields = [...this.fields, {
            name: 'type', label: '类型/Type', type: 'select',
            options: [
              { label: '目录/Directory', value: 0, disabled: true },
              { label: '菜单/Menu', value: 1, disabled: true },
              { label: '功能/Function', value: 2, disabled: false }
            ]
          }]
        }
      } else {
        this.addForm.form['pName'] = '根目录/Root Directory'
        this.addForm.form['pid'] = 0
        this.addForm.fields = [...this.fields, {
          name: 'type', label: '类型/Type', type: 'select',
          options: [
            { label: '目录/Directory', value: 0 },
            { label: '菜单/Menu', value: 1, disabled: true },
            { label: '功能/Function', value: 2, disabled: true }
          ]
        }]
      }
      this.$refs.addForm.show()
    },
    handleDel() {
      const menuIds = []
      this.selections.forEach(e => {
        menuIds.push(e.menuId)
      })

      this.$ask({ message: '确认删除/Confirm to Delete?' }).then(() => {
        del(menuIds.join(',')).then(res => {
          this.$messageOk(res.message)
          this.getTree()
        })
      })
    },
    openEdition() {
      this.editForm.form = this.selections[0]
      this.$refs.editForm.show()
    }
  }

}
</script>

<template>
  <div class="app-container">

    <el-card>
      <el-row style="padding: 20px 0;display: inline-flex;" :gutter="20">
        <el-col>
          <el-button v-permission="`post:/sys/menu/add`" type="primary" icon="el-icon-plus" plain @click.native.prevent="openAdd(null)">添加/Add</el-button>
        </el-col>

        <el-col>
          <el-button
            v-permission="`post:/sys/menu/delete`"
            type="danger"
            icon="el-icon-delete"
            :disabled="selections.length===0"
            plain
            @click.native.prevent="handleDel"
          >删除/Del
          </el-button>
        </el-col>

        <el-col>
          <el-button
            v-permission="`post:/sys/menu/edite`"
            icon="el-icon-edit"
            type="success"
            :disabled="selections.length!==1"
            plain
            @click.native.prevent="openEdition"
          >
            编辑/Edit
          </el-button>
        </el-col>

      </el-row>

      <el-row style="padding:20px 0;">
        <el-table
          v-permission="`get:/sys/menu/tree`"
          :data="menuTree"
          style="width: 100%;margin-bottom: 20px;"
          row-key="menuId"
          :tree-props="{children: 'children'}"
          @selection-change="handleSelectionChange"
        >

          <el-table-column
            type="selection"
            width="55"
          />

          <el-table-column
            prop="name"
            label="名称/Name"
          />

          <el-table-column
            prop="route"
            label="前端权限值/Frontend Auths` Value"
          />

          <el-table-column
            prop="api"
            label="后端权限值/Backend Auths` Value"
          />

          <el-table-column
            v-slot="scope"
            label="类型/Type"
          >
            <template>
              {{ scope.row.type === 0 ? '目录/Directory' : scope.row.type === 1 ? '菜单/Menu' : '功能/Function' }}
            </template>
          </el-table-column>

          <el-table-column
            v-slot="scope"
            label="操作/Operation"
          >

            <template>
              <el-button
                v-if="scope.row.type!==2"
                plain
                type="text"
                icon="el-icon-plus"
                @click.native.prevent="openAdd(scope.row)"
              >
                添加/Add
              </el-button>
            </template>

          </el-table-column>

        </el-table>
      </el-row>

      <form-dialog
        ref="addForm"
        :fields="addForm.fields"
        :rules="addForm.rules"
        :success-handler="getTree"
        :submit="addForm.submit"
        title="添加菜单/Adding Menu"
        :add-form="addForm.form"
      />

      <form-dialog
        ref="editForm"
        :fields="editForm.fields"
        :rules="editForm.rules"
        :success-handler="getTree"
        :submit="editForm.submit"
        title="编辑菜单/Edit Menu"
        :add-form="editForm.form"
      />

    </el-card>
  </div>
</template>

<style scoped lang="less">

</style>
