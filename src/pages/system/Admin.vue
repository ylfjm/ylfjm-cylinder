<template>
    <div class="container">
        <div class="search_box">
            <a @click="changeSearchBox" :class="searchBoxVisible ? 'link-search-btn link-search-btn-active' : 'link-search-btn'">
                <i class="el-icon-search"></i> 搜索
            </a>
            <el-button @click="showDialog(null, 'create')" type="primary" style="float: right;">
                <i class="el-icon-plus"></i>
                新增用户
            </el-button>
        </div>
        <div class="search-box-content" v-show="searchBoxVisible">
            <el-form :inline="true" :model="formSearch" ref="formSearch">
                <el-form-item label="姓名" prop="realName" class="specialWidth50">
                    <el-input
                            v-model="formSearch.realName"
                            placeholder="请输入姓名"
                            clearable
                            @clear="onSearch"
                    ></el-input>
                </el-form-item>
                <el-form-item label="部门" prop="deptId" class="specialWidth50">
                    <el-select v-model="formSearch.deptId" clearable placeholder="请选择">
                        <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位" prop="postCode" class="specialWidth50">
                    <el-select v-model="formSearch.postCode" clearable placeholder="请选择">
                        <el-option v-for="item in postList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="roleId" class="specialWidth50">
                    <el-select v-model="formSearch.roleId" clearable placeholder="请选择" style="width: 100%;">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="forbidden" class="specialWidth50">
                    <el-select v-model="formSearch.forbidden" clearable @clear="onSearch">
                        <el-option key="true" label="被禁用" value="true"></el-option>
                        <el-option key="false" label="可用" value="false"></el-option>
                    </el-select>
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
                        prop="userName"
                        min-width="130"
                        show-overflow-tooltip
                        label="用户名"
                ></el-table-column>
                <el-table-column
                        prop="realName"
                        min-width="130"
                        show-overflow-tooltip
                        label="姓名"
                ></el-table-column>
                <!--<el-table-column
                        prop="roleNameList"
                        min-width="150"
                        show-overflow-tooltip
                        label="角色"
                >
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.roleNameList" :key="item">
                            {{item}}<br/>
                        </div>
                    </template>
                </el-table-column>-->
                <el-table-column
                        prop="deptName"
                        min-width="150"
                        show-overflow-tooltip
                        label="部门"
                ></el-table-column>
                <el-table-column
                        prop="postCode"
                        min-width="150"
                        show-overflow-tooltip
                        label="职位"
                >
                    <template slot-scope="scope">
                        <!--<div v-if="scope.row.postCode === 'po'">产品经理</div>
                        <div v-if="scope.row.postCode === 'ui'">UI设计师</div>
                        <div v-if="scope.row.postCode === 'web'">前端开发</div>
                        <div v-if="scope.row.postCode === 'android'">安卓开发</div>
                        <div v-if="scope.row.postCode === 'ios'">苹果开发</div>
                        <div v-if="scope.row.postCode === 'dev'">后端开发</div>
                        <div v-if="scope.row.postCode === 'test'">测试</div>
                        <div v-if="scope.row.postCode === 'pm'">项目经理</div>
                        <div v-if="scope.row.postCode === 'td'">研发经理</div>
                        <div v-if="scope.row.postCode === 'others'">其他</div>-->
                        <div v-for="item in postList" :key="item.id">
                            <div v-if="scope.row.postCode.indexOf(item.code) > -1">
                                {{item.name}}<br/>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="enable"
                        min-width="100"
                        show-overflow-tooltip
                        label="是否启用"
                >
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.forbidden"
                                :active-value="false"
                                :inactive-value="true"
                                @change="changeEnable(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="remark"
                        min-width="150"
                        show-overflow-tooltip
                        label="备注"
                ></el-table-column>
                <el-table-column
                        align="center"
                        fixed="right"
                        width="150"
                        label="操作"
                >
                    <template slot-scope="scope">
                        <el-row type="flex" justify="center">
                            <el-tooltip content="编辑" placement="bottom-start">
                                <a @click="showDialog(scope.row, 'update')" class="action-a-btn">
                                    <img src="@/assets/images/edit-22.png">
                                </a>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="bottom-start">
                                <a @click="deleteAdmin(scope.row)" class="action-a-btn">
                                    <img src="@/assets/images/delete-22.png">
                                </a>
                            </el-tooltip>
                            <!--<el-button type="primary" size="mini" @click="showDialog(scope.row, 'update')">编辑</el-button>
                            <el-button type="danger" size="mini" @click="deleteAdmin(scope.row)">删除</el-button>-->
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
        <AdminDialog
                :visible="dialogVisible"
                :hideDialog="hideDialog"
                :submit="addOrUpdateAdmin"
                :loading="dialogSubmitLoading"
                :error="error"
                :updateObj="updateObj"
                :deptList="deptList"
                :postList="postList"
                :roleList="roleList"
        />
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import CryptoJS from 'crypto-js'
    import AdminDialog from './container/admin/AdminDialog'

    export default {
        name: 'adminPage',
        data() {
            return {
                formSearch: {
                    realName: '',
                    deptId: '',
                    postCode: '',
                    roleId: '',
                    forbidden: '',
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
                deptList: [],
                postList: [],
                roleList: [],
                dialogSubmitLoading: false,
                actionType: '',
                updateObj: {},
                oldObj: {},
            }
        },
        computed: {},
        methods: {
            changeSearchBox() {
                this.searchBoxVisible = !this.searchBoxVisible
            },
            //重置
            refresh() {
                this.$refs['formSearch'].resetFields();
                this.onSearch()
            },
            async onSearch() {
                this.formSearch.pageNum = 1;
                this.searchCommon()
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
                    realName: this.formSearch.realName.trim(),
                    deptId: this.formSearch.deptId,
                    postCode: this.formSearch.postCode,
                    roleId: this.formSearch.roleId,
                    forbidden: this.formSearch.forbidden,
                    pageNum: this.formSearch.pageNum,
                    pageSize: this.formSearch.pageSize
                };
                this.searchLoading = true;
                const res = await this.$service.getAdminList(formData);
                this.searchLoading = false;
                if (res.code === 20000) {
                    this.formSearch.pageNum = res.data.pageNum;
                    this.formSearch.pageSize = res.data.pageSize;
                    this.total = res.data.total;
                    this.pages = res.data.pages;
                    this.tableList = res.data.result || [];
                    this.tableList.map(item => {
                        item.postCode = item.postCode.split(',');
                    });
                } else {
                    this.$notify.error({
                        title: '提示',
                        message: res.message ? res.message : '查询失败',
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
                    this.oldObj = {...row};
                }
            },
            hideDialog() {
                this.dialogVisible = false;
                this.error = false;
                this.updateObj = {};
                this.oldObj = {};
            },
            async addOrUpdateAdmin(data) {
                let formData;
                let res;
                this.dialogSubmitLoading = true;
                if (this.actionType === 'create') {
                    formData = {
                        ...data,
                        postCode: data.postCode.join(','),
                        password: CryptoJS.MD5(data.password.trim()).toString()
                    };
                    res = await this.$service.addAdmin(formData);
                } else if (this.actionType === 'update') {
                    formData = {
                        ...data,
                        postCode: data.postCode.join(',')
                    };
                    if (formData.password && formData.password !== '' && formData.password !== this.oldObj.password) {
                        formData.password = CryptoJS.MD5(formData.password).toString()
                    } else {
                        formData.password = null
                    }
                    res = await this.$service.updateAdmin(formData);
                }
                this.dialogSubmitLoading = false;
                if (res.code === 20000) {
                    this.hideDialog();
                    this.searchCommon();
                } else {
                    this.error = res.message || true;
                }
            },
            //是否启用
            async changeEnable(row) {
                const res = await this.$service.changeAdminStatus({
                    id: row.id
                });
                if (res.code === 20000) {
                    this.$notify({
                        title: '提示',
                        type: 'success',
                        message: '操作成功',
                    })
                } else {
                    this.tableList = this.tableList.map(item => {
                        if (item.id === row.id) {
                            return Object.assign({}, item, {
                                forbidden: !row.forbidden
                            })
                        }
                        return item
                    });
                    this.$notify.error({
                        title: '提示',
                        message: res.message ? res.message : '操作失败',
                    })
                }
            },
            //删除
            deleteAdmin(row) {
                this.$confirm('您选择了1条数据，是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    lockScroll: false
                }).then(async () => {
                    const res = await this.$service.deleteAdmin({
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
            async getDeptList() {
                const res = await this.$service.getDepartmentList({pageNum: 1, pageSize: 10000});
                if (res.code === 20000) {
                    this.deptList = res.data.result || [];
                }
            },
            async getPostList() {
                const res = await this.$service.getPositionList({});
                if (res.code === 20000) {
                    this.postList = res.data || [];
                }
            },
            async getRoleList() {
                const res = await this.$service.getRoleList({pageNum: 1, pageSize: 10000});
                if (res.code === 20000) {
                    this.roleList = res.data.result || [];
                }
            },
        },
        created() {
            if (this.$route.params.deptId) {
                this.formSearch.deptId = this.$route.params.deptId;
            } else if (this.$route.params.roleId) {
                this.formSearch.roleId = this.$route.params.roleId;
            }
            this.getDeptList();
            this.getPostList();
            this.getRoleList();
            this.searchCommon()
        },
        mounted() {
        },
        watch: {},
        components: {
            AdminDialog
        }
    }
</script>
