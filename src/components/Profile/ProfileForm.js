import { useRef } from "react";
import classes from "./ProfileForm.module.css";
import AuthContext from "../../store/AuthContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  console.log(authCtx);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;
    //add validation
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API]",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => {
      //assume always succeeds
      history.replace("/");
    });
  };

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
