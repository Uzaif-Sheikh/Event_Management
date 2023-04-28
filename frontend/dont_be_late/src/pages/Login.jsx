import React, {useContext} from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as Yup from 'yup';
import {UserContext} from "../userContext";

//validation schema to check that user enters valid login details
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});


//login page, with login form
function Login () {
  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext);

  const login = async (values) => {
    const { email, password } = values;
    const resp = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    if (!resp.ok) {
      alert("Invalid Login Detail!");
    }
    else {
      const data = await resp.json();
      navigate('/');
      return data;
    }
  }


  const formit = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: values => {
      login(values)
        .then((value) => {
          setUser(
            {
              "userid": value.userID,
              "userName": value.userName,
              "token": value.token,
              "creditPoints": value.creditPoint,
              "cardName": value.cardName,
              "cardNumber": value.cardNumber,
              "expiryDate": value.expiryDate,
              "securityCode": value.cvv
            }
          );
        });
      navigate('/');
    },
    validationSchema
  });


  // returns a header, and a register form
  return (<>
    <div className='loginBackground'>
      <Button className='logo' id={'homeLogo'} onClick={()=> navigate('/')}><img className='logo' src={'/dont-be-late.png'} alt="don't be late logo"/></Button>
      <form className='loginForm' onSubmit={formit.handleSubmit}>
        <h1>Login</h1>
        <div className={"formControl"}>
          Email
          <br/>
          <input
            type = "email"
            id={'email'}
            name={'email'}
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.email}
          /><br/>
          {formit.touched.email && formit.errors.email ? <div className={'error'}>{formit.errors.email}</div> : null}
        </div>
        <div className={"formControl"}>
          Password:
          <br/>
          <input
            type = "password"
            id={'password'}
            name={'password'}
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.password}
          /><br/>
          {formit.touched.password && formit.errors.password ? <div className={'error'}>{formit.errors.password}</div> : null}
        </div>
        <br/>
        <button type={'submit'}>Login </button>

        <br/>
        <br/>
        No Account?
        <br/>
        <button type='register' onClick={()=> {navigate('/register')}}>
          Register!
        </button>
        <br/>
      </form>
    </div>
  </>)
}

export default Login;