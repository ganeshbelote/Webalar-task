import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../utils/auth.helper'
import '../style/Auth.css'
import { failureMsg, successMsg } from '../utils/message.helper'

type userDetailType = {
  username: string
  email: string
  password: string
}
const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [userDetails, setUserDetails] = useState<userDetailType | any>({
    username: '',
    email: '',
    password: ''
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await register(userDetails)
    if (!res.ok) {
      failureMsg(res.message)
    } else {
      successMsg(res.message)
      localStorage.setItem("accessToken",res.accessToken)
      navigate('/')
    }
    setUserDetails({
    username: '',
    email: '',
    password: ''
  })
  }
  return (
    <div className='auth'>
      <video
        src='/vid-bg.mp4'
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: 'auto',
          objectFit: 'cover'
        }}
      ></video>
      <div className='wrapper'></div>
      <div className='form-wrapper'>
        <h2 className='heading'>Sign Up</h2>
        <form onSubmit={e => handleSubmit(e)} className='form'>
          <input
            id='username'
            className='input'
            placeholder='Username'
            value={userDetails.username}
            type='text'
            onChange={e =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
          />

          <input
            id='email'
            className='input'
            placeholder='Email'
            value={userDetails.email}
            type='email'
            onChange={e =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
          />

          <div className='password-wrapper'>
            <input
              id='password'
              className='input'
              placeholder='Password'
              value={userDetails.password}
              type={showPassword ? 'text' : 'password'}
              onChange={e =>
                setUserDetails({ ...userDetails, password: e.target.value })
              }
            />
            <img
              className='show-pass'
              src={showPassword ? '/eye-close.svg' : '/eye-open.svg'}
              alt={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button className='auth-btn' type='submit'>
            Sign Up
          </button>
        </form>
        <p
          style={{
            fontWeight: 'lighter'
          }}
        >
          Already have account ?{' '}
          <Link to='/login' className='text-blue-500 text-xl'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
