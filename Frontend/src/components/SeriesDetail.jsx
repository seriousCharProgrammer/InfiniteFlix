import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { toast } from 'react-toastify';
import { getSeriesDetails } from '../features/series/seriesSlice';

export default function SeriesDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tvDetails, loading, error } = useSelector((state) => state.series);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  // New state for seasons and episodes
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;

  // Enhanced useEffect to fetch seasons and episodes
  useEffect(() => {
    const fetchTVDetailsAndTrailer = async () => {
      console.log('Fetching TV details for ID:', id);
      setImagesLoaded(false);

      try {
        // Dispatch TV series details
        const detailsAction = await dispatch(getSeriesDetails(id));
        console.log('Details Action Result:', detailsAction);

        // Fetch seasons
        const seasonsResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=seasons`
        );
        const seasonsData = await seasonsResponse.json();

        // Filter out seasons with 0 episodes and sort
        /*
        const validSeasons = seasonsData.seasons
          .filter((season) => season.episode_count > 0)
          .sort((a, b) => a.season_number - b.season_number);
*/
        const validSeasons = seasonsData.seasons
          .filter(
            (season) => season.episode_count > 0 && season.season_number > 0
          )
          .sort((a, b) => a.season_number - b.season_number);
        setSeasons(validSeasons);

        // Automatically select first season
        if (validSeasons.length > 0) {
          await fetchSeasonEpisodes(validSeasons[0].season_number);
        }

        // Fetch trailer
        const trailerResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`
        );

        if (!trailerResponse.ok) {
          throw new Error(`HTTP error! status: ${trailerResponse.status}`);
        }

        const trailerData = await trailerResponse.json();
        console.log('Trailer Data:', trailerData);

        // Find the first trailer or teaser
        const trailer = trailerData.results.find(
          (video) => video.type === 'Trailer' || video.type === 'Teaser'
        );

        if (trailer) {
          setTrailerKey(trailer.key);
          console.log('Trailer Key:', trailer.key);
        } else {
          console.log('No trailer found');
        }
      } catch (error) {
        console.error('Error fetching TV details or trailer:', error);
        toast.error(`Failed to fetch TV series details: ${error.message}`);
      }
    };

    fetchTVDetailsAndTrailer();
  }, [dispatch, id, API_KEY]);

  // New function to fetch episodes for a specific season
  const fetchSeasonEpisodes = async (seasonNumber) => {
    try {
      const episodesResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`
      );
      const episodesData = await episodesResponse.json();

      setSelectedSeason(seasonNumber);
      setEpisodes(episodesData.episodes);

      // Automatically select first episode
      if (episodesData.episodes.length > 0) {
        setSelectedEpisode(episodesData.episodes[0]);
      }
    } catch (error) {
      console.error('Error fetching season episodes:', error);
      toast.error(`Failed to fetch season episodes: ${error.message}`);
    }
  };

  // Handlers for season and episode selection
  const handleSeasonSelect = (seasonNumber) => {
    fetchSeasonEpisodes(seasonNumber);
  };

  const handleEpisodeSelect = (episode) => {
    setSelectedEpisode(episode);
    setShowPlayer(true);
  };

  // Existing methods remain the same
  const handleTrailerClick = () => {
    if (trailerKey) {
      setShowTrailer(true);
    } else {
      toast.error('No trailer available for this TV series');
    }
  };

  const handlePlayClick = () => {
    if (selectedSeason && selectedEpisode) {
      setShowPlayer(true);
    } else if (seasons.length > 0) {
      // If no episode selected, select first season and first episode
      fetchSeasonEpisodes(seasons[0].season_number);
    } else {
      toast.error('No episodes available');
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === 'trailer-overlay') {
      setShowTrailer(false);
    }
    if (e.target.id === 'player-overlay') {
      setShowPlayer(false);
    }
  };

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const onBackButton = () => {
    navigate(-1);
  };

  const handleGroupWatchClick = () => {
    const tvUrl = `https://your-website.com/series/${id}`;
    navigator.clipboard
      .writeText(tvUrl)
      .then(() => {
        toast.success(
          `The link to the TV series: ${tvDetails.name} copied, Enjoy sharing it with friends 🤩`
        );
      })
      .catch((err) => {
        console.error('Error copying link: ', err);
      });
  };

  // Add error logging to rendering
  if (error) {
    return (
      <ErrorContainer>
        <h2>Error Loading TV Series</h2>
        <p>{error}</p>
      </ErrorContainer>
    );
  }
  const toggleWatchlist = (id) => {
    // Retrieve the current watchlist from localStorage or state
    let watchlist = JSON.parse(localStorage.getItem('watchlistseries')) || [];

    // Check if the movie is already in the watchlist
    const isInWatchlist = watchlist.some((item) => item.id === id);

    let updatedWatchlist;

    if (isInWatchlist) {
      // Remove from watchlist
      updatedWatchlist = watchlist.filter((item) => item.id !== id);
    } else {
      // Add to watchlist
      updatedWatchlist = [...watchlist, { id }];
    }

    // Save the updated watchlist back to localStorage or state
    localStorage.setItem('watchlistseries', JSON.stringify(updatedWatchlist));

    // Optionally, trigger a toast notification
    if (isInWatchlist) {
      toast.success('Movie removed from your watchlist');
    } else {
      toast.success('Movie added to your watchlist');
    }
  };

  return (
    <Container>
      {loading ? (
        <LoadingSpinner>
          <div className='spinner'></div>
          <p>Loading movie details...</p>
        </LoadingSpinner>
      ) : tvDetails ? (
        <>
          {/* Existing background and content */}
          <Background>
            <img
              alt={tvDetails.name}
              src={`https://image.tmdb.org/t/p/original${tvDetails.backdrop_path}`}
              onLoad={handleImageLoad}
            />
          </Background>
          <ImageTitle isLoading={!imagesLoaded}>
            <img
              src={`https://image.tmdb.org/t/p/original${tvDetails.poster_path}`}
              alt={tvDetails.name}
              onLoad={handleImageLoad}
            />
          </ImageTitle>
          <ContentMeta>
            <Controls>
              <Player onClick={handlePlayClick}>
                <img src='/images/play-icon-black.png' alt='Play' />
                <span>Play</span>
              </Player>
              <Trailer onClick={handleTrailerClick}>
                <img src='/images/play-icon-white.png' alt='Trailer' />
                <span>Trailer</span>
              </Trailer>
              <AddList onClick={() => toggleWatchlist(id)}>
                <span />
                <span />
              </AddList>
              <GroupWatch onClick={handleGroupWatchClick}>
                <div>
                  <img src='/images/group-icon.png' alt='Group Watch' />
                </div>
              </GroupWatch>
              <BackButton onClick={onBackButton}>
                <div>
                  <img src='/images/back-button.png' alt='Back' />
                </div>
              </BackButton>
            </Controls>
            <SubTitle>
              <div>{tvDetails.name || 'Subtitle'}</div>
              <div>First Air Date: {tvDetails.first_air_date || ''}</div>
              <div>Seasons: {tvDetails.number_of_seasons || 0}</div>
            </SubTitle>
            <Description>
              {tvDetails.overview || 'No description available.'}
            </Description>
          </ContentMeta>

          {/* Seasons Selection Section */}
          {seasons.length > 0 && (
            <SeasonsContainer>
              <SectionTitle>Seasons</SectionTitle>
              <SeasonsList>
                {seasons.map((season) => (
                  <SeasonButton
                    key={season.season_number}
                    onClick={() => handleSeasonSelect(season.season_number)}
                    active={selectedSeason === season.season_number}
                  >
                    Season {season.season_number}
                  </SeasonButton>
                ))}
              </SeasonsList>

              {/* Episodes Selection */}
              {selectedSeason && (
                <>
                  <SectionTitle>
                    Episodes (Season {selectedSeason})
                  </SectionTitle>
                  <EpisodesList>
                    {episodes.map((episode) => (
                      <EpisodeCard
                        key={episode.id}
                        onClick={() => handleEpisodeSelect(episode)}
                      >
                        <EpisodeImage
                          src={`https://image.tmdb.org/t/p/w200${episode.still_path}`}
                          alt={`Episode ${episode.episode_number}`}
                        />
                        <EpisodeDetails>
                          <h3>
                            Episode {episode.episode_number}: {episode.name}
                          </h3>
                          <p>{episode.overview}</p>
                        </EpisodeDetails>
                      </EpisodeCard>
                    ))}
                  </EpisodesList>
                </>
              )}
            </SeasonsContainer>
          )}

          {/* Trailer Overlay */}
          {showTrailer && trailerKey && (
            <TrailerOverlay id='trailer-overlay' onClick={handleOutsideClick}>
              <TrailerIframeContainer>
                <iframe
                  width='100%'
                  height='100%'
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                  allowFullScreen
                  allow='autoplay; encrypted-media'
                  title='Trailer'
                />
                <CloseButton onClick={handleCloseTrailer}>X</CloseButton>
              </TrailerIframeContainer>
            </TrailerOverlay>
          )}

          {/* Player Overlay with Episode Details */}
          {showPlayer && selectedEpisode && (
            <PlayerOverlay id='player-overlay' onClick={handleOutsideClick}>
              <PlayerIframeContainer>
                <iframe
                  width='100%'
                  height='100%'
                  src={` https://embed.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`}
                  allowFullScreen
                  allow='autoplay; encrypted-media'
                  title={`${tvDetails.name} - S${selectedSeason}E${selectedEpisode.episode_number}`}
                />

                <CloseButton onClick={handleClosePlayer}>X</CloseButton>
              </PlayerIframeContainer>
            </PlayerOverlay>
          )}
        </>
      ) : (
        <ErrorContainer>
          <h2>No TV Series Details Found</h2>
        </ErrorContainer>
      )}
    </Container>
  );
}

// New Styled Components for Seasons and Episodes
const SeasonsContainer = styled.div`
  margin-top: 20px;
  color: white;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 15px;
`;

const SeasonsList = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const SeasonButton = styled.button`
  background-color: ${(props) =>
    props.active ? 'rgb(249, 249, 249)' : 'rgba(0, 0, 0, 0.6)'};
  color: ${(props) => (props.active ? 'black' : 'white')};
  border: 2px solid white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: rgb(200, 200, 200);
  }
`;

const EpisodesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const EpisodeCard = styled.div`
  display: flex;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const EpisodeImage = styled.img`
  width: 200px;
  height: 112px;
  object-fit: cover;
`;

const EpisodeDetails = styled.div`
  padding: 10px;
  color: white;

  h3 {
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    opacity: 0.7;
  }
`;

const EpisodeInfoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
`;

// Existing styled components remain the same
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
`;

// Existing styled components from your original code
const Container = styled.div`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`;
/*
const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 24px;
  font-weight: bold;
`;
*/
const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background: black;

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const Background = styled.div`
  left: 0px;
  opacity: 0.8;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: -1;

  img {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    @media (max-width: 768px) {
      width: initial;
    }
  }
`;

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
  height: 30vw;
  min-height: 170px;
  padding-bottom: 24px;
  width: 100%;

  img {
    max-width: 350px;
    min-width: 200px;
    width: 35vw;
    @media (max-width: 768px) {
      max-width: 90px;
      min-width: 90px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 1851px) {
      max-width: 300px;
      min-width: 250px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 1600px) {
      max-width: 250px;
      min-width: 250px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 1340px) {
      max-width: 200px;
      min-width: 150px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 1080px) {
      max-width: 180px;
      min-width: 150px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 980px) {
      max-width: 160px;
      min-width: 150px;
      width: 35vw;
    }
  }
`;

const ContentMeta = styled.div`
  max-width: 874px;
`;

const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 24px 0;
  min-height: 56px;
`;

const Player = styled.button`
  font-size: 15px;
  margin: 0 22px 0 0;
  padding: 0 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  background: rgb(249, 249, 249);
  border: none;
  color: rgb(0, 0, 0);

  img {
    width: 32px;
  }

  &:hover {
    background: rgb(198, 198, 198);
  }
  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;

    img {
      width: 25px;
    }
  }
`;

const Trailer = styled(Player)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`;

const AddList = styled.div`
  margin-right: 16px;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;

    &:first-child {
      height: 2px;
      transform: translate(1px, 0) rotate(0deg);
      width: 16px;
    }

    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
  }

  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;
  }
`;

const GroupWatch = styled.div`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;

  div {
    height: 40px;
    width: 40px;
    background: rgb(0, 0, 0);
    border-radius: 50%;
    img {
      width: 100%;
    }
  }
`;

const BackButton = styled.div`
  margin-left: 10px;
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;

  div {
    height: 40px;
    width: 40px;
    background: rgb(249, 249, 249);
    border-radius: 50%;
    img {
      width: 100%;
    }
  }
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  display: flex;
  gap: 10px;
  font-family: Avenir-Roman, sans-serif;
  font-size: 17px;
  min-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0;
  color: rgb(249, 249, 249);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TrailerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TrailerIframeContainer = styled.div`
  position: relative;
  width: 80vw;
  height: 45vw;
  max-width: 900px;
  max-height: 500px;
  iframe {
    border-radius: 8px;
  }
`;

const PlayerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayerIframeContainer = styled.div`
  position: relative;
  width: 80vw;
  height: 45vw;
  max-width: 900px;
  max-height: 500px;
  iframe {
    border-radius: 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 7px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;
