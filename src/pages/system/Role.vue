<template>
    <div class="container">
        <div class="search_box">
            <a @click="changeSearchBox" :class="searchBoxVisible ? 'link-search-btn link-search-btn-active' : 'link-search-btn'">
                <i class="el-icon-search"></i> 搜索
            </a>
            <el-button @click="showDialog(null, 'create')" type="primary" style="float: right;">
                <i class="el-icon-plus"></i>
                新增角色
            </el-button>
        </div>
        <div class="search-box-content" v-show="searchBoxVisible">
            <el-form :inline="true" :model="formSearch" ref="formSearch">
                <el-form-item label="角色" prop="name" class="specialWidth50">
                    <el-input
                            v-model="formSearch.name"
                            placeholder="请输入角色名"
                            clearable
                            @clear="onSearch"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSearch" type="primary" icon="el-icon-search" plain>
                        查询
                    </el-button>
                    <el-button @click="refresh" icon="el-icon-refresh">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-content">
            <el-table
                    :data="tableList"
                    tooltip-effect="dark"
                    v-loading="searchLoading"
                    :header-cell-style="{fontSize: '14px', color: '#333333'}"
                    stripe
            >
                <el-table-column
                        type="index"
                        :index="index => index + 1 + (formSearch.pageNum - 1) * formSearch.pageSize"
                        align="center"
                        fixed="left"
                        width="80"
                        label="序号"
                ></el-table-column>
                <el-table-column
                        prop="name"
                        min-width="150"
                        show-overflow-tooltip
                        label="角色名"
                ></el-table-column>
                <el-table-column
                        prop="adminList"
                        min-width="500"
                        show-overflow-tooltip
                        label="用户列表"
                >
                    <template slot-scope="scope">
                        <div v-if="scope.row.adminList && scope.row.adminList.length > 0">
                            <span v-for="(item, index) in scope.row.adminList" :key="item.id">
                                {{item.realName}}<span v-if="index < scope.row.adminList.length - 1">、</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        width="170"
                        label="操作"
                >
                    <template slot-scope="scope">
                        <el-row type="flex" justify="center">
                            <el-tooltip content="用户" placement="bottom-start">
                                <a @click="jumpPage(scope.row, 'user')" class="action-a-btn">
                                    <img src="@/assets/images/user-22.png">
                                </a>
                            </el-tooltip>
                            <el-tooltip content="菜单" placement="bottom-start">
                                <a @click="jumpPage(scope.row, 'menu')" class="action-a-btn">
                                    <img src="@/assets/images/menu-22.png">
                                </a>
                            </el-tooltip>
                            <el-tooltip content="权限" placement="bottom-start">
                                <a @click="jumpPage(scope.row, 'permission')" class="action-a-btn">
                                    <img src="@/assets/images/permission-22.png">
                                </a>
                            </el-tooltip>
                            <el-tooltip content="编辑" placement="bottom-start">
                                <a @click="showDialog(scope.row, 'update')" class="action-a-btn">
                                    <img src="@/assets/images/edit-22.png">
                                </a>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="bottom-start">
                                <a @click="deleteRole(scope.row)" class="action-a-btn">
                                    <img src="@/assets/images/delete-22.png">
                                </a>
                            </el-tooltip>
                            <!--<el-button type="primary" size="mini" @click="jumpPage(scope.row, 'user')">用户维护</el-button>
                            <el-button type="primary" size="mini" @click="jumpPage(scope.row, 'menu')">菜单维护</el-button>
                            <el-button type="primary" size="mini" @click="jumpPage(scope.row, 'permission')">权限维护</el-button>
                            <el-button type="primary" size="mini" @click="showDialog(scope.row, 'update')">编辑</el-button>
                            <el-button type="danger" size="mini" @click="deleteRole(scope.row)">删除</el-button>-->
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination_box">
                <el-pagination
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        class="pagination_content"
                        :current-page="formSearch.pageNum"
                        :page-size="formSearch.pageSize"
                        :total="total"
                ></el-pagination>
            </div>
        </div>
        <RoleDialog
                :visible="dialogVisible"
                :hideDialog="hideDialog"
                :submit="addOrUpdateRole"
                :loading="dialogSubmitLoading"
                :error="error"
                :updateObj="updateObj"
        />
    </div>
</template>
<script>
    import RoleDialog from './container/role/RoleDialog'

    export default {
        name: 'rolePage',
        data() {
            return {
                formSearch: {
                    name: '',
                    pageNum: 1,
                    pageSize: 15
                },
                searchBoxVisible: false,
                searchLoading: false,
                tableList: [],
                total: 0,
                pages: 0,
                error: false,
                dialogVisible: false,
                dialogSubmitLoading: false,
                actionType: '',
                updateObj: {},
            }
        },
        methods: {
            changeSearchBox() {
                this.searchBoxVisible = !this.searchBoxVisible
            },
            async onSearch() {
                this.formSearch.pageNum = 1;
                this.searchCommon()
            },
            //重置
            refresh() {
                this.$refs['formSearch'].resetFields();
                this.onSearch()
            },
            //分页
            handleCurrentChange(pageNum) {
                this.formSearch.pageNum = pageNum;
                this.searchCommon()
            },
            handleSizeChange(pageSize) {
                this.formSearch.pageNum = 1;
                this.formSearch.pageSize = pageSize;
                this.searchCommon()
            },
            async searchCommon() {
                let formData = {
                    name: this.formSearch.name.trim(),
                    pageNum: this.formSearch.pageNum,
                    pageSize: this.formSearch.pageSize
                };
                this.searchLoading = true;
                const res = await this.$service.getRoleList(formData);
                this.searchLoading = false;
                if (res.code === 20000) {
                    this.formSearch.pageNum = res.data.pageNum;
                    this.formSearch.pageSize = res.data.pageSize;
                    this.total = res.data.total;
                    this.pages = res.data.pages;
                    this.tableList = res.data.result || []
                } else {
                    this.$notify.error({
                        title: '提示',
                        message: res.message ? res.message : '搜索失败',
                        duration: 2000
                    })
                }
            },
            showDialog(row, actionType) {
                this.dialogVisible = true;
                this.error = false;
                this.actionType = actionType;
                if (this.actionType === 'update') {
                    this.updateObj = {...row};
                }
            },
            hideDialog() {
                this.dialogVisible = false;
                this.error = false;
                this.updateObj = {};
            },
            async addOrUpdateRole(data) {
                let formData = {...data};
                let res;
                this.dialogSubmitLoading = true;
                if (this.actionType === 'create') {
                    res = await this.$service.addRole(formData);
                } else if (this.actionType === 'update') {
                    res = await this.$service.updateRole(formData);
                }
                this.dialogSubmitLoading = false;
                if (res.code === 20000) {
                    this.hideDialog();
                    this.searchCommon();
                } else {
                    this.error = res.message || true;
                }
            },
            //删除
            deleteRole(row) {
                this.$confirm('您选择了1条数据，是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    lockScroll: false
                }).then(async () => {
                    const res = await this.$service.deleteRole({
                        id: row.id
                    });
                    if (res.code === 20000) {
                        this.$notify({
                            title: '提示',
                            type: 'success',
                            message: '删除成功',
                        });
                        this.searchCommon()
                    } else {
                        this.$notify.error({
                            title: '提示',
                            message: res.message ? res.message : '删除失败',
                        })
                    }
                }).catch(() => {
                });
            },
            jumpPage(data, page) {
                if (page === 'user') {
                    this.$router.push({
                        name: 'role-user.html',
                        query: {
                            roleId: data.id,
                            roleName: data.name
                        }
                    })
                } else if (page === 'menu') {
                    this.$router.push({
                        name: 'role-menu.html',
                        query: {
                            roleId: data.id,
                            roleName: data.name
                        }
                    })
                } else if (page === 'permission') {
                    this.$router.push({
                        name: 'role-permission.html',
                        query: {
                            roleId: data.id,
                            roleName: data.name
                        }
                    })
                }
            },
        },
        created() {
            this.searchCommon()
        },
        mounted() {
        },
        computed: {},
        components: {
            RoleDialog,
        }
    }
</script>
<style scoped></style>
