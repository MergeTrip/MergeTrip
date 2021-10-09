import './Account.css';
import apple from './apple.svg';
import google from './google.svg';
import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, OAuthProvider } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

class SimpleForm extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onGoogleLogin = this.onGoogleLogin.bind(this);
    this.onAppleLogin = this.onAppleLogin.bind(this);
    this.onResetPassword = this.onResetPassword.bind(this);

  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onResetPassword() {
    this.reset();
  }

  onGoogleLogin() {
    this.createGoogle();
  }

  onAppleLogin() {
    this.createApple();
  }

  onSignUp() {
    this.createAccount();
  }

  onLogin() {
    this.loginToAccount();
  }

  reset() {
    const auth = getAuth();
    sendPasswordResetEmail(auth, this.state.username)
      .then((userCredential) => {
        alert("Email sent");
      }).catch(function (error) {
        alert(error);
      });
  }

  createGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const db = getDatabase();
        set(ref(db, 'users/' + user.uid), {
          googletoken: token
        });

        console.log("Login Succesful");
        this.props.history.push("/");
        // ...
      }).catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        alert("Incorrect Email or Password");

        // ...
      });
  }

  createApple() {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        // const user = result.user;

        // Apple credential
        // const credential = OAuthProvider.credentialFromResult(result);
        // const accessToken = credential.accessToken;
        // const idToken = credential.idToken;
        console.log("Login Succesful");
        this.props.history.push("/");

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The credential that was used.
        // const credential = OAuthProvider.credentialFromError(error);
        // alert("Incorrect Email or Password");
        // ...
      });
  }

  loginToAccount() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.state.username, this.state.password)
      .then((userCredential) => {
        // Signed in 
        // const user = userCredential.user;
        console.log("Login Succesful");
        this.props.history.push("/");
        // ...
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        if (this.state.username === "") {
          alert("You need to input an Email!");
        } else {
          alert("Incorrect Email or Password");
        }
      });
  }

  createAccount() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.state.username, this.state.password)
      .then((userCredential) => {
        // Signed in 
        // const user = userCredential.user;
        console.log("Sign Up Succesful");
        // ...
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        if (this.state.username === "") {
          alert("You need to input an Email!");
        } else {
          alert("Email is already in use");
        }
        // ..
      });

  }

  render() {

    return (
      <div className="Account">
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <header className="Account-header">
          <div className="Account-buttons">
            <button className="Account-google" onClick={this.onGoogleLogin}>
              <img src={google} alt="Google" />
              Log In With Google
            </button>
            <button className="Account-apple" onClick={this.onAppleLogin}>
              <img src={apple} alt="Apple" />
              Log In With Apple
            </button>
          </div>
          <div>
            <input className="Account-input"
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.onInputchange}
              placeholder="Username"
            />
          </div>
          <div>
            <input className="Account-input"
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onInputchange}
              placeholder="Password"
            />
          </div>
          <div>
            <button className="Account-button" onClick={this.onSignUp}>Sign Up</button>
            <button className="Account-button" onClick={this.onLogin}>Log In</button>
            <button className="Account-button" onClick={this.onResetPassword}>Reset Password</button>
          </div>
        </header>
      </div>
    );
  }
}

export default withRouter(SimpleForm);