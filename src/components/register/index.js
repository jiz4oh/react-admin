import React from "react";
import {Button, Form, Input} from "antd";

class RegisterForm extends React.Component {
  formRef = React.createRef();
  
  state = {
    focusItem: -1
  }

  registerSubmit = (e) => {
    e.preventDefault()
    this.setState({
      focusItem: -1
    })
  }

  handleChangeLogin = () => {
    this.props.setShowBox('login')
    setTimeout(() => this.formRef.current.resetFields(), 500)
  }

  render() {
    const {focusItem} = this.state
    return (
      <div className={this.props.className}>
        <div className='P-owl'>
          <div
            className={`P-hand-left P-hand ${focusItem === 1 ? 'P-focus-hand-left' : null}`}
          />
          <div
            className={`P-hand-right P-hand ${focusItem === 1 ? 'P-focus-hand-right' : null}`}
          />
          <div className='P-arms-box'>
            <div
              className={`P-arms-left P-arms ${focusItem === 1 ? 'P-focus-arms-left' : null}`}
            />
            <div
              className={`P-arms-right P-arms ${focusItem === 1 ? 'P-focus-arms-right' : null}`}
            />
          </div>
        </div>
        <Form onSubmit={this.registerSubmit} ref={this.formRef}>
          <Form.Item>
            <Input
              placeholder='用户名'
              addonBefore={<span
                className={`iconfont icon-User ${focusItem === 0 ? 'P-focus' : null}`}
              />}
              onFocus={() => this.setState({focusItem: 0})}
              onBlur={() => this.setState({focusItem: -1})}
              size='large'/>
          </Form.Item>
          <Form.Item>
            <Input
              placeholder='密码'
              addonBefore={<span
                className={`iconfont icon-suo1 ${focusItem === 1 ? 'P-focus' : null}`}
              />}
              type='password'
              onFocus={() => this.setState({focusItem: 1})}
              onBlur={() => this.setState({focusItem: -1})}
              size='large'/>
          </Form.Item>
          <Form.Item>
            <Input
              placeholder='确认密码'
              addonBefore={<span
                className={`iconfont icon-suo1 ${focusItem === 1 ? 'P-focus' : null}`}
              />}
              type='password'
              onFocus={() => this.setState({focusItem: 2})}
              onBlur={() => this.setState({focusItem: -1})}
              size='large'/>
          </Form.Item>
          <div className='bottom'>
              <span className='P-back-btn'
                    onClick={this.handleChangeLogin}>返回登录</span>&emsp;
            <Button type='primary' htmlType="submit">注册</Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default RegisterForm