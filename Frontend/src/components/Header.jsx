import React, { useState } from 'react';
import styled from 'styled-components';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { login, register, logout, reset } from '../features/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsSignInForm(true);
  };

  const showCreateAccountForm = () => {
    setIsSignInForm(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          setIsModalOpen(false);
          setIsMobileMenuOpen(false); // Close mobile menu
          navigate('/home');
        })
        .catch((error) => {
          if (error.response) {
            toast.error(
              `Error: ${error.response.data.message || 'Something went wrong'}`
            );
          } else if (error.request) {
            toast.error('Network error, please try again later.');
          } else {
            toast.error(
              `Error: ${error.message} Please try later or try changing the email address`,
              { position: 'top-center' }
            );
          }
        });
    }
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();

    const userData = {
      email: email.toLowerCase(),
      password,
    };

    dispatch(login(userData))
      .unwrap()
      .then((user) => {
        toast.success(`🥳 Welcome back ${capitalizeFirstLetter(user.name)} 🥳`);
        setIsModalOpen(false);
        setIsMobileMenuOpen(false); // Close mobile menu
        navigate('/home');
      })
      .catch(toast.error);
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    toast.success('Logout Successfully ✅ ');
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    navigate('/');
  };
  /*
  const navigation = (string) => {
    return navigate(string);
  };
*/
  const closeAllMenus = () => {
    setIsModalOpen(false);
    setIsMobileMenuOpen(false);
    setIsSignInForm(true);
  };

  const openMobileLoginModal = () => {
    toggleModal(); // Open modal
    setIsMobileMenuOpen(false); // Close mobile menu
  };

  if (isLoading) {
    return <Spinner />;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Close mobile menu and search modal
      closeAllMenus();

      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);

      // Reset search query
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Modify existing navigation items
  const navItems = [
    {
      icon: '../images/home-icon.svg',
      label: 'Home',
      path: '/home',
    },
    {
      icon: '../images/search-icon.svg',
      label: 'Search',
      action: toggleSearch,
    },
    {
      icon: '../images/watchlist-icon.svg',
      label: 'Watchlist',
      path: '/watchlist',
    },
    {
      icon: '../images/original-icon.svg',
      label: 'Originals',
      path: '/originals',
    },
    {
      icon: '../images/movie-icon.svg',
      label: 'Movies',
      path: '/movies',
    },
    {
      icon: '../images/series-icon.svg',
      label: 'Series',
      path: '/series',
    },
  ];

  return (
    <>
      <Nav>
        <Logo>
          <img src='../images/logo3.png' alt='disney_logo' />
        </Logo>
        <DesktopNavmenu user={user}>
          {user ? (
            <Navmenu>
              <a
                onClick={() => {
                  navigate('/home');
                }}
              >
                <img src='../images/home-icon.svg' alt='Home' />
                <span>Home</span>
              </a>
              <a
                onClick={() => {
                  setIsSearchOpen(true);
                }}
              >
                <img src='../images/search-icon.svg' alt='Search' />
                <span>Search</span>
              </a>
              <a
                onClick={() => {
                  navigate('/watchlist');
                }}
              >
                <img src='../images/watchlist-icon.svg' alt='Watchlist' />
                <span>Watchlist</span>
              </a>
              <a
                onClick={() => {
                  navigate('/originals');
                }}
              >
                <img src='../images/original-icon.svg' alt='Originals' />
                <span>Originals</span>
              </a>
              <a
                onClick={() => {
                  navigate('/movies');
                }}
              >
                <img src='../images/movie-icon.svg' alt='Movies' />
                <span>Movies</span>
              </a>
              <a
                onClick={() => {
                  navigate('/series');
                }}
              >
                <img src='../images/series-icon.svg' alt='Series' />
                <span>Series</span>
              </a>
            </Navmenu>
          ) : (
            <Login onClick={toggleModal}>Login</Login>
          )}
        </DesktopNavmenu>
        <MobileMenuToggle onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuToggle>
        {user && <Logout onClick={onLogout}>Logout</Logout>}{' '}
        {/* Desktop and Mobile Search Modals */}
        {isSearchOpen && (
          <SearchOverlay>
            <SearchModal onSubmit={handleSearchSubmit}>
              <input
                type='text'
                placeholder='Search movies, series...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <SearchButton type='submit'>Search</SearchButton>
              <CloseSearchButton onClick={() => setIsSearchOpen(false)}>
                ×
              </CloseSearchButton>
            </SearchModal>
          </SearchOverlay>
        )}
      </Nav>

      {/* Existing mobile menu code */}
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileMenuContent>
          <CloseButton onClick={closeAllMenus}>×</CloseButton>
          {user ? (
            <>
              <MobileNavmenu>
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    onClick={() => {
                      closeAllMenus();
                      if (item.path) {
                        navigate(item.path);
                      } else if (item.action) {
                        item.action();
                      }
                    }}
                  >
                    <img src={item.icon} alt={item.label} />
                    <span>{item.label}</span>
                  </a>
                ))}
              </MobileNavmenu>
              <MobileLogout onClick={onLogout}>Logout</MobileLogout>
            </>
          ) : (
            <MobileLogin onClick={openMobileLoginModal}>Login</MobileLogin>
          )}
        </MobileMenuContent>
      </MobileMenu>

      {isModalOpen && (
        <ModalOverlay>
          <Modal>
            {' '}
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
const Logout = styled.a`
  color: #f9f9f9;
  font-size: 18px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;

  @media screen and (max-width: 890px) {
    display: none;
  }

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`;
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

const DesktopNavmenu = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 890px) {
    display: none;
  }
`;

const Navmenu = styled.div`
  cursor: pointer;
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #f9f9f9;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;

  label {
    display: flex;
    flex-direction: column;
    text-align: left;
    font-size: 14px;
    color: #f9f9f9;
  }

  input {
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #333;
    border-radius: 4px;
    background-color: #1a1a2e;
    color: #f9f9f9;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #4a4e69;
    }
  }

  button {
    padding: 12px;
    background-color: #0072ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 15px 0;
  color: #888;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #333;
  }

  &::before {
    margin-right: 10px;
  }

  &::after {
    margin-left: 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #f9f9f9;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ff4136;
  }
`;

const MobileMenuToggle = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  @media screen and (max-width: 890px) {
    display: flex;
  }

  span {
    height: 3px;
    width: 25px;
    background-color: #f9f9f9;
    margin: 3px 0;
    transition: all 0.3s ease;
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media screen and (max-width: 890px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #090b13;
    z-index: 1000;
    overflow-y: auto;
  }
`;

const MobileMenuContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MobileNavmenu = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;

  a {
    display: flex;
    align-items: center;
    color: #f9f9f9;
    text-decoration: none;
    font-size: 18px;

    img {
      width: 24px;
      margin-right: 15px;
    }
  }
`;

const MobileLogin = styled(Login)`
  margin-top: auto;
  align-self: center;
  width: 100%;
  text-align: center;
`;

const MobileLogout = styled(Logout)`
  margin-top: auto;
  align-self: center;
  width: 100%;
  text-align: center;
  display: flex !important; // Override any previous display: none
  visibility: visible !important;
`;
// Add these new styled components
const SearchOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const SearchModal = styled.form`
  background: #090b13;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  display: flex;
  align-items: center;
  position: relative;

  input {
    flex-grow: 1;
    padding: 12px;
    background-color: #1a1a2e;
    border: 1px solid #333;
    border-radius: 4px;
    color: #f9f9f9;
    margin-right: 10px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #0072ff;
    }
  }
`;

const SearchButton = styled.button`
  background-color: #0072ff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const CloseSearchButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #f9f9f9;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ff4136;
  }
`;
