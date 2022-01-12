import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from "./components/Navbar";
import SignIn from "./components/forms/Sign-in";
import Home from "./pages/Home";

const App = () => {
    return (
        <div className="App">
            <Home/>
        </div>
    );
}

export default App;