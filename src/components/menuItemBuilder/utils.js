import _ from 'lodash'

/*
 *
 * @param menuItem {Object} 需要判断的菜单对象
 * @param authoriseFn {Function} 判断函数
 * @returns {FlatArray<[], number>[]|{path}|*}
 */
export function authoriseMenu(menuItem, authoriseFn) {
  const path = !!menuItem.path ? menuItem.path.split('/').join('') : ''

  if (_.isEmpty(menuItem.subs)) {
    if (authoriseFn(path)) return menuItem
  } else {
    let subs = []
    for (let i = 0; i < menuItem.subs.length; i++) {
      subs.push(authoriseMenu(menuItem.subs[i], authoriseFn))
    }

    subs = subs.flat(1).filter(Boolean)
    // 当 menuItem.path 为 / 时，不生成菜单
    if (path === '') return subs

    // 过滤为空的结果
    if (!_.isEmpty(subs)) {
      // 复制上级菜单
      let parentItem = _.cloneDeep(menuItem)
      // symbol 类型无法深拷贝，所以引用过来
      parentItem.icon = menuItem.icon
      parentItem.subs = subs
      return parentItem
    }
  }
}
