import _ from "lodash";
import React from "react";
import Logger from "@/utils/Logger";

const logger = Logger.getLogger('Form')

export default ({
                  name,
                  type,
                  as,
                  key,
                  label,
                  ...restProps
                }, { onTypecast }) => {
  // 根据指定的 显示类型 选择 input 类型
  const InputComponent = onTypecast(name, type, as)
  if (!_.isFunction(InputComponent)) {
    // 未实现的组件不转换
    logger.warn(`${InputComponent} 不是有效的 InputComponent，请检查配置`)
    return
  }

  return (
    <InputComponent
      key={`form-item-${name}i${key}`}
      name={name}
      label={label}
      {...restProps}
    />
  )
}
