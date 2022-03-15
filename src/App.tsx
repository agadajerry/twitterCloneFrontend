import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import BookMarksPage from "././Components/BookMarksPage";
import ExplorePage from "./Components/ExplorePage";
import TrendingDesktopPage from "./Components/TrendingDesktopPage";
import TrendingMobilePage from "./Components/TrendingMobilePage";
// import Chat from "./pages/chat/Chat";
import Chat2 from "./pages/chat/Chat2"
import AuthProvider from "./context/Auth.context";

import TrendsController from "./Components/TrendsController";
import Login from "./pages/authentication/Login/Login";
import Signup from "./pages/authentication/Signup/Signup";
import Follower from "./Components/Follower/follower";
import Following from "./Components/Following/following";
import ChangePassword from "./Components/changePassword/changePassword";

import Navbar from "./Components/NavBar/Nav";
import Tweet from "./Components/Tweet/Tweet";
import FollowingProvider from "./Components/FollowingProvider";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings";
import Social from "./pages/authentication/Login/Social";

import { UserContext } from "./hooks/useContext";
import {
  getUserData,
  getUserToken,
  isLoggedIn,
} from "./hooks/useLogin";
import TweetContent from "./Components/TweetContent";
import Forgotpassword from "./pages/authentication/resetpassword/Forgotpassword";
import SingleTweet from "./pages/profile/SingleTweet";
import { useState } from "react";
import { LanguageContext } from "./context/test.context";
function App() {
  isLoggedIn();
  let USERDATA = getUserData();
    const [language, setLanguage] = useState("en");
    const value :any= { language, setLanguage };
    const [user, setUser] = useState(USERDATA);
    // setUser(USERDATA);
    const userData :any= { user, setUser };
  return (
    <UserContext.Provider value={userData}>
      <LanguageContext.Provider value={value}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* <Route path="/" element={<Profile />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/social/:user" element={<Social />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/forgot-password" element={<Forgotpassword />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/trends/:id" element={<TrendsController />} />
              <Route path="/trending" element={<TrendingMobilePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/bookmark" element={<BookMarksPage />} />
              <Route path="/chat" element={<Chat2 />} />
              <Route path="/tweet/desktoptrending" element={<TrendingDesktopPage />} />
              <Route path="/setting" element={<Settings />} />
              <Route path="/follower" element={<Follower />} />
              <Route path="/following" element={<Following />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/tweetcomment/:id" element={<SingleTweet />} />
              <Route
                path="/"
                element={
                  <FollowingProvider>
                    {" "}
                    <TweetContent />{" "}
                  </FollowingProvider>
                }
              />
              <Route
                path="/home"
                element={
                  <FollowingProvider>
                    {" "}
                    <TweetContent />{" "}
                  </FollowingProvider>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
