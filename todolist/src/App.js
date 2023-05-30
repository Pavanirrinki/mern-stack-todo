import logo from './logo.svg';
import './App.css';
import Home from './Pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Todolist from './Pages/Todolist';

function App() {
  const usersdata = JSON.parse(localStorage.getItem('usersdata'));
 console.log("usersdata",usersdata)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={usersdata?.token ? <Todolist />:<Home /> }
          />
           <Route
            exact
            path="/Home"
            element={ <Todolist />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
