import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  border-width: 4px;
  border-style: solid;
  border-color: currentColor;
  border-right-color: transparent;
  vertical-align: -0.125em;
  animation: ${spinAnimation} 1s linear infinite;

  @media (prefers-reduced-motion) {
    animation: ${spinAnimation} 1.5s linear infinite;
  }
`;

const ScreenReaderText = styled.span`
  position: absolute;
  margin: -1px;
  height: 1px;
  width: 1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  padding: 0;
  clip: rect(0, 0, 0, 0);
`;

export const Spinner = () => (
  <LoadingSpinner role='status'>
    <ScreenReaderText>Loading...</ScreenReaderText>
  </LoadingSpinner>
);

export default Spinner;
