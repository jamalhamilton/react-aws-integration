import React from "react";
import config from "../config/front_config";
import DateTimePicker from 'react-datetime-picker';

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
            displayMessage: {
                type: '',
                message: ''
            },
            formError: {}
        };
        this.registerUserData = this.registerUserData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    validateForm(userInfo) {
        const errorMessages = {};
        if (userInfo) {
            if (!userInfo['candidate_name_first']) { errorMessages['candidate_name_first'] = 'Candidate First Name is required'; }
            if (!userInfo['candidate_name_last']) { errorMessages['candidate_name_last'] = 'Candidate Last Name is required'; }
            if (!userInfo['candidate_email']) { errorMessages['candidate_email'] = 'Candidate Email is required'; }
            if (!userInfo['date_of_interview']) { errorMessages['date_of_interview'] = 'Date of Interview is required'; }
            if (!userInfo['social_link']) { errorMessages['social_link'] = 'Interview Link is required'; }
            if (!userInfo['interviewer_name_first']) { errorMessages['interviewer_name_first'] = 'Interview First Name is required'; }
            if (!userInfo['interviewer_name_last']) { errorMessages['interviewer_name_last'] = 'Interview Last Name is required'; }
            if (!userInfo['interviewer_email']) { errorMessages['interviewer_email'] = 'Interview Email is required'; }
        } else {
            errorMessages['candidate_name_first'] = 'Candidate First Name is required';
            errorMessages['candidate_name_last'] = 'Candidate Last Name is required';
            errorMessages['candidate_email'] = 'Candidate Email is required';
            errorMessages['date_of_interview'] = 'Date of Interview is required';
            errorMessages['social_link'] = 'Interview Link is required';
            errorMessages['interviewer_name_first'] = 'Interview First Name is required';
            errorMessages['interviewer_name_last'] = 'Interview Last Name is required';
            errorMessages['interviewer_email'] = 'Interview Email is required';
        }
        this.setState({ formError: errorMessages })
        return !(Object.keys(errorMessages).length);
    }

    registerUserData(e) {
        e.preventDefault();
        var { userInfo, isUploading } = this.state;
        if (this.validateForm(userInfo)) {
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
                        fetch(config.api.sendRegisterSuccessMailToRecruiter, {
                            headers: { 'Content-Type': 'application/json' },
                            method: "POST",
                            body: JSON.stringify({
                                token: data.token
                            }),
                        }).then(() => {
                            this.setState({ isUploading: false });
                            this.showErrorMessage('success', 'Registered User Successfully');
                            window.location.href = "/success";
                        }).catch(() => {
                            this.setState({ isUploading: false });
                            this.showErrorMessage('error', 'Send mail faild!');
                        });
                    }).catch(() => {
                        this.setState({ isUploading: false });
                        this.showErrorMessage('error', 'Send mail faild!');
                    })
                } else {
                    this.setState({ isUploading: false });
                    this.showErrorMessage('error', 'Something went wrong!');
                }
            }).catch(err => {
                this.setState({ isUploading: false });
                this.showErrorMessage('error', 'Something went wrong!');
            });
        } else {
            this.showErrorMessage('error', 'Some of your inputs are not valid!');
        }
    }

    handleChange(e) {
        const fname = e.target.name;
        const value = e.target.value;
        const { userInfo } = this.state;
        userInfo[fname] = value;
        this.setState({ userInfo: userInfo });
    }

    handleDateChange(value) {
        const { userInfo } = this.state;
        userInfo["date_of_interview"] = value;
        this.setState({ userInfo: userInfo });
    }

    showErrorMessage(type, message) {
        this.setState({
            displayMessage: {
                type,
                message
            }
        });
        setTimeout(() => {
            this.setState({
                displayMessage: undefined
            });
        }, 3000);
    }


    showMessage() {
        if (this.state.displayMessage && this.state.displayMessage.type && this.state.displayMessage.message) {
            if (this.state.displayMessage.type === 'success') {
                return (
                    <div class="submitMsg"><img src="images/checked_ic.svg" />{this.state.displayMessage.message}</div>
                );
            } else {
                return (
                    <div class="errorMsg"><i class="fas fa-times-circle errorMsgIcon"></i>{this.state.displayMessage.message}</div>
                );
            }
        }
    }

    render() {

        return (
            <div class="innerPage ptb_100">
                <section>
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} class="text-center">
                                    <img style={{ height: 50 }} src="images/weblogo.png" />
                                    <a style={{ fontSize: 50, marginLeft: 10 }} href="/">interverify</a>
                                </div>
                                <div class="whiteWrap">
                                    <h3 class="text-center">Interview Details</h3>
                                    <div class="row form___Row pt-5">
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Candidate First Name <span class="req__">*</span></label>
                                                <input name="candidate_name_first" onChange={this.handleChange} type="text" placeholder="Enter Candidate First Name" class="input__" />
                                                {this.state.formError && this.state.formError['candidate_name_first'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['candidate_name_first'] ? this.state.formError['candidate_name_first'] : 'Candidate First Name is not valid.'}</small> : null}
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Candidate Last Name <span class="req__">*</span></label>
                                                <input name="candidate_name_last" onChange={this.handleChange} type="text" placeholder="Enter Candidate Last Name" class="input__" />
                                                {this.state.formError && this.state.formError['candidate_name_last'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['candidate_name_last'] ? this.state.formError['candidate_name_last'] : 'Candidate Last Name is not valid.'}</small> : null}
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Candidate Email <span class="req__">*</span></label>
                                                <input name="candidate_email" onChange={this.handleChange} type="email" placeholder="example@example.com" class="input__" />
                                                {this.state.formError && this.state.formError['candidate_email'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['candidate_email'] ? this.state.formError['candidate_email'] : 'Candidate Email is not valid.'}</small> : null}
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">

                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview Date <span class="req__">*</span></label>
                                                {/* <input name="date_of_interview" onChange={this.handleChange} type="date" placeholder="Interview Date" class="input__" /> */}
                                                <DateTimePicker className={"input__"} value={this.state?.userInfo?.date_of_interview} name="date_of_interview" onChange={(val) => this.handleDateChange(val)} />
                                                {this.state.formError && this.state.formError['date_of_interview'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['date_of_interview'] ? this.state.formError['date_of_interview'] : 'Date of Interview is not valid.'}</small> : null}
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview Link <span class="req__">*</span></label>
                                                <input name="social_link" type="text" onChange={this.handleChange} placeholder="Zoom, Skype, Bluejeans, Hirevue link" class="input__" />
                                                {this.state.formError && this.state.formError['social_link'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['social_link'] ? this.state.formError['social_link'] : 'Interview Link is not valid.'}</small> : null}
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview First Name<span class="req__">*</span></label>
                                                <input name="interviewer_name_first" type="text" onChange={this.handleChange} placeholder="Enter Interview First Name" class="input__" />
                                                {this.state.formError && this.state.formError['interviewer_name_first'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['interviewer_name_first'] ? this.state.formError['interviewer_name_first'] : 'Interviewer First Name is not valid.'}</small> : null}
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview Last Name <span class="req__">*</span></label>
                                                <input name="interviewer_name_last" type="text" onChange={this.handleChange} placeholder="Enter Interview Last Name" class="input__" />
                                                {this.state.formError && this.state.formError['interviewer_name_last'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['interviewer_name_last'] ? this.state.formError['interviewer_name_last'] : 'Interviewer Last Name is not valid.'}</small> : null}
                                            </div>
                                        </div>

                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Interview Email<span class="req__">*</span></label>
                                                <input name="interviewer_email" type="email" onChange={this.handleChange} placeholder="example@example.com" class="input__" />
                                                {this.state.formError && this.state.formError['interviewer_email'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['interviewer_email'] ? this.state.formError['interviewer_email'] : 'Interviewer Email is not valid.'}</small> : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row form___Row">
                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Recruiter First Name<span class="req__">*</span></label>
                                                <input name="recruiter_first_name" type="text" onChange={this.handleChange} placeholder="Enter Recruiter First Name" class="input__" />
                                                {this.state.formError && this.state.formError['recruiter_first_name'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['recruiter_first_name'] ? this.state.formError['recruiter_first_name'] : 'Recruiter First Name is not valid.'}</small> : null}
                                            </div>
                                        </div>

                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Recruiter Last Name<span class="req__">*</span></label>
                                                <input name="recruiter_last_name" type="text" onChange={this.handleChange} placeholder="Enter Recruiter Last Name" class="input__" />
                                                {this.state.formError && this.state.formError['recruiter_last_name'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['recruiter_last_name'] ? this.state.formError['recruiter_last_name'] : 'Recruiter Last Name is not valid.'}</small> : null}
                                            </div>
                                        </div>

                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Recruiter Email<span class="req__">*</span></label>
                                                <input name="recruiter_email" type="email" onChange={this.handleChange} placeholder="example@example.com" class="input__" />
                                                {this.state.formError && this.state.formError['recruiter_email'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['recruiter_email'] ? this.state.formError['recruiter_email'] : 'Recruiter Email is not valid.'}</small> : null}
                                            </div>
                                        </div>

                                        <div class="col-md-6 col-12">
                                            <div class="form-group">
                                                <label class="label__">Company Name<span class="req__">*</span></label>
                                                <input name="company_name" type="text" onChange={this.handleChange} placeholder="Enter Company Name" class="input__" />
                                                {this.state.formError && this.state.formError['company_name'] ? <small style={{ color: '#d32222', marginLeft: 3 }}>{this.state.formError['company_name'] ? this.state.formError['company_name'] : 'Company Name is not valid.'}</small> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-12 col-12">
                                        <div class="form-group text-center pt-2">
                                            <a onClick={this.registerUserData} class="btn_1">{this.state.isUploading ? 'Uploading...' : 'Submit'}</a>
                                        </div>
                                    </div>

                                    {/* <div class="col-12 text-center mt-3">
                                            <p class="not__">By clicking start verification you <br />accept <a>all terms and conditions</a></p>
                                        </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {this.showMessage()}
            </div>
        );
    }
}
