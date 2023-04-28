import React,  { useState, useContext , useRef }from 'react';
import './CreateEvent.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { TextField, MenuItem, Stack, Button, Autocomplete } from '@mui/material';
import { styled } from '@mui/system';
import { useFormik } from "formik";
import * as Yup from 'yup';
import {UserContext} from "../userContext";
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

//the CreateEventPage allows logged in user to create an event by typing in key information. They can submit event details, which will be passed onto the backend.
export default function CreateEventPage() {
  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext);
  const [image, setImage] = React.useState('');
  let fileInput = React.createRef(); 
  const [location, setLocation] = useState(null);


  const createEvent = async (values) => {
    const data = new FormData()

    //taking the banner image uploaded by event creator, calling cloudinary api, which returns a short url to the image
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
        values['banner'] = data.url;
        values['organiserId'] = user.userid
        values['availableTicketQuantity'] = formit.values.totalTicketQuantity;
        values["organiserName"] = user.userName;
        values['startTimeandDate'] = formit.values.startDate + " " + formit.values.startTime;
        values['endTimeandDate'] = formit.values.endDate + " " +formit.values.endTime;
        values['location'] = location;
        
        //calling the backend
        fetch('http://localhost:5000/event/create', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': user.token,
          },
          body: JSON.stringify( values ),
        })
        .then(
          (resp) => {
            if (resp.status === 400) {
              alert("Error! Event was not created.");
            }
            navigate('/');
          }
        )

      }

    )
    .catch(err => console.log(err))
    

  }

  const formit = useFormik({
    initialValues: {
      title: "",
      eventType: "",
      description: "",
      location: "",
      startDate: "2023-10-10",
      startTime: "07:30",
      endDate: "2023-10-10",
      endTime: "07:30",
      totalTicketQuantity: 0,
      ticketPrice: 0,
      banner: '',
    },
    onSubmit: values => {
      createEvent(values);
      navigate('/');
    },
    validationSchema
  });

  return (<>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRosQizY_uZCn69ikMvCGSiCAchAAcsCU&callback=initMap"></script>
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
            {EventTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </StyledInputField>
          {formit.touched.eventType && formit.errors.eventType ? <div className={'error'}>{formit.errors.eventType}</div> : null}
        </div>

        <h1>Location</h1>
        
        {/**Input field for event location*/}
        <PlacesAutocomplete setLocation={setLocation} />
           
        <br/>
          

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
              step: 300
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

        <div className={"formControl"}>
          {/**Option tick for allowing user to purchase vip ticket*/}
          <StyledInputField
            type = "checkbox"
            id={'VIPTicketCheckbox'}
            name={'VIPTicketCheckbox'}
            label={"Allow VIP select prioritised seats"}
            sx={{ width: 200 }}
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
