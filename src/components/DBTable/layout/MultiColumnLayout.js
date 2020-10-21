import React from "react";
import { Col, Row } from "antd";

export default function ({children, extend}) {
  return (
    <>
      <Row gutter={8}>
        <Col span={12}>
          {children}
        </Col>
        <Col span={12}>
          {extend}
        </Col>
      </Row>
    </>
  )
}
