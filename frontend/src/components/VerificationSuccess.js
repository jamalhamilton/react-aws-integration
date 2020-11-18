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
                        history.push('/userphoto?token=' + token);
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

    const proceed = () => {
        if (user) {
            window.open(user['social_link'], "_blank");
        } else {
            alert('User not found!.');
        }
    }

    return (
        <div class="innerPage ptb_150">
            <section>
                <div class="container">
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
                    <div class="row">
                        <div class="col-12">
                            <div class="text-center">
                                <a href="index.html" class="logoIn mb-5">interverify</a>
                                <ul class="processHead">
                                    <li class="active">
                                        <span class="round_no">1</span>
                                        <span class="t__">ID Verification</span>
                                    </li>
                                    <li class="active">
                                        <span class="round_no">2</span>
                                        <span class="t__">Photo Verification</span>
                                    </li>
                                    <li class="active" >
                                        <span class="round_no">3</span>
                                        <span class="t__">Finished</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="whiteWrap">
                                <h3 class="text-center">Photo Verification</h3>
                                <div class="row form___Row pt-5">
                                    <div class="col-md-12 col-12 ">
                                        <div class="wrap400">
                                            <p>Verification completed Please click the link below to proceed to your Interview</p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 col-12 btnBootomCol">
                                        <div class="form-group text-center pt-5">
                                            <a onClick={() => proceed()} class="btn_1">Proceed</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default VerificationSuccess;