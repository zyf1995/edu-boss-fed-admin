<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
        :model="form"
        ref="form"
        :inline="true"
        class="demo-form-inline"
        label-width="80px"
        >
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="资源路径"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" clearable placeholder="资源分类">
              <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in resourceCategorys"
              :key="item.id"
            ></el-option>
            </el-select>
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
      </div>
      <el-table
        :data="resources"
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
          label="资源名称"
        >
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径"
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
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages, getAllCategory } from '@/services/resource'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      form: {
        name: '',
        url: '',
        categoryId: '',
        current: 1, // 页码
        size: 5 // 每页数据量
      },
      resources: [],
      total: 0,
      resourceCategorys: [],
      isLoading: false
    }
  },
  created () {
    this.loadResources()
    this.loadAllCategory()
  },
  methods: {
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      this.total = data.data.total
      this.resources = data.data.records
      this.isLoading = false
    },

    async loadAllCategory () {
      const { data } = await getAllCategory()
      this.resourceCategorys = data.data
    },

    onSubmit () {
      if (
        !this.form.name &&
        !this.form.url &&
        !this.form.categoryId
      ) return
      this.form.current = 1
      this.loadResources()
    },

    onReset () {
      if (
        !this.form.name &&
        !this.form.url &&
        !this.form.categoryId
      ) return
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    },

    // eslint-disable-next-line
    handleEdit (row: any) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: row.id
        }
      })
    },

    // eslint-disable-next-line
    handleDelete (row: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(() => {
          console.log(row.id)
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
      this.loadResources()
    },

    // eslint-disable-next-line
    handleCurrentChange (val: any) {
      this.form.current = val
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped></style>
