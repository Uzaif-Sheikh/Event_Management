import React, {useContext} from 'react'
import "./Navbar.css"
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {Avatar} from "@mui/material";
import {UserContext} from "../userContext";
import { deepPurple } from '@mui/material/colors';

//a component that is displayed at the top of the home page
const Navbar = ( {updateSearchWord} ) => {
    const navigate = useNavigate();
    const [searchString, setSearchString] = React.useState('');
    const {user, setUser} = useContext(UserContext);
    const processKeyDown = (e)=>{
      if (e.key === 'Enter') {
          updateSearchWord(searchString);
          e.preventDefault();
      }
    }

    const processInputChange = (e) => {
        e.preventDefault();
        setSearchString(e.target.value);
    }

    //calls backend to logout user
    const logout = async (token) => {
        const resp = await fetch('http://localhost:5000/auth/logout', {
            method: 'POST',
            headers: {
                "Authorization": token
            }
        });
        if (!resp.ok) {
            alert("Invalid Token Detail!");
        }
        else {
            navigate('/');
            setUser(null);
        }
    }

    function stringAvatar(name) {
        return {
            children: `${name[0][0]}`,
        };
    }

    return (
      <div className='navBar'>
        <div className='navContainer'>
          <img className='logo' onClick={()=> navigate('/')} src={'/dont-be-late.png'}/>
          <Paper
              component="form"
              sx={{ p: '1px 3px', display: 'flex', alignItems: 'center', width: 400, height: 30}}
          >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Popular Events"
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={(e)=>{processInputChange(e)}}
                onKeyDown={(e)=>{processKeyDown(e)}}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={()=> {updateSearchWord(searchString)}}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <div className="navItems">
            {user ? (
              <div>
                <Button className="navButton" onClick={() => {navigate('/createEventPage')}}>
                  Create an Event
                </Button>
                <Button className="navButton" onClick={() => {navigate(`/profile/${user.userid}`)}}>
                  <Avatar sx={{ bgcolor: deepPurple[500] }} {...stringAvatar(user.userName)} />
                </Button>
                <Button className="navButton" onClick={() => {
                  logout(user.token);
                }}>
                  Logout
                </Button>
              </div>
              ) : (
                <div>
                  <Button className="navButton" onClick={() => {navigate('/login')}}>
                    Login
                  </Button>
                  <Button className="navButton" onClick={() => {navigate('/register')}}>
                    Register
                  </Button>
                </div>
              )
            }
          </div>
      </div>
    </div>
  )
}

export default Navbar