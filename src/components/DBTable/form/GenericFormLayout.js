import React from "react";
import { Row, Space, Spin } from "antd";
import _ from "lodash";

export default function GenericFormLayout({
                                     spinning,
                                     delay,
                                     children,
                                     footer,
                                   }) {
  return (
    <Spin spinning={spinning} delay={delay || 100}>
      {children}
      {
        !_.isEmpty(footer) && (
          <Row
            align='middle'
            justify='center'
          >
            <Space>
              {
                footer.map(
                  (Action, index) => <Action key={Action.name || index}/>
                )
              }
            </Space>
          </Row>
        )
      }
    </Spin>
  )
}
