import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import BookMarksPage from "././Components/BookMarksPage";
import ExplorePage from "./Components/ExplorePage";
import TrendingDesktopPage from "./Components/TrendingDesktopPage";
import TrendingMobilePage from "./Components/TrendingMobilePage";
import Chat from "./pages/chat/Chat";
import Chat2 from "./pages/chat/Chat2"
import AuthProvider from "./context/Auth.context";

import TrendsController from "./Components/TrendsController";
import Login from "./pages/authentication/Login/Login";
import Signup from "./pages/authentication/Signup/Signup";
import Following from "./Components/Following/following";
import ChangePassword from "./Components/changePassword/changePassword";

import Navbar from "./Components/NavBar/Nav";
import Tweet from "./Components/Tweet/Tweet";
import FollowingProvider from "./Components/FollowingProvider";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings";

import { UserContext } from "./hooks/useContext";
import {
  getUserData,
  useLogin,
  getUserToken,
  isLoggedIn,
} from "./hooks/useLogin";
import TweetContent from "./Components/TweetContent";
function App() {
  isLoggedIn();
  let USERDATA = getUserData();
  return (
    <UserContext.Provider value={USERDATA}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* <Route path="/" element={<Profile />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/trends/:id" element={<TrendsController />} />
            <Route path="/trending" element={<TrendingMobilePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/bookmark" element={<BookMarksPage />} />
            <Route path="/chat" element={<Chat2 />} />
            <Route
              path="/tweet/desktoptrending"
              element={<TrendingDesktopPage />}
            />
            <Route path="/setting" element={<Settings />} />
            <Route path="/following" element={<Following />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route
              path="/"
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
    </UserContext.Provider>
  );
}

export default App;
