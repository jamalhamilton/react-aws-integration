import React, { useState } from "react";
import { withRouter } from "react-router";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import config from "../config/front_config";

const LoginPage = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState();
    const [displayMessage, setDisplayMessage] = useState();

    const history = useHistory();

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const validatePassword = (password) => {
        if (password) {
            return true;
        }
        return false;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateEmail(email)) {
            if (validatePassword(password)) {
                loginUser();
            } else {
                showErrorMessage('error', "Issue on password text");
            }
        } else {
            showErrorMessage('error', "Invalid email");
        }
    }

    const loginUser = () => {
        setIsLoading(true);
        fetch(config.api.adminLogin, {
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify({
                userName: email,
                password: password
            })
        }).then(res => res.json()).then(data => {
            setIsLoading(false);
            if (data['success'] && data['token']) {
                localStorage.setItem("authToken", data['token']);
                history.push('/admin');
            } else {
                showErrorMessage('error', ((data && data['message'] && data['message']['message']) ? data['message']['message'] : 'Issue on login!'));
            }
        })
            .catch(err => {
                setIsLoading(false);
                showErrorMessage('error', 'Issue on login!');
            })

    }

    const showErrorMessage = (type, message) => {
        setDisplayMessage({
            type,
            message
        });
        setTimeout(() => {
            setDisplayMessage();
        }, 3000);
    }



    const showMessage = () => {
        if (displayMessage && displayMessage.type && displayMessage.message) {
            if (displayMessage.type === 'success') {
                return (
                    <div class="submitMsg"><img src="images/checked_ic.svg" />{displayMessage.message}</div>
                );
            } else {
                return (
                    <div class="errorMsg"><i class="fas fa-times-circle errorMsgIcon"></i>{displayMessage.message}</div>
                );
            }
        }
    }

    return (
        <div class="innerPage ptb_100">
            {isLoading ? <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: 'rgba(16, 16, 16, 0.5)',
                    zIndex: 999
                }}>
                <Spinner style={{ textAlign: 'center', marginTop: '30%' }} animation="border" />
            </div> : null}
            <section>
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="whiteWrap" style={{ width: '45%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} class="text-center">
                                    <img style={{ height: 50 }} src="images/weblogo.png" />
                                    <a style={{ fontSize: 50, marginLeft: 10 }} href="/">interverify</a>
\                                </div>
                                <div class="col-12 text-center mt-1">
                                    <p class="not__">Administrator Login</p>
                                </div>
                                <div class="row form___Row pt-5">
                                    <div class="col-12">
                                        <div class="form-group">
                                            <label class="label__">Email address <span class="req__">*</span></label>
                                            <input onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Enter Email address" class="input__" />
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="form-group">
                                            <label class="label__">Password <span class="req__">*</span></label>
                                            <input onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Enter Password" class="input__" />
                                        </div>
                                    </div>
                                    <div class="col-md-12 col-12">
                                        <div class="form-group text-center pt-2">
                                            <a onClick={handleSubmit} class="btn_1">Login</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showMessage()}
        </div>
    );
}

export default withRouter(LoginPage);