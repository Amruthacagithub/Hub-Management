import React,{useState} from "react";
import './Login.css';
import { useNavigate } from "react-router-dom";

const Login = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!email || !password){
            setError("Both fields are required!");
            return;
        }
        if(email === 'user@example.com' && password === 'password123'){
            onLogin(true);
            navigate('/home');
        }
        else{
            setError("Invalid email or password");
        }
    };

    return(
        <div className="login-container">
            <h1>Welcome to Hub-Management System</h1>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="submit-btn">Login</button>
            </form>
        </div>
    );
};
export default Login;