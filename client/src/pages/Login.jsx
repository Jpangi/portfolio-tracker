import { useNavigate } from "react-router";
import { useState } from "react";
import axios from 'axios';
import { BASEURL } from "../constants/constants";


const LogIn = (props)=>{
  //keeping track of sign in state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
const navigate = useNavigate();
  //handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent the page from reloading
    
    try {
      //make a call to the backend to sign up
      const res = await axios.post(`${BASEURL}/users/signin`, formData);
      //logIn function is passed as a prop from the app.jsx page
      props.logIn(res.data.token);
      console.log("Submit succeeded");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  //form validation
  const isFormInValid = () => {
    // any of the fields are blank
    if (!formData.username || !formData.password) {
      return true;
    } else {
      return false;
    }
  };
  console.log(formData);

  return (
    <main>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
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
        <div>
          <button disabled={isFormInValid()}>Sign In</button>
        </div>
      </form>
    </main>
  );
}
export default LogIn