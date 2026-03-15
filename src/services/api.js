import http from './http'

const unwrap = (res) => res?.data

// auth
export const loginApi = (payload) => http.post('/api/v1/auth/login', payload).then(unwrap)
export const logoutApi = () => http.post('/api/v1/auth/logout').then(unwrap)

// account
export const registerStudentApi = (payload) => http.post('/api/v1/accounts/register/student', payload).then(unwrap)
export const getMeApi = () => http.get('/api/v1/accounts/me').then(unwrap)
export const updateMeApi = (payload) => http.put('/api/v1/accounts/me', payload).then(unwrap)
export const changePasswordApi = (payload) => http.put('/api/v1/accounts/me/change-password', payload).then(unwrap)
export const deleteMeApi = () => http.delete('/api/v1/accounts/me').then(unwrap)
export const getMyLinkStatusApi = () => http.get('/api/v1/accounts/me/link-status').then(unwrap)

// admin accounts
export const getAllAccountsApi = () => http.get('/api/v1/accounts').then(unwrap)
export const getAccountByIdApi = (accountId) => http.get(`/api/v1/accounts/${accountId}`).then(unwrap)
export const getStudentsApi = (search) => http.get('/api/v1/accounts/students', { params: search ? { search } : {} }).then(unwrap)
export const getLecturersApi = (search) => http.get('/api/v1/accounts/lecturers', { params: search ? { search } : {} }).then(unwrap)
export const getLinkedStudentsApi = () => http.get('/api/v1/accounts/students/linked').then(unwrap)
export const createLecturerApi = (payload) => http.post('/api/v1/accounts/lecturers', payload).then(unwrap)
export const updateAccountApi = (accountId, payload) => http.put(`/api/v1/accounts/${accountId}`, payload).then(unwrap)
export const deleteAccountApi = (accountId) => http.delete(`/api/v1/accounts/${accountId}`).then(unwrap)

// projects
export const createProjectApi = (payload) => http.post('/api/v1/projects', payload).then(unwrap)
export const getAllProjectsApi = () => http.get('/api/v1/projects').then(unwrap)
export const getProjectByIdApi = (projectId) => http.get(`/api/v1/projects/${projectId}`).then(unwrap)
export const updateProjectApi = (projectId, payload) => http.put(`/api/v1/projects/${projectId}`, payload).then(unwrap)
export const deleteProjectApi = (projectId) => http.delete(`/api/v1/projects/${projectId}`).then(unwrap)
export const updateProjectStatusApi = (projectId, status) => http.put(`/api/v1/projects/${projectId}/status`, null, { params: { status } }).then(unwrap)
export const getMyProjectsApi = () => http.get('/api/v1/projects/my-projects').then(unwrap)
export const getMyGroupsApi = () => http.get('/api/v1/projects/my-groups').then(unwrap)

// project members
export const addProjectMemberApi = (projectId, payload) => http.post(`/api/v1/projects/${projectId}/members`, payload).then(unwrap)
export const removeProjectMemberApi = (projectId, accountId) => http.delete(`/api/v1/projects/${projectId}/members/${accountId}`).then(unwrap)
export const getProjectMembersApi = (projectId) => http.get(`/api/v1/projects/${projectId}/members`).then(unwrap)

// tasks
export const createTaskApi = (projectId, payload) => http.post(`/api/v1/projects/${projectId}/tasks`, payload).then(unwrap)
export const updateTaskApi = (taskId, payload) => http.put(`/api/v1/tasks/${taskId}`, payload).then(unwrap)
export const deleteTaskApi = (taskId) => http.delete(`/api/v1/tasks/${taskId}`).then(unwrap)
export const getTaskByIdApi = (taskId) => http.get(`/api/v1/tasks/${taskId}`).then(unwrap)
export const getTasksByProjectApi = (projectId) => http.get(`/api/v1/projects/${projectId}/tasks`).then(unwrap)
export const getRequirementsByProjectApi = (projectId) => http.get(`/api/v1/projects/${projectId}/requirements`).then(unwrap)
export const getTasksOnlyByProjectApi = (projectId) => http.get(`/api/v1/projects/${projectId}/tasks/list`).then(unwrap)
export const getTasksByProjectAndStatusApi = (projectId, status) => http.get(`/api/v1/projects/${projectId}/tasks/status/${status}`).then(unwrap)
export const getMyTasksApi = () => http.get('/api/v1/users/me/tasks').then(unwrap)
export const getUserTasksApi = (userId) => http.get(`/api/v1/users/${userId}/tasks`).then(unwrap)
export const getTasksByProjectAndUserApi = (projectId, userId) => http.get(`/api/v1/projects/${projectId}/members/${userId}/tasks`).then(unwrap)
export const assignTaskApi = (taskId, userId) => http.put(`/api/v1/tasks/${taskId}/assign/${userId}`).then(unwrap)
export const updateTaskStatusApi = (taskId, status) => http.put(`/api/v1/tasks/${taskId}/status`, null, { params: { status } }).then(unwrap)
export const getProjectProgressApi = (projectId) => http.get(`/api/v1/projects/${projectId}/progress`).then(unwrap)
export const getMyTaskStatsApi = () => http.get('/api/v1/users/me/stats/tasks').then(unwrap)

// github
export const getGithubAuthorizeUrlApi = () => http.get('/api/github/authorize-url').then(unwrap)
export const handleGithubCallbackApi = (code) => http.get('/api/github/callback', { params: { code } }).then(unwrap)
export const getGithubMeApi = () => http.get('/api/github/me').then(unwrap)
export const unlinkGithubApi = () => http.delete('/api/github/unlink').then(unwrap)
export const getMyCommitStatsApi = (repoName, githubUsername) => http.get('/api/v1/users/me/github/commits', { params: { repoName, githubUsername } }).then(unwrap)
export const getTeamCommitSummaryApi = (projectId, repoName) => http.get(`/api/v1/projects/${projectId}/github/commits/team`, { params: { repoName } }).then(unwrap)
export const getProjectUserCommitStatsApi = (projectId, username, repoName) => http.get(`/api/v1/projects/${projectId}/github/commits/user/${username}`, { params: { repoName } }).then(unwrap)
export const getAllTeamCommitsApi = (projectId, repoName) => http.get(`/api/v1/projects/${projectId}/github/commits/all`, { params: { repoName } }).then(unwrap)

// jira
export const getJiraAuthorizeUrlApi = () => http.get('/api/v1/jira/oauth/authorize').then(unwrap)
export const getJiraLinkApi = () => http.get('/api/v1/jira/link').then(unwrap)
export const unlinkJiraApi = () => http.delete('/api/v1/jira/link').then(unwrap)
export const getProjectIssuesApi = (projectKey) => http.get(`/api/v1/projects/${projectKey}/jira/issues`).then(unwrap)
export const getIssueApi = (projectKey, issueKey) => http.get(`/api/v1/projects/${projectKey}/jira/issues/${issueKey}`).then(unwrap)
export const createIssueApi = (projectKey, payload) => http.post(`/api/v1/projects/${projectKey}/jira/issues`, null, { params: payload }).then(unwrap)
export const updateIssueStatusApi = (issueKey, status) => http.put(`/api/v1/jira/issues/${issueKey}/status`, null, { params: { status } }).then(unwrap)
export const deleteIssueApi = (projectKey, issueKey) => http.delete(`/api/v1/projects/${projectKey}/jira/issues/${issueKey}`).then(unwrap)
