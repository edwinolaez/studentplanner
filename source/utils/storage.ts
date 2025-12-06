import { addDoc, collection, deleteDoc, doc, getDocs, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Task } from '../types';


const DEFAULT_USER_ID = 'VbW5sejndvTyP111OA1TZvsXcXX2';
const TASKS_COLLECTION = 'tasks';


export const saveTasksToDB = async (tasks: Task[]) => {
  // console.log('Saving tasks to database ------------------------------');
  const colRef = collection(db, TASKS_COLLECTION);

  // Delete all existing tasks
  // console.log('delet tasks from database ------------------------------',colRef);


  const tasksQuery = query(colRef);
  const querySnapshot = await getDocs(tasksQuery);

  try {
    const tasksQuery = query(colRef);
    const querySnapshot = await getDocs(tasksQuery);
    const deletePromises = querySnapshot.docs.map((postDoc) =>
      deleteDoc(doc(db, TASKS_COLLECTION, postDoc.id))
    );
    await Promise.all(deletePromises);
  } catch (error) {
    console.log(error);
  }
  



  // console.log('save new tasks ------------------------------');

  try {
    const colRef = collection(db, TASKS_COLLECTION);
    const addPromises = tasks.map((task) => 
      addDoc(colRef, task)
    );
    await Promise.all(addPromises);
  } catch (error) {
    console.log(error);
  }
  




};

export const getTasksFromDB = async () => {

  const colRef = collection(db, TASKS_COLLECTION);

  const tasksQuery = query(colRef);

  const querySnapshot = await getDocs(tasksQuery);


  const task: any[] = [];

  querySnapshot.forEach((doc) => {
    task.push({ id: doc.id, ...doc.data() });
  });

  // console.log('completed get tasks from database ------------------------------',task);
  return task;
}

