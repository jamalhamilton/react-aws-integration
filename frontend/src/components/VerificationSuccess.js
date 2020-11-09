import React, { useEffect, useState } from 'react';
import { Button, Row, Spinner } from "react-bootstrap";
import { BrowserRouter as Router, useLocation, useHistory } from "react-router-dom";
import config from "../config/front_config";
import { Container } from "react-bootstrap";

const VerificationSuccess = () => {

    const history = useHistory();
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState();

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const token = query.get('token');

    useEffect(() => {
        getUserWithToken();
    }, []);

    const getUserWithToken = () => {
        setIsLoading(true);
        fetch(config.api.getUser, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                token
            })
        }).then(res => res.json()).then(data => {
            setIsLoading(false);
            if (data && data['data'] && data['data']['token']) {
                setUser(data['data']);
                if (data['data']['id_verification_result'] == "verified") {
                    if (!(data['data']['verify_result'])) {
                        if (data['data']['verify_photo']) {
                            history.push('/userid?token=' + token);
                        } else {
                            history.push('/userphoto?token=' + token);
                        }
                    }
                } else {
                    history.push('/verifyID?token=' + token);
                }
            } else {
                alert('User not found!.');
            }
        }).catch(err => {
            setIsLoading(false);
        })
    }

    return (
        <Router>
            <Container style={{ textAlign: "center" }}>
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
                <Row style={{ justifyContent: 'center' }}>
                    <ul class="progressbar">
                        <li class="active">Identity Verification</li>
                        <li class="active">Photo Verification</li>
                        <li class="active">Verification finished</li>
                    </ul>
                </Row>
                <div style={{ paddingTop: 200, paddingBottom: 20 }}>
                    <h1>Congratulation!, you have completed verification process</h1>
                </div>
                <Button variant="primary" onClick={() => window.open(user['social_link'], "_blank")}>Proceed to interview</Button>
            </Container>
        </Router>
    );
}

export default VerificationSuccess;