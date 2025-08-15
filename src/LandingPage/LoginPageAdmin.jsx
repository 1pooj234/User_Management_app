import { useState } from "react";
import "./LoginPageAdmin.css";
import Loader from "../ui/Loader";
import Modal from "../ui/Modal";
import { SignupUser, LoginUser } from "../CustomHooks/Api";
import { useNavigate } from "react-router-dom";
import {
  isValidCompany,
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../CustomHooks/Validate";

const LoginPageAdmin = () => {
  const navigate = useNavigate();

  const [signup, setSignup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);
  const [valid, setValid] = useState({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const switchForm = () => {
    setSignup((prev) => !prev);
    setValid({});
    setHttpError(null);
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setHttpError(null);

    const validName = isValidName(name);
    const validEmail = isValidEmail(email);
    const validPassword = isValidPassword(password);
    const validCompany = isValidCompany(company);

    if (validName || validEmail || validPassword || validCompany) {
      setValid({
        name: validName,
        email: validEmail,
        password: validPassword,
        company: validCompany,
      });
      return;
    }

    const userData = {
      name,
      email,
      password,
      companyName: company,
      role: "admin",
      noOfEmployees: 100,
    };

    try {
      setLoading(true);
      const data = await SignupUser(userData, false);
      navigate("/users", { state: { token: data?.token } });
    } catch (e) {
      setHttpError({ status: e.status, message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setHttpError(null);

    const validEmail = isValidEmail(email);
    const validPassword = isValidPassword(password);

    if (validEmail || validPassword) {
      setValid({
        email: validEmail,
        password: validPassword,
      });
      return;
    }

    const userData = {
      email,
      password,
    };

    try {
      setLoading(true);
      const data = await LoginUser(userData, false);
      navigate("/users", { state: { token: data?.token } });
    } catch (e) {
      setHttpError({ status: e.status, message: e.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Modal show={true} />
        <div className="centered">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <div className="login_section">
      <h1>{signup ? "Sign up" : "Login"}</h1>
      <form
        className="login_form"
        onSubmit={signup ? signupHandler : loginHandler}
      >
        {signup && (
          <>
            <label>
              Name
              <p className="inp_error">{valid.name}</p>
            </label>
            <div className="input_holder">
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter name"
              />
              <div className="hover_line"></div>
            </div>
          </>
        )}

        <label className={signup ? "" : "email_label"}>
          Email
          <p className="inp_error">
            {httpError?.status === 404 ? "Incorrect combination" : valid.email}
          </p>
        </label>
        <div className={signup ? "input_holder" : "input_holder switch_form"}>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter email"
          />
          <div className="hover_line"></div>
        </div>

        <label className={signup ? "" : "password_label"}>
          Password
          <p className="inp_error">
            {httpError?.status === 404 ? "" : valid.password}
          </p>
        </label>
        <div className={signup ? "input_holder" : "input_holder switch_form"}>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter password"
          />
          <div className="hover_line"></div>
        </div>

        {signup && (
          <>
            <label>
              Company name <p className="inp_error">{valid.company}</p>
            </label>
            <div className="input_holder">
              <input
                type="text"
                onChange={(e) => setCompany(e.target.value)}
                value={company}
                placeholder="Enter company name"
              />
              <div className="hover_line"></div>
            </div>

            <label>Number of Employees</label>
            <div className="input_holder">
              <input type="text" readOnly value={100} />
            </div>

            <label>Role</label>
            <div className="input_holder">
              <input type="text" readOnly value="Admin" />
            </div>
          </>
        )}

        <div className="login_btn_holder">
          <button disabled={!signup} className={signup ? "btn_active" : ""}>
            Sign up
          </button>
          <button disabled={signup} className={signup ? "" : "btn_active"}>
            Login
          </button>
        </div>
      </form>

      <p className="toggle_p" onClick={switchForm}>
        {signup ? "Click here to Login" : "Don't have account yet? click here"}
      </p>
    </div>
  );
};

export default LoginPageAdmin;
