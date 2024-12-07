import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import SeriesCard from './SeriesCard';

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Ref to track the last element for intersection observer
  const observerRef = useRef();

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchSeries = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const API_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`;
      const response = await axios.get(API_URL);
      const newSeries = response.data.results;

      if (newSeries.length === 0) {
        setHasMore(false);
      } else {
        // Use a Set to ensure unique series across all pages
        setSeries((prevSeries) => {
          const seriesSet = new Set(prevSeries.map((s) => s.id));
          const uniqueSeries = newSeries.filter((s) => !seriesSet.has(s.id));
          return [...prevSeries, ...uniqueSeries];
        });

        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching series:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchSeries();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchSeries, hasMore, loading]);

  // Initial fetch
  useEffect(() => {
    fetchSeries();
  }, []);

  return (
    <PageContainer>
      <MoviesGrid>
        {series.map((serie, index) => (
          <SeriesCard
            key={serie.id}
            serie={serie}
            ref={index === series.length - 1 ? observerRef : null}
          />
        ))}
      </MoviesGrid>
      {loading && <Loading>Loading...</Loading>}
      {!hasMore && <EndMessage>No more series to show!</EndMessage>}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 20px;
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
`;

const EndMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: gray;
`;

export default SeriesPage;
