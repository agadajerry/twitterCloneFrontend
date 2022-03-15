import classes from "./Tweet.module.css";
import { FiMessageSquare, FiBookmark } from "react-icons/fi";
import { BsFillSuitHeartFill } from "react-icons/bs";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import { ChangeEvent, useContext, useState } from "react";
// import { followingContext, iFollowing } from "../FollowingProvider";
import Moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import React from "react";
import { AVATAR, BASE_URL } from "../../constants/contants";
import { UserContext } from "../../hooks/useContext";
import { AuthContext } from "../../context/Auth.context";
import axios from "axios";

export interface iTweet {
  tweetImage: string;
  commentCount: number;
  retweetCount: number;
  messageBody: string;
  userId: any;
  createdAt: Date;
  _id: string;
  bookmarkCount: number;
  noOfLikes: number;
  isLiked: boolean;
  isRetweeted: boolean;
  isBookmarked: boolean;
}
const Tweet: React.FC<iTweet> = ({
  tweetImage,
  commentCount,
  retweetCount,
  messageBody,
  userId,
  createdAt,
  _id,
  bookmarkCount,
  noOfLikes,
  isLiked,
  isRetweeted,
  isBookmarked,
}) => {
  const [textField, setTextField] = useState<any>("");
  const [newHeight, setNewHeight] = useState<any>("22px");
  const [isLoading, setIsLoading] = useState(false);
  const [isbookMark, setIsBookMark] = useState(isBookmarked);
  const [isLike, setIsLike] = useState(isLiked);
  const [isFollowerRetweet, setIsFollowerRetweet] = useState(isRetweeted);
  const [likeTweet, setLikeTweet] = useState(noOfLikes);
  const [allBookMarkCount, setAllBookMarkCount] = useState(bookmarkCount);
  const [allCommentCount, setAllCommentCount] = useState(commentCount);
  const [allretweetCount, setAllretweetCount] = useState(retweetCount);

  const { user, setUser }: any = useContext(UserContext);

  // const user: any = useContext(UserContext);
  // const { user } = useContext(AuthContext);

  console.log(isbookMark, isFollowerRetweet, isLike, _id);

  console.log(userId, "userId");

  //get text field value

  const getTextFieldValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextField(e.target.value);

    setNewHeight(e.target.scrollHeight);

    if (e.target.value === "") {
      setNewHeight(25);
    }
  };

  const handleComment = async (tweetId: string) => {
    try {
      if (textField === "") {
        return console.log("Empty field");
      } else {
        setAllCommentCount(Number(allCommentCount) + 1);
        const postData = { content: textField };
        setIsLoading(true);

        const commentUrl = `${BASE_URL}tweet/${tweetId}/comment`;

        fetch(commentUrl, {
          method: "POST",
          body: JSON.stringify(postData),

          headers: {
            Authorization: "Bearer " + user.token,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setTextField(" ");
            setNewHeight("22px");
          })
          .catch((err: any) => console.log(err));
        setIsLoading(false);
      }
    } catch (err) {
      return console.error(err);
    }
  };

  //handle bookmarking
  const bookMarkNewTweet = async (tweetId: string) => {
    const postData = { isBookmark: true };

    const bookMarkUrl = `${BASE_URL}tweet/${tweetId}/bookmark`;

    fetch(bookMarkUrl, {
      method: "POST",
      body: JSON.stringify(postData),

      headers: {
        Authorization: "Bearer " + user.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data.data.isBookmark))
      .catch((err: any) => console.log(err));
  };

  //handle bookmark delete

  const bookMarkDelete = async (tweetId: string) => {
    const bookMarkUrl = `${BASE_URL}tweet/${tweetId}/bookmark`;

    fetch(bookMarkUrl, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + user.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err: any) => console.log(err));
  };

  //handle book marking event listener function

  const handleBookMarkTweet = (tweetId: string) => {
    if (isbookMark === false) {
      setAllBookMarkCount(Number(allBookMarkCount) + 1);
      bookMarkNewTweet(tweetId);
      setIsBookMark(true);
    } else {
      setIsBookMark(false);
      setAllBookMarkCount(Number(allBookMarkCount) - 1);
      bookMarkDelete(tweetId);
    }
  };
  //handle likes

  const handleLikes = async () => {
    const unlikeTweetUrl = `${BASE_URL}tweet/${_id}/like`;
    if (isLike === true) {
      setLikeTweet(Number(likeTweet) - 1);

      await axios.delete(unlikeTweetUrl, {
        headers: { Authorization: "Bearer " + user.token },
      });
      setIsLike(false);
    } else {
      setLikeTweet(Number(likeTweet) + 1);

      await axios.post(
        unlikeTweetUrl,
        {},
        {
          headers: {
            Authorization: "Bearer " + user.token,
            "Content-Type": "application/json",
          },
        }
      );

      setIsLike(true);
    }
  };

  const navigate = useNavigate();

  const handleProfileRoute = (e: any) => {
    navigate(`/profile/${userId._id}`);
    e.preventPropagation();
  };

  const handleSingleTweet = (e: any) => {
    e.preventPropagation();
    //console.log("Click single tweet")
    //navigate(`/tweetcomment/${_id}`)
  }

  //handle retweet count
  //
  function handleReTweet(id: string) {
    try {
      if (isFollowerRetweet === false) {
        const retweetUrl = `${BASE_URL}tweeting/retweet/${id}`;

        fetch(retweetUrl, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + user.token,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setIsFollowerRetweet(true);
            setAllretweetCount(Number(allretweetCount) + 1);
          });
      } else {
        setIsFollowerRetweet(false);
        setAllretweetCount(Number(allretweetCount) - 1);

        const undoretweetUrl = `${BASE_URL}tweeting/undoretweet/${id}`;

        fetch(undoretweetUrl, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + user.token,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  const imageErrorHandler = (e: any) => {
    e.target.style.display = "none";
  };

  /**
    
   */

  return (
    <div style={{marginBottom: "100px", border: "1px solid #fafafa", padding: "15px", borderRadius: "5px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)", cursor: "pointer"}}>
      <div className={classes.container}  onClick={(e) =>  {console.log("br99"); handleSingleTweet(e); }} >
        <div className={classes.wrapper} onClick={(e) => {console.log("8888"); handleProfileRoute(e); }}  >
          <div className={classes.top} >
            <div className={classes.profile}>
              <div  >
                {userId.profilePic == "null" ? (
                  <div className="image-replacer">
                    <h6>
                      {userId.firstName[0].toUpperCase() +
                        "." +
                        userId.lastName[0].toUpperCase()}
                    </h6>
                  </div>
                ) : (
                  <img
                    src={userId.profilePic || AVATAR}
                    onError={imageErrorHandler}
                    className={classes.profile__img}
                    alt='userphoto'
                  />
                )}
              </div>
            </div>
            <div className={classes.person}>
              <p className={classes.person_name}>
                {userId.firstName + " " + userId.lastName}
              </p>
              <p className={classes.person_date}>
                {Moment(createdAt).format("DD-MM-YYYY hh:ss")}
              </p>
            </div>
          </div>
          <div className={classes.tweet}>
            <p style={{ margin: 0, marginTop: "7px" }}>{messageBody}</p>
          </div>
          <div className={classes.main}>
            <img
              src={!tweetImage ? "" : tweetImage}
              onError={imageErrorHandler}
              className={classes.main_img}
              alt="img"
            />
            {/* onError={imageErrorHandler}
                  className={classes.profile__img}
                />
              </Link> */}
          </div>
        </div>
        <div>
          <ul className={classes.second}>
            <li>{allCommentCount} Comments</li>
            <li> {allretweetCount} Retweets</li>
            <li>{allBookMarkCount} Saved</li>
          </ul>
        </div>
        <div className={classes.action}>
          <div className={classes.actions}>
            <button>
              <span>
                <FiMessageSquare className={classes.icons} />
                <span className={classes.button}>Comments</span>
              </span>
            </button>
            <button onClick={() => handleReTweet(_id)}>
              <span style={{ color: isFollowerRetweet ? "red" : "grey" }}>
                <FaRetweet className={classes.icons} />
                <span className={classes.button}>Retweets</span>
              </span>
            </button>
            <button onClick={() => handleLikes()}>
              <span style={{ color: isLike ? "deeppink" : "grey" }}>
                <BsFillSuitHeartFill className={classes.icons} />
                <span className={classes.button}>Likes</span>
              </span>
            </button>
            <button onClick={() => handleBookMarkTweet(_id)}>
              <span style={{ color: isbookMark ? "red" : "grey" }}>
                <FiBookmark className={classes.icons} />
                <span className={classes.button}>Saved</span>
              </span>
            </button>
          </div>
        </div>
        <div className={classes.last}>
          <div className={classes.profile2}>
            <Link to="/profile">
              {!user.user.profilePic || user.user.profilePic == "null" ? (
                <div className="image-replacer">
                  <h6>
                    {user.user.firstName[0].toUpperCase() +
                      "." +
                      user.user.lastName[0].toUpperCase()}
                  </h6>
                </div>
              ) : (
                <img
                  src={user.user.profilePic}
                  onError={imageErrorHandler}
                  className={classes.profile2_img}
                />
              )}
            </Link>
          </div>
          <form action="" className={classes.form}>
            <textarea
              onChange={(e) => getTextFieldValue(e)}
              placeholder="Tweet your reply"
              value={textField}
              name={"message"}
              style={{ height: newHeight }}
            ></textarea>
            <span
              onClick={() => handleComment(_id)}
              className={classes.iconBox}
            >
              {isLoading ? (
                <CirclesWithBar
                  color="#2F80ED"
                  height={30}
                  width={30}
                  wrapperStyle={{ justifyContent: "center" }}
                />
              ) : (
                <AiOutlineSend className={classes.icon} />
              )}
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
