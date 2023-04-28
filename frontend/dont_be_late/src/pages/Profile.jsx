import React, {useContext, useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import {useNavigate} from "react-router-dom";
import {UserContext} from "../userContext";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import './profile.css'
import FollowButton from '../components/FollowButton';
import { deepPurple } from '@mui/material/colors';
import InfoBar from '../components/InfoBar';


const hostingColumns = [
  { field: 'title', headerName: 'Event Title', width: 200 },
  { field: 'eventType', headerName: 'Type', width: 70 },
  { field: 'totalTicketQuantity', headerName: 'Total Tickets', type: 'number', width: 60 },
  { field: 'ticketPrice', headerName: 'Ticket Price', type: 'number', width: 100 },
  { field: 'startTimeandDate', headerName: 'Start Time', width: 150 },
  { field: 'endTimeandDate', headerName: 'End Time', width: 150 },
];

const attendingColumns = [
  { field: 'title', headerName: 'Event Title', width: 200},
  { field: 'eventID', headerName: 'Event ID', width: 70 },
  { field: 'quantity', headerName: 'Quantity', width: 80 },
  { field: 'startTimeandDate', headerName: 'Start Time', width: 180 },
  { field: 'endTimeandDate', headerName: 'End Time', width: 180 }
];

const messageColumns = [
  { field: 'eventID', headerName: 'Event ID', width: 75 },
  { field: 'string', headerName: 'Message', width: 1000 }
];

//Profile page shows information about a user. Including their name, tier, events they're attending, and events they're hosting
function Profile () {
  const navigate = useNavigate();
  //note that userID is the id of the person whos profile is being viewed, this is different to user, which is whoever is currently logged in
  let { userID } = useParams();
  const {user, setUser} = useContext(UserContext);
  let [attendingEventLists, setAttendingEventData] = useState([]);
  let [hostingEventLists, setHostingEventData] = useState([]);
  let [messageLists, setMessageLists] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [reload, setReload] = useState(true);
  const [followed, setFollowed] = React.useState('');
  const [initial, setInitial] = React.useState(stringAvatar('unknown'));

  userID = parseInt(userID);

  useEffect(() => {
    // Fetch attending event data
    fetch(`http://localhost:5000/booking/getall/${userID}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setAttendingEventData(data["bookings"]);
      })

    // Fetch hosting event data
    fetch(`http://localhost:5000/event/getall/${userID}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        })
    .then(response => response.json())
    .then(data => {
      setHostingEventData(data["events"]);
    })

    // Fetch User Messages
    fetch(`http://localhost:5000/messages/getall/${userID}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        })
    .then(response => response.json())
    .then(data => {
      setMessageLists(data["message"]);
    })

    // Fetch User Follows
    fetch(`http://localhost:5000/friend/getallfollowed/${userID}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        })
    .then(response => response.json())
    .then(data => {
      const followed = data.map (person=> {
            return(
              <>
              <Typography style={{display: 'inline-block'}} variant='body1'  onClick = {() => {navigate(`/profile/${person["userID"]}`)}}>{person["name"]}</Typography>
              <br/>
              </>
            )
          })
      setFollowed(followed);
    })


    let token = ''
    if (user) {
      token = user.token
    }
   

    //Fetch user information
    fetch(`http://localhost:5000/friend/user/${userID}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Authorization': token
          },
        })
    .then(response => response.json())
    .then(data => {
      //given the number of credit points that a user has, calculate their tier, how many points to the next tier, and what the next tier it
      if (data['creditPoint'] < 100){
        data['tier'] = 'Bronze';
        data['additionalPoints'] = 100 - data['creditPoint'];
        data['percentage'] = parseInt(data['creditPoint']/100 * 100);
        data['nextTier'] = 'Silver'
      }
      else if (data['creditPoint'] < 500){
        data['tier'] = 'Silver';
        data['additionalPoints'] = 500 - data['creditPoint'];
        data['percentage'] = parseInt(data['creditPoint']/500 * 100);
        data['nextTier'] = 'Gold'
      }
      else if (data['creditPoint'] < 2000){
        data['tier'] = 'Gold';
        data['additionalPoints'] = 2000 - data['creditPoint'];
        data['percentage'] = parseInt(data['creditPoint']/2000 * 100);
        data['nextTier'] = 'Diamond'
      }
      else {
        data['tier'] = 'Diamond'
        data['additionalPoints'] = 0
        data['percentage'] = 100
      }
      setInitial(stringAvatar(data.userName))
      setUserInfo(data);
    })

  },[reload, userID])

  //calls the backend so that a user can cancel their tickets to an event they're attending
  const removeAttendingEvent = async (bookingId) => {
    const resp = await fetch(`http://localhost:5000/booking/del/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token
      }
    });
    if (!resp.ok) {
      alert("Removing Attending Event Unsuccessfully, Please try again!");
    }
    else {
      navigate('/');
    }
  }

  //calls the backend so that a user can cancel an event they're organising
  const removeHostingEvent = async (eventID) => {
    const response = await fetch(`http://localhost:5000/event/cancel/${eventID}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': user.token
      },

    });
    if (response.status === 400) {
      alert("Removing Event Unsuccessfully, Please try again!");
    }
    else {
      {navigate('/')}
    }
  }
  
  //list of events that the user is hosting
  const actionColumnsHosting = [
    {
      field: "action",
      headerName: "Action",
      width: "200",
      renderCell: (params) => {
        return (
          <div>
            <Button size={'small'} variant="outlined" color="success" onClick={()=> {navigate('/event/' + params.row.id)}}>
              View
            </Button>
            {
              (user && userID === user.userid) ?
                (<Button size={'small'} variant="outlined" color="error" onClick={() => {
                  removeHostingEvent(params.row.id)
                }}>
                  Remove
                </Button>)
                :
                (
                  <></>
                )
            }

          </div>
        );
      },
    },
  ];

  //list of events which a user is attending
  const actionColumnsAttending = [
    {
      field: "action",
      headerName: "Action",
      width: "200",
      renderCell: (params) => {
        return (
          <div>
            <Button size={'small'} variant="outlined" color="success" onClick={()=> {navigate('/event/' + params.row.eventID)}}>
              View
            </Button>
            {
              isShowingRemove(params.row.startTimeandDate) &&  (user && userID === user.userid)?
              (
                <Button size={'small'} variant="outlined" color="error" onClick={() => {
                  removeAttendingEvent(params.row.id)
                }}>
                  Remove
                </Button>
              ):
              (
                <></>
              )
            }
          </div>
        );
      },
    },
  ];

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
  };

  function stringAvatar(name) {
    return {
      children: `${name[0][0]}`,
    };
  }

  function isShowingRemove(startTime) {
    let startDate = new Date(startTime);
    let currentDate = new Date();
    let diff = (startDate - currentDate);
    let diffInDays = Math.floor(diff/(24*60*60));
    return diffInDays >= 7;
  }

  
  return (
    <div>
      <Navbar/>
      <br/>
      <div id={"profilePage"}>
        <div className={'personalInfo'}>
          <Avatar id={"profilePic"} sx={{ bgcolor: deepPurple[500] }} {...initial}></Avatar>
          <h1>{userInfo.userName}</h1>
          {
            /**only allow following if userID of the profile im viewing is different from the userid of the current user */
            user && parseInt(userID) !== parseInt(user.userid) ?
            (<FollowButton isFollowed = {userInfo.isFollowed} otherID = {userID} curUser = {user} setReload = {setReload} reload = {reload}/>):(<></>)
          }

          <div id={"loyaltyStatus"}>
            <div>
              <h5>{userInfo.tier === "Bronze" ? (<img className='logo' src={'/bronze.png'}/>):(<></>)}
              {userInfo.tier === "Silver" ? (<img className='logo' src={'/silver.png'}/>):(<></>)}
              {userInfo.tier === "Gold" ? (<img className='logo' src={'/gold.png'}/>):(<></>)}
              {userInfo.tier === "Diamond" ? (<img className='logo' src={'/diamond.png'}/>):(<></>)}
              {userInfo.tier} Member</h5></div>
            <div>{userInfo.creditPoint} Status Credits</div>
            {userInfo.creditPoint >= 2000 ?
              (
                <>{userInfo.userName} has reached our exclusive Diamond Tier!</>
              ):(
                <div>{userInfo.userName} needs {userInfo.additionalPoints} more points to become a {userInfo.nextTier} member...</div>
              )
            }
            

            <Box sx={{ width: '90%', marginTop: "1%" }} id={"progressBarBox"}>
              <LinearProgressWithLabel variant="determinate" value={userInfo.percentage} />
            </Box>

          </div>
          {/**a user cannot follow or unfollow themselves */}
          { user && parseInt(userID) == parseInt(user.userid) ? (
              <>
              <br></br>
              <h5>Followed</h5>
              {followed}
              </>
            ):(<></>)}
        </div>
        <div id={"eventsSection"}>
          <div className={'attendingEvents'}>
            <br/>
            <h2>Attending Events</h2>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={attendingEventLists}
                columns={attendingColumns.concat(actionColumnsAttending)}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
              />
            </div>
          </div>
          <br/>
          <div className={'hostingEvents'}>
            <h2>Hosting Events</h2>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={hostingEventLists}
                columns={hostingColumns.concat(actionColumnsHosting)}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
              />
            </div>
          </div>
          <br/>
          {
            /**only allow following if userID of the profile im viewing is different from the userid of the current user */
            user && parseInt(userID) === parseInt(user.userid) ?
            (<div className={'messages'}>
            <h2>Messages</h2>
            <div style={{ height: 400, width: '100%'}}>
              <DataGrid
                getRowId={(row) => row.eventID}
                rows={messageLists}
                columns={messageColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
              />
            </div>
            <br/>
          </div>):(<></>)
          }
        </div>

      </div>
      <InfoBar/>
    </div>
  )
}

export default Profile;