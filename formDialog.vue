<script>
export default {
  props: {
    title: String,
    width: { type: String, default: '380px' },
    labelWidth: { type: String, default: '90px' },
    submit: Function,
    successHandler: Function,
    addForm: {
      type: Object,
      default: () => {

      }
    },
    fields: {
      type: Array,
      default: () => {

      }
    },
    rules: {
      type: Object,
      default: () => {

      }
    }
  },
  data() {
    return {
      formShow: false
    }
  },
  methods: {
    show() {
      this.formShow = true
    },
    hide() {
      this.formShow = false
    },
    handleSubmit() {
      this.$refs.addForm.validate().then(() => {
        this.submit(this.addForm).then(res => {
          this.$messageOk(res.message)
          this.hide()
          this.successHandler()
        })
      })
    }
  }

}
</script>

<template>
  <el-dialog :width="width" :title="title" :visible.sync="formShow">
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="rules"
      :label-width="labelWidth"
    >
      <el-form-item
        v-for="item in fields"
        v-show="item.type!== 'hidden'"
        :key="item.name"
        :label="item.label"
        :prop="item.name"
      >
        <el-input
          v-if="item.type!=='select'"
          v-model="addForm[item.name]"
          :disabled="item.disabled"
          :placeholder="item.placeholder?item.placeholder:''"
          :type="item.type?item.type:'text'"
          :show-password="item.type==='password'"
        />
        <el-select
          v-if="item.type==='select'"
          v-model="addForm[item.name]"
          :disabled="item.disabled"
          clearable
          :multiple="item.multiple"
          :placeholder="item.placeholder"
        >
          <el-option
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
            :disabled="opt.disabled"
          />
        </el-select>
        {{ item.tip?item.tip:'' }}
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取消/Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">确定/Confirm</el-button>
    </span>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
