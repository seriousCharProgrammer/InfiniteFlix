import React, { useEffect } from 'react';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { getPopularMovies } from '../features/movie/movieSlice';
import { useNavigate } from 'react-router';
export default function ImgSlider() {
  const dispatch = useDispatch();
  const { popularMovies } = useSelector((state) => state.movies);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPopularMovies());
  }, [dispatch]);

  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    pauseOnHover: true,
    fade: true, // Adds a smooth fade transition between slides
    arrows: false, // Hide default arrows for custom styling
  };

  return (
    <CarouselContainer>
      <Carousel {...settings}>
        {popularMovies &&
          popularMovies.slice(0, 5).map((movie) => (
            <Wrap key={movie.id}>
              <MovieSlide
                onClick={() => {
                  navigate(`/movies/${movie.id}`);
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt={movie.title}
                />
                <MovieOverlay>
                  <MovieInfo>
                    <h2>{movie.title}</h2>
                    <p>{movie.overview.substring(0, 150)}...</p>
                    <Rating>
                      <span>★</span> {movie.vote_average.toFixed(1)}
                    </Rating>
                  </MovieInfo>
                </MovieOverlay>
              </MovieSlide>
            </Wrap>
          ))}
      </Carousel>
    </CarouselContainer>
  );
}

const CarouselContainer = styled.div`
  cursor: pointer;
  position: relative;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
`;

const Carousel = styled(Slider)`
  .slick-dots {
    bottom: 20px;

    li {
      margin: 0 5px;

      button:before {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.5);
        opacity: 0.5;
        transition: all 0.3s ease;
      }

      &.slick-active button:before {
        color: white;
        opacity: 1;
        font-size: 12px;
      }
    }
  }
`;

const Wrap = styled.div`
  position: relative;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
`;

const MovieSlide = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.5s ease;
  }

  &:hover {
    img {
      transform: scale(1.05);
    }
  }
`;

const MovieOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  padding: 50px 5%;
  display: flex;
  align-items: flex-end;
  color: white;
`;

const MovieInfo = styled.div`
  max-width: 600px;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 15px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 1rem;
    margin-bottom: 15px;
    opacity: 0.9;
    line-height: 1.4;
  }
`;

const Rating = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 20px;

  span {
    color: gold;
    margin-right: 5px;
    font-size: 1.2rem;
  }
`;
