<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
        :model="form"
        ref="form"
        :inline="true"
        class="demo-form-inline"
        label-width="80px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
            type="primary"
            @click="onSubmit"
            :disabled="isLoading"
            >查询搜索</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button
          @click="handleAdd"
        >添加角色</el-button>
      </div>
      <el-table
        :data="roles"
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px"
        >
        <el-table-column
          type="index"
          label="编号"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
        >
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
        >
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    roleId: scope.row.id
                  }
                })"
              >分配菜单</el-button>
              <el-button
                type="text"
              >分配资源</el-button>
            </div>
            <div>
              <el-button
                size="mini"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :disabled="isLoading"
        >
      </el-pagination>
    </el-card>

    <el-dialog
      :title="isEdit?'编辑角色':'添加角色'"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <create-or-edit
       v-if="dialogVisible"
       :role-id="roleId"
       :is-edit="isEdit"
       @success="onSuccess"
       @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRolePages, deleteRoleById } from '@/services/role'
import { Form } from 'element-ui'
import CreateOrEdit from './CreateOrEdit.vue'

export default Vue.extend({
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: '',
        current: 1, // 页码
        size: 5 // 每页数据量
      },
      roles: [],
      total: 0,
      isLoading: false,
      dialogVisible: false,
      roleId: null,
      isEdit: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRolePages(this.form)
      this.total = data.data.total
      this.roles = data.data.records
      this.isLoading = false
    },

    onSubmit () {
      if (
        !this.form.name
      ) return
      this.form.current = 1
      this.loadRoles()
    },

    onReset () {
      if (
        !this.form.name
      ) return
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadRoles()
    },

    // eslint-disable-next-line
    handleEdit (row: any) {
      this.dialogVisible = true
      this.roleId = row.id
      this.isEdit = true
    },

    // eslint-disable-next-line
    handleDelete (row: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => {
          await deleteRoleById(row.id)
          this.$message.success('删除成功')
          this.loadRoles()
        })
        .catch(err => {
          console.log(err)
          this.$message.info('已取消删除')
        })
    },

    // eslint-disable-next-line
    handleSizeChange (val: any) {
      this.form.size = val
      this.form.current = 1
      this.loadRoles()
    },

    // eslint-disable-next-line
    handleCurrentChange (val: any) {
      this.form.current = val
      this.loadRoles()
    },

    handleAdd () {
      this.dialogVisible = true
      this.roleId = null
      this.isEdit = false
    },

    onSuccess () {
      this.dialogVisible = false
      this.loadRoles()
    }
  }
})
</script>

<style lang="scss" scoped></style>
