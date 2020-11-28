import React from "react";
import { withRouter } from "react-router"

const About = () => {
    return (
        <div>
            <header>
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <nav class="navbar navbar-expand-lg">
                                <img style={{ height: 80 }} src="images/weblogo.png" />
                                <a style={{ fontSize: 50, marginLeft: 10 }} href="/">interverify</a>
                                <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navb">
                                    <span class="navbar-toggler-icon"></span>
                                </button>

                                <div class="collapse navbar-collapse" id="navb">
                                    <ul class="navbar-nav ml-auto">
                                        <li class="nav-item">
                                            <a class="nav-link" href="/">Home</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="about">About us</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="/#Features_">Features</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="/#Testimonials_">Testimonials</a>
                                        </li>
                                        <li>
                                            <a class="nav-link btn_1" href="register">Get Started</a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <section class="heroSection">
                <div class="container">
                    <div class="row heroRow">
                        <div class="col-xl-12 col-lg-12 col-md-12 col-12 innderHeader">
                            <h1>About Us</h1>
                            <span class="breadcrumbs"><a href="/">Home</a> / <a href="about" class="currect">About</a></span>


                        </div>

                    </div>
                </div>
            </section>
            <section class="aboutSection">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-8 col-8 ">

                            <p>We help you create and maintain a clean audit trail of verifications performed.
                            Interverify is an identity verification solution platform that assists businesses, startups, and personal projects of various scopes to automate the identification verification process for their potential candidates during recruitment. We adhere to data privacy regulations to deliver a safe and reliable experience.
					Recruiters will appreciate the simplicity of integrating Interverify solutions with any website or application.</p>
                        </div>

                    </div>
                </div>
            </section>
            <section class="getStartSection">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="getStartCol">
                                <div class="">
                                    <h1>Get Started with us</h1>
                                    <p>Still Confused Interverify is right choice for you ?  No problem.</p>
                                    <a href="register" class="btn_1">Get Started</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 col-12">
                            <div class="f_comInfo">
                                <div class="f_logo">interverify</div>
                                <p>Interverify makes online customer verification efficient, cost-effective, and compliant with the online code of ethics. We offer secure and flexible solutions in the interest of preventing identity theft, security breaches,</p>
                            </div>
                        </div>
                        <div class="col-md-3 col-12">
                            <h6>Quick Links</h6>
                            <ul class="f_links">
                                <li><a href="/">Home</a></li>
                                <li><a href="/#Features_">Features</a></li>
                                <li><a href="/#Testimonials_">Testimonials</a></li>
                            </ul>
                        </div>
                        <div class="col-md-3 col-12">
                            <h6>Contact</h6>
                            <ul class="f_links">
                                <li><a href="mailto:test@test.com">test@test.com</a></li>
                            </ul>
                            {/* <h6 class="mt-4">Phone</h6>
                            <ul class="f_links">
                                <li><a href="tel:2324-2323-2323">2324-2323-2323</a></li>
                            </ul> */}
                        </div>
                    </div>
                    <div class="row copyRightRow__">
                        <div class="col-md-6 col-12">
                            <ul class="socialLinksList">
                                <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
                                <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                                <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                            </ul>
                        </div>
                        <div class="col-md-6 col-12">
                            <p class="copyRight__">© 2020 All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default withRouter(About);