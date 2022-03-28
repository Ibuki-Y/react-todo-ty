import { VFC, useState } from "react";
import { doc, collection, setDoc, deleteDoc } from "firebase/firestore";
import { ListItem, TextField, Grid } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

import { db } from "../firebase";
import styles from "../styles/TaskItem.module.css";

type Props = {
  id: string;
  title: string;
};
export const TaskItem: VFC<Props> = (props) => {
  const { id, title } = props;
  const [editTitle, setEditTitle] = useState(title);

  // フォームの値を取得
  const titleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };
  // 編集ボタン
  const ref = collection(db, "tasks");
  const editTaskOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await setDoc(doc(ref, id), { title: editTitle }, { merge: true });
  };
  // 削除ボタン
  const deleteTaskOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await deleteDoc(doc(ref, id));
  };

  return (
    <ListItem>
      <h2>{title}</h2>

      <Grid container justifyContent="flex-end">
        <TextField
          InputLabelProps={{ shrink: true }}
          label="Edit Task"
          value={editTitle}
          onChange={titleOnChange}
        />
        <button className={styles.taskIcon} onClick={editTaskOnClick}>
          <EditOutlinedIcon />
        </button>
        <button className={styles.taskIcon} onClick={deleteTaskOnClick}>
          <DeleteOutlineOutlinedIcon />
        </button>
      </Grid>
    </ListItem>
  );
};
