<template>
  <div class="alloc-menu">
    <el-card class="box-card">
      <div slot="header">
        <span>分配权限</span>
      </div>
      <el-tree
        ref="menu-tree"
        :data="menus"
        :props="defaultProps"
        node-key="id"
        :default-checked-keys="checkedKeys"
        show-checkbox
        default-expand-all
      ></el-tree>
      <div style="margin-top: 20px">
        <el-button
          @click="handleReset"
        >清空</el-button>
        <el-button
         type="primary"
         @click="onSave"
        >保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    async loadMenus () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },

    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },

    // eslint-disable-next-line
    getCheckedKeys (menus: any) {
      // eslint-disable-next-line
      menus.forEach((menu: any) => {
        if (menu.selected) {
          // this.checkedKeys.push(menu.id as never) 不会触发vue重新渲染页面
          // eslint-disable-next-line
          this.checkedKeys = [...this.checkedKeys, menu.id] as any
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },

    async onSave () {
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      this.$router.back()
      this.$message.success('保存成功')
    },

    handleReset () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped></style>
