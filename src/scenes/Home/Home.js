import React, { useState } from 'react';
import './sign.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const Animation = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const [values, setValues] = useState({
    email: '',
    password: ''
})
const [regvalues, setregValues] = useState({
    name: '',
    email: '',
    phoneno: '',
    password: '',
  });
  const [showOTPForm, setShowOTPForm] = useState(false); // Control OTP form visibility
  const [resotp,setresotp]=useState('')
  const [otp, setOtp] = useState('');
const navigate = useNavigate()

const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(values)
    try {
        const response = await axios.post('http://127.0.0.1:3002/api/v1/admin/login', values)
        console.log(response.data.token)
        localStorage.setItem('token', response.data.token)
        toast.success('Login Successful');
        navigate("/global")
    }
    catch (err) {
        console.log(err.response.data.msg)
        toast.error(err.response.data.msg);
    }

}
const handleSubmitt = async (event) => {
    event.preventDefault();
    console.log(regvalues);
    try {
      // Send user registration data to the server
      const response = await axios.post(
        'http://127.0.0.1:3002/api/v1/admin/emailverification',
        {email:regvalues.email}
      );
      setresotp(response.data.otp);
      toast.success('OTP sent');
      setShowOTPForm(true); // Show OTP form after successful registration
    } catch (err) {
      console.log(err.response.data.msg);
      toast.error(err.response.data.msg);
    }
  };

  const handleOTPSubmit = async (event) => {
    event.preventDefault();
    if (resotp==otp) {      
        try {
          // Send OTP to the server for verification
          const response = await axios.post(
            'http://127.0.0.1:3002/api/v1/admin/register',
            regvalues // Send email and OTP for verification
          )
            console.log(response.data)
            toast.success('OTP Verified. Registration Complete');
            toggleMode() // Navigate to the login page after successful registration
        }
        catch (err) {
            console.log(err.response.data.msg);
            toast.error(err.response.data.msg);
        }
    }
    else{
        toast.error("Invalid OTP")
    }
  };
  return (
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field" style={{alignItems: "center"}}>
            <PersonIcon className='icon_margin'/>
              {/* <i className="fas fa-user"></i> */}
              <input type="text" placeholder="Username" required onChange={e => setValues({ ...values, email: e.target.value.toLowerCase() })}/>
            </div>
            <div className="input-field">
                <LockIcon className='icon_margin'/>
              {/* <i className="fas fa-lock"></i> */}
              <input type="password" placeholder="Password" required onChange={e => setValues({ ...values, password: e.target.value.toLowerCase() })}/>
            </div>
            <input type="submit" value="Login" className="btn solid" onClick={handleSubmit}/>
            <h5 id="sign-up-btn" className="register-link" onClick={toggleMode}>
              New here ? Register
            </h5>
            <h5 id="sign-up-btn" className="register-link" onClick={(e)=>{navigate('/forgotpassword')}}>
              Forgot password
            </h5>
          </form>
          {!showOTPForm ? (<form action="#" className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
               <PersonIcon className='icon_margin'/> 
              {/* <i className="fas fa-user"></i> */}
              <input type="text" placeholder="Username" required onChange={(e) =>
                  setregValues({ ...regvalues, name: e.target.value })
                }/>
            </div>
            <div className="input-field">
                <EmailIcon className='icon_margin'/>
              {/* <i className="fas fa-envelope"></i> */}
              <input type="email" placeholder="Email" required onChange={(e) =>
                  setregValues({ ...regvalues, email: e.target.value.toLowerCase() })
                }/>
            </div>
            <div className="input-field">
                <PhoneIcon className='icon_margin'/>
              {/* <i className="fas fa-envelope"></i> */}
              <input type="number" placeholder="Phone no" required onChange={(e) =>
                  setregValues({ ...regvalues, phoneno: e.target.value })
                }/>
            </div>
            <div className="input-field">
                <LockIcon className='icon_margin'/>
              {/* <i className="fas fa-lock"></i> */}
              <input type="password" placeholder="Password" required onChange={(e) =>
                  setregValues({ ...regvalues, password: e.target.value })
                }/>
            </div>
            <input type="submit" className="btn" value="Sign up" onClick={handleSubmitt}/>
            <h5 id="sign-in-btn" className="register-link" onClick={toggleMode}>
              Existing user ? Login
            </h5>
          </form>):(<form action="#" className="sign-up-form"  onSubmit={handleOTPSubmit}>
            <h2 className="title">OTP</h2>
            <div className="input-field">
              <VpnKeyIcon className='icon_margin'/>
              {/* <i className="fas fa-envelope"></i> */}
              <input type="number" placeholder="OTP" value={otp} required onChange={(e) => setOtp(e.target.value)}/>
            </div><input type="submit" className="btn" value="Submmit" onClick={handleOTPSubmit}/></form>)}
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <img src="imgs/4.png" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <img src="imgs/5.png" className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Animation;
