import React, { useState } from 'react';
import styled from 'styled-components';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { login, register } from '../features/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInForm, setIsSignInForm] = useState(true);

  const { isLoading, user } = useSelector((state) => state.auth); // Access auth state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsSignInForm(true); // Reset to Sign In form when closing
  };

  const showCreateAccountForm = () => {
    setIsSignInForm(false);
  };

  const [formDataLogin, setFormDataLogin] = useState({
    email: '',
    password: '',
  });
  const [formDataSignup, setFormDataSignup] = useState({
    name: '',
    emailCreate: '',
    passwordCreate: '',
    password2: '',
  });
  const { name, emailCreate, passwordCreate, password2 } = formDataSignup;
  const { email, password } = formDataLogin;

  const onChangeLogin = (e) => {
    setFormDataLogin((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangeCreate = (e) => {
    setFormDataSignup((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitRegister = (e) => {
    e.preventDefault();

    if (passwordCreate !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        name: name,
        email: emailCreate,
        password: passwordCreate,
      };

      dispatch(register(userData))
        .unwrap()
        .then((user) => {
          toast.success(`Registered new user - ${user.name}`);
          setIsModalOpen(false); // Close the modal
          navigate('/home');
        })
        .catch(toast.error);
    }
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData))
      .unwrap()
      .then((user) => {
        toast.success(`Welcome back!! ${user.name}`);
        setIsModalOpen(false); // Close the modal
        navigate('/home');
      })
      .catch(toast.error);
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Nav>
        <Logo>
          <img src='../images/logo.svg' alt='disney_logo' />
        </Logo>
        {user ? (
          <Navmenu>
            <a href='/home'>
              <img src='../images/home-icon.svg' alt='Home' />
              <span>Home</span>
            </a>
            <a href='/Search'>
              <img src='../images/search-icon.svg' alt='Search' />
              <span>Search</span>
            </a>
            <a href='/Watchlist'>
              <img src='../images/watchlist-icon.svg' alt='Watchlist' />
              <span>Watchlist</span>
            </a>
            <a href='/Originals'>
              <img src='../images/original-icon.svg' alt='Originals' />
              <span>Originals</span>
            </a>
            <a href='/Movies'>
              <img src='../images/movie-icon.svg' alt='Movies' />
              <span>Movies</span>
            </a>
            <a href='/Series'>
              <img src='../images/series-icon.svg' alt='Series' />
              <span>Series</span>
            </a>
          </Navmenu>
        ) : (
          <Login onClick={toggleModal}>Login</Login>
        )}
      </Nav>
      {isModalOpen && (
        <ModalOverlay>
          <Modal>
            {isSignInForm ? (
              <>
                <h2>Sign In</h2>
                <Form onSubmit={onSubmitLogin}>
                  <label>
                    Email:
                    <input
                      type='email'
                      name='email'
                      id='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={onChangeLogin}
                      required
                    />
                  </label>
                  <label>
                    Password:
                    <input
                      name='password'
                      id='password'
                      type='password'
                      placeholder='Enter your password'
                      value={password}
                      onChange={onChangeLogin}
                      required
                    />
                  </label>
                  <button type='submit'>Sign In</button>
                  <Separator>or</Separator>
                  <button type='button' onClick={showCreateAccountForm}>
                    Create Account
                  </button>
                </Form>
              </>
            ) : (
              <>
                <h2>Create Account</h2>
                <Form onSubmit={onSubmitRegister}>
                  <label>
                    Full Name:
                    <input
                      name='name'
                      id='name'
                      type='text'
                      value={name}
                      onChange={onChangeCreate}
                      required
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      name='emailCreate'
                      id='emailCreate'
                      type='email'
                      placeholder='Enter your email'
                      value={emailCreate}
                      onChange={onChangeCreate}
                      required
                    />
                  </label>
                  <label>
                    Password:
                    <input
                      name='passwordCreate'
                      id='passwordCreate'
                      type='password'
                      placeholder='Enter your password'
                      value={passwordCreate}
                      onChange={onChangeCreate}
                      required
                    />
                  </label>
                  <label>
                    Confirm Password:
                    <input
                      name='password2'
                      id='password2'
                      type='password'
                      placeholder='Re-enter your password'
                      value={password2}
                      onChange={onChangeCreate}
                      required
                    />
                  </label>
                  <button type='submit'>Create Account</button>
                  <Separator>or</Separator>
                  <button type='button' onClick={() => setIsSignInForm(true)}>
                    Back to Sign In
                  </button>
                </Form>
              </>
            )}
            <CloseButton onClick={toggleModal}>×</CloseButton>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
}

////////////////////////////////////////////////////////////////////////////
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 3;
`;

const Logo = styled.a`
  padding: 0;
  width: 80px;
  margin-top: 4px;
  max-height: 70px;
  font-size: 0;
  display: inline-block;
  img {
    display: block;
    width: 100%;
  }
`;

const Navmenu = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: flex-end;
  margin: 0px;
  padding: 0px;
  position: relative;
  margin-right: auto;
  margin-left: 25px;

  a {
    display: flex;
    align-items: center;
    padding: 0 12px;

    img {
      height: 22px;
      min-width: 20px;
      width: 22px;
      z-index: auto;
    }

    span {
      color: rgb(249, 249, 249);
      font-size: 18px;
      letter-spacing: 1.42px;
      line-height: 1.08;
      padding: 2px 0px;
      white-space: nowrap;
      position: relative;

      &:before {
        background-color: rgb(249, 249, 249);
        border-radius: 0px 0px 4px 4px;
        bottom: -6px;
        content: '';
        opacity: 0;
        position: absolute;
        height: 2px;
        left: 0px;
        right: 0px;
        transform-origin: left center;
        transform: scaleX(0);
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        visibility: hidden;
        width: auto;
      }
    }

    &:hover span:before {
      transform: scaleX(1);
      visibility: visible;
      opacity: 1 !important;
    }
  }
`;

const Login = styled.a`
  font-size: 18px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: #090b13;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  text-align: center;
  color: #f9f9f9;
  position: relative;

  h2 {
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  label {
    text-align: left;
    font-size: 14px;

    input {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      border-radius: 4px;
      border: 1px solid #f9f9f9;
      background-color: rgba(255, 255, 255, 0.1);
      color: #f9f9f9;
    }
  }

  button {
    background-color: #1f80e0;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;

    &:hover {
      background-color: #4b92e0;
    }
  }
`;

const Separator = styled.div`
  margin: 10px 0;
  color: rgba(249, 249, 249, 0.6);
  font-size: 14px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #f9f9f9;
  font-size: 20px;
  cursor: pointer;
`;
