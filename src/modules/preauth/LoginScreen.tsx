import { useForm } from "react-hook-form";
import useWebSocket from "react-use-websocket";

import { WS_URL } from "../../config";
import useAuth from "../../contexts/auth";

import "./LoginScreen.css";
import NetsLogo from "./nets_logo.png";

type LoginFormData = {
  username: string;
  location: string;
};

export function LoginScreen() {
  const { setUsername } = useAuth();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL);

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    sendJsonMessage(
      {
        login: data,
      },
      true,
    );
    setUsername(data.username);
  });

  return (
    <div className="login-screen-background">
      <div className="login-screen-main-section">
        <div className="login-screen-main-frame">
          <img
            height={"40px"}
            id="defaultLogo"
            src={NetsLogo}
            alt="Nets logo"
          />
          <div className="login-screen-intro-header">
            Connect to the group chat
          </div>

          <div className="login-screen-intro-paragraph">
            Welcome!
            <br />
            Please insert your username and location for your account to
            connect.
          </div>

          <div>
            <form onSubmit={onSubmit} className="login-screen-form">
              <label className="form-label">Username</label>
              <input className="form-input" {...register("username")} />
              <p className="form-error"></p>
              <label className="form-label">Location</label>
              <input className="form-input" {...register("location")} />
              <p className="form-error"></p>
              <input
                className="form-button"
                type={"submit"}
                style={{
                  marginLeft: "auto",
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
