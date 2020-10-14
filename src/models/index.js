import {RestfulModelFactory} from '../components/DBTable/RestfulModel'

export default {
    user: RestfulModelFactory('User', '/users'),
    adminUser: RestfulModelFactory('AdminUser', '/admin_users'),
    role: RestfulModelFactory('Role', '/roles'),
}
