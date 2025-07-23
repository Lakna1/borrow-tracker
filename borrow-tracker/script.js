// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCI8i9neIug1BpVOIfZ2oxd0ECnhpUYQYc",
  authDomain: "borrow-tracker-cdef8.firebaseapp.com",
  projectId: "borrow-tracker-cdef8",
  storageBucket: "borrow-tracker-cdef8.firebasestorage.app",
  messagingSenderId: "333157545548",
  appId: "1:333157545548:web:56d7a81c3d2dddd54626e9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('borrowForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const item = document.getElementById('item').value;
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const due = document.getElementById('due').value;

  await addDoc(collection(db, "items"), {
    item, from, to, due, status: "active"
  });

  document.getElementById('borrowForm').reset();
  loadItems();
});

async function loadItems() {
  const querySnapshot = await getDocs(collection(db, "items"));
  const now = new Date().toISOString().split('T')[0];
  const currentTable = document.querySelector("#currentTable tbody");
  const historyTable = document.querySelector("#historyTable tbody");
  currentTable.innerHTML = "";
  historyTable.innerHTML = "";

  querySnapshot.forEach(async (docSnap) => {
    const data = docSnap.data();
    const row = `
      <tr>
        <td>${data.item}</td>
        <td>${data.from}</td>
        <td>${data.to}</td>
        <td>${data.due}</td>
        <td>${data.status === "archived" ? "✔️ Returned/Overdue" : "⏳ Borrowed"}</td>
      </tr>
    `;
    if (data.status === "archived" || data.due < now) {
      if (data.status !== "archived") {
        await updateDoc(doc(db, "items", docSnap.id), { status: "archived" });
      }
      historyTable.innerHTML += row;
    } else {
      currentTable.innerHTML += row;
    }
  });
}

loadItems();
