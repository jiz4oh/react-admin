import React from "react";
import { Button } from "antd";

const HasManyRender = (onClick) =>
  (_rawText, _record) =>
    <Button
      key='showBtn'
      type={'text'}
      onClick={onClick}
      size='small'
      className={'C-option'}
    >
      显示更多
    </Button>

export default HasManyRender
