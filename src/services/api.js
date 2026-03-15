import http from './http'

const unwrap = (res) => res?.data

export const loginApi = (payload) => http.post('/api/v1/auth/login', payload).then(unwrap)
export const logoutApi = () => http.post('/api/v1/auth/logout').then(unwrap)

export const registerStudentApi = (payload) => http.post('/api/v1/accounts/register/student', payload).then(unwrap)
export const getMeApi = () => http.get('/api/v1/accounts/me').then(unwrap)
export const updateMeApi = (payload) => http.put('/api/v1/accounts/me', payload).then(unwrap)
export const changePasswordApi = (payload) => http.put('/api/v1/accounts/me/change-password', payload).then(unwrap)
export const deleteMeApi = () => http.delete('/api/v1/accounts/me').then(unwrap)

export const getAllAccountsApi = () => http.get('/api/v1/accounts').then(unwrap)
export const getStudentsApi = (search) => http.get('/api/v1/accounts/students', { params: search ? { search } : {} }).then(unwrap)
export const getLecturersApi = (search) => http.get('/api/v1/accounts/lecturers', { params: search ? { search } : {} }).then(unwrap)
export const getLinkedStudentsApi = () => http.get('/api/v1/accounts/students/linked').then(unwrap)
export const createLecturerApi = (payload) => http.post('/api/v1/accounts/lecturers', payload).then(unwrap)
export const updateAccountApi = (accountId, payload) => http.put(`/api/v1/accounts/${accountId}`, payload).then(unwrap)
export const deleteAccountApi = (accountId) => http.delete(`/api/v1/accounts/${accountId}`).then(unwrap)

export const createProjectGroupApi = (payload) => http.post('/api/v1/project-groups', payload).then(unwrap)
export const addGroupMemberApi = (groupId, payload) => http.post(`/api/v1/project-groups/${groupId}/members`, payload).then(unwrap)
export const removeGroupMemberApi = (groupId, accountId) => http.delete(`/api/v1/project-groups/${groupId}/members/${accountId}`).then(unwrap)

export const getGithubAuthorizeUrlApi = () => http.get('/api/github/authorize-url').then(unwrap)
export const getGithubMeApi = () => http.get('/api/github/me').then(unwrap)
export const unlinkGithubApi = () => http.delete('/api/github/unlink').then(unwrap)

export const getJiraAuthorizeUrlApi = () => http.get('/api/v1/jira/oauth/authorize').then(unwrap)
export const getJiraLinkApi = () => http.get('/api/v1/jira/link').then(unwrap)
export const unlinkJiraApi = () => http.delete('/api/v1/jira/link').then(unwrap)