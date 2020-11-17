import api from './api'

const baseUrl = 'http://localhost:9999';
const Service = {
    //登录
    adminLogin: data => api.axiosPost(baseUrl + '/api/system/admin/login', null, data),
    //用户管理
    getAdminList: data => api.axiosGet(baseUrl + '/api/system/admin/' + data.pageNum + '/' + data.pageSize, null, data),
    addAdmin: data => api.axiosPost(baseUrl + '/api/system/admin', data, null),
    updateAdmin: data => api.axiosPut(baseUrl + '/api/system/admin', data, null),
    changeAdminStatus: data => api.axiosPatch(baseUrl + '/api/system/admin/' + data.id + '/forbidden', null, null),
    deleteAdmin: data => api.axiosDelete(baseUrl + '/api/system/admin/' + data.id, null, null),
    //部门管理
    getDepartmentList: data => api.axiosGet(baseUrl + '/api/system/department/' + data.pageNum + '/' + data.pageSize, null, data),
    addDepartment: data => api.axiosPost(baseUrl + '/api/system/department', data, null),
    updateDepartment: data => api.axiosPut(baseUrl + '/api/system/department', data, null),
    deleteDepartment: data => api.axiosDelete(baseUrl + '/api/system/department/' + data.id, null, null),
    //菜单管理
    getMenuList: data => api.axiosGet(baseUrl + '/api/system/menu/' + data.pageNum + '/' + data.pageSize, null, data),
    getMenuWithPermissionByRoleId: data => api.axiosGet(baseUrl + '/api/system/menu/permission', null, data),
    addMenu: data => api.axiosPost(baseUrl + '/api/system/menu', data, null),
    updateMenu: data => api.axiosPut(baseUrl + '/api/system/menu', data, null),
    deleteMenu: data => api.axiosDelete(baseUrl + '/api/system/menu/' + data.id, null, null),
    getMenuTree: data => api.axiosGet(baseUrl + '/api/system/menu/tree', null, data),
    //权限管理
    getPermissionList: data => api.axiosGet(baseUrl + '/api/system/permission/' + data.pageNum + '/' + data.pageSize, null, data),
    addPermission: data => api.axiosPost(baseUrl + '/api/system/permission', data, null),
    updatePermission: data => api.axiosPut(baseUrl + '/api/system/permission', data, null),
    deletePermission: data => api.axiosDelete(baseUrl + '/api/system/permission/' + data.id, null, null),
    //角色管理
    getRoleList: data => api.axiosGet(baseUrl + '/api/system/role/' + data.pageNum + '/' + data.pageSize, null, data),
    addRole: data => api.axiosPost(baseUrl + '/api/system/role', data, null),
    updateRole: data => api.axiosPut(baseUrl + '/api/system/role', data, null),
    deleteRole: data => api.axiosDelete(baseUrl + '/api/system/role/' + data.id, null, null),

    getProjectList: data => api.axiosGet(baseUrl + '/api/system/project/' + data.pageNum + '/' + data.pageSize, null, data),
    addProject: data => api.axiosPost(baseUrl + '/api/system/project', data, null),
    deleteProject: data => api.axiosDelete(baseUrl + '/api/system/project/' + data.id, null, null),

    getTaskList: data => api.axiosGet(baseUrl + '/api/system/task/' + data.pageNum + '/' + data.pageSize, null, data),
    addTask: data => api.axiosPost(baseUrl + '/api/system/task', data, null),

};

export default Service
