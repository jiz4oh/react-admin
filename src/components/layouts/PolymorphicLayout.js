import React from "react";
import _ from "lodash";
import { Col, Row } from "antd";

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
  children = children.flat().filter(Boolean)
  if (columns === 1) return children
  const rows = [];
  const colspan = 24 / columns

  for (let i = 0; i < children.length; i += columns) {
    const cols = []
    for (let j = 0; j < columns; j += 1) {
      const Component = children[i + j]

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
