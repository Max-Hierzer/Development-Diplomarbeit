// App.js
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import WriteMessages from './messages/WriteMessage';
import InputMessage from './messages/InputMessage';
import Login from './usermanagment/Login';
import PollDashboard from './selectPolls/PollDashboard';
import PublicPolls from './publicPolls/publicPolls';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isInputMode, setIsInputMode] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    return storedLoginStatus ? JSON.parse(storedLoginStatus) : false;
  });
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || 0);
  const [userName, setUserName] = useState(sessionStorage.getItem('userName') || '');
  const [userRoleId, setUserRoleId] = useState(sessionStorage.getItem('userRoleId') || 0);
  const [isPublic, setIsPublic] = useState(null);
  const [displayMode, setDisplayMode] = useState(0);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [newUserRegistration, setNewUserRegistration] = useState(null);
  const [newUserLink, setNewUserLink] = useState(null);

  useEffect(() => {
    // Save login state to sessionStorage whenever it changes
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('userName', userName);
    sessionStorage.setItem('userRoleId', userRoleId);
  }, [isLoggedIn, userId, userName, userRoleId]);

  const handleLoginChange = (loginMode, userId, userName, userRoleId) => {
    setIsLoggedIn(loginMode);
    setUserId(userId);
    setUserName(userName);
    setUserRoleId(userRoleId);
    setDisplayMode(0);
    setSelectedPoll(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(0);
    setUserName('');
    setUserRoleId(0);
    sessionStorage.clear(); // Clear session storage on logout
  };


  useEffect(() => {
    const linkParam = window.location.search.substring(1);
    if (linkParam) {
      const unhashed = atob(decodeURIComponent(linkParam));
      const params = new URLSearchParams(unhashed);
      const newUser = params.get('newUser');
      const link = params.get('link');
      if (newUser === "true" || link) {
        setNewUserRegistration(1);
        setNewUserLink(link);
      } else {
        const publicValue = params.get('public');
        if (publicValue === "true") {
          setIsPublic(1);
        } else {
          setIsPublic(0);
        }
      }
    }
  }, []);


  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} setDisplayMode={setDisplayMode} setSelectedPoll={setSelectedPoll} userRoleId={userRoleId} />
      <main>
        {!newUserRegistration ? (
          !isPublic ? (
            !isLoggedIn ? (
              // Render the login component if the user is not logged in
              <div className='Usermanagement'>
                <div>
                  <h1>Wilkommen zu unserem Umfragetool</h1>
                  <Login loginChange={handleLoginChange} />
                  <h2>Bitte melden Sie sich an um fortzufahren</h2>
                </div>
              </div>
            ) : (
              // Render the main content if the user is logged in
              <div className='MainContent'>
              <p className="user-text">Hallo, {userName}!</p>
                  <PollDashboard userId={userId} userName={userName} userRoleId={userRoleId} setDisplayMode={setDisplayMode} displayMode={displayMode} setSelectedPoll={setSelectedPoll} selectedPoll={selectedPoll} />
                  {/* <div className='Messenger'>
                    <h1>{isInputMode ? 'Submit a Message' : 'Messages'}</h1>

                    <button onClick={() => setIsInputMode(!isInputMode)}>
                      Switch to {isInputMode ? 'View Messages' : 'Submit a Message'}
                    </button>
                    {isInputMode ? (
                      <InputMessage />
                    ) : (
                      <WriteMessages />
                    )}
                  </div> */}
              </div>
            )) : (
              <PublicPolls />
            )
        ) : (
          <newUser link={newUserLink}/>
        )
        }
      </main>
      <Footer />
    </div>
  );
}

export default App;
