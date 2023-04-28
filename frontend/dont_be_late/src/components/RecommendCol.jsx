import React, {useContext} from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import {useNavigate} from "react-router-dom";
import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@mui/material";
import Shrek from "./shrekieBoi.jpg";
import {UserContext} from "../userContext";

//a components which displays recommendations for a user based on past attendence
function RecommendedCol() {
  const [events, setEvents] = React.useState([]);
  const [notEnoughEvents, setNotEnoughEvents] = React.useState(false);
  const {user} = useContext(UserContext);

  //calls backend to get event recommendations for a user
  React.useEffect(() => {
    const loadEvents = async () => {
      const response = await fetch(`http://localhost:5000/event/recommendations/${user.userid}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.error) {
        setNotEnoughEvents(true)
      } else {
        setEvents(data)
      }
    }
    loadEvents()
  }, [])


  return (
    <>
    {
      notEnoughEvents ? (
        <>
        Please attend more events to recieve recommendations!
        </>
      ):(<>
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
        {events.map(event => (
          <CardBox
            key={event.id}
            event = {event}
          />
        ))}
        </ScrollMenu>
      </>)
    }
    </>
  );
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <Arrow disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
      Left
    </Arrow>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <Arrow disabled={isLastItemVisible} onClick={() => scrollNext()}>
      Right
    </Arrow>
  );
}

function Arrow({
                 children,
                 disabled,
                 onClick,
                 className,
               }: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: VoidFunction;
  className?: String;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={'arrow' + `-${className}`}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        right: '1%',
        opacity: disabled ? '0' : '1',
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  );
}

function CardBox({event}) {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: 200, height: 300, margin: 5}} onClick={()=> {navigate('/event/' + event.id)}}>
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
  );
}

export default RecommendedCol;