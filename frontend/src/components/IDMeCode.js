import React from "react";
import { Container, Row, Col} from "react-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter } from "react-router"

// import config from "../config/config"

class IDMeCode extends React.Component {
    // webcamRef = React.useRef(null);

    constructor(props) {
        super();

        let query = new URLSearchParams(props.location.search);

        this.state = {
            code: query.get("code"),
        };
    }

    render() {
        let { code } = this.state;

        return (
            <Router>
                <Container style={{ textAlign: "center" }}>
                    <Row style={{ marginTop: 50 }}>
                        <Col>
                            <h1>Code : {code}</h1>
                        </Col>
                    </Row>
                </Container>
            </Router>
        );
    }
}

// const styles = {
//     container: {
//         textAlign: "center",
//     },
// };


export default withRouter(IDMeCode);