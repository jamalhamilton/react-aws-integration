import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useParams, useHistory } from "react-router-dom";
import { Container, Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import config from "../config/front_config";

const UpdateUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState();
    const [userWithoutEdit, setUserWithoutEdit] = useState();
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();
    const history = useHistory();

    useEffect(() => {
        getUser();
    }, []);

    const validateEmail = (email) => {
        if (!email) { return false; }
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleChange = (value, key) => {
        const currentVal = user;
        currentVal[key] = value;
        setUser(currentVal);
    }

    const getUser = () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoading(true);
            fetch(config.api.getUser, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                method: "POST",
                body: JSON.stringify({
                    token: id
                })
            }).then(res => res.json()).then(data => {
                setIsLoading(false);
                if (data && data['data'] && data['data']['token']) {
                    setUser(data['data']);
                    setUserWithoutEdit(data['data']);
                } else {
                    setError("Issue on loding user or no user found!");
                }
            }).catch(err => {
                setIsLoading(false);
                setError("Issue on loding user! ", err);
            })
        }
        else {
            history.push('/login');
        }
    }

    const update = () => {
        if (validateEmail(user['candidate_email'])) {
            const token = localStorage.getItem("authToken");
            if (token) {
                setIsLoading(true);
                fetch(config.api.adminUpdate, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    method: "POST",
                    body: JSON.stringify({
                        ...user
                    })
                }).then(res => res.json()).then(data => {
                    setIsLoading(false);
                    if (data['status']) {
                        alert("Updated.");
                        history.push('/admin');
                    } else {
                        alert(data['message'] ? data['message'] : 'Issue on updating user');
                    }
                })
                    .catch(err => {
                        setIsLoading(false);
                        setError("Issue on deleting! ", err);
                    })
            } else {
                history.push('/login');
            }
        } else {
            alert("Candidate Email should be valid");
        }
    }


    return (
        <Router>
            <p onClick={() => history.push('/admin')} style={{
                margin: 10,
                textDecorationLine: 'underline',
                cursor: 'pointer'
            }}>Back to users list</p>
            <Container style={{ textAlign: "center", backgroundColor: '#ced1c9', padding: 30, borderRadius: 10 }}>
                <h1>update user</h1>
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
                </div> : (user && user.token) ?
                        <Row className="justify-content-md-center" style={{ marginTop: 50 }}>
                            <Col xs lg="6">
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Candidate First Name</Form.Label>
                                        <Form.Control defaultValue={user['candidate_name_first']} onChange={(event) => handleChange(event.target.value, 'candidate_name_first')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Candidate Last Name</Form.Label>
                                        <Form.Control defaultValue={user['candidate_name_last']} onChange={(event) => handleChange(event.target.value, 'candidate_name_last')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Candidate Email</Form.Label>
                                        <Form.Control defaultValue={user['candidate_email']} onChange={(event) => handleChange(event.target.value, 'candidate_email')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Interviewer First Name</Form.Label>
                                        <Form.Control defaultValue={user['interviewer_name_first']} onChange={(event) => handleChange(event.target.value, 'interviewer_name_first')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Interviewer Last Name</Form.Label>
                                        <Form.Control defaultValue={user['interviewer_name_last']} onChange={(event) => handleChange(event.target.value, 'interviewer_name_last')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Interviewer Email</Form.Label>
                                        <Form.Control defaultValue={user['interviewer_email']} onChange={(event) => handleChange(event.target.value, 'interviewer_email')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Social Link</Form.Label>
                                        <Form.Control defaultValue={user['social_link']} onChange={(event) => handleChange(event.target.value, 'social_link')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Similarity</Form.Label>
                                        <Form.Control defaultValue={user['similarity']} onChange={(event) => handleChange(event.target.value, 'similarity')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Verify Result</Form.Label>
                                        <Form.Control defaultValue={user['verify_result']} onChange={(event) => handleChange(event.target.value, 'verify_result')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Date Of Interview</Form.Label>
                                        <Form.Control type="datetime-local" defaultValue={user['date_of_interview']} onChange={(event) => handleChange(event.target.value, 'date_of_interview')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Verify Photo</Form.Label>
                                        <Form.Control defaultValue={user['verify_photo']} onChange={(event) => handleChange(event.target.value, 'verify_photo')} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Verify IDcard</Form.Label>
                                        <Form.Control defaultValue={user['verify_idcard']} onChange={(event) => handleChange(event.target.value, 'verify_idcard')} />
                                    </Form.Group>
                                </Form>
                                <Button style={{ margin: 10 }} onClick={() => update()} variant="primary">Update</Button>
                            </Col>
                        </Row>
                        : null}
                {error ? <Alert style={{ marginTop: 20 }} variant="danger">{error}!</Alert> : null}
            </Container>
        </Router>
    );
}

export default UpdateUser;