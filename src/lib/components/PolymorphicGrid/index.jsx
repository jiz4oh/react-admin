import React from "react";
import _ from "lodash";
import { Col, Row } from "antd";

const BASE_ROW_LENGTH = 24

/**
 * 将布局下的所有组件按照 columns 均分布置
 * @param children {[]|{}}
 * @param columns {Number} 将一行分成几列，默认 1
 * @param gutter {Number|Array} 每列中的间隔大小，默认恒纵向都为 8
 * @returns {JSX.Element|[]}
 * @constructor
 */
export default function PolymorphicGrid({
                                            children,
                                            columns = 1,
                                            gutter = [8, 8]
                                          }) {
  children = React.Children.toArray(children)
  if (columns === 1) return children
  const rows = [];
  const colspan = BASE_ROW_LENGTH / columns

  for (let i = 0; i < children.length; i += columns) {
    const cols = []
    for (let j = 0; j < columns; j += 1) {
      let Component = children[i + j]
      !_.isEmpty(Component) && cols.push(
        <Col key={j} span={colspan.toString()}>
          {Component}
        </Col>
      );
    }

    rows.push(
      <Row key={i} gutter={gutter}>
        {cols}
      </Row>
    );
  }

  return rows
}
