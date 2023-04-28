import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "../components/Navbar";
import './Event.css';
import Shrek from '../components/shrekieBoi.jpg';
import { Card, Button, Typography, Rating, TextField, Modal, Box } from '@mui/material';
import { styled } from '@mui/system';
import { Icon } from '@iconify/react';
import TicketPopup from '../components/TicketPopup';
import {UserContext} from "../userContext";
import RecommendedCol from "../components/RecommendCol";
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { getGeocode, getLatLng } from "use-places-autocomplete";
import FollowButton from '../components/FollowButton';
import InfoBar from '../components/InfoBar';

const StyledCard = styled(Card)({
  width: '60%',
  margin: 'auto',
  marginTop: '50px',
  padding: '20px'
});

const StyledInputField = styled(TextField)({
  marginTop: '10px',
  marginBottom: '10px',
});

//The Event page displays key information about a particular event
//allows users to book tickets, leave review and view reviews
//allows organiser to delete and edit an event, and also reply to reviews
const Event = () => {

  const navigate = useNavigate()
  let { eventID } = useParams();
  const [event, setEvent] = React.useState('');
  const {user, setUser} = useContext(UserContext);
  const [userStarRating, setUserStarRating] = React.useState(1);
  const [review, setReview] = React.useState('');
  const [allReviews, setAllReviews] = React.useState([]);
  const [reload, setReload] = React.useState(true);
  const [attendees, setAttendees] = React.useState('');
  const [attendeeCount, setAttendeeCount] = React.useState(0);
  const { isLoaded } = useLoadScript({ 
    googleMapsApiKey: "AIzaSyBRosQizY_uZCn69ikMvCGSiCAchAAcsCU",
    libraries: ['places'],
  });
  const [latLng, setLatLng] = React.useState({lat:0, lng:0});
  const [curReviewID, setcurReviewID] = React.useState(null);
  const [hostReply, setHostReply] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [afterEvent, setAfterEvent] = React.useState(false);

  //get info needed to set info in event page
  React.useEffect(() => {
    
    //calls route to get all important info on the event
    const loadEvent = async () => {
      const response = await fetch(`http://localhost:5000/event/${eventID}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setEvent(data);
        //the backed passes in the number of credit points a user has, the frontend uses that to determine the amount of discount a user gets.
        if (user){
          if (user.creditPoints < 100) {
            setDiscount(0);
          }
          else if (user.creditPoints < 500) {
            setDiscount(0.05);
          }
          else if (user.creditPoints < 2000) {
            setDiscount(0.1);
          }
          else {
            setDiscount(0.2);
          }
        }
        
        //processes the event start and end times (given as strings), and seperate that into individual numbers for year, month and date
        let startMonth = data.startTimeandDate.split(' ')[2];
        let startMonthNum = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(startMonth) / 3 + 1 ;
        let startDate = data.startTimeandDate.split(' ').slice(1, 4).reverse();
        const startYear = parseInt(startDate[0]);
        const startDay = parseInt(startDate[2]);

        const curYear = new Date().getFullYear();
        const curMonth = new Date().getMonth() + 1;
        const currDay = new Date().getDate();

        //compare event start day with current day, and only allow comment if event has already happened
        if (curYear > startYear || (curYear === startYear && curMonth >  startMonthNum) || (curYear === startYear && curMonth ===  startMonthNum && currDay > startDay) ) {
          setAfterEvent(true);
        }
        
        let adr = data.location;
        //try getting the longtitude and latitude of the location, which is used to set up the pin on the map
        try {
          const results  = await getGeocode( { address: adr } );
          const { lat, lng } = await getLatLng(results[0]);
          setLatLng({ lat:lat, lng:lng})
        }
        finally {
          setAllReviews(data.reviews);
          loadAttendees();
        }

        
      }
    };
    loadEvent();
    
    //load name and follow button for all attendees of an event
    const loadAttendees = async () => {
      //calls backend
      const response = await fetch(`http://localhost:5000/event/getallAttendees/${eventID}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            "Authorization": user.token
          },
        });
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          //for each user, display their name, and a follow/unfollow button next to their name
          const att = data.map (person=> {
            return(
              <>
              <Typography style={{display: 'inline-block'}} variant='body1'  onClick = {() => {navigate(`/profile/${person.attendeeID}`)}}>{person.attendeeName}</Typography>
              {
                person.attendeeID !== user.userid ?
                (<FollowButton isFollowed = {person.isFollowed} otherID = {person.attendeeID} curUser = {user} setReload = {setReload} reload = {reload}/>):(<></>)
              }

              <br/>
              </>
            )
          })
          setAttendees(att);
          setAttendeeCount(data.length);

        }
    };
    
    }, [eventID, reload])
  
  //when the host click the option to reply to a particular review, make note of the review id
  const reply = (id) => {
    setHostReply('')
    setReload(!reload)
    if (id === curReviewID) {
      setcurReviewID(null);
    }
    else{
      setcurReviewID(id);
    }
  }

  //Calls api route to send user comment to backend
  const reviewEvent = async () => {
    const response = await fetch(`http://localhost:5000/review/new/${eventID}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': user.token
      },
      body: JSON.stringify(
        {
          "userID": user.userid,
          "comment": review,
          "rate": userStarRating
        }
      ),
    });
    if (response.status === 400) {
      alert("Error, cannot leave review!");
    }
    else {
      setReload(!reload);
    }
  }

  //Calls api route to cancel event when host clicks cancel button
  const cancelEvent = async () => {
    const response = await fetch(`http://localhost:5000/event/cancel/${eventID}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': user.token
      },
      
    });
    if (response.status === 400) {
      alert("Error, cancellation failed.");
    }
    else {
      navigate('/');
    }
  }

  //Calls api route for host to sent their reply to comment
  const sendHostReply = async () => {
    const response = await fetch(`http://localhost:5000/review/reply/${curReviewID}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': user.token
      },
      body: JSON.stringify(
        {
          "reply": hostReply,
        }
      ),
    });
    if (response.status === 400) {
      alert("Error, reply failed.");
    }
    else {
      setcurReviewID(null);
      setReload(!reload);
    }
  }

  
  return (
    <div>
      <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRosQizY_uZCn69ikMvCGSiCAchAAcsCU&callback=initMap"></script>
    
      <Navbar/>
      <div className='contentHolder'>
        
        {event.banner ? (<img src={event.banner} className='bannerPic' alt={"Shrek"}/>):(<img src={Shrek} className='bannerPic' alt={"Shrek"}/>)}
        {/**displays key information about the event */}
        <div className='belowImg'>
          
          <div className='infoHolder'>
          <br/>
          <br/>
            <Typography variant='h1' sx={{ fontWeight: 'bold', mb: 7 }}>{event.title}</Typography>
            <Typography variant='h6' sx={{mb: 4}} onClick = {() => {navigate(`/profile/${event.organiserId}`)}}>By: {event.organiserName}</Typography>
            <Typography variant='h6' sx={{mb: 4}}>Event Type: {event.eventType}</Typography>
            <Typography variant='h3' sx={{ fontWeight: 'bold', mb: 4 }}>When & Where</Typography>
            <div className='whenAndWhereHolder'>
              <div className='whenAndWhere'>
                <Icon icon="uil:calender"></Icon>
                <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>Date & Time</Typography>
                <Typography variant='body1' color="text.secondary" sx={{ mb: 4 }}>
                  Start: {event.startTimeandDate}
                  <br/>
                  End: {event.endTimeandDate}
                </Typography>
              </div>
              <div className='whenAndWhere'>
                <Icon icon="akar-icons:location"></Icon>
                <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>Location</Typography>
                <Typography variant='body1' color="text.secondary" sx={{ mb: 4 }}>
                  {event.location}
                </Typography>
                
              </div>
            </div>
            { isLoaded ? (
                <>
                  <GoogleMap zoom={15} center={latLng} mapContainerClassName='mapContainer'>
                    <MarkerF position={latLng}/>
                  </GoogleMap>
                  
                </>)
                
                :(<>LOADING......</>) 
            }
            <Typography variant='h3' sx={{ fontWeight: 'bold', mb: 4, mt: 4}}>About This Event</Typography>
            <Typography variant='body1' color="text.secondary" sx={{ mb: 4 }}>
              {event.description}
            </Typography>
            </div>
            <div className='bookingAndEdit'>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            {/*If user is logged in, allow them to book tickets*/}
            {user ? (
              <>
                {!afterEvent ? (
                   <StyledCard variant="outlined">
                   <Typography variant='h5'>${parseFloat(event.ticketPrice * (1 - discount)).toFixed(2)}</Typography>
                   <Typography variant='body1'>({discount * 100}% Discount Applied)</Typography>
                   <br/>
                   <TicketPopup event={event} cost={parseFloat(event.ticketPrice * (1 - discount)).toFixed(2)}/>
                   <br/>
                 </StyledCard>
                ):(<></>)}
              </>
             
            ) : (
              <div>
                <br/>
                <br/>
                <h2>You have to log in to book the event!</h2>
              </div>
            )}
            <br/>
            {/*If user is the organiser, they can cancel or edit an event*/}
            { user !== null && user.userid === event.organiserId && !afterEvent ? (
              <>
                <Button onClick={()=>{navigate(`/editEvent/${event.id}`, { state: { event: event } } )}}>Edit Event</Button>
                <Button onClick={()=>{cancelEvent()}}>Cancel Event</Button>
                
              </>
            ) : ( <></>)
            }
            {/*If user is logged in, they can view a list of attendess*/}
            {user ? (
              <>
              <Typography variant='h5'>Attendees ({attendeeCount})</Typography>
              {attendees}
              </>
            ):(<></>)}
            
          </div>
        </div>

      </div>

      <div className='reviewHolder'>
        {/**if an event has already occured, anyone can view reviews and host replies */}
        {afterEvent ? (<>

        <Typography variant='h3' sx={{ fontWeight: 'bold', mb: 4 }}>Reviews</Typography>
        {
          //for each review, show reviewer name, their rating, and their comment, as well as any host replies
          allReviews.map (review => {
            return (
              <div key={review}>
                <Typography variant='h6' fontWeight='bold' color="text.secondary" sx={{ mt : 6 }}>
                  {review.reviewerName}
                </Typography>
                
                <Rating
                  value={review.rating}
                  readOnly
                />
                <Typography variant='body1' color="text.secondary" sx={{ mb: 2 }}>
                  {review.comment}
                </Typography>
                {
                  review.hostReply.map(reply => {
                    return(
                      <>
                        <Typography variant='h6' fontWeight='bold' color="text.secondary" sx={{ mt : 1, ml : 3 }}>
                          {event.organiserName}(Host Reply):
                        </Typography>
                        <Typography variant='body1' color="text.secondary" sx={{ mb: 2, ml : 3 }}>
                          {reply.reply}
                        </Typography>
                      </>
                    )
                  })
                }
                {
                  //if the current user is the event organiser, they can reply to reviews
                  user !== null && user.userid === event.organiserId ?
                  (<>
                    {
                      curReviewID !== null && curReviewID === review.reviewId ?
                      (
                        <>
                        <StyledInputField
                          label="Reply To This Review"
                          multiline
                          rows={1}
                          fullWidth
                          onChange={(e) => setHostReply(e.target.value)}
                          sx={{ ml : 2 }}
                        />
                        <Button variant="contained" size="small" onClick={()=> sendHostReply()} sx={{ ml : 2 }}>Send Reply</Button>
                        
                        </>
                      ):
                      (<>
                        <Button id={review.reviewId} onClick = {()=>{reply(review.reviewId)}} sx={{ ml : 2 }}>Reply to Attendee</Button>
                      </>)
                      
                    }
                    
                  </>):
                  (<></>)
                }
          
              </div>
            )
          })
        }
        </>):
        
        (<></>)}

      </div>
      
      {/**Users can only leave a review if they are logged in, and it is after the event start date*/}
      {user && afterEvent ? (
        <div className='reviewHolder'>
          <Typography variant='h3' sx={{ fontWeight: 'bold', mb: 4 }}>Leave a Review</Typography>
          <Rating
            name="simple-controlled"
            onChange={(event, newValue) => {
              setUserStarRating(newValue);

            }}
          />
          <StyledInputField
            label="Review This Event"
            multiline
            rows={4}
            fullWidth
            onChange={(e) => setReview(e.target.value)}
          />
          <Button variant="contained" size="small" onClick = {()=>reviewEvent()}>
            Submit Review
          </Button>
        </div>
      ) : (
        <></>
      )}

      { user !== null ? (
        <>
          <br/>
          <h2>Recommendations For You:</h2>
          <br/>
          <RecommendedCol/>
        </>
      ) : ( <></>)
      }
      <InfoBar/>
    </div>
  )
}

export default Event
