import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Routes, Route, useParams } from "react-router-dom";
import Navbar from "../../Components/NavBar/Nav";
import classes from "./Chat2.module.css";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdArrowDropDown } from "react-icons/md";
import { Circles } from "react-loader-spinner";
import { FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HiOutlinePhoneMissedCall } from "react-icons/hi";
import { AiOutlineSend } from "react-icons/ai";
import { MdInsertEmoticon } from "react-icons/md";
import { AuthContext } from "../../context/Auth.context";
import { BASE_URL } from "../../constants/contants";
import io from "socket.io-client";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { v4 as uuidv4 } from "uuid";

import {
  memberObj,
  eachMember,
  Conversation,
  Message,
  IMessage,
} from "../../interfaces/index";

interface IcurrentUser {
  userId: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}

const sockets = io("https://tweetaclone.herokuapp.com");

const Chat2 = () => {
  const { user } = useContext(AuthContext);
  let params = useParams();
  const [isFetchingConversation, setIsFetchingConversation] = useState(false);
  const [isFetchingMessage, setIsFetchingMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<IMessage[] | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState("");
  const [currentUser, setCurrentUser] = useState<IcurrentUser | null>(null);
  const [currentName, setCurrentName] = useState("");
  const [conversation, setConversation] = useState<Array<Conversation>>([]);
  const [newMessage, setNewMessage] = useState<Array<IMessage>>([]);
  const [message, setMessage] = useState("");
  const [postMessage, setPostMessage] = useState(false);
  const [getConversationError, setGetConversationError] = useState(null);
  const [style, setStyle] = useState("classes.friend");
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [socket, setSocket] = useState<any | null>(null);
  const [isFetchingSearch, setIsFetchingSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = async (e: any) => {
    try {
      setIsFetchingSearch(true);
      e.preventDefault();
      const { data } = await axios.get(
        `${BASE_URL}api/v1/search/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const val = data.data.users;
      const datas = val.filter((item: any) => item._id !== user.user._id);
      console.log({ datas });
      setSearchResult(datas);
      setIsFetchingSearch(false);
      setSearch("");
    } catch (e) {
      console.log(e);
      setIsFetchingSearch(false);
    }
  };

  const handleOutsideClick = () => {
    setSearchResult(null);
  };

  const handleSearchItemClick = async (receiver: any) => {
    // console.log(receiver, '**');

    try {
      const { data } = await axios.post(
        `${BASE_URL}conversation`,
        {
          receiverId: receiver._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const val = {} as Conversation
      val.conversationId = data.data.id
      val.firstName= receiver.firstName
      val.lastName= receiver.lastName
      val.email= receiver.email
      val.bioData=receiver.bioData
      val.profilePic=receiver.profilePic
      val.userId= receiver._id
      
      
      setConversation([...conversation, val])
      
      console.log(val, '***')
    } catch (el) {
      console.log(el);
    }
  };

  useEffect(() => {
    sockets.emit("addUser", user.user._id);
    console.log("I am in");
  }, [user.user._id]);

  useEffect(() => {
    sockets.on("getMessage", ({ message }) => {
      const val = {} as IMessage;
      val.senderId = message.senderId;
      val.text = message.text;
      val.conversationId = message.conversationId;
      val.createdAt = message.createdAt;
      val.id = message.id;

      console.log({ val });

      console.log(currentMessage);

      if (currentMessage) {
        setCurrentMessage([...currentMessage, val]);
      }

      // setCurrentMessage([...(currentMessage as IMessage[]), val]);
      messageEndRef.current?.scrollTo({
        top: messageEndRef.current?.scrollHeight,
        // behavior: "smooth",
      });
    });
  }, [currentMessage]);

  const handleSendMessage = async () => {
    const data = {
      senderId: user.user._id,
      receiverId: currentUser?.userId,
      text: message,
      conversationId: currentConversationId,
    };

    /* 
              senderId: {
                _id
              }
              text
              createdAt
              conversationId
              id
            */
    const val = {
      senderId: {
        _id: user.user._id,
      },
      text: message,
      createdAt: new Date(),
      conversationId: currentConversationId,
      id: uuidv4(),
    };
    console.log({ val });
    //return data;
    sockets.emit("sendMessage", data);

    console.log({ currentMessage });

    setCurrentMessage([...(currentMessage as IMessage[]), val]);
    messageEndRef.current?.scrollTo({
      top: messageEndRef.current?.scrollHeight,
      // behavior: "smooth",
    });
    setMessage("");
  };

  //  useEffect(() => {
  //    sockets.emit('sendMessage', {
  //      senderId: user.user._id,
  //      receiverId: `${currentConversationId}`,
  //      text: newMessage
  //     })
  //  }, [currentConversationId, newMessage, user.user._id])

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setIsFetchingConversation(true);
        const { data } = await axios.get(
          `${BASE_URL}conversation/${user.user._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        // console.log(data.data, "User Conversation");
        const info = data.data;

        const conversations = info.map((item: any) => {
          const conversation: Conversation = {} as Conversation;

          conversation.conversationId = item._id;
          const personB = item.members.filter(
            (el: any) => el._id !== user.user._id
          );

          conversation.firstName = personB[0].firstName;
          conversation.lastName = personB[0].lastName;
          conversation.email = personB[0].email;
          conversation.userId = personB[0]._id;
          conversation.profilePic = personB[0].profilePic;
          conversation.bioData = personB[0].bioData;

          return conversation;
        });

        setConversation(conversations);
        // conversations = ;
        // console.log(conversations)

        setCurrentConversationId(conversations[0].conversationId);

        setCurrentUser({
          userId: conversations[0].userId,
          firstName: conversations[0].firstName,
          lastName: conversations[0].lastName,
          profilePic: conversations[0].profilePic,
        });

        console.log(
          conversations[0].firstName,
          conversations[0].lastName,
          conversations[0].profilePic,
          conversations[0].userId,
          "current"
        );
        // setCurrentUser(conversations[1].firstName );
        setIsFetchingConversation(false);
      } catch (e: any) {
        console.log(e);
        setIsFetchingConversation(false);
        setGetConversationError(e);
      }
    };
    fetchConversation();
  }, [user.token, user.user._id]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setIsFetchingMessage(true);
        setCurrentMessage(null);
        const val = await axios.get(
          `${BASE_URL}message/${currentConversationId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log(val.data.data, "PREV MESG");

        setCurrentMessage(val.data.data);
        console.log("Scroll@@", messageEndRef.current);
        messageEndRef.current?.scrollTo({
          top: messageEndRef.current?.scrollHeight,
          // behavior: "smooth",
        });
        setIsFetchingMessage(false);
      } catch (e) {
        console.log(e);
        setIsFetchingMessage(false);
      }
    };

    if (currentConversationId) {
      fetchMessage();
    }
  }, [currentConversationId, user.token]);

  // useEffect(() => {
  //   setSocket(io("http://localhost:3001"), {
  //     headers: {
  //       Authorization: `Bearer ${user.token}`,
  //     },
  //   } )
  // }, [])

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessage(message + emoji);
  };

  // const scrollToBottom = () => {
  //   messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: 'end',
  //   inline: 'nearest'})
  // }

  // useEffect(() => {
  //   if (messageEndRef.current) {
  //   messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: 'end',
  //   inline: 'nearest'})
  //   }
  // });



  return (
    <div className={classes.container}>
      <div className={classes.nav_top}>
        <Navbar />
      </div>
      <div className={classes.main} onClick={handleOutsideClick}>
        <div className={classes.nav_left}>
          <div className={classes.search}>
            <form
              action=""
              className={classes.form}
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                placeholder="search"
                className={classes.text}
                onChange={handleChange}
                value={search}
              />
              {isFetchingSearch === true ? (
                <Circles
                  color="#2F80ED"
                  height={20}
                  width={20}
                  wrapperStyle={{
                    position: "absolute",
                    top: "15px",
                    left: "250px",
                  }}
                />
              ) : (
                ""
              )}
              <BiSearchAlt2 className={classes.icon} />
            </form>
            {searchResult && (
              <div className={classes.searchDrop}>
                {searchResult.map((item: any) => (
                  <div
                    className={classes.searchItem}
                    onClick={() => handleSearchItemClick(item)}
                  >
                    <span className={classes.name}>
                      {item.firstName + " " + item.lastName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/*  {!user.user.profilePic ?
                <div className={classes.profileImg}>{user.user.firstName[0] + " " + user.user.lastName[0]}</div>
                  :
                <img
                src={user.user.profilePic}
                className={classes.profileImgI}
                alt="profile"
              />
              } */}

          {/* list of conversations */}
          {/* {isFetchingConversation === true ? 
            <Circles
              color="rgb(71, 144, 240)"
              height={30}
              width={30}
              wrapperStyle={{
                justifyContent: "center",
                alignItems: "center",
                height: "25vh",

              }}
            /> : */}
          <div className={classes.friends}>
            {isFetchingConversation === true ? (
              <Circles
                color="rgb(71, 144, 240)"
                height={30}
                width={30}
                wrapperStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "25vh",
                }}
              />
            ) : (
              conversation.map((item: any) => (
                <div
                  className={`${classes.friend} ${
                    currentConversationId === item.conversationId &&
                    classes.friend2
                  }`}
                  onClick={() => {
                    setCurrentConversationId(item.conversationId);
                    setCurrentUser({
                      userId: item.userId,
                      firstName: item.firstName,
                      lastName: item.lastName,
                      profilePic: item.profilePic,
                    });
                    // changeStyle()
                  }}
                  key={item.conversationId}
                >
                  <figure className={classes.avatar}>
                    {!item.profilePic ? (
                      <div className={classes.img1}>
                        {item.firstName[0] + " " + item.lastName[0]}
                      </div>
                    ) : (
                      <img
                        src={item.profilePic}
                        alt=""
                        className={classes.img}
                      />
                    )}
                  </figure>
                  <p className={classes.name}>
                    {item.firstName + " " + item.lastName}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className={classes.profile}>
            <Link to="/profile" className={classes.person}>
              <figure className={classes.profile_avatar}>
                <img
                  src={user.user.profilePic}
                  alt=""
                  className={classes.profile_img}
                />
              </figure>
              <p className={classes.profile_name}>
                {user.user.firstName + " " + user.user.lastName}
              </p>
              <MdArrowDropDown className={classes.arrow} />
            </Link>
          </div>
        </div>

        <div className={classes.nav_right}>
          <div className={classes.chat_head}>
            <div className={classes.heading}>
              <figure className={classes.chat_avatar}>
                {currentUser && !currentUser.profilePic ? (
                  <div className={classes.chat_img1}>
                    {currentUser.firstName[0] + " " + currentUser.lastName[0]}
                  </div>
                ) : (
                  <img
                    src={currentUser?.profilePic}
                    alt=""
                    className={classes.chat_img}
                  />
                )}
              </figure>
              {currentUser && (
                <p className={classes.chat_name}>
                  {currentUser?.firstName + " " + currentUser?.lastName}
                </p>
              )}
              <HiOutlinePhoneMissedCall className={classes.chat_arrow} />
            </div>
          </div>

          <div id="scroll" className={classes.chat_body} ref={messageEndRef}>
            {isFetchingMessage && (
              <Circles
                color="rgb(71, 144, 240)"
                height={50}
                width={50}
                wrapperStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "25vh",
                  paddingTop: "25%",
                }}
              />
            )}

            {currentMessage &&
              currentMessage.map((msg) => {
                console.log(currentMessage);
                return msg.senderId._id !== user.user._id ? (
                  <div className={classes.chat_boxA} key={msg.id}>
                    <div
                      className={`${classes.chat_caseA} ${classes.chat_case2A}`}
                    >
                      <p className={classes.chat_messageA}>{msg.text}</p>
                      <span className={classes.chat_timeA}>
                        {new Date(msg.createdAt).toLocaleTimeString(
                          navigator.language,
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={classes.chat_boxB} key={msg.id}>
                    <div
                      className={`${classes.chat_caseB} ${classes.chat_case2B}`}
                    >
                      <p className={classes.chat_messageB}>{msg.text}</p>
                      <span className={classes.chat_timeB}>
                        {new Date(msg.createdAt).toLocaleTimeString(
                          navigator.language,
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}

            {!isFetchingMessage &&
              currentMessage &&
              currentMessage.length === 0 && (
                <span className={classes.chat_background}>
                  <p className={classes.chat_shadow}>Start a conversation</p>
                  <FaTwitter className={classes.chat_shadowicon} />
                </span>
              )}
          </div>

          <div className={classes.chat_form}>
            <div className={classes.form_body}>
              <form className={classes.form_case}>
                <textarea
                  name=""
                  id=""
                  placeholder="Type a message here"
                  className={classes.form_text}
                  onChange={(el) => setMessage(el.target.value)}
                  value={message}
                ></textarea>
              </form>
              <MdInsertEmoticon
                className={classes.form_emoji}
                onClick={() => setShowEmojis(!showEmojis)}
              />
              <AiOutlineSend
                className={classes.form_send}
                onClick={handleSendMessage}
              />
            </div>
          </div>

          {/* <span className={classes.chat_background}>
            <p className={classes.chat_shadow}>Start a conversation</p>
            <FaTwitter className={classes.chat_shadowicon} />
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default Chat2;
