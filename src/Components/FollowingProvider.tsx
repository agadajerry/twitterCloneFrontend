import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
// import { TRUE } from "sass";
import { BASE_URL } from "../constants/contants";
import { UserContext } from "../hooks/useContext";

export interface iFollowing {
  followerTweet: any[];
  followerCondition: any | boolean[];
  isLoading:boolean;
  isScrolling:boolean
}

export const followingContext = createContext<iFollowing>(null!);

function FollowingProvider({ children }: { children: React.ReactNode }) {
    const { user, setUser }: any = useContext(UserContext);

  // const userToken: any = useContext(UserContext);
  const pageNumber:number = 1;

  const [followerTweet, setFollowerTweet] = useState<any[]>([]);
  const [followerCondition, setFollowerCondition] = useState<any | boolean[]>([]);
  const [ isLoading, setIsLoading]  = useState(false);
  const [isScrolling, setIsScrolling] = useState(false)
  const [page, setPage] = useState(pageNumber)

  const url = `${BASE_URL}api/viewtweet/?pageNo=${page}&pageSize=5`;
console.log(page);

  const authorised = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };


  const scrollToEnd = ()=>{
    setPage(page+1);
    setIsScrolling(true);
  }

  window.onscroll = function(){

    //check if page has reach the bottom
    if(
      window.innerHeight + document.documentElement.scrollTop
       === document.documentElement.offsetHeight){
         scrollToEnd()
       }
  }
  // set  the content of the following tweet properts

  const getFollowerTweet = async () => {
    try {
      setIsLoading(true);
      setIsScrolling(false)
      let result = await axios.get(url, authorised);
      setFollowerTweet(result.data.data.tweet);
      setFollowerCondition(result.data.data.conditionalTweet);

      console.log(result.data.data);


      if(result){
        setIsLoading(false)
        setIsScrolling(false)
      }
     
    } catch (err: any) {
      console.error(err);
      setIsLoading(false)
    }
  };
  useEffect(() => {
    getFollowerTweet();
  }, []);

  return (
    <followingContext.Provider
      value={{
        followerTweet,
        followerCondition,
        isLoading,
        isScrolling
      }}
    >
      {children}
    </followingContext.Provider>
  );
}

export default FollowingProvider;
