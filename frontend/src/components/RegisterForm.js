import React from "react";
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

    registerUserData(e) {
        e.preventDefault();
        var { userInfo, isUploading } = this.state;
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
                    window.location.href = "/success";
                });
            } else {
                this.setState({ isUploading: false });
            }
        });
    }

    handleChange(e) {
        const fname = e.target.name;
        const value = e.target.value;
        const { userInfo } = this.state;
        userInfo[fname] = value;
        this.state.userInfo = userInfo;
    }

    render() {

        return (
            <div class="innerPage ptb_150">
                <section>
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="text-center">
                                    <a href="/" class="logoIn mb-5">interverify</a>
                                </div>
                                <div class="whiteWrap">
                                    <h3 class="text-center">Interview Details</h3>
                                    <div class="row form___Row pt-5">
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Candidate First Name <span class="req__">*</span></label>
                                                <input name="candidate_name_first" onChange={this.handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Candidate Last Name <span class="req__">*</span></label>
                                                <input name="candidate_name_last" onChange={this.handleChange} type="text" placeholder="Enter Candidate Last Name" class="input__" />
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Candidate Email <span class="req__">*</span></label>
                                                <input name="candidate_email" onChange={this.handleChange} type="text" placeholder="example@example.com" class="input__" />
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">

                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview Date <span class="req__">*</span></label>
                                                <input name="date_of_interview" onChange={this.handleChange} type="date" placeholder="Interview Date" class="input__" />
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview Link <span class="req__">*</span></label>
                                                <input name="social_link" type="text" onChange={this.handleChange} placeholder="Zoom, Skype, Bluejeans, Hirevue link" class="input__" />
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview First Name<span class="req__">*</span></label>
                                                <input name="interviewer_name_first" type="text" onChange={this.handleChange} placeholder="Enter Interview First Name" class="input__" />
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview Last Name <span class="req__">*</span></label>
                                                <input name="interviewer_name_last" type="text" onChange={this.handleChange} placeholder="Enter Interview Last Name" class="input__" />
                                            </div>
                                        </div>

                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview Email<span class="req__">*</span></label>
                                                <input name="interviewer_email" type="text" onChange={this.handleChange} placeholder="example@example.com" class="input__" />
                                            </div>
                                        </div>
                                        <div class="col-md-12 col-12">
                                            <div onClick={this.registerUserData} class="form-group text-center pt-2">
                                                <a class="btn_1">{this.state.isUploading ? 'Uploading...' : 'Submit'}</a>
                                            </div>
                                        </div>
                                        <div class="col-12 text-center mt-3">
                                            <p class="not__">By clicking start verification you <br />accept <a>all terms and conditions</a></p>
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
}
