import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter } from "react-router"

// import config from "../config/config"

class SubmitIDSuccess extends React.Component {

    constructor(props) {
        super();

        this.state = {

        };
    }
    render() {

        return (
            <Router>
                <Container style={{ textAlign: "center" }}>
                    <div>
                        <Row style={{ marginTop: 150 }}>
                            <Col>
                                <h2>You uploaded your ID photo successfully!</h2>
                            </Col>
                        </Row>
                        
                    </div>
                </Container>
            </Router>
        );
    }
}

export default withRouter(SubmitIDSuccess);