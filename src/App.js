import './App.css'

import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth"
import { collection, getFirestore, query, orderBy, limit, serverTimestamp, setDoc, doc, addDoc } from "firebase/firestore"
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRef, useState } from 'react'

const firebaseConfig = {
  apiKey: "AIzaSyB6JdPrt6P16JfGAhXfJgBaFWnSoPRL2Hs",
  authDomain: "superchat-b588e.firebaseapp.com",
  databaseURL: "https://superchat-b588e-default-rtdb.firebaseio.com",
  projectId: "superchat-b588e",
  storageBucket: "superchat-b588e.appspot.com",
  messagingSenderId: "428501632822",
  appId: "1:428501632822:web:352d8b9bba198942d05597",
  measurementId: "G-6VGNT7S84K"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app);

function App() {
  const [user] = useAuthState(auth)
  
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut></SignOut>
      </header>
      <section>
        { user ? <ChatRoom /> : < SignIn /> }
      </section>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }
  
  return (
    <button onClick={signInWithGoogle}>Sign In With Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => signOut(auth)}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef()

  const messagesRef = collection(db, 'messages')

  const q = query(messagesRef, orderBy('createdAt'), limit(25))

  const [value, loading, error] = useCollection(q, {idField: 'id'})

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
      <>
        <main>
          {value && value.docs.map(
            doc => <ChatMessage key={doc.id} message={doc.data()} />
          )}
          <div ref={dummy}></div>
        </main>
        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
          <button type='submit'>🕊️</button>
        </form>
      </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )

}

export default App
