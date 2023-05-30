import React, { useState } from 'react';
import './Home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
function Home() {
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [validEmail, setValidEmail] = useState(true);

  const handlePasswordChange = (e) => {
    const enteredPassword = e.target.value;
    setPassword(enteredPassword);
};



  function signupform(e) {
    e.preventDefault();
    if (firstname !== '' && email !== '' && password !== '') {
      if (password.length >=8) {
		if (validator.isEmail(email)) {
        axios
          .post('http://localhost:5900/signup', {
            firstname,
            email,
            password,
          })
          .then((res) => {
            alert('successfully signup, please sign in');
            setFirstname('');
            setEmail('');
            setPassword('');
          }).catch(err=>(alert(err.response.data)))
		}else{
			setValidEmail(false)
		}
      } else {
        setIsValid(true);
      }
    } else {
      alert('Please fill all fields.');
    }
  }

  function Loginform(e) {
    if (email !== '' && password !== '') {
	
      e.preventDefault();
      axios
        .post('http://localhost:5900/login', {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem('usersdata', JSON.stringify(res.data));
          alert('successfully sign in');
          setEmail('');
          setPassword('');
          navigate('/Home');
        }).catch(err=>(alert(err.response.data)))
	}else {
      alert('Please fill all fields.');
    }
  }

  return (
    <div className="login-wrap bodyof">
      <div className="login-html">
        <input id="tab-1" type="radio" name="tab" className="sign-in" />
        <label htmlFor="tab-1" className="tab">
          Sign In
        </label>
        <input id="tab-2" type="radio" name="tab" className="sign-up" defaultChecked />
        <label htmlFor="tab-2" className="tab">
          Sign Up
        </label>
        <div className="login-form">
          <div className="sign-in-htm">
            <form onSubmit={Loginform}>
              <div className="group">
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  data-type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              			{isValid && <p className='text-danger'>Password must 8 characters with special characters and numbers</p>}
              </div>

              <div className="group">
                <label className="label">Email Address</label>
                <input type="text" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="group">
                <input type="submit" className="button" value="Sign Up" />
              </div>
            </form>
          </div>
          <div className="sign-up-htm">
            <form onSubmit={signupform}>
              <div className="group">
                <label className="label">Username</label>
                <input type="text" className="input" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
              </div>
              <div className="group">
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  data-type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
				{isValid && <p className='text-danger'>Password must 8 characters with special characters and numbers</p>}
              </div>

              <div className="group">
                <label className="label">Email Address</label>
                <input type="text" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
				{!validEmail && <p className='text-danger'>Email not valid</p>}
              </div>
              <div className="group">
                <input type="submit" className="button" value="Sign Up" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
