import React from 'react';
import Helmet from "./Helemt/Helmet";
import { Container, Row, Col } from "reactstrap";
import heroimg from "../assets/images/heroimg.png";
import "../styles/Home.css";
import heroimg1 from "./assets/header_img.png";

const Home: React.FC = () => {
    return (
        <Helmet title={"Home"}>
            <section id="home" className="hero__section">
                <Container>
                    <Row className="heroback">
                        <Col lg="6" md="6">
                            <div className="hero_content">
                                <div className="h21">
                                    <h2>Revolutionary Clinical Support System</h2>
                                </div>
                                <div className="h22 mt-0">
                                    <h2 className="gradvpy">AIsculapius</h2>
                                </div>

                                <p>
                                    Empower your medical decisions with advanced AI technology that delivers accurate
                                    diagnoses and personalized treatment plans. Enhance your practice, save time, and
                                    improve patient outcomes today.
                                </p>

                                <button className="buy__button">
                                    <a href="#events">Get Started</a>
                                </button>
                            </div>
                        </Col>

                        <Col lg="6" md="6">
                            <div className="lottie">
                                <img src={heroimg1} alt="" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default Home;