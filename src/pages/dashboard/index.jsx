import React, {useReducer} from "react";
import {Row, Col, Statistic, Tabs} from 'antd'
import {
  MoneyCollectOutlined,
  RadarChartOutlined,
  LineChartOutlined
} from "@ant-design/icons";

import './index.scss'
import Logger from "../../utils/Logger";

const logger = Logger.getLogger('Dashboard')
const deadline = Date.now() + 1000 * (60 * 60 * 24 * 2 + 30); // Moment is also OK

const initialState = {
  ordersCount: 0,
  ordersAmount: 0,
  pv: 0,
  uv: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setup':
      return {
        ...action.payload,
        ordersCount: action.payload['orders_count'],
        ordersAmount: action.payload['orders_amount'],
      }
    default:
      return state
  }
};

function Dashboard() {
  logger.debug('切换到 Dashboard')
  const [state] = useReducer(reducer, initialState,)

  const iconStyle = {fontSize: 24}
  
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Tab 1" key="1">
        <Row gutter={[16, 24]}>
          <Col span={12} push={4}>
            <Statistic
              title="Order Count"
              value={state.ordersCount}
              prefix={<RadarChartOutlined style={iconStyle}/>}
            />
          </Col>
          <Col span={12} push={2}>
            <Statistic
              title="Order Amount (CNY)"
              value={state.ordersAmount}
              precision={2}
              prefix={<MoneyCollectOutlined style={iconStyle}/>}
            />
          </Col>
        </Row>
        <Row gutter={[16, 24]}>
          <Col span={12} push={4}>
            <Statistic
              title="PV"
              value={state.pv}
              prefix={<LineChartOutlined style={iconStyle}/>}
            />
          </Col>
          <Col span={12} push={2}>
            <Statistic
              title="UV"
              value={state.uv}
              prefix={<LineChartOutlined style={iconStyle}/>}
            />
          </Col>
        </Row>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tab 2" key="2">
        <Col span={24}>
          <Statistic.Countdown
            title="Day Level"
            value={deadline}
            format="D 天 H 时 m 分 s 秒"
          />
        </Col>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tab 3" key="3">
        <Col span={12}>
          <Statistic.Countdown
            title="Countdown"
            value={deadline}
          />
        </Col>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Tab 4" key="4">
        <Col span={12}>
          <Statistic.Countdown
            title="Million Seconds"
            value={deadline}
            format="HH:mm:ss:SSS"
          />
        </Col>
      </Tabs.TabPane>
    </Tabs>
  )
}

export default Dashboard
