import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatEngine, getOrCreateChat, sendMessage } from "react-chat-engine";
import { Link, useLocation, NavLink } from "react-router-dom";
import { getChats } from "react-chat-engine";
import createUserNoPP from "./createChatUserNoProfilePic";

import {
  ChatEngineWrapper,
  Socket,
  ChatList,
  ChatFeed,
  ChatSettings,
} from "react-chat-engine";
import createUser from "./createChatsUser";

import { Col } from "react-grid-system";
import WithAuth from "../../hoc/withAuth";

import "./ChatsDirectDesktopSingle.css";

// import { useAuth } from "./AuthContext"
import firebase, { auth } from "firebase";
import { selectCartItemsCount } from "../../redux/Cart/cart.selectors";
import { GoogleProvider } from "../../firebase/utils";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

export default function Chats(props) {
  const { currentUserEmail, currentUserUid } = props;
  const authObject = {
    projectID: "896f6a0e-9b91-41ff-a3a4-4dedbfe06c10",
    userName: `${currentUserEmail}`,
    userSecret: `${currentUserEmail}`,
  };
  console.log(`${currentUserEmail}`);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  //const { user } = useAuth();
  const history = useHistory();
  let [chatID, setChatID] = useState("");
  let [count, setCount] = useState(0);

  const callback = (chat) => {
    setChatID(chat.id);
    console.log(chat.id);
    console.log("callback");
  };

  useEffect(() => {
    const authObject1 = {
      projectID: "896f6a0e-9b91-41ff-a3a4-4dedbfe06c10",
      userName: `${currentUserEmail}`,
      userSecret: `${currentUserEmail}`,
    };
    const messageObject = {
      text: `<p><strong>${props.name}</strong></p><p><strong>${props.cat}</strong></p><p><strong>${props.price}</strong></p><a href="${props.url}">${props.url}</a>`,
      sender_username: `${currentUserEmail}`,
    };
    console.log(props.url)
    console.log(props.name)
    sendMessage(authObject1, chatID, messageObject, callback1);
  }, [props.url]);

  const callback1 = () => {
    console.log("auto callback");
  };

  function createDirectChat(creds, str, str2) {
    getOrCreateChat(
      creds,
      {
        is_direct_chat: true,
        usernames: [`${str}`, `${currentUserEmail}`],
      },
      callback
    );
    console.log(`${str}`);
  }

  useEffect(() => {
    setTimeout(
      () =>
        createDirectChat(authObject, props.adminUserEmail, props.adminUserUid),
      100
    );
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // useEffect(() => {
  //   setTimeout(createDirectChat(authObject, props.adminUserEmail, props.adminUserUid), 150);
  //   console.log("create direct chat called")
  // }, [])

  function renderChatForm(creds) {
    setTimeout(
      () => createDirectChat(creds, props.adminUserEmail, props.adminUserUid),
      200
    );
  }

  // useEffect(() => {
  //   setTimeout(createDirectChat("", props.adminUserEmail, props.adminUserUid), 250);
  //   console.log(chatID)
  // }, [chatID])

  if (loading) {
    return <div className="centerText"></div>;
  }
  return (
    <WithAuth>
      <div id="chats-page">
        <ChatEngineWrapper>
          <div id="Desktop">
            <Socket
              userName={currentUserEmail}
              userSecret={currentUserEmail}
              projectID="896f6a0e-9b91-41ff-a3a4-4dedbfe06c10"
            />
            <div className="chatFeedSingle">
              <ChatFeed activeChat={chatID} />
            </div>
          </div>
        </ChatEngineWrapper>
      </div>
    </WithAuth>
  );
}
