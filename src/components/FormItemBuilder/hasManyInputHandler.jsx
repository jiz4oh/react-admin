import { Form } from "antd";
import React from "react";
import { FormTabsBuilder } from "@/components/FormItemBuilder/index";

const INPUT_CONFIG_MAP = process.env.REACT_APP_FORM_DATA_TYPE_KEY

export default ({
                  name,
                  label,
                  key,
                  [INPUT_CONFIG_MAP]: subFieldConfigs = [],
                  ...restProps
                }, meta) => {
  return (
    <Form.Item
      key={`form-item-${name}${key}`}
      label={label}
      {...restProps}
    >
      <FormTabsBuilder
        name={name}
        configs={subFieldConfigs}
        meta={meta}
      />
    </Form.Item>
  )
}
