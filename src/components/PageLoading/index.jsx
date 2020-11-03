import React from "react";
import { Spin } from "antd";

export default () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      margin: 'auto',
      paddingTop: 50,
      textAlign: 'center',
    }}
  >
    <Spin size="large"/>
  </div>
)
