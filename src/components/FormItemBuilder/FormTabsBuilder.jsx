import React, { useCallback, useState } from "react";
import { Form, Tabs } from "antd";

import dispatcher from "@/components/FormItemBuilder/dispatcher";

/**
 * 根据配置 schema 生成 tabs 类型的 form 表单
 * @param name {string} 当前 array 字段名
 * @param configs {Object[]} 字段配置
 * @param meta {Object} form 的整体配置
 * @returns {JSX.Element}
 * @constructor
 */
function FormTabsBuilder({ name, configs = [], meta }) {
  const [activeKey, setActiveKey] = useState()

  const onEdit = useCallback((fields, { add, remove }) =>
    (targetKey, action) => {
      switch (action) {
      case 'add':
        return add()
      case 'remove':
        let newActiveKey = activeKey > 0 ? activeKey - 1 : 0;

        setActiveKey(String(newActiveKey))
        return remove(Number(targetKey))
      default:
        console.log(`未知动作：${action}`)
      }
    }, [activeKey])

  return (
    <Form.List name={name}>
      {(fields, operation) =>
        <Tabs
          type="editable-card"
          onChange={setActiveKey}
          activeKey={activeKey}
          onEdit={onEdit(fields, operation)}
        >
          {fields.map(field =>
            <Tabs.TabPane
              tab={field.name}
              // antd remove 比对的是 index，所以这里需要使用 name 而不是 key
              key={field.name}
            >
              {configs.map(config => {
                return dispatcher({
                  ...field,
                  ...config,
                  name: [field.name, config.name],
                  fieldKey: [field.fieldKey, config.name]
                }, meta)
              })}
            </Tabs.TabPane>
          )}
        </Tabs>
      }
    </Form.List>
  );
}

export default FormTabsBuilder
