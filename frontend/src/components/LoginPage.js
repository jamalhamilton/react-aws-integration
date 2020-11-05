import React, { useState } from "react";
import { withRouter } from "react-router";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import config from "../config/front_config";

const LoginPage = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [isLoading, setIsLoading] = useState();
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
                setErrorMsg(null);
                loginUser();
            } else {
                setErrorMsg("Issue on password");
            }
        } else {
            setErrorMsg("Invalid email");
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
                setErrorMsg(data['message'] ? data['message'] : 'Issue on login');
            }
        })
            .catch(err => {
                setIsLoading(false);
                setErrorMsg("Issue on login! ", err);
            })

    }

    return (
        <Router>
            <Container style={{ textAlign: "center", backgroundColor: '#ced1c9', padding: 30, borderRadius: 10 }}>
                <Row className="justify-content-md-center" style={{ marginTop: 50 }}>
                    <Col xs lg="6">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" onChange={(event) => setEmail(event.target.value)} placeholder="Enter email" />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.</Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                            </Form.Group>
                            {isLoading ? <Button variant="primary" disabled>
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />Loading...</Button>
                                :
                                <Button type="submit" variant="primary">Submit</Button>}
                            {errorMsg ? <Alert style={{ marginTop: 20 }} variant="danger">{errorMsg}!</Alert> : null}
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Router>
    );
}

export default withRouter(LoginPage);