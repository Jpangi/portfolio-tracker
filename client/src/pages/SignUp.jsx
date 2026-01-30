import { useNavigate } from "react-router";
import { useState } from "react";
import axios from 'axios';
import { BASEURL } from "../constants/constants";


const SignUp = (props)=>{
  const navigate = useNavigate()
    //keeping track of sign up state
    const [formData, setFormData] = useState({
        username:'',
        email: "",
        password: '',
        passwordTwo: '',
    })

    //handle change
    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    //handle submit
    const handleSubmit = async (e) => {
      e.preventDefault();  //prevent the page from reloading

      try {
        //make a call to the backend to sign up
        const res = await axios.post(`${BASEURL}/users/signup`, formData);
        //logIn function is passed as a prop from the app.jsx page
        props.logIn(res.data.token);
        console.log('Submit succeeded')
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    };

    //form validation
    const isFormInvalid = () => {
      //any of the fields are blank
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.passwordTwo
      ) {
        return true;

        //if the passwords do not match
      } else if (formData.password !== formData.passwordTwo) {
        return true;
      } else {
        return false;
      }
    };
    console.log(formData);

    return (
      <main>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="passwordTwo">Confirm Password:</label>
          <input
            id="passwordTwo"
            type="password"
            name="passwordTwo"
            value={formData.passwordTwo}
            onChange={handleChange}
          />
          <div>
            <button disabled={isFormInvalid()}>Sign Up</button>
          </div>
        </form>
      </main>
    );



}
export default SignUp