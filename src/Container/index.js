import React, { useEffect, useState } from 'react'
import Tracks from '../components/Tracks';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import CreatePlaylistSpotify from '../components/CreatePlaylist';
import { getUserProfile } from '../lib/fetchApi.js';
import { toast } from 'react-toastify';
import { useDocumentTitle } from '../lib/customHooks';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../TokenSlice';
import "./index.css";

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [selectedTracksUri, setSelectedTracksUri] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [isInSearch, setIsInSearch] = useState(false);
  const isAuthorize = useSelector((state) => state.auth.isAuthorize);
  const dispatch = useDispatch();

   useDocumentTitle('Home - Spotify');

  useEffect(() => {
    const accessTokenParams = new URLSearchParams(window.location.hash).get('#access_token');

    if (accessTokenParams !== null) {
      const setUserProfile = async () => {
        try {
          const responseUser = await getUserProfile(accessTokenParams);
          dispatch(login({
            accessToken: accessTokenParams,
            user: responseUser
          }));
        } catch (e) {
          toast.error(e);
        }
      }

      setUserProfile();
    }
  }, []);

  useEffect(() => {
    if (!isInSearch) {
      setTracks(selectedTracks);
    }
  }, [selectedTracksUri, selectedTracks, isInSearch]);

  const getSpotifyLinkAuthorize = () => {
    const state = Date.now().toString();
    const clientId = "c3674ca69601470ebbf98c96ec75c3bd";

    return `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=http://localhost:3000/`;
  }

  const onSuccessSearch = (searchTracks) => {
    setIsInSearch(true);

    const selectedSearchTracks = searchTracks.filter((track) => selectedTracksUri.includes(track.uri));

    setTracks([...new Set([...selectedSearchTracks, ...searchTracks])])
  }


  const clearSearch = () => {
    setTracks(selectedTracks);
    setIsInSearch(false);
  }

  const toggleSelect = (track) => {
    const uri = track.uri;

    if (selectedTracksUri.includes(uri)) {
      setSelectedTracksUri(selectedTracksUri.filter((item) => item !== uri));
      setSelectedTracks(selectedTracks.filter((item) => item.uri !== uri));
    } else {
      setSelectedTracksUri([...selectedTracksUri, uri]);
      setSelectedTracks([...selectedTracks, track]);
    }
  }

  return (
    <>
      {!isAuthorize && (
        <main className="center">
          <p>Login your accounts</p>
          <Button href={getSpotifyLinkAuthorize()}>Login</Button>
        </main>
      )}

      {isAuthorize && (
        <main className="container" id="home">
          <CreatePlaylistSpotify uriTracks={selectedTracksUri}
          />

          <hr />

          <SearchBar
            onSuccess={onSuccessSearch}
            onClearSearch={clearSearch}
          />

          <div className="content">
            {tracks.length === 0 && (
              <p>No tracks</p>
            )}

            <div className="tracks">
              {tracks.map((track) => (
                <Tracks
                  key={track.id}
                  imageUrl={track.album.images[0].url}
                  title={track.name}
                  artist={track.artists[0].name}
                  select={selectedTracksUri.includes(track.uri)}
                  toggleSelect={() => toggleSelect(track)}
                />
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
}