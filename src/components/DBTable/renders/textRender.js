const textRender = fieldMap =>
  (rawText, record) => {
    // 默认为 0
    let num = rawText || 0
    // 这里的 num 应为 number
    if (num === true) {
      // 对于 true 值做处理, false 值已经为 0
      num = Number(num)
    }
    // fieldMap 可能有两种形式
    // [男，女]
    // {1: 男}, {2: 女}
    return fieldMap[num] || rawText
  }

export default textRender
