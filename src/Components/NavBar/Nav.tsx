import { FaTwitter } from "react-icons/fa";
import { MdGroup, MdSettings, MdLogout, MdArrowDropDown } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import classes from "./Nav.module.css";
import { Link, NavLink } from "react-router-dom";
import {logOut} from '../../hooks/useLogin';
import {AuthContext} from '../../context/Auth.context'
import { useContext } from "react";


const Navbar = () => {

  const {user} = useContext(AuthContext);


  return (
    <div className={classes.wrapper}>
      <nav>
        <div className={classes.logo}>
          <NavLink to="/">
            <span>
              <FaTwitter className={classes.icon} />
              <span className={classes.theme}>Tweeter</span>
            </span>
          </NavLink>
        </div>

        <div className={classes.menu}>
          <div className={classes.navlinks}>
            <NavLink
              className={classes.linkedNav}
              style={({ isActive }) => {
                return {
                  borderBottom: isActive
                    ? "2px solid #2f80ed"
                    : "2px solid transparent",
                  paddingBottom: "25px"
                };
              }}
              to="/"
            >
              Home
            </NavLink>
            <NavLink className={classes.linkedNav}
              style={({ isActive }) => {
                return {
                  borderBottom: isActive
                    ? "2px solid #2f80ed"
                    : "2px solid transparent",
                  paddingBottom: "25px"
                };
              }} to="/explore">
              Explore
            </NavLink>
            <NavLink className={classes.linkedNav}
              style={({ isActive }) => {
                return {
              
                  borderBottom: isActive
                    ? "2px solid #2f80ed"
                    : "2px solid transparent",
                  paddingBottom: "25px",
                  
                };
              }} to="/bookmark">
              Bookmark
            </NavLink>
          </div>
        </div>

        <div className={classes.navright}>
          <div className={classes.profile}>
            <figure className={classes.avatarContainer}>

             
            
              {!user.user.profilePic ?
                <div className={classes.profileImg}>{user.user.firstName[0] + " " + user.user.lastName[0]}</div>
                  :
                <img
                src={user.user.profilePic}
                className={classes.profileImgI}
                alt="profile"
              />
              }
              
            </figure>
            <p className={classes.nameTxt}>{user.user.firstName + " " + user.user.lastName}</p>
            <MdArrowDropDown className={classes.arrow} />
          </div>

          <div className={classes.dropdown}>
            <Link to={`/profile/${user.user._id}`} className={classes.navItem}>
              <CgProfile className={classes.icon} />
              <span className={classes.navText}>My Profile</span>
            </Link>
            <Link to="/chat" className={classes.navItem}>
              <MdGroup className={classes.icon} />
              <span className={classes.navText}>Chat</span>
            </Link>
            <Link to="/setting" className={classes.navItem}>
              <MdSettings className={classes.icon} />
              <span className={classes.navText}>Settings</span>
            </Link>
            <div className={classes.divider}> &nbsp; </div>
            <span className={classes.navItem}>
              <MdLogout className={classes.icon} />
              <span className={classes.navText} onClick={logOut}>
                Log Out
              </span>
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
