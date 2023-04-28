import logo from './logo.svg';

import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import Home from "./pages/Home"
import Event from "./pages/Event"
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from "./pages/Profile";
import {UserContext} from "./userContext";
import {useMemo, useState} from "react";
import CreateEventPage from "./pages/CreateEventPage";
import EditEvent from './pages/EditEvent';
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({user, setUser}), [user, setUser]);
  return (
    <BrowserRouter>
      <UserContext.Provider value={value}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/event/:eventID" element={<Event/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/createEventPage" element={<CreateEventPage/>}/>
          <Route path="/profile/:userID" element={<Profile/>}/>
          <Route path="/editEvent/:eventID" element={<EditEvent/>}/>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>

  );
}

export default App;
