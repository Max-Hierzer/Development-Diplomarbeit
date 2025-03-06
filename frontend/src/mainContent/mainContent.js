import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import WriteMessages from '../messages/WriteMessage';
import InputMessage from '../messages/InputMessage';
import Login from '../usermanagment/Login';
import PollDashboard from '../selectPolls/PollDashboard';


function MainContent({ isLoggedIn, handleLoginChange, userId, userName, userRoleId, setSelectedPoll, selectedPoll }) {
  const location = useLocation();

  const getDisplayMode = () => {
    switch (location.pathname) {
      case "/registrierung": return 5;
      case "/erstellen": return 6;
      case "/bearbeiten": return 1;
      case "/abstimmen": return 2;
      case "/ergebnisse": return 3;
      case "/meine-umfragen": return 4;
      case "/gruppen": return 7;
      default: return 0;
    }
  };

  const displayMode = getDisplayMode();

  return (
    <Routes>
      <Route
        path="/"
        element={!isLoggedIn ? <Login loginChange={handleLoginChange} /> : <Navigate to="/home" />}
      />
      <Route
        path="/home"
        element={
          isLoggedIn ? (
            <PollDashboard
              userId={userId}
              userName={userName}
              userRoleId={userRoleId}
              displayMode={displayMode}
              setSelectedPoll={setSelectedPoll}
              selectedPoll={selectedPoll}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default MainContent;
