import React from "react";
import { withRouter } from "react-router";

const TermOfUse = () => {
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
                            <h1> Terms of Use</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section class="aboutSection">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-8 col-8 ">
                            <p style={{ textAlign: 'left' }}>YOUR USE OF THIS WEBSITE CONSTITUTES YOUR AGREEMENT TO BE BOUND BY THESE TERMS OF USE.</p>
                            <p style={{ textAlign: 'left' }}>This website (the “Website”) is owned and made available by Interverify or its affiliates (“Interverify ” or “we”). The Website and all of the services, content, and information we provide through the website (collectively, the “Content”) are provided to you subject to your agreement to and compliance with the following terms and conditions (the “Terms of Use”).</p>
                            <p style={{ textAlign: 'left' }}><b>1. Your Use of the Website.</b></p>
                            <p style={{ textAlign: 'left' }}>You agree to use the Website and the Content only for your personal use. You acknowledge and agree that, as between you and us, we own all of the Website and the Content and that you have no interest in the Website or the Content beyond your use of them consistent with the Terms of Use. You agree that you will not (a) decompile, reverse engineer, disassemble, rent, lease, loan, sell, license, sublicense, or create derivative works from the Website or the Content; (b) use any robot, spider, other automatic software or device, or manual process to monitor or copy the Website or the Content without our prior written permission; or (c) copy, modify, reproduce, republish, distribute, display, or transmit for commercial, non-profit, or public purposes all or any portion of the Website or the Content. Any unauthorized use of the Website or the Content is prohibited. You agree that we may deny or terminate your use of the Website or the Content at any time and for any reason and with no notice to you.</p>
                            <p style={{ textAlign: 'left' }}><b>2. Our Use of Personal Information.</b></p>
                            <p style={{ textAlign: 'left' }}>We receive from the businesses and companies to which we provide products and services certain items of personal information of the customers of those businesses and companies. We use such Personal Information in accordance with our Website Privacy Policy. By accepting these Terms of Service, you authorize us to verify your personal information through our ID + Identity Verification Solution and any other inquiries that we consider necessary to validate the personal information that you provide to Interverify.</p>
                            <p style={{ textAlign: 'left' }}><b>3. Your Responsibility for Access.</b></p>
                            <p style={{ textAlign: 'left', marginLeft: 30 }}><i style={{ fontSize: 10, marginBottom: 2, marginRight: 13 }} class="fa fa-square"></i>  If a username or password is provided by us or created by you in connection with your use of the Website or the Content (the “Access Information”), you are responsible to maintain the confidentiality and security of, and to prevent any unauthorized use of, the Access Information. If you believe there has been unauthorized use of your Access Information, you must notify us immediately by emailing <a href="mailto:contact@interverify.co">contact@interverify.co</a>. You accept all risks of unauthorized use of your Access Information. In addition, you are solely responsible for all of the data and equipment you may use in connection with your use of the Website or the Content.</p>
                            <p style={{ textAlign: 'left' }}><b>4. Indemnity.</b></p>
                            <p style={{ textAlign: 'left' }}>You agree to indemnify, defend, and hold harmless us and all of our subsidiaries, affiliates, stockholders, officers, directors, agents, licensors, suppliers, partners, employees, and representatives from any and all claims or demands, including reasonable attorneys’ fees, made by any third party arising out of or relating to your use of the Website or the Content, or your failure to comply with the Terms of Use.</p>
                            <p style={{ textAlign: 'left' }}><b>5. Modification and Termination.</b></p>
                            <p style={{ textAlign: 'left' }}>You agree that we may at any time, and without any notice to you, modify the Website, the Content and the Terms of Use. Each time you use the Website or the Content, you are bound by the Terms of Use as they appear on the Website at the time of your use. You agree that we may at any time, and without any notice to you, terminate and cease providing the Website and the Content.</p>
                            <p style={{ textAlign: 'left' }}><b>6. Third Party Content.</b></p>
                            <p style={{ textAlign: 'left' }}>The Website or the Content may contain advertising by third parties and links to third party websites (collectively, “Third Party Content”). You acknowledge and agree that we are not responsible in any way for, and that we will have no liability of any kind to you for, any Third Party Content or any services, products, information or other things you may purchase, obtain or have access to by or because of your access to or use of, or otherwise in connection with, the Third Party Content.</p>
                            <p style={{ textAlign: 'left' }}><b>7. Disclaimer of Warranties.</b></p>
                            <p style={{ textAlign: 'left' }}>YOUR USE OF THE WEBSITE AND THE CONTENT IS AT YOUR SOLE RISK. THE WEBSITE AND THE CONTENT ARE PROVIDED ON AN “AS IS” BASIS. WE DISCLAIM ALL EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS, AND WARRANTIES OF ANY KIND, INCLUDING ANY IMPLIED WARRANTY OR CONDITION OF MERCHANTABILITY, QUALITY, AVAILABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NONINFRINGEMENT. WE MAKE NO REPRESENTATIONS, WARRANTIES, OR GUARANTEES AS TO THE USEFULNESS, QUALITY, SUITABILITY, ACCURACY, AVAILABILITY, OR COMPLETENESS OF THE WEBSITE OR THE CONTENT.</p>
                            <p style={{ textAlign: 'left' }}><b>8. Limitation of Liability.</b></p>
                            <p style={{ textAlign: 'left' }}>WE WILL NOT BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE WEBSITE OR THE CONTENT, EVEN IF WE HAVE PREVIOUSLY BEEN ADVISED OF OR REASONABLY COULD HAVE FORESEEN THE POSSIBILITY OF SUCH DAMAGES, HOWEVER, THEY ARISE, WHETHER IN BREACH OF CONTRACT OR IN TORT (INCLUDING NEGLIGENCE).</p>
                            <p style={{ textAlign: 'left' }}><b>9. General Terms.</b></p>
                            <p style={{ textAlign: 'left' }}>The Terms of Use constitute the entire agreement between you and us relating to your use of the Website and the Content. We reserve the right to investigate actual or potential violations of the Terms of Use and to take any action we deem appropriate, including, but not limited to, reporting any suspected unlawful activity to law enforcement officials, regulators or other third parties and disclosing any information we deem necessary or appropriate relating to user profiles, email addresses, usage histories, posted materials and IP addresses. We reserve the right to seek any and all remedies available at law and in equity for violations of the Terms of Use. The Terms of Use will be governed by the laws of the United States of America without giving effect to its laws, rules or principles regarding choice or conflict of laws. Any express waiver or failure to exercise promptly any right under the Terms of Use will not create a continuing waiver or any expectation of non-enforcement. If any provision of the Terms of Use is held invalid by any law or regulation of any government, or by any court or arbitrator, such provision will be replaced with a new provision that accomplishes the original business purpose, and the other provisions of the Terms of Use will remain in full force and effect. Any unauthorized use of the Website or the Content is prohibited. You agree that we may deny or terminate your use of the Website or the Content at any time and for any reason and with no notice to you.</p>
                            <p style={{ textAlign: 'left' }}><b>Updated November 28, 2020</b></p>
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
                        <div class="col-12">
                            <div style={{ justifyContent: 'flex-end' }} class="row">
                                <p class="copyRight__">© 2020 All Rights Reserved</p>
                                <a href="privacypolicy"><p style={{ marginLeft: 13, textDecorationLine: 'underline' }} class="copyRight__">Privacy policy</p></a>
                                <a href="termsofuse"><p style={{ marginLeft: 13, textDecorationLine: 'underline' }} class="copyRight__">Terms of use</p></a>
                                <a href="termsandconditions"><p style={{ marginLeft: 13, textDecorationLine: 'underline' }} class="copyRight__">Terms &amp; conditions</p></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default withRouter(TermOfUse);