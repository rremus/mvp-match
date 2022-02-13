class ApiEndpoints {
    basePath = 'http://178.63.13.157:8090/mock-api/api'

    getUsers = `${this.basePath}/users`
    getProjects = `${this.basePath}/projects`
    getGateways = `${this.basePath}/gateways`
    postReport = `${this.basePath}/report`
}

export default ApiEndpoints;
