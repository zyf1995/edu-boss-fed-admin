<template>
  <div class="user-list">
    <el-card>
      <div slot="header">
        <el-form :model="filterParams" ref="filter-form">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="filterParams.phone"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="rangeDate">
            <el-date-picker
              v-model="filterParams.rangeDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button>重置</el-button>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="users"
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column prop="name" label="用户名"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="createTime" label="注册时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleSelectRole(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="filterParams.currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="filterParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :disabled="isLoading"
      >
      </el-pagination>
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <el-select v-model="roleIdList" multiple placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages } from '@/services/user'
import { getAllRoles, allocateUserRoles, getRoleUserById } from '@/services/role'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      filterParams: {
        currentPage: 1,
        pageSize: 5,
        phone: '',
        userId: 0,
        startCreateTime: '',
        endCreateTime: ''
      },
      users: [],
      isLoading: false,
      total: 0,
      dialogVisible: false,
      roles: [],
      roleIdList: [],
      currentUser: null
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    async loadUsers () {
      const { data } = await getUserPages(this.filterParams)
      this.users = data.data.records
      this.total = data.data.total
    },

    handleSizeChange () {
      console.log(11)
    },

    handleCurrentChange () {
      console.log(11)
    },

    // eslint-disable-next-line
    async handleSelectRole (row: any) {
      this.currentUser = row
      const { data } = await getAllRoles()
      this.roles = data.data
      // eslint-disable-next-line
      const { data: { data: userRoles } } = await getRoleUserById((this.currentUser as any).id)
      // eslint-disable-next-line
      this.roleIdList = userRoles.map((item: any) => item.id)
      this.dialogVisible = true
    },

    async handleSubmit () {
      await allocateUserRoles({
        // eslint-disable-next-line
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList
      })
      this.$message.success('操作成功')
      this.dialogVisible = false
    }
  }
})
</script>

<style lang="scss" scoped></style>
