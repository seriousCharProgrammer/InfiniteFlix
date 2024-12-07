import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
const CustomToastContainer = styled(ToastContainer).attrs({
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
})`
  .Toastify__toast {
    background: #1a1d28; /* Dark background with a subtle depth */
    color: #f9f9f9; /* Bright text for contrast */
    border-radius: 12px; /* Rounded corners for a smoother look */
    font-size: 17px;
    font-weight: 400;
    padding: 12px 20px;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3); /* Subtle shadow for elegance */
    transition: all 0.3s ease-in-out;
    border: 1px solid #2e3743; /* Soft border with a muted contrast */
  }

  /* Success Toast */
  .Toastify__toast--success {
    background: linear-gradient(
      135deg,
      #1a68c1,
      #0f4f8b
    ); /* Darker blue gradient for success */
    color: #e3f2fd; /* Soft, bright blue text */
    box-shadow: 0px 6px 18px rgba(30, 144, 255, 0.2); /* Light blue shadow */
  }

  /* Error Toast */
  .Toastify__toast--error {
    background: linear-gradient(
      135deg,
      #e02f4b,
      #c12f46
    ); /* Smooth red gradient for error */
    color: #ffebee; /* Soft pinkish white text */
    box-shadow: 0px 6px 18px rgba(255, 0, 0, 0.3); /* Slight red shadow */
  }

  /* Info Toast */
  .Toastify__toast--info {
    background: linear-gradient(
      135deg,
      #4b92e0,
      #12335c
    ); /* Cool blue gradient for info */
    color: #dbe8ff; /* Light bluish-white text */
    box-shadow: 0px 6px 18px rgba(67, 128, 255, 0.2); /* Light blue glow effect */
  }

  /* Progress Bar */
  .Toastify__progress-bar {
    background: #ffffff; /* Elegant white progress bar */
    height: 4px;
    border-radius: 4px;
  }

  /* Close Button */
  .Toastify__close-button {
    color: #f9f9f9;
    font-size: 18px;
    font-weight: 600;
    opacity: 0.7;
    transition: opacity 0.3s ease-in-out;

    &:hover {
      opacity: 1; /* Make the close button fully visible on hover */
    }
  }

  /* Adding a smooth fade-in and fade-out animation */
  .Toastify__toast-enter {
    opacity: 0;
    transform: translateY(-20px);
  }

  .Toastify__toast-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.3s ease-in-out;
  }

  .Toastify__toast-exit {
    opacity: 1;
  }

  .Toastify__toast-exit-active {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease-in-out;
  }
`;

export default CustomToastContainer;
