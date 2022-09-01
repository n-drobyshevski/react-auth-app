import classes from './ProfileForm.module.css';
import { useContext, useRef } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const newPasswordInputRef = useRef();
  const history = useHistory();
  const submitHandler = event => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
    const token = authCtx.token;
    // add validation
    // ...

    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCh6FQZOrW9GOlnA0-hS4goGMgOgOE-8aM';

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: token,
        password: enteredNewPassword,
        returnSecureToken: false,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => {
        //assumption: always succeed


        history.replace('/');
      });
  };
  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={newPasswordInputRef} minLength="7" type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
