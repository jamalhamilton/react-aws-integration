import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter } from "react-router"

// import config from "../config/config"

class LandingPage extends React.Component {

    constructor(props) {
        super();

        this.state = {

        };
    }

    render() {

        return (
            <Router>
               <img className="landing-img" src="/comingsoon.png"/>
            </Router>
        );
    }
}

export default withRouter(LandingPage);