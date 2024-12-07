import React from 'react';

import styled from 'styled-components';
import ImgSlider from './ImgSlider';
import Viewers from './Viewers';
import Recommends from './Recommends';
import NewMovies from './NewMovies';
import Oldies from './Oldies';
import TrendingMovies from './TrendingMovies';

export default function Home() {
  return (
    <Container>
      <ImgSlider />
      <Viewers />
      <Recommends />
      <NewMovies />
      <TrendingMovies />
      <Oldies />
    </Container>
  );
}

const Container = styled.main`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);

  &:after {
    background: url('/images/home-background.png') center center / cover
      no-repeat fixed;

    content: '';
    position: absolute;
    inset: 0px;
    opacity: 1;
    z-index: -1;
  }
`;
