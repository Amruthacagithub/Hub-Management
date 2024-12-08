import {Route,BrowserRouter as Router, Routes, Navigate} from "react-router-dom";
import Login from "./components/LoginPage/Login";
import HomePage from "./components/HomePage/HomePage";
import VehicleStates from "./components/VehicleStateManagement/VehicleStates";
import VehicleEntry from "./components/VehicleEntryRecord/VehicleEntry";
import TaskAllocation from "./components/TaskAllocationPage/TaskAllocation";
import Error from "./components/Error";
import { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ProtectedRoute = ({ element }) => {
    if(!isAuthenticated){
      return <Navigate to="/error"/>
    }
    else{
      return element;
    }
  };

    return(   
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={setIsAuthenticated}/>}></Route>
          <Route path="/home" element={<ProtectedRoute element={<HomePage/>}/>}></Route>
          <Route path="/vehicle-states" element={<ProtectedRoute element={<VehicleStates/>}/>}></Route>
          <Route path="/vehicle-entry" element={<VehicleEntry/>}></Route>
          <Route path="/task-allocation" element={<TaskAllocation/>}></Route>
          <Route path="/error" element={<Error/>} ></Route>
        </Routes>
      </Router>
    )


}

export default App;