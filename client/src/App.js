import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from "./components/Navbar";

function App() {
    return (
        <div className="App">
            <NavbarComp/>
            <p style={{textAlign: "center"}}>Do Something</p>
        </div>
    );
}

export default App;
