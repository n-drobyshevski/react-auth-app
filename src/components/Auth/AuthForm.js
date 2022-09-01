import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);
    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCh6FQZOrW9GOlnA0-hS4goGMgOgOE-8aM';

    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCh6FQZOrW9GOlnA0-hS4goGMgOgOE-8aM';
    }
    fetch(
      url,
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',

        }
      })
      .then(res => {
        if (res.ok) {
          console.log('ok')
          setIsLoading(false);
          return res.json();
        } else {
          res.json().then(data => {
            console.log(data);
            throw new Error('authentication failed')
          });
        }
      })
      .then(data => {
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace('/');

      })
      .catch(err => {
        alert(err.message)
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input ref={emailInputRef} type='email' id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input ref={passwordInputRef} type='password' id='password' required />
        </div>
        <div className={classes.actions}>
          {!isLoading &&
            <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading.</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
