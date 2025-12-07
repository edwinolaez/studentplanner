import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Task } from "../types";
import { auth } from "../../lib/firebase";

// const DEFAULT_USER_ID = 'VbW5sejndvTyP111OA1TZvsXcXX2';
// const TASKS_COLLECTION = 'tasks';

// export const saveTasksToDB = async (tasks: Task[]) => {
//   // console.log('Saving tasks to database ------------------------------');
//   const colRef = collection(db, TASKS_COLLECTION);

//   // Delete all existing tasks
//   // console.log('delet tasks from database ------------------------------',colRef);

//   const tasksQuery = query(colRef);
//   const querySnapshot = await getDocs(tasksQuery);

//   try {
//     const tasksQuery = query(colRef);
//     const querySnapshot = await getDocs(tasksQuery);
//     const deletePromises = querySnapshot.docs.map((postDoc) =>
//       deleteDoc(doc(db, TASKS_COLLECTION, postDoc.id))
//     );
//     await Promise.all(deletePromises);
//   } catch (error) {
//     console.log(error);
//   }

//   // console.log('save new tasks ------------------------------');

//   try {
//     const colRef = collection(db, TASKS_COLLECTION);
//     const addPromises = tasks.map((task) =>
//       addDoc(colRef, task)
//     );
//     await Promise.all(addPromises);
//   } catch (error) {
//     console.log(error);
//   }

// };

// export const getTasksFromDB = async () => {

//   const colRef = collection(db, TASKS_COLLECTION);

//   const tasksQuery = query(colRef);

//   const querySnapshot = await getDocs(tasksQuery);

//   const task: any[] = [];

//   querySnapshot.forEach((doc) => {
//     task.push({ id: doc.id, ...doc.data() });
//   });

//   // console.log('completed get tasks from database ------------------------------',task);
//   return task;
// }

// SAVE tasks for the logged-in user
export const saveTasksToDB = async (tasks: Task[]) => {
  const user = auth.currentUser;

  if (!user) {
    console.warn("No user logged in. Cannot save tasks.");
    return;
  }

  // Path: users/{uid}/tasks
  const colRef = collection(db, "users", user.uid, "tasks");

  // Delete existing tasks
  const snapshot = await getDocs(colRef);
  const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  // Add new tasks
  const addPromises = tasks.map((task) =>
    addDoc(colRef, {
      ...task,
      completed: task.completed ?? false, // ALWAYS SAVE COMPLETED FLAG
    })
  );
  await Promise.all(addPromises);
};

// LOAD tasks for the logged-in user
export const getTasksFromDB = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.warn("No user logged in. Cannot load tasks.");
    return [];
  }

  const colRef = collection(db, "users", user.uid, "tasks");

  const snapshot = await getDocs(colRef);

  const tasks: Task[] = [];

  snapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() } as Task);
  });

  return tasks;
};
