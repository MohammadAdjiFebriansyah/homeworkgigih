import './App.css';
import CreatePlaylist from './Container/CreatePlaylist';
import { useLocation, Switch, Route } from 'react-router-dom';
import Auth from './Container/Auth';
import GuardRoute from './components/GuardRoute';
import NotFound from './Container/NotFound';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/index';
import { login, logout } from './TokenSlice/index';

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const accessTokenState = useAppSelector((state) => state.auth.accessToken);

  
  return (
      <Switch>
        <GuardRoute path="/create-playlist" type="private" exact>
          <CreatePlaylist />
        </GuardRoute>
        <GuardRoute path="/" type="guest" exact>
          <Auth />
        </GuardRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
  );
}

export default App;
