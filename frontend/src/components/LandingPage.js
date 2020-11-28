import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter } from "react-router"

// import config from "../config/config"

class LandingPage extends React.Component {

    constructor(props) {
        super();
    }

    render() {
        return (
            <div>
                <header>
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <nav class="navbar navbar-expand-lg">
                                    <img style={{ height: 80 }} src="images/weblogo.png" />
                                    <a style={{ fontSize: 50, marginLeft: 10 }} href="/">interverify</a>
                                    <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                                        data-target="#navb">
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
                                                <a class="nav-link" href="#Features_">Features</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" href="#Testimonials_">Testimonials</a>
                                            </li>
                                            <li>
                                                <a class="nav-link btn_1" href="register">Get Started Free</a>
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
                            <div class="col-xl-7 col-lg-6 col-md-6 col-12 heroSliderFull">
                                <h1>Realtime identity verification for Virtual Hiring!
                </h1>
                                <p>The smart solution for fast, secure and seamless identity verification for remote interviewing


                </p>
                                <a href="register" class="btn_1">Get Started Free</a>
                            </div>
                            <div class="col-xl-5 col-lg-6 col-md-6 col-12 heroSliderFull">
                                <img src="images/female.png" class="heroImg" />
                            </div>
                        </div>
                    </div>
                </section>
                <section class="secondSection">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-8 col-md-12 col-12">
                                <p>Interverify offers easy to implement and reliable identity verification services for recruitment
                                process. We have designed an advance software and algorithms into a simple and straightforward
                                interface that is compatible with any video conferencing application. Our flexible system lets
                                you adjust the parameters to suit your needs and verify candidates through various checks.
                    Interverify solutions are easy to set up and even easier to maintain!</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="featuresSection" id="Features_">
                    <div class="featurBgWrap">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12 col-12 titleCol">
                                    <h1>Features</h1>
                                    <p>Get ready to verify and identify customers in seconds with the swift and reliable Interverify integration!
                                        <br />Take advantage of our feature-rich and efficiently automated solutions today.</p>
                                </div>
                            </div>
                            <div class="row f_Row">
                                <div class="col-md-6 col-12 imgCenter">
                                    <img src="images/feature_1.svg" />
                                </div>
                                <div class="col-md-6 col-12 f_textCol">
                                    <div>
                                        <h2>Deep Facial Analysis</h2>
                                        <p>Facial recognition and analysis are the bedrock of credible customer identity verification. At Interverify, our sophisticated software algorithms use artificial intelligence and machine learning to perform biometric facial recognition. Our proficient grasp of the latest facial recognition technology and access to seasoned software architects allows us to offer accurate facial analysis services that are difficult to bypass using fraudulent means. Our automated facial analysis services will save you hours of time and energy that is better expended elsewhere!</p>
                                    </div>
                                </div>
                            </div>
                            <div class="row f_Row">
                                <div class="col-md-6 col-12 f_textCol leftTextCol">
                                    <div>
                                        <h2>ID Authentication</h2>
                                        <p>We understand that businesses, startups, and personal projects of various scopes continuously face the risk of having their security breached. At Interverify, we offer real-time ID authentication solutions to minimize the likelihood of identity theft, online frauds, and financial crimes. Our ID authentication system matches users' information and verifies whether or not it is authentic in seconds. Our system may seem complicated on the backend, but it is incredibly simple upfront!</p>
                                    </div>
                                </div>
                                <div class="col-md-6 col-12 order-1 imgCenter">
                                    <img src="images/feature_2.svg" />
                                </div>
                            </div>
                            <div class="row f_Row">
                                <div class="col-md-6 col-12 imgCenter">
                                    <img src="images/feature_3.svg" />
                                </div>
                                <div class="col-md-6 col-12 f_textCol">
                                    <div>
                                        <h2>IP Address Verification</h2>
                                        <p>Did you know? A considerable fraction of online crimes are committed through the exploitation of IP addresses. At Interverify, we can identify the device type of an Internet Protocol (IP)  address based anywhere in the world. We use this information to cross-check against other data points (bills, receipts, and addresses) that the user may have provided to flag any potential fraudulent activities and suspicious behavior. We deliver the most authentic and accurate IP address verification services available with our access to regularly updated databases.</p>
                                    </div>
                                </div>
                            </div>


                            <div class="row f_Row">
                                <div class="col-md-6 col-12 f_textCol leftTextCol">
                                    <div>
                                        <h2>Platform Agnostic</h2>
                                        <p>Regardless of which web conferencing platform you chose, Interverify is has a seamless integration. By simply providing a weblink to you web meeting, Interverify handles the verification process and forwards your candidate to the weblink at the time of the interview, while providing the recruiter and interviewer an analysis report of the candidate.</p>
                                    </div>
                                </div>
                                <div class="col-md-6 col-12 order-1 imgCenter">
                                    <img src="images/feature_2.svg" />
                                </div>
                            </div>
                            <div class="row f_Row">
                                <div class="col-md-6 col-12 imgCenter">
                                    <img src="images/feature_3.svg" />
                                </div>
                                <div class="col-md-6 col-12 f_textCol">
                                    <div>
                                        <h2>Quick and Easy to use</h2>
                                        <p>Entire verification process takes less than 1 minute to deliver analysis, and provides
                                        guided steps to conclude verification process.
                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="testimonialsSection ptb_100" id="Testimonials_">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12 col-12 titleCol">
                                <h1>Testimonials</h1>
                                <p>What People are saying about us</p>
                            </div>
                            <div class="col-12 testCol__">
                                <div class="t_imgRound _01"><img src="images/test_round_1.png" /></div>
                                <div class="t_imgRound _02"><img src="images/test_round_2.png" /></div>
                                <div class="t_imgRound _03"><img src="images/test_round_3.png" /></div>
                                <div class="t_imgRound _04"></div>
                                <div class="t_imgRound _05"></div>
                                <div id="testoSlider" class="carousel slide testoSlider_" data-ride="carousel">

                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <div class="testoRow">
                                                <div class="testoMaintext">
                                                    <p>“Interverify helped us become compliant with our cyber risks audit, by verifying the identities of incoming employees.”</p>
                                                </div>
                                                <div class="clientInfo">
                                                    <div class="avtImg">
                                                        <img src="images/test_img_1.png" />
                                                    </div>
                                                    <div class="avtText">
                                                        <div class="_name">Alex Smith</div>
                                                        <div class="_designation">CEO of GenMerch</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="carousel-item">
                                            <div class="testoRow">
                                                <div class="testoMaintext">
                                                    <p>“Interverify helped us in saving tons of hours of identification process into
                                        seconds by providing the automate solutions.”</p>
                                                </div>
                                                <div class="clientInfo">
                                                    <div class="avtImg">
                                                        <img src="images/test_img_1.png" />
                                                    </div>
                                                    <div class="avtText">
                                                        <div class="_name">Alex Smith</div>
                                                        <div class="_designation">CEO of Duplee</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="carousel-item">
                                            <div class="testoRow">
                                                <div class="testoMaintext">
                                                    <p>“Interverify helped us in saving tons of hours of identification process into
                                        seconds by providing the automate solutions.”</p>
                                                </div>
                                                <div class="clientInfo">
                                                    <div class="avtImg">
                                                        <img src="images/test_img_1.png" />
                                                    </div>
                                                    <div class="avtText">
                                                        <div class="_name">Alex Smith</div>
                                                        <div class="_designation">CEO of Duplee</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="arrowCol">
                                        <a class="carousel-control-prev" href="#testoSlider" data-slide="prev">
                                            <span class="prev-icon"></span>
                                        </a>
                                        <a class="carousel-control-next" href="#testoSlider" data-slide="next">
                                            <span class="next-icon"></span>
                                        </a>
                                    </div>
                                </div>
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
                                        <p>Still Confused Interverify is right choice for you ? No problem.</p>
                                        <a href="register" class="btn_1">Get Started Free</a>
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
                                    <p>Interverify makes online candidate verification efficient, cost-effective, and compliant with
                                    the online code of ethics. We offer secure and flexible solutions in the interest of
                        preventing identity theft, security breaches,</p>
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
                                    <li><a href="mailto:contact@interverify.co">contact@interverify.co</a></li>
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
}

export default withRouter(LandingPage);