import React from "react";
import { Button, Col, Form, Input, Row, message, Space } from "antd";
import { withRouter } from 'react-router-dom';

import "./LoginForm.scss"
import VerifyCodeFactory from "../../utils/verifyCode";
import Logger from "../../utils/Logger";
import globalConfig from '../../config'
import { setUserInfo } from "../../session";
import Session from "../../models/session";

const logger = Logger.getLogger('login')
const IS_DEBUG = globalConfig.debug
const session = new Session()

class Login extends React.Component {
  formRef = React.createRef();

  state = {
    focusItem: -1,
    requesting: false
  }

  componentDidMount() {
    this.verifyCode = this.props.verifyCode || new VerifyCodeFactory('verify-code') || '111111'
  }

  componentWillUnmount() {
    this.verifyCode = ''
  }

  handleBlur = () => this.setState({ focusItem: -1 })
  handleFocus = item => () => this.setState({ focusItem: item })

  handleLoginSubmit = () => {
    const fieldsValue = this.formRef.current.getFieldsValue()
    const verifyCode = fieldsValue.verifyCode
    const loading = () => message.loading('正在验证...', 0);

    // 在非 debug 模式开启验证码
    if (!IS_DEBUG) {
      if (!this.verifyCode.validate(verifyCode) || !verifyCode) {
        message.warn('验证码错误')
        return
      }
    }

    this.handleFocus(-1)()
    this.setState({ requesting: true })
    try {
      // 服务端验证
      loading();
      const data = {
        admin_user: {
          username: fieldsValue.userName,
          password: fieldsValue.password
        },
        code: verifyCode
      }
      logger.debug(data)

      const onSuccess = data => {
        setUserInfo(data.message)
        message.destroy()
        message.success("登录成功");
        let { from } = this.props.location.state || { from: { pathname: "/dashboard" } }
        this.props.history.replace(from)
      }
      const onFail = (data, status) => {
        message.destroy()
        if (String(status).startsWith('4')) {
          const msg = data.message || '验证失败，请重试'
          message.error(msg);
        } else {
          message.error(`服务器开小差了，请稍候重试: ${JSON.stringify(status)}`);
        }

        this.setState({ requesting: false });
        this.verifyCode.refresh()
      }

      session.login({
        data: data,
        showErrorMessage: false,
        onSuccess,
        onFail
      })
    } catch (exception) {
      logger.warn(exception)
      message.destroy()
      message.error(`网络请求出错: ${exception.message}`);
      this.setState({ requesting: false });
      this.verifyCode.refresh()
    }
  }

  handleChangeRegister = () => {
    this.props.setShowBox('register')
    setTimeout(() => this.formRef.current.resetFields(), 500)
  }

  render() {
    const { focusItem } = this.state;
    const isCover = focusItem === 1
    return (
      <div className={`P-login-container ${this.props.className}`}>
        <div className='P-owl'>
          <div className='P-hand-container'>
            <div
              className={`P-hand-left ${isCover ? 'P-hand-focus' : ''}`}
            />
            <div
              className={`P-hand-right ${isCover ? 'P-hand-focus' : ''}`}
            />
          </div>
          <div className='P-arms-container'>
            <div
              className={`P-arms-left ${isCover ? 'P-arms-focus' : ''}`}
            />
            <div
              className={`P-arms-right ${isCover ? 'P-arms-focus' : ''}`}
            />
          </div>
        </div>
        <Form
          onFinish={this.handleLoginSubmit}
          ref={this.formRef}
          labelCol={{
            xs: { span: 24 },
            sm: { span: 5 },
          }}
          // wrapperCol={{
          //   xs: {span: 24},
          //   sm: {span: 12},
          // }}
          scrollToFirstError
        >
          <Form.Item
            label="用户名"
            name="userName"
            labelAlign="right"
          >
            <Input
              // addonBefore={<span
              //   className={`iconfont icon-User ${focusItem === 0 ? 'P-focus' : ''}`}
              // />}
              onFocus={this.handleFocus(0)}
              onBlur={this.handleBlur}
              size='large'
            />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            labelAlign="right"
          >
            <Input
              // addonBefore={<span
              //   className={`iconfont icon-suo1 ${isCover ? 'P-focus' : ''}`}
              // />}
              type='password'
              onFocus={this.handleFocus(1)}
              onBlur={this.handleBlur}
              size='large'
            />
          </Form.Item>
          <Form.Item
            label="验证码"
            name="verifyCode"
          >
            <Row gutter={8}>
              <Col span={16}>
                <Input
                  // addonBefore={<span
                  //   className={`iconfont icon-securityCode-b ${focusItem === 2 ? 'P-focus' : ''}`}
                  // />}
                  onFocus={this.handleFocus(2)}
                  onBlur={this.handleBlur}
                  size='large'
                />
              </Col>
              <Col span={8}>
                <div id='verify-code' />
              </Col>
            </Row>
          </Form.Item>
          <Row justify={'end'} className='P-bottom'>
            <Space>
              <Button type='primary' htmlType="submit"
                disabled={this.state.requesting}>登录</Button>
              <Button onClick={this.handleChangeRegister}
                disabled={this.state.requesting}>注册</Button>
            </Space>
          </Row>
        </Form>
      </div>
    )
  }
}

export default withRouter(Login)
