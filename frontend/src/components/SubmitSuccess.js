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
    goBack() {
        window.location.href = '/register';
    }
    render() {

        return (
            <div class="innerPage ptb_100">
                <section>
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} class="text-center">
                                    <img style={{ height: 50 }} src="images/weblogo.png" />
                                    <a style={{ fontSize: 50, marginLeft: 10 }} href="/">interverify</a>
\                                </div>
                                <div class="whiteWrap">
                                    <p className="not__">That info has been received and email has been sent to candidate. You can invite another candidate.</p>
                                    <div class="text-center pt-2">
                                        <a onClick={this.goBack} class="btn_1">Go Back</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        );
    }
}

export default withRouter(SubmitSuccess);