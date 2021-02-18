<template>
  <div class="create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">{{ isEdit?'添加菜单':'编辑菜单' }}</div>
      <div>
        <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        >
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径" prop="href">
            <el-input v-model="form.href"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单">
            <el-select v-model="form.parentId" placeholder="请选择上级菜单">
              <el-option :value="-1" label="无上级菜单"></el-option>
              <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in parentMenuList"
              :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="前端图标" prop="icon">
            <el-input v-model="form.icon"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-radio-group v-model="form.shown">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.orderNum"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button
            v-if="isEdit"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdateMenu, getEditMenuInfo } from '@/services/menu'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'MenuCreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: '',
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: true
      },
      parentMenuList: [],
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        href: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入前端图标', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入菜单描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.loadMenuInfo()
  },
  methods: {
    async loadMenuInfo () {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1)
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo
      }
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
      }
    },

    async onSubmit () {
      try {
        await (this.$refs.form as Form).validate()// 表单验证
        const { data } = await createOrUpdateMenu(this.form)
        if (data.code === '000000') {
          this.$message.success('提交成功')
          this.$router.back()
        }
      } catch (err) {
        console.log('提交失败', err)
      }
    }
  }
})
</script>

<style lang="scss" scoped></style>
