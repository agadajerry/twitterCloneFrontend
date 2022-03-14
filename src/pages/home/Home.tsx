import React, { useContext } from "react";
import Navbar from "../../Components/NavBar/Nav";
import { UserContext } from "../../hooks/useContext";

const Home = () => {
  const { user, setUser }: any = useContext(UserContext);

  // const msg=useContext(UserContext)
  return (
    <div>
      <Navbar />
      <h1>Tweeter Team A</h1>
    </div>
  );
};

export default Home;
