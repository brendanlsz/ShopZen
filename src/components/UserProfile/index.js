import React from "react";
import { useHistory } from "react-router-dom";
import "./styles.scss";
import userIMG from "./../../assets/user.png";

const UserProfile = (props) => {
  const { currentUser } = props;
  const { userName } = currentUser;

  return (
    <div className="userProfile">
      <ul>
        <li>
          <div className="img">
            <img src={userIMG} />
          </div>
        </li>
        <li>
          <span className="displayName">{userName && userName}</span>
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;
