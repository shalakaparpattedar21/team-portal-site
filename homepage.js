import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Track selected task
let selectedTaskId = null;
let userRole = "user"; // default role

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      userRole = userDoc.data().role || "user";
      if (userRole === "mentor") {
        document.getElementById("mentorTaskFields").style.display = "block";
      }
      loadTasks();
    } else {
      console.error("User document not found.");
    }
  } else {
    window.location.href = "/login.html";
  }
});

// Load all tasks into table
async function loadTasks() {
  const tasksSnapshot = await getDocs(collection(db, "tasks"));
  const tableBody = document.getElementById("taskTableBody");
  tableBody.innerHTML = "";

  tasksSnapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${task.memberName}</td>
      <td>${task.dateAssigned}</td>
      <td>${task.task}</td>
      <td>${task.dueDate}</td>
      <td>${task.status}</td>
    `;

    // Click row to edit task
    row.addEventListener("click", () => {
      selectedTaskId = docSnap.id;
      if (userRole === "mentor") {
        document.getElementById("taskTitle").value = task.task;
        document.getElementById("taskDueDate").value = task.dueDate;
      }
      document.getElementById("taskStatus").value = task.status;
    });

    tableBody.appendChild(row);
  });
}

// Submit updated task
document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedTaskId) return alert("Please select a task to update.");

  const updates = {
    status: document.getElementById("taskStatus").value
  };

  if (userRole === "mentor") {
    updates.task = document.getElementById("taskTitle").value;
    updates.dueDate = document.getElementById("taskDueDate").value;
  }

  await updateDoc(doc(db, "tasks", selectedTaskId), updates);
  alert("Task updated successfully.");
  loadTasks();
});
