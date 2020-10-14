import React from 'react'

import './index.scss'
import LoginForm from "../../components/login";

class Login extends React.Component {
  state = {
    showBox: 'login'
  }

  toggleShowBox = (box) => {
    this.setState({
      showBox: box
    })
  }

  render() {
    return (
      <div id='P-login-page'>
        <div className='P-background-box'/>
        <div className='P-container'>
          <LoginForm
            className={`P-login-box-${this.state.showBox === 'login' ? 'active' : 'leave'}`}
            setShowBox={this.toggleShowBox}
          />
          {/*<RegisterForm className={this.state.showBox === 'register' ? 'P-login-box-active P-login-box' : 'P-login-box-leave P-login-box'}*/}
          {/*              setShowBox={this.toggleShowBox}/>*/}
        </div>
      </div>
    )
  }
}

export default Login