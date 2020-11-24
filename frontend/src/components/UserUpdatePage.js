import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import config from "../config/front_config";
import DateTimePicker from 'react-datetime-picker';

const UpdateUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState();
    const [userWithoutEdit, setUserWithoutEdit] = useState();
    const [isLoading, setIsLoading] = useState();
    const history = useHistory();
    const [displayMessage, setDisplayMessage] = useState();

    useEffect(() => {
        getUser();
    }, []);

    const validateEmail = (email) => {
        if (!email) { return false; }
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleChange = (e) => {
        const fname = e.target.name;
        const value = e.target.value;
        const currentVal = user;
        currentVal[fname] = value;
        setUser(currentVal);
    }

    const handleDateChange = (value) => {
        const currentVal = user;
        currentVal["date_of_interview"] = value;
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
                    showErrorMessage('error', 'User not found!');
                }
            }).catch(err => {
                setIsLoading(false);
                showErrorMessage('error', 'Unable to fetch user info!');
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
                        showErrorMessage("success", "Updated.");
                        history.push('/admin');
                    } else {
                        showErrorMessage('error', 'Issue on updating user');
                    }
                })
                    .catch(err => {
                        setIsLoading(false);
                        showErrorMessage('error', 'Issue on updating user');
                    })
            } else {
                history.push('/login');
            }
        } else {
            showErrorMessage('error', 'Candidate Email should be valid');
        }
    }

    const showErrorMessage = (type, message) => {
        setDisplayMessage({
            type,
            message
        });
        setTimeout(() => {
            setDisplayMessage();
        }, 3000);
    }

    const showMessage = () => {
        if (displayMessage && displayMessage.type && displayMessage.message) {
            if (displayMessage.type === 'success') {
                return (
                    <div class="submitMsg"><img src="../../images/checked_ic.svg" />{displayMessage.message}</div>
                );
            } else {
                return (
                    <div class="errorMsg"><i class="fas fa-times-circle errorMsgIcon"></i>{displayMessage.message}</div>
                );
            }
        }
    }

    return (
        <div class="innerPage ptb_100">
            <section>
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
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} class="text-center">
                                <img style={{ height: 50 }} src="../../images/weblogo.png" />
                                <a style={{ fontSize: 50, marginLeft: 10 }} href="/">interverify</a>
\                                </div>
                            <div class="whiteWrap">
                                <h3 class="text-center">Interview Details</h3>
                                <div class="row form___Row pt-5">
                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Candidate First Name </label>
                                            <input defaultValue={user?.candidate_name_first} name="candidate_name_first" onChange={handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Candidate Last Name </label>
                                            <input defaultValue={user?.candidate_name_last} name="candidate_name_last" onChange={handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Candidate Email </label>
                                            <input defaultValue={user?.candidate_email} name="candidate_email" onChange={handleChange} type="email" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Date Of Interview </label>
                                            {/* <input defaultValue={user?.date_of_interview} name="date_of_interview" onChange={handleChange} type="date" placeholder="Enter Candidate First Name" class="input__" /> */}
                                            <DateTimePicker className={"input__"} value={user?.date_of_interview} name="date_of_interview" onChange={(val) => handleDateChange(val)} />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Interview Link </label>
                                            <input defaultValue={user?.social_link} name="social_link" onChange={handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Interview First Name </label>
                                            <input defaultValue={user?.interviewer_name_first} name="interviewer_name_first" onChange={handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Interview Last Name </label>
                                            <input defaultValue={user?.interviewer_name_last} name="interviewer_name_last" onChange={handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Interview Email </label>
                                            <input defaultValue={user?.interviewer_email} name="interviewer_email" onChange={handleChange} type="email" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Similarity Score</label>
                                            <input defaultValue={user?.verify_result} name="verify_result" onChange={handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Uploaded Photo </label>
                                            <input defaultValue={user?.verify_photo} name="verify_photo" onChange={handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Uploaded IDcard </label>
                                            <input defaultValue={user?.verify_idcard} name="verify_idcard" onChange={handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Vouched verification </label>
                                            <input defaultValue={user?.id_verification_result} name="id_verification_result" onChange={handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Recruiter First Name<span class="req__">*</span></label>
                                            <input defaultValue={user?.recruiter_first_name} name="recruiter_first_name" type="text" onChange={handleChange} placeholder="Enter Recruiter First Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Recruiter Last Name<span class="req__">*</span></label>
                                            <input defaultValue={user?.recruiter_last_name} name="recruiter_last_name" type="text" onChange={handleChange} placeholder="Enter Recruiter Last Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Recruiter Email<span class="req__">*</span></label>
                                            <input defaultValue={user?.recruiter_email} name="recruiter_email" type="email" onChange={handleChange} placeholder="example@example.com" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-6 col-12">
                                        <div class="form-group">
                                            <label class="label__">Company Name<span class="req__">*</span></label>
                                            <input defaultValue={user?.company_name} name="company_name" type="text" onChange={handleChange} placeholder="Enter Company Name" class="input__" />
                                        </div>
                                    </div>

                                    <div class="col-md-12 col-12">
                                        <div class="form-group text-center pt-2">
                                            <a onClick={() => update()} class="btn_1">Update</a>
                                        </div>
                                    </div>
                                    {/* <div class="col-12 text-center mt-3">
                                            <p class="not__">By clicking start verification you <br />accept <a>all terms and conditions</a></p>
                                        </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showMessage()}
        </div>
    );
}

export default UpdateUser;