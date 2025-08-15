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

const LoginPageEmployee = () => {
  const navigate = useNavigate();

  const [valid, setValid] = useState({});
  const [signup, setSignup] = useState(true);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);

  const switchForm = () => {
    setSignup((prev) => !prev);
    setValid({});
    setHttpError(null);
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setHttpError(null);

    const validName = isValidName(userName);
    const validEmail = isValidEmail(userEmail);
    const validPassword = isValidPassword(userPassword);
    const validCompany = isValidCompany(companyName);

    if (
      validName !== "" ||
      validPassword !== "" ||
      validEmail !== "" ||
      validCompany !== ""
    ) {
      setValid({
        name: validName,
        password: validPassword,
        email: validEmail,
        company: validCompany,
      });
      return;
    }

    if (companyName.trim().length <= 5) {
      setValid({
        name: validName,
        password: validPassword,
        email: validEmail,
        company: "Company doesn't exist",
      });
      return;
    }

    const userData = {
      name: userName,
      email: userEmail,
      password: userPassword,
      employeeCompany: companyName,
    };

    try {
      setLoading(true);
      const data = await SignupUser(userData, true);
      navigate("/users", { state: { token: data?.token, emp: true } });
    } catch (e) {
      setHttpError({ status: e.status, message: e.message });
    } finally {
      setLoading(false);
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setHttpError(null);

    const validEmail = isValidEmail(userEmail);
    const validPassword = isValidPassword(userPassword);

    if (validEmail !== "" || validPassword !== "") {
      setValid({
        password: validPassword,
        email: validEmail,
      });
      return;
    }

    const userData = {
      email: userEmail,
      password: userPassword,
    };

    try {
      setLoading(true);
      const data = await LoginUser(userData, true);
      navigate("/users", { state: { token: data?.token, emp: true } });
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
          }}
        >
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
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
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
            onChange={(e) => setUserEmail(e.target.value)}
            value={userEmail}
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
            onChange={(e) => setUserPassword(e.target.value)}
            value={userPassword}
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
                onChange={(e) => setCompanyName(e.target.value)}
                value={companyName}
                placeholder="Enter company name"
              />
              <div className="hover_line"></div>
            </div>

            <label>Role</label>
            <div className="input_holder">
              <input type="text" readOnly value={"Employee"} />
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

export default LoginPageEmployee;
