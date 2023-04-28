import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import './TicketPopup.css'
import { Popup } from "reactjs-popup";
import { Button, Typography, TextField } from '@mui/material';
import { styled } from '@mui/system';
import {UserContext} from "../userContext";
import { useFormik } from "formik";
import * as Yup from 'yup';


const contentStyle = {
  width: "70%",
  background: 'white'
};

const StyledInputField = styled(TextField)({
  marginTop: '10px',
  marginBottom: '10px',
  marginRight: '20px',
});

const StyledInputField2 = styled(TextField)({
  marginTop: '10px',
  marginBottom: '10px',
  marginRight: '20px',
  width: '200px'
});

const validationSchema = Yup.object({
  cardNumber: Yup.string()
    .required('Card number is required'),
  expirationDate: Yup.string()
    .required('Expiration Date is required'),
  securityCode: Yup.string()
    .required('Security Code is required'),
  cardName: Yup.string()
    .required('Card Holer Name is required'),
 
});

//A component that pops up, allowing users to select ticket quantity and pay for tickets.
const TicketPopup = ( {event, cost} ) => {
  const navigate = useNavigate();
  const quantity = event.availableTicketQuantity
  const [ticketCount, setTicketCount] = React.useState(1);
  const [bookingStage, setBookingStage] = React.useState(true);

  //set initial values of payment form, autofill based on card informaton saved
  const {user, setUser} = useContext(UserContext);
  const formit = useFormik({
    initialValues: {
      cardName: user.cardName,
      cardNumber: user.cardNumber,
      expirationDate: user.expiryDate,
      securityCode: user.securityCode,

    },
    onSubmit: values => {
      createBooking(values);
      navigate('/');
    },
    validationSchema
  });

  //call the backend to send booking information
  const createBooking = async (values) => {
    values['userID'] = user['userid']
    values['quantity'] = parseInt(ticketCount)
    const resp = await fetch(`http://localhost:5000/booking/new/${event['id']}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token
      },
      body: JSON.stringify(
        values
      )
      
    });
    if (!resp.ok) {
      alert("Cannot book!");
    }
    else {
      const data = await resp.json();
      navigate('/');
      return data;
    }
  }

  const handleCheckout = ()=> {
    setBookingStage(false)
  }

  return (<>
  <Popup
    trigger={<Button variant='contained'>Tickets</Button>}
    modal
    contentStyle={contentStyle}
  >
    {close => (
      <div className="modal1">
        <a className="close" onClick={close}>
          &times;
        </a>
        <div className="header"> 
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1 }}>{event.title} </Typography>
         
        </div>
        {/**event summary and ticket quantity selection*/}
        <div className="content" style={{display: bookingStage ? 'flex' : 'none'}}>
          <div className='orderInfo'>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 1 }}>Admission To {event.title}</Typography>
            <Typography variant='subtitle1' sx={{ mb: 1 }}>${cost}</Typography>
            <Typography variant='subtitle1' sx={{ mb: 1 }} display="inline">Start Time: </Typography>
            <Typography variant='body1' color="text.secondary" sx={{ mb: 1 }} display="inline">{event.startTime}</Typography>
            <br/>
            <Typography variant='subtitle1' sx={{ mb: 1 }} display="inline">Location: </Typography>
            <Typography variant='body1' color="text.secondary" sx={{ mb: 1 }} display="inline">{event.location}</Typography>
            <br/>
            <StyledInputField2
              name="maxNodeSelectedCount"
              label="Number of Tickets"
              type="number"
              InputProps={{ inputProps: { min: 1, max: quantity } }}
              onChange={(e)=>setTicketCount(e.target.value)}
              
              defaultValue='1'
            />
            <Typography variant='subtitle1' sx={{ mb: 1 }}>Available Tickets: {event.availableTicketQuantity}</Typography>
            <Button variant="contained" onClick={()=> {handleCheckout()}}>Checkout</Button>
          </div>
          <div className='orderSummary'>
            <img src={event.banner} className='bannerPicSmol'/>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 1, mt: 3 }}>Order Summary</Typography>
            <Typography variant='subtitle1' sx={{  mb: 1 }}> Quantity: {ticketCount} ticket/s</Typography>
            <Typography variant='h6' sx={{  mb: 1 }}> Total: ${ticketCount*cost}</Typography>
          </div>
        </div>

         {/**collects payment detail from users*/}
        <div className="content" style={{display: bookingStage ? 'none' : 'block'}}>
          <div className='orderInfo'>
            <Typography variant='h3' sx={{ fontWeight: 'bold', mb: 1 }}>Billing Info</Typography>

            <form onSubmit={formit.handleSubmit}>
              <StyledInputField 
                type = "text"
                id={'cardName'}
                name={'cardName'}
                label={"Card Holder Name"}
                onChange={formit.handleChange}
                onBlur={formit.handleBlur}
                value={formit.values.cardName}
              />
              {formit.touched.cardName && formit.errors.cardName ? <div className={'error'}>{formit.errors.cardName}</div> : null}
              

              <StyledInputField 
                type = "text"
                id={'cardNumber'}
                name={'cardNumber'}
                label={"Card Number"}
                fullWidth
                onChange={formit.handleChange}
                onBlur={formit.handleBlur}
                value={formit.values.cardNumber}
              />
              {formit.touched.cardNumber && formit.errors.cardNumber ? <div className={'error'}>{formit.errors.cardNumber}</div> : null}
              
              <StyledInputField 
                type = "text"
                id={'expirationDate'}
                name={'expirationDate'}
                label={"Expiration Date"}
                onChange={formit.handleChange}
                onBlur={formit.handleBlur}
                value={formit.values.expirationDate}
              />
              {formit.touched.expirationDate && formit.errors.expirationDate ? <div className={'error'}>{formit.errors.expirationDate}</div> : null}

              <StyledInputField 
                type = "text"
                id={'securityCode'}
                name={'securityCode'}
                label={"Security Code"}
                onChange={formit.handleChange}
                onBlur={formit.handleBlur}
                value={formit.values.securityCode}
              />
              {formit.touched.securityCode && formit.errors.securityCode ? <div className={'error'}>{formit.errors.securityCode}</div> : null}

              <br/>
              <Button variant="contained" onClick={()=> {setBookingStage(true)}}>Back</Button>
              <Button variant="contained" type={'submit'}>Book</Button>
            </form>
          </div>
        </div>
        
      </div>
    )}
  </Popup>
  </>)
};

export default TicketPopup;
