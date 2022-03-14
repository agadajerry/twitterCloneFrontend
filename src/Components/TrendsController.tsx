import styles from "../styles/Tweeting_style/TweetController.module.css";
// import { followingContext } from "../Components/FollowingProvider";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "./NavBar/Nav";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../hooks/useContext";
import { BASE_URL } from "../constants/contants";
// import Trending_Follow from "./Trending_Follow";
// import Tweet from "./Tweet/Tweet";
// import { Navbar } from "reactstrap";
import Trending_Follow from "./Trending_Follow";
import { BeatLoader } from "react-spinners";
import Tweet from "./Tweet/Tweet";
import { CirclesWithBar } from "react-loader-spinner";
import { followingContext } from "./FollowingProvider";

function TrendsController() {
  
  // const { followerTweet, followerCondition, isLoading,isScrolling } = useContext(followingContext);
  const { user, setUser }: any = useContext(UserContext);

  // const user: any = useContext(UserContext);
  const token = user.token;
  const params: any = useParams();

  const [trends, setTrends] = useState<any>([]);
  const [hashtags, setHashtags] = useState<any>([]);
  const [follow, setFollow] = useState<any[]>([]);

  const urll = `${BASE_URL}api/trends`;
  const url = `${BASE_URL}api/trends/hashtag?hashtag=%23${params.id}&pageNo=1&pageSize=5`;
  const uri = `${BASE_URL}api/follow/suggest/?pageNo=2&pageSize=5`;


  useEffect(() => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log('tweet-----',res.data);
        setHashtags(res.data.data.tweet);
      })
      .catch((err) => {
        console.log(err);
      });
      axios
      .get(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFollow(res.data["suggested-connection"].suggestedConnection);
      })
      .catch((err) => {
        console.log(err);
      });
      axios
      .get(urll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setTrends(res.data.data.trending);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleFollow = (userId: string) => {
    axios
      .post(
        `${BASE_URL}api/follow`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        const newFollow = follow.filter(item => item._id !== userId)
        setFollow(newFollow)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Nav />
      {/* <Trending_Follow /> */}

      <div className={styles["tweet-wrapper"]}>

        <div className={styles["tweet-body"]} style={{marginBottom: '100px', padding: '80px'}}>
          
        {hashtags?.length && hashtags.map((tag: any, index: number) => {
                return (
                  <Tweet
                    key={index}
                    isLiked={tag.isLiked}
                    isRetweeted={tag.isRetweeted}
                    isBookmarked={tag.isBookmarked}
                    tweetImage={tag.tweetImage}
                    commentCount={0}
                    retweetCount={0}
                    messageBody={tag.messageBody}
                    userId={tag.userId}
                    createdAt={tag.updatedAt}
                    noOfLikes={0}
                    _id={tag._id}
                    bookmarkCount={0}
                  />
                );
              })}
                  {/* {isScrolling ?  <CirclesWithBar
                    color="#2F80ED"
                    height={50}
                    width={50}
                    wrapperStyle={{ justifyContent: "center",marginTop:"30px" }}
                  />:""} */}
          <div style={{marginBottom: '40px', padding: '20px'}}                                                                                                                                                                                                                                                                           ></div>
          </div>
      {/* <Tweet /> */}
      <Trending_Follow />
      </div>
    </>
  );
}

export default TrendsController;
