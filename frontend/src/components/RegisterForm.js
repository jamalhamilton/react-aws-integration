import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Divider } from 'rsuite';

import config from "../config/front_config";

export default class RegisterForm extends React.Component {

    constructor() {
        super();

        this.state = {
            userInfo: {
                candidate_name_first: '',
                candidate_name_last: '',
                candidate_email: '',

                date_of_interview: '',
                social_link: '',

                interviewer_name_first: '',
                interviewer_name_last: '',
                interviewer_email: '',
            },

            isUploading: false,
        };

        this.registerUserData = this.registerUserData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        console.log(config.api.getUsers);
    }

    registerUserData(e) {
        e.preventDefault();
        var { userInfo, isUploading } = this.state;

        console.log('------ userInfo: ', userInfo);

        if (isUploading) return;
        this.setState({ isUploading: true });
        fetch(config.api.registerUser, {
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify(userInfo)
        }).then(res => res.json()).then(data => {
            if (data.status) {
                fetch(config.api.sendMail, {
                    headers: { 'Content-Type': 'application/json' },
                    method: "POST",
                    body: JSON.stringify({
                        token: data.token
                    }),
                }).then(() => {
                    this.setState({ isUploading: false });
                    window.location.href="/success";

                });
            } else {
                this.setState({ isUploading: false });
            }
            console.log('data', data.data)
        });

    }

    handleChange(e) {
        var fname = e.target.name;
        var value = e.target.value;
        var { userInfo } = this.state;
        userInfo[fname] = value;

        this.state.userInfo = userInfo;
    }

    render() {

        return (
            <Container style={{ textAlign: "center" }}>
                <div>
                    <Row style={{ marginTop: 50 }}>
                        <Col>
                            <h1>
                                Step 1. Register New User
                                </h1>
                        </Col>
                    </Row>
                    <Divider />
                    <Form style={{ textAlign: "left" }}>
                        <Row style={{ marginTop: 30 }}>
                            <Form.Group as={Col}
                                onChange={this.handleChange}
                            >
                                <Form.Label>Candidate Name</Form.Label>
                                <Form.Control type="text" placeholder=""
                                    name="candidate_name_first" />
                                <Form.Text className="text-muted">First Name</Form.Text>
                            </Form.Group>
                            <Form.Group as={Col}
                                onChange={this.handleChange}
                            >
                                <Form.Label>&nbsp;</Form.Label>
                                <Form.Control type="text" placeholder=""
                                    name="candidate_name_last" />
                                <Form.Text className="text-muted">Last Name</Form.Text>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col}
                                onChange={this.handleChange}>
                                <Form.Label>Candidate Email</Form.Label>
                                <Form.Control type="email" placeholder=""
                                    name="candidate_email" />
                                <Form.Text className="text-muted">example@example.com</Form.Text>
                            </Form.Group>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Form.Group as={Col}
                                onChange={this.handleChange}>
                                <Form.Label>Date Of Interview</Form.Label>
                                <Form.Control type="date" placeholder=""
                                    dateformat="YYYY-MM-DD"
                                    name="date_of_interview"
                                />
                                <Form.Text className="text-muted">Date</Form.Text>
                            </Form.Group>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Form.Group as={Col}
                                onChange={this.handleChange}>
                                <Form.Label>Zoom, Skype, Bluejeans, Hirevue link</Form.Label>
                                <Form.Control type="text" placeholder=""
                                    name="social_link" />
                                <Form.Text className="text-muted">http://www.zoom.us/1234567890</Form.Text>
                            </Form.Group>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Form.Group as={Col}
                                onChange={this.handleChange}>
                                <Form.Label>Interviewer's Name</Form.Label>
                                <Form.Control type="text" placeholder=""
                                    name="interviewer_name_first" />
                                <Form.Text className="text-muted">First Name</Form.Text>
                            </Form.Group>
                            <Form.Group as={Col}
                                onChange={this.handleChange}>
                                <Form.Label>&nbsp;</Form.Label>
                                <Form.Control type="text" placeholder=""
                                    name="interviewer_name_last" />
                                <Form.Text className="text-muted">Last Name</Form.Text>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col}
                                onChange={this.handleChange}>
                                <Form.Label>Interviewer's Email</Form.Label>
                                <Form.Control type="email" placeholder=""
                                    name="interviewer_email" />
                                <Form.Text className="text-muted">example@example.com</Form.Text>
                            </Form.Group>
                            <Col></Col>
                        </Row>
                        <Divider />
                        <Row style={{ marginTop: 30, marginBottom: 30, textAlign: 'center' }}>
                            <Col>
                                <Button variant="primary" type="submit"
                                    onClick={this.registerUserData}
                                >{this.state.isUploading?'Uploading...':'Submit'}</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Container>
        );
    }
}
