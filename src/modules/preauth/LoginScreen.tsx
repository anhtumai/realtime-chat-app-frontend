import { useForm } from "react-hook-form";
import useWebSocket from "react-use-websocket";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { WS_URL } from "../../config";
import useAuth from "../../contexts/auth";

import "./LoginScreen.css";
import NetsLogo from "../../assets/nets_logo.png";

type LoginFormData = {
  username: string;
  location: string;
};

const schema = yup.object({
  username: yup
    .string()
    .min(5, "Username must have at least 5 characters")
    .max(30, "Username must have at most 30 characters")
    .matches(
      /^[a-z0-9]+$/i,
      "Username must be alphanumeric, space and special characters are not allowed",
    )
    .required("Username is required"),
  location: yup
    .string()
    .min(5, "Location must have at least 5 characters")
    .max(50, "Location must have at most 50 characters")
    .matches(
      /^[a-z0-9 ,]+$/i,
      "Location must be alphanumeric, space and comma are also allowed.",
    )
    .required(),
});

export function LoginScreen() {
  const { setUsername } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const { sendJsonMessage } = useWebSocket(WS_URL);

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
    <div className="bg-nets-color">
      <div className="login-main-section">
        <div className="login-main-frame">
          <img
            height={"40px"}
            id="defaultLogo"
            src={NetsLogo}
            alt="Nets logo"
          />
          <div className="login-intro-header">Connect to the group chat</div>

          <div className="login-intro-paragraph">
            Welcome!
            <br />
            Please insert your username and location for your account to
            connect.
          </div>

          <div>
            <form onSubmit={onSubmit} className="login-form">
              <label className="form-label">Username</label>
              <input className="form-input" {...register("username")} />
              <p className="form-error">{errors?.username?.message}</p>
              <label className="form-label">Location</label>
              <input className="form-input" {...register("location")} />
              <p className="form-error">{errors?.location?.message}</p>
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
