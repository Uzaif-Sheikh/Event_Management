import React, {useContext} from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as Yup from 'yup';
import {UserContext} from "../userContext";

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .max(30, 'Name must be no longer than 30 characters'),
  nickname: Yup.string()
    .required('Nickname is required')
    .max(30, 'Nickname must be no longer than 30 characters'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be no shorter than 6 characters'),
  confirmPassword: Yup.string()
    .required('Confirming password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});


// register page, with register form
function Register () {
  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext);
  const signup = async (values) => {
    const { name, nickname, email, password } = values;
    const resp = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        name,
        nickname,
      })
    });
    if (!resp.ok) {
      alert("Opps, you didn't register successfully, please try again!")
    } else {
      const data = await resp.json();
      navigate('/');
      return data
    }
  }


  const formit = useFormik({
    initialValues: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: values => {
      signup(values)
        .then((value) => {
          setUser(
            {
                "userid": value.userID,
                "userName": value.userName,
                "token": value.token,
                "creditPoints": 0,
                "cardName": '',
                "cardNumber": '',
                "expiryDate": '',
                "securityCode": ''
                
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
      <Button className='logo' id={'homeLogo'} onClick={()=> navigate('/')}><img className='logo' src={'/dont-be-late.png'} alt="Don't Be Late Logo"/></Button>
      <form className='loginForm' onSubmit={formit.handleSubmit}>
        <h1>Register</h1>
        <div className={"formControl"}>
          Name
          <br/>
          <input
            type = "text"
            id={'name'}
            name={'name'}
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.name}
          /><br/>
          {formit.touched.name && formit.errors.name ? <div className={'error'}>{formit.errors.name}</div> : null}
        </div>

        <div className={"formControl"}>
          Nickname
          <br/>
          <input
            type = "text"
            id={'nickname'}
            name={'nickname'}
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.nickname}
          /><br/>
          {formit.touched.nickname && formit.errors.nickname ? <div className={'error'}>{formit.errors.nickname}</div> : null}
        </div>

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
        <div className={"formControl"}>
          Confirm Password:
          <br/>
          <input
            type = "password"
            id={'confirmPassword'}
            name={'confirmPassword'}
            onChange={formit.handleChange}
            onBlur={formit.handleBlur}
            value={formit.values.confirmPassword}
          /><br/>
          {formit.touched.confirmPassword && formit.errors.confirmPassword ? <div className={'error'}>{formit.errors.confirmPassword}</div> : null}
        </div>

        <br/>
        <button type={'submit'}>Register </button>

        <br/>
        <br/>
        Already Have an Account?
        <br/>
        <button type='login' onClick={()=> {navigate('/Login')}}>
          Login!
        </button>
      </form>
    </div>
  </>)
}

export default Register;