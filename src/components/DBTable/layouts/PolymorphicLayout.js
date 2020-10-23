import React from "react";
import _ from "lodash";
import { Col, Row } from "antd";
import { InnerFormTable } from "../index";

/**
 * 
 * @param children
 * @param columns
 * @param gutter
 * @returns {JSX.Element|[]}
 * @constructor
 */
export default function PolymorphicLayout({
                                            children,
                                            columns = 1,
                                            gutter = 8
                                          }) {
  const tables = children.flat().filter(Boolean)
  if (columns === 1) return (
    <>
      {tables}
    </>
  );
  const rows = [];
  const colspan = 24 / columns

  for (let i = 0; i < tables.length; i += columns) {
    const cols = []
    for (let j = 0; j < columns; j += 1) {
      let Component = tables[i + j]
      // 第一个组件通常是组件形式
      Component = i + j > 0 || _.isFunction(Component)
        // hasMany 列表需为 InnerFormTable 组件
        ? <Component components={{list: InnerFormTable}}/>
        : Component
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
