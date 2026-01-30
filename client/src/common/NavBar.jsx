import { Link } from "react-router";
import "../components/styling/navbar.css"


//if the user is signed in show the signout nav link
//otherise show the signin and signup links
const Navbar = (props) => {
    return (
        <nav className="nav-bar">
            <ul>
                {props.user ? (
                    <>
                        <li>
                            <Link onClick={props.signOut} to={'/'}>
                                Sign Out
                            </Link>
                        </li>
                        <li><Link to={'/add-stocks'}>Add to Portfolio</Link></li>
                        <li><Link to={'/Dashboard'}>Dashboard</Link></li>

                        
                    </>
                ) : (
                    <>
                        <li><Link to={'/'}>Sign In</Link></li>
                        <li><Link to={'/signup'}>Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};




export default Navbar;