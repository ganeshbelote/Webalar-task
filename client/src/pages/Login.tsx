import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style/Auth.css'
import { login } from '../utils/auth.helper'
import { failureMsg, successMsg } from '../utils/message.helper'

type userDetailType = {
  email: string
  password: string
}
const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [userDetails, setUserDetails] = useState<userDetailType | any>({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await login(userDetails)
        if (!res.ok) {
          failureMsg(res.message)
        } else {
          successMsg(res.message)
          localStorage.setItem("accessToken",res.accessToken)
          navigate('/home')
        }
        setUserDetails({
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
        <h2 className='heading'>Login</h2>
        <form onSubmit={e => handleSubmit(e)} className='form'>
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
            Login
          </button>
        </form>
        <p
          style={{
            fontWeight: 'lighter'
          }}
        >
          Don't have account ?{' '}
          <Link to='/register' className='text-blue-500 text-xl'>
            register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
