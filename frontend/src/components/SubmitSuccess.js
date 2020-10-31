import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter } from "react-router"

// import config from "../config/config"

class SubmitSuccess extends React.Component {

    constructor(props) {
        super();

        this.state = {

        };
    }
    goBack(){
        window.location.href = '/submit';
    }
    render() {

        return (
            <Router>
                <Container style={{ textAlign: "center" }}>
                    <div>
                        <Row style={{ marginTop: 150 }}>
                            <Col>
                                <h2>That info has been received and email has been sent to candidate. You can invite another candidate.</h2>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 15 }}>
                            <Col>
                                <Button variant="primary"
                                    onClick={this.goBack}
                                >Go Back</Button>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </Router>
        );
    }
}

export default withRouter(SubmitSuccess);