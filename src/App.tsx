import { VFC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FormControl, TextField, List } from "@material-ui/core";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { makeStyles } from "@material-ui/core";

import { db, auth } from "./firebase";
import styles from "./styles/App.module.css";
import { TaskItem } from "./components/TaskItem";

const App: VFC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");
  const classes = useStyles();
  const navigate = useNavigate();

  // ユーザー確認
  useEffect(() => {
    const req = onAuthStateChanged(auth, (user) => {
      !user && navigate("login");
    });
    return () => req();
  });

  // データ取得
  useEffect(() => {
    const qry = query(collection(db, "tasks"));
    const data = onSnapshot(qry, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title })));
    });
    // アンマウント時に停止
    return () => data();
  }, []);

  // フォームの値を取得
  const taskOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  // フォームボタン => docに追加
  const inputOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await addDoc(collection(db, "tasks"), { title: input });
    setInput("");
  };
  // サインアウト
  const signoutOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await signOut(auth);
      navigate("login");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.App}>
      <h1>TODO APP</h1>
      <button className={styles.logout} onClick={signoutOnClick}>
        <ExitToAppIcon />
      </button>
      <br />
      <FormControl>
        <TextField
          className={classes.field}
          label="Enter New Task"
          value={input}
          onChange={taskOnChange}
          InputLabelProps={{ shrink: true }}
        />
      </FormControl>

      <button className={styles.taskIcon} disabled={!input} onClick={inputOnClick}>
        <AddToPhotosIcon />
      </button>

      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  );
};

export default App;

// material ui style
const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
});
