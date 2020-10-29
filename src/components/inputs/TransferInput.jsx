import React, {useCallback, useState} from "react";
import {Transfer, Button} from "antd";

import {collectionWrapper} from "./utils";

const renderItem = item => item.name

const TransferInput = (props) => {
  const {
    name,
    inputOptions = {},
    value,
    onChange,
    collection,
    ...restProps
  } = props

  const [targetKeys, select] = useState([])

  const handleChange = useCallback((targetKeys, direction, moveKeys) => {
    select(targetKeys)
    onChange && onChange(targetKeys)
  }, [onChange])

  const reload = useCallback(() => handleChange([]), [handleChange])

  const renderFooter = () => (
    <Button
      size="small"
      style={{float: 'right', margin: 5}}
      onClick={reload}
    >
      重置
    </Button>
  );

  return (
    <Transfer
      key={`${name}-input`}
      dataSource={collection}
      showSearch
      listStyle={{
        width: 350,
        height: 400,
      }}
      targetKeys={value || targetKeys}
      render={renderItem}
      footer={renderFooter}
      value={value}
      onChange={handleChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default collectionWrapper(TransferInput)