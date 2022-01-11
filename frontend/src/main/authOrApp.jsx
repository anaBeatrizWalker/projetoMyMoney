//Decide de mostra o auth ou App

import '../common/template/dependencies' //encapsula tanto app quanto auth
import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import App from './app'
import Auth from '../auth/auth'
import { validateToken } from '../auth/authActions'

class AuthOrApp extends Component {
    componentWillMount() {
        //se usuário setado
        if(this.props.auth.user) {
            //valida token
            this.props.validateToken(this.props.auth.user.token)
        }
    }
    
    render() {
        const { user, validToken } = this.props.auth

        //se usuário existe e token está validado, retorna App
        if(user && validToken) {
            //manda para todas as req feitas pelo axios o header com o token
            axios.defaults.headers.common['authorization'] = user.token
            return <App>{this.props.children}</App>
    
        //se o usuário não existe e o token está inválido, reotrna Auth
        } else if(!user && !validToken) {
            return <Auth />
        
        //se tiver usuário com token inválida espera o processo de validação do token
        } else {
            return false
        }
    }
}
const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({ validateToken }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(AuthOrApp)