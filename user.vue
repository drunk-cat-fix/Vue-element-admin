<script xmlns="http://www.w3.org/1999/html">
import { getList, add, del, edit, resetCipher, changeStatus } from '@/api/api/user'
import formDialog from '@/views/murray-component/formDialog.vue'
import { getList as getRoleList } from '@/api/api/roles'
import permission from '@/directive/permission/index.js'

export default {
  name: 'User',
  components: {
    formDialog
  },
  directives: {
    permission
  },
  data() {
    return {
      roles: [],
      dialogData: {
        submit: add,
        successHandler: this.getList,
        title: '添加用户',
        fields: [
          // {
          //   name: 'name',
          //   label: '昵称/Name',
          // },
          // {
          //   name: 'userName',
          //   label: '用户名/Username',
          // },
          // {
          //   name: 'password',
          //   label: '密码/Password',
          //   type: 'password',
          // },
          // {
          //   name: 'phone',
          //   label: '手机号/Phone Number',
          //   type: 'number',
          // },
          // {
          //   name: 'roleIds',
          //   type: 'select',
          //   label: '角色/Role',
          //   multiple: true,
          //   options: [{
          //     label: '超级管理员/Admin',
          //     value: 1,
          //   },
          //     {
          //       label: 'Murray/Murray',
          //       value: 3,
          //     }
          //   ],
          // }
        ],
        rules: {
          name: [{
            required: true,
            trigger: 'blur',
            message: '昵称/Name不能为空'
          }],
          phone: [{
            pattern: '^(?:(?:(?:\\+|00)86)?1(?:3\\d|4[11]|5[0-35-9]|6[567]|7[0-8]|8\\d|9[189])\\d{8})|(?:(?:(?:\\+|00)60)?1[0-9]{1,2}\\d{7,8})$',
            trigger: 'blur',
            message: '手机号格式错误'
          }],
          password: [{
            required: true,
            trigger: 'blur',
            message: '密码不能为空'
          },
          {
            min: 6,
            max: 18,
            message: '密码长度在6-18位',
            trigger: 'blur'
          }
          ],
          userName: [{
            required: true,
            trigger: 'blur',
            message: '用户名不能为空'
          }]
        },
        addForm: {}
      },
      editDialog: {
        title: '编辑用户/Edit User',
        submit: edit,
        addForm: {}
      },
      resetCipherDialog: {
        title: '重置密码/Reset Cipher',
        submit: resetCipher,
        addForm: {},
        fields: [
          {
            name: 'username',
            label: '用户名/Username',
            type: 'text',
            disabled: true
          },
          {
            name: 'password',
            label: '密码/Password',
            type: 'password',
            tip: '默认密码为murray/ Default password is murray'
          }

        ],
        rules: {
          password: [{
            required: true,
            trigger: 'blur',
            message: '密码不为空/Password Cannot be Empty'

          },
          {
            min: 6,
            max: 18,
            message: '密码长度在6-18为/The length of passwords is between 6-18',
            trigger: 'blur'
          }
          ]
        }
      },
      dataList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        key: null
      },
      selection: []
    }
  },

  mounted() {
    getRoleList({
      pageshow: false
    }).then((res) => {
      this.roles = res.data.list
      this.getList()
    })
  },

  methods: {
    getList() {
      getList(this.page).then(res => {
        this.dataList = res.data.list || []
        this.page.total = res.data.total
      })
    },

    openAdd() {
      getRoleList({
        pageshow: false
      }).then(res => {
        const options = []
        res.data.list.forEach(item => {
          options.push({
            label: item.name,
            value: item.roleId
          })
          this.dialogData.fields = [
            {
              name: 'name',
              label: '昵称/Name'
            },
            {
              name: 'userName',
              label: '用户名/Username'
            },
            {
              name: 'password',
              label: '密码/Password',
              type: 'password',
              tip: '默认密码为murray/ Default password is murray'
            },
            {
              name: 'phone',
              label: '手机号/Phone Number',
              type: 'number'
            },
            {
              name: 'roleIds',
              type: 'select',
              label: '角色/Role',
              multiple: true,
              options:
              //   [{
              //   label: '超级管理员/Admin',
              //   value: 1,
              // },
              //   {
              //     label: 'Murray/Murray',
              //     value: 3,
              //   }
              // ],
              options
            }
          ]
          this.dialogData.addForm.password = 'murray'
        })
      })
      this.$refs.addDialog.show()
    },

    handleDel() {
      const userIds = []
      this.selection.forEach(item => {
        userIds.push(item.userId)
      })

      del(userIds.join(',')).then(res => {
        this.$messageOk(res.message)
        this.selection = []
        this.getList()
      })
    },

    handleSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNum = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.selection = val
    },

    openEdition(row) {
      getRoleList({
        pageshow: false
      }).then(res => {
        const options = []
        res.data.list.forEach(item => {
          options.push({
            label: item.name,
            value: item.roleId
          })
          this.dialogData.fields = [
            {
              name: 'name',
              label: '昵称/Name'
            },
            {
              name: 'phone',
              label: '手机号/Phone Number',
              type: 'number'
            },
            {
              name: 'roleIds',
              type: 'select',
              label: '角色/Role',
              multiple: true,
              options:
              //   [{
              //   label: '超级管理员/Admin',
              //   value: 1,
              // },
              //   {
              //     label: 'Murray/Murray',
              //     value: 3,
              //   }
              // ],
              options
            }
          ]
        })
      })
      this.editDialog.addForm = { ...row }
      this.$refs.editDialog.show()
    },

    openResetCipher(row) {
      this.$refs.resetCipherDialog.show()
      this.resetCipherDialog.addForm = {
        userId: row.usreId,
        username: row.userName,
        password: 'murray'
      }
    },

    changeStatus(data) {
      changeStatus({
        userId: data.userId
      }).then(res => {
        this.messageOk(res.message)
        this.getList()
      }).catch(() => {
        this.getList()
      })
    }

  }
}
</script>

<template>
  <div class="app-container">
    <el-card>
      <div>
        <el-row :gutter="20" style="display: inline-flex;padding: 20px 0">

          <el-col style="min-width: 240px">
            <el-input
              v-model="page.key"
              placeholder="请输入内容"
              @keyup.enter.native="getList"
            />
          </el-col>

          <el-col>
            <el-button v-permission="`get:/sys/user/list`" type="primary" icon="el-icon-search" @click.native.prevent="getList">搜索/Search</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row :gutter="20" style="display: inline-flex;padding: 20px 0">
          <el-col>
            <el-button v-permission="`post:/sys/user/add`" type="primary" icon="el-icon-plus" @click.native.prevent="openAdd">添加用户/Add User
            </el-button>

            <el-button
              v-permission="`post:/sys/user/delete`"
              type="danger"
              icon="el-icon-delete"
              :disabled="selection.length===0"
              @click.native.prevent="handleDel"
            >删除用户/Del User
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div>
        <el-row style="padding: 20px 0;">
          <el-table v-permission="`get:/sys/user/list`" :data="dataList" @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column prop="name" label="昵称/Name" />
            <el-table-column prop="userName" label="用户名/Username" />
            <el-table-column prop="userId" label="用户id/User Id" />
            <el-table-column label="用户状态/Status">
              <template slot-scope="scope">
                {{ scope.row.status === 0 ? '正常/Normal' : '禁用/Disabled' }}
                <el-switch
                  v-model="scope.row.status"
                  v-permission="`post:/sys/user/status/switch`"
                  :active-value="0"
                  inactive-value="-1"
                  @change="changeStatus(scope.row)"
                />
              </template>
            </el-table-column>

            <el-table-column prop="phone" label="手机号/Phone" />

            <el-table-column label="角色">
              <template slot-scope="scope">
                <el-tag v-for="id in scope.row.roleIds">
                  {{ roles.find(e => e.roleId === id).name }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作/Operation">
              <template slot-scope="scope">
                <el-button
                  v-permission="`post:/sys/user/edite`"
                  icon="el-icon-edit"
                  type="text"
                  @click.native.prevent="openEdition(scope.row)"
                >编辑/Edit
                </el-button>
                <el-button
                  v-permission="`post:/sys/user/password/reset`"
                  type="text"
                  @click.native.prevent="openResetCipher(scope.row)"
                >重置密码/Reset Cipher
                </el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-row>
      </div>
      <div>
        <el-row v-permission="`get:/sys/user/list`" style="padding: 20px 0;">
          <el-pagination
            :current-page.sync="page.pageNum"
            :page-size="page.pageSize"
            :page-sizes="[10,50,100,200]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </div>
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
        :fields="dialogData.fields"
        :rules="dialogData.rules"
        :add-form="editDialog.addForm"
        :success-handler="dialogData.successHandler"
      />

      <form-dialog
        ref="resetCipherDialog"
        :submit="resetCipherDialog.submit"
        :title="resetCipherDialog.title"
        :fields="resetCipherDialog.fields"
        :rules="resetCipherDialog.rules"
        :add-form="resetCipherDialog.addForm"
        :success-handler="dialogData.successHandler"
      />

    </el-card>
  </div>
</template>

<style scoped lang="sass">

</style>
