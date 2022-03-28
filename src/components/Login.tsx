import { VFC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Button, FormControl, TextField, Typography } from "@material-ui/core";

import { auth } from "../firebase";
import styles from "../styles/Login.module.css";

export const Login: VFC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // firebase認証
  useEffect(() => {
    const data = onAuthStateChanged(auth, (user) => {
      user && navigate("/");
    });
    return () => data();
  }, [navigate]);

  const emailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const loginOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error: any) {
      alert(error.message);
    }
  };
  const registerOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.login}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{ shrink: true }}
          name="email"
          label="E-mail"
          value={email}
          onChange={emailOnChange}
        />
      </FormControl>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{ shrink: true }}
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={passwordOnChange}
        />
      </FormControl>
      <br />
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={isLogin ? loginOnClick : registerOnClick}
      >
        {isLogin ? "Login" : "Register"}
      </Button>
      <br />
      <Typography align="center">
        <span className={styles.mode} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create New Account?" : "Back To Login"}
        </span>
      </Typography>
    </div>
  );
};
