import { asyncRequest } from "../utils/request";

export default class Session {
  logout(options) {
    return asyncRequest({
                          url: '/logout',
                          method: 'delete',
                          ...options
                        })
  }

  login(options) {
    return asyncRequest({
                          url: '/login',
                          method: 'post',
                          ...options
                        })
  }
}
