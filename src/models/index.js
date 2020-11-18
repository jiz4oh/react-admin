import {RestfulModelFactory} from '../components/List/RestfulModel'

export default {
    user: RestfulModelFactory('user', 'users'),
    adminUser: RestfulModelFactory('adminUser', 'admin_users'),
    role: RestfulModelFactory('role', 'roles'),
}
