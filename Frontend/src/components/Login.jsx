import React from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

export default function Login() {
  const onClick = (e) => {
    e.preventDefault();
    toast.info('Please press on the login button to continue', {
      position: 'top-center', // Position the toast at the top-left corner
    });
  };
  return (
    <Container>
      <Content>
        <CTA>
          <CTALogoOne
            src='../images/cta-logo-one(1).png'
            alt='disney-logo'
          ></CTALogoOne>
          <SignUp onClick={onClick}>GET ALL THERE</SignUp>
          <Description>
            Experience the magic of Infinite Flix with exclusive Originals,
            thrilling blockbusters, binge-worthy series, and endless
            entertainment—only on Infinite Flix
          </Description>
          <CTALogoTwo
            src='../images/cta-logo-two.png'
            alt='disney-marvel-espn'
          />
        </CTA>
        <BgImage />
      </Content>
    </Container>
  );
}

const Container = styled.section`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100vh;
`;

const Content = styled.div`
  margin-bottom: 10vw;
  width: 100%;
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 80px 40px;
  height: 100%;
`;

const BgImage = styled.div`
  height: 100%;
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('../images/login-background.jpg');
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
`;

const CTA = styled.div`
  margin-bottom: 2vw;
  max-width: 650px;
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 0;
  align-items: center;
  text-align: center;
  margin-right: auto;
  margin-left: auto;
  transition-timing-function: ease-out;
  transition: opacity 0.2s;
  width: 100%;
`;

const CTALogoOne = styled.img`
  max-width: 600px;
  min-height: 1px;
  display: block;
  width: 100%;
  margin-bottom: 12px;
`;

const SignUp = styled.a`
  font-weight: bold;
  color: #f9f9f9;
  background-color: #0063e5;
  margin-bottom: 12px;
  width: 100%;
  letter-spacing: 1.5px;
  font-size: 18px;
  padding: 16.5px 0;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0483ee;
  }
`;

const Description = styled.p`
  color: hsla(0, 0%, 95.3%, 1);
  font-family: Avenir-Roman, sans-serif;
  font-size: 16px;
  margin: 0 0 24px;
  letter-spacing: 1.5px;
`;

const CTALogoTwo = styled.img`
  max-width: 600px;
  margin-bottom: 20px;
  display: inline-block;
  vertical-align: bottom;
  width: 100%;
`;
