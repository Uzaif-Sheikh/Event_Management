import React, {useContext} from 'react';
import Navbar from '../components/Navbar';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActionArea,
  } from "@mui/material";
import Shrek from '../components/shrekieBoi.jpg';
import {UserContext} from "../userContext";
import RecommendCol from "../components/RecommendCol";
import CarouselCol from "../components/CarouselCol";
import InfoBar from '../components/InfoBar';


//this is where all the upcoming events are listed
const Home = () => {
    const navigate = useNavigate();
    const [searchString, setSearchString] = React.useState('');
    const [events, setEvents] = React.useState('');
    const {user} = useContext(UserContext);

    
    const update = (str) => {
        setSearchString(str.toLowerCase())
    }

    React.useEffect(() => {
    //calls the backend to gett all summary information about an event
    const loadEvents = async () => {
        const response = await fetch('http://localhost:5000/event/getall', {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.error) {
          alert(data.error)
        } else {
          listings(data)
        }
      }
    loadEvents()
    }, [searchString])
    
    
    const listings = (list) => {
      const e = list.events.map (event => {
        //processes the event start and end times (given as strings), and seperate that into individual numbers for year, month and date
        let startMonth = event.startTimeandDate.split(' ')[2];
        let startMonthNum = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(startMonth) / 3 + 1 ;
        let startDate = event.startTimeandDate.split(' ').slice(1, 4).reverse();
        const startYear = parseInt(startDate[0])
        const startDay = parseInt(startDate[2])

        const curYear = new Date().getFullYear();
        const curMonth = new Date().getMonth() + 1;
        const currDay = new Date().getDate();

        //only shows event which matches the search string, has available tickets, and start on or after the current date
        if ((event.title.toLowerCase().includes(searchString) || event.eventType.toLowerCase().includes(searchString)) && event.availableTickets > 0 && (curYear < startYear || (curYear === startYear && curMonth <  startMonthNum) || (curYear === startYear && curMonth ===  startMonthNum && currDay <= startDay) ) ) {
          //returns a card, showing key information on an event
          return (
            <Card sx={{ maxWidth: 345, marginBottom: 2}} onClick={()=> {navigate('/event/' + event.id)}} key = {event.id}>
              <CardActionArea>
                {event.banner ? (
                  <CardMedia
                    component="img"
                    height="150"
                    image={event.banner}
                    resizemode="contain"
                    alt="eventBanner"
                  />
                  )
                  :(<CardMedia
                    component="img"
                    height="150"
                    image={Shrek}
                    resizemode="contain"
                    alt="green shrek"
                  />
                )}

                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {event.title}
                  </Typography>
                  <Typography gutterBottom variant="h9" component="div">
                    From {event.startTimeandDate} to {event.endTimeandDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {event.address}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
        )
      }
      })
      setEvents(e)
    }

    
    return (
        <div>
          <Navbar updateSearchWord={update}/>
          
          <CarouselCol></CarouselCol>
          <div id={"homeContainer"}>
            <h2>Current Trending Events:</h2>
            <br/>
            <div className={"homeCard"}>
              {events}
            </div>

            { user !== null ? (
              <>
                <br/>
                <h2>Recommendations For You:</h2>
                <br/>
                <RecommendCol/>
                <br/>
                <br/>
              </>
            ) : ( <></>)
            }
          </div>

          <InfoBar/>
        </div>

    )
}

export default Home