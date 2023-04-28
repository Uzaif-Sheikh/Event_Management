import React,  { useState, useContext , useRef }from 'react';
import './CreateEvent.css';
import Navbar from '../components/Navbar';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TextField, MenuItem, Stack, Button, Autocomplete} from '@mui/material';
import { styled } from '@mui/system';
import { useFormik } from "formik";
import * as Yup from 'yup';
import {UserContext} from "../userContext";
import Shrek from '../components/shrekieBoi.jpg';
import usePlacesAutocomplete from "use-places-autocomplete";


const StyledInputField = styled(TextField)({
  marginTop: '10px',
  marginBottom: '10px',
  marginRight: '20px'
});

//validation schema to check that the event details entered by user is valid
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .max(30, 'Title must be no longer than 30 characters'),
  eventType: Yup.string()
    .required('Event type is required'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be no shorter than 10 characters'),
  totalTicketQuantity: Yup.string()
    .required('Total ticket quantity is required'),
  ticketPrice: Yup.string()
    .required('Ticket Price is required'),
});

const EventTypes = ['Camp Trip, or Retreat', 'Competition', 'Conference', 'Festival', 'Food & Drink', 'Live Music', 'Networking Event', 'Party or Social Gathering', 'Tour', 'Other']

//the EditEvent page allows the creator of existing events to change key event informations (such as date).
export default function EditEvent() {

  const navigate = useNavigate();
  let { eventID } = useParams();
  const { state } = useLocation();
  const {user, setUser} = useContext(UserContext);
  const [image, setImage] = React.useState(Shrek);
  let fileInput = React.createRef(); 
  const [location, setLocation] = useState(null);

  const event = state.event;

  //processes the event start and end times (given as strings), and seperate that into individual numbers for year, month and date
  //this is used to fill in the initial values of the form, showing the old info about the event
  let startMonth = event.startTimeandDate.split(' ')[2];
  let startMonthNum = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(startMonth) / 3 + 1 ;
  let startDate = event.startTimeandDate.split(' ').slice(1, 4).reverse();
  startDate[1] = startMonthNum;
  startDate = startDate.join("-");

  let endMonth = event.endTimeandDate.split(' ')[2];
  let endMonthNum = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(endMonth) / 3 + 1 ;
  let endDate = event.endTimeandDate.split(' ').slice(1, 4).reverse();
  endDate[1] = endMonthNum;
  endDate = endDate.join("-");

  //compiles user input into a dict, then passing that onto the backend
  const editEvent = async (values) => {

    //taking the banner image uploaded by event creator, calling cloudinary api, which returns a short url to the image
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "dontBeLate");
    data.append("cloud_name","do3jhsuyg");
    fetch("https://api.cloudinary.com/v1_1/do3jhsuyg/image/upload",{
      method:"post",
      body: data
    })
    .then(resp => resp.json())

    .then(
      //create a dict, containing all event information that gets passed into backend
      data=> {
        console.log(data.url);
        values['banner'] = data.url;
        values['organiserId'] = user.userid
        values['availableTicketQuantity'] = formit.values.totalTicketQuantity;
        values["organiserName"] = user.userName;
        values['startTimeandDate'] = formit.values.startDate + " " + formit.values.startTime;
        values['endTimeandDate'] = formit.values.endDate + " " +formit.values.endTime;
        values['location'] = location;

        //calling the backend
        fetch(`http://localhost:5000/event/${eventID}`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            'Authorization': user.token,
          },
          body: JSON.stringify( values ),
        })
        .then(
          (resp) => {
            if (resp.status === 400) {
              alert("Error, this event was not successfully modified.");
            }
            navigate('/');
          }
        )

      }

    )
    .catch(err => console.log(err));

  }

  const formit = useFormik({
    initialValues: {
      title: event.title,
      eventType: event.eventType,
      description: event.description,
      location: event.location,
      startDate: startDate,
      startTime: event.startTimeandDate.split(' ')[4],
      endDate: endDate,
      endTime: event.endTimeandDate.split(' ')[4],
      totalTicketQuantity: event.totalTicketQuantity,
      ticketPrice: event.ticketPrice,
      banner: event.banner,
    },
    onSubmit: values => {
      editEvent(values);
      navigate('/');
    },
    validationSchema
  });

  return (<>
    <Navbar/>
    <div className='textHolder'>
      <Button onClick={()=>{navigate('/')}}>&lt; events</Button>
      <form className='fields' onSubmit={formit.handleSubmit}>

        <div className={"formControl"}>
          <h1>Basic Info</h1>
          {/**Input field for event title*/}
          <StyledInputField
            type = "text"
            id={'title'}
            name={'title'}
            label={"Event Title"}
            fullWidth
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.title}
          /><br/>
          {formit.touched.title && formit.errors.title ? <div className={'error'}>{formit.errors.title}</div> : null}
        </div>

        <div className={"formControl"}>
          {/**Input field for event type*/}
          <StyledInputField
            type = "text"
            id={'eventType'}
            name={'eventType'}
            label={"Event Type"}
            select
            helperText="Please select your event type"
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.eventType}
          >
            {/**A dropdown menu, showing all possibel event types*/}
            {EventTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledInputField>
          {formit.touched.eventType && formit.errors.eventType ? <div className={'error'}>{formit.errors.eventType}</div> : null}
        </div>

        <h1>Location</h1>
      
        <PlacesAutocomplete setLocation={setLocation} />

        <h1>Date and Time</h1>
        <div className={"formControl"}>
          {/**Input field for event start date*/}
          <StyledInputField
            type = "date"
            id={'startDate'}
            name={'startDate'}
            label={"Start Date"}
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.startDate}
          />
          {/**Input field for event start time*/}
          <StyledInputField
            type = "time"
            id={'startTime'}
            name={'startTime'}
            label={"Start Time"}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: 150 }}
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.startTime}
          />
        </div>

        <div className={"formControl"}>
          {/**Input field for event end date*/}
          <StyledInputField
            type = "date"
            id={'endDate'}
            name={'endDate'}
            label={"End Date"}
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.endDate}
          />
          {/**Input field for event end time*/}
          <StyledInputField
            type = "time"
            id={'endTime'}
            name={'endTime'}
            label={"End Time"}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: 150 }}
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.endTime}
          />
        </div>

        <h1>Details</h1>
        <div className={"formControl"}>
          {/**Input field for event details*/}
          <StyledInputField
            type = "text"
            id={'description'}
            name={'description'}
            label={"Event Details"}
            multiline
            rows={4}
            fullWidth
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.description}
          /><br/>
          {formit.touched.description && formit.errors.description ? <div className={'error'}>{formit.errors.description}</div> : null}
        </div>
        
        <Button onClick={() => {fileInput.current.click() }}>
          Upload a Banner Image
        </Button>
        {/**Input field for image upload*/}
        <input
          type="file"
          accept='image/*'
          style={{display: 'none'}}
          name="myImage"
          onChange={(e)=> setImage(e.target.files[0])}
          ref={fileInput}
        />
        <div>{image === '' ? "Please Upload" : "Image Uploaded"}</div>
      

        <h1>Tickets</h1>
        <div className={"formControl"}>
          {/**Input field for ticket quantity*/}
          <StyledInputField
            type = "number"
            id={'totalTicketQuantity'}
            name={'totalTicketQuantity'}
            label={"Total Quantity"}
            fullWidth
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.totalTicketQuantity}
          /><br/>
          {formit.touched.totalTicketQuantity && formit.errors.totalTicketQuantity ? <div className={'error'}>{formit.errors.totalTicketQuantity}</div> : null}
        </div>

        <div className={"formControl"}>
          {/**Input field for ticket price*/}
          <StyledInputField
            type = "number"
            id={'ticketPrice'}
            name={'ticketPrice'}
            label={"Price"}
            fullWidth
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.ticketPrice}
          /><br/>
          {formit.touched.ticketPrice && formit.errors.ticketPrice ? <div className={'error'}>{formit.errors.ticketPrice}</div> : null}
        </div>

        <Button variant="contained" size="large" type={'submit'}>SUBMIT </Button>
      </form>
    </div>
  </>)
}

//A component that handles the autocomplete location suggestion
const PlacesAutocomplete = ({ setLocation }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleChange = (event, value) => {
    setLocation(value)
  }

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={
          data.map(({ place_id, description }) => (
            description
          ))
        }
        
        sx={{ width: 300 }}
        onChange={ (event, value) => handleChange (event, value)}
        renderInput={(params) => <TextField 
          {...params} 
          label="Seach an Address" 
          value={value}
          onChange = {(e) => setValue(e.target.value)}
        
        />}
      />
    </>
  );
};
