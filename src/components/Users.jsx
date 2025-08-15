import { useEffect, useState } from "react";
import { AllUsers } from "../CustomHooks/Api";
import "./Users.css";
import Pagination from "../ui/Pagination";
import Httphook from "../CustomHooks/Httphook";
import { Link, useLocation } from "react-router-dom";
import Loader from "../ui/Loader";
import Modal from "../ui/Modal";
import Popup from "../ui/Popup";
import "../LandingPage/Content.css";
const Users = () => {
  const [sendReq, httpObj] = Httphook(AllUsers);
  const [query, setQuery] = useState("");
  const curPage = useState(1)[0];
  const [p, setp] = useState(curPage);
  const location = useLocation();
  const noOfUsersPerPage = 8;
  const getQuery = (e) => {
    setp(1);
    setQuery(e.target.value);
  };
  useEffect(() => {
    sendReq(location.state?.token, location.state?.emp);
  }, [sendReq, location, query]);
  // let pagenoLimit = 5;
  const getPageno = (pageno) => {
    setp(pageno);
  };
  const [direction, setDirection] = useState("forward"); // 👈 New: track navigation direction

  let pagenos = Math.ceil(httpObj?.data?.length / noOfUsersPerPage);
  // let pagenos = 3;

  const getRange = (p, direction) => {
    if (direction === "forward") {
      let start = p - 1;
      let end = start + 5;
      if (end > pagenos) {
        end = pagenos;
        start = end - 5;
      }
      if (start < 0) start = 0;
      return { f: start, l: end };
    } else {
      // backward
      let end = p;
      let start = end - 5;
      if (start < 0) {
        start = 0;
        end = 5;
      }
      return { f: start, l: end };
    }
  };

  const { f, l } = getRange(p, direction);

  const goToPage = (page, dir = "forward") => {
    setDirection(dir);
    setp(Math.min(Math.max(page, 1), pagenos));
  };
  let initialContent;
  let finalContent;
  const firstUser = p * noOfUsersPerPage - noOfUsersPerPage;
  const lastUser = firstUser + noOfUsersPerPage;

  if (httpObj.status === "loading") {
    finalContent = (
      <div
        style={{
          width: "90vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Loader />;
      </div>
    );
  }
  if (httpObj.status === "Completed" && httpObj.error !== null) {
    initialContent = (
      <Modal show={true}>
        <Popup>
          <h2 className="error_message">{httpObj.error.message}</h2>
          <Link to="/">
            <button className="error_btn">Back</button>
          </Link>
        </Popup>
      </Modal>
    );
  }
  let dispEmployees = [];
  if (httpObj.status === "Completed" && httpObj.error === null) {
    dispEmployees = httpObj.data
      .map((employee, i) => {
        return { ...employee, id: i + 1 };
      })
      .filter((employee) => {
        if (employee.name.includes(query)) {
          return employee;
        } else if (employee.email.includes(query)) {
          return employee;
        }
      })
      .slice(firstUser, lastUser)
      .map((employee, i) => {
        return (
          <div key={i} className="emp_card">
            <h1 style={{ fontSize: "18px" }}>{employee.name}</h1>
            <div className={`task_status grey`}></div>
            <div className="user_emp_email" style={{ fontSize: "16px" }}>
              <b>Email</b> : {employee.email}
            </div>
            <p style={{ fontSize: "16px" }}>
              <b>Role</b> : {employee.role}
            </p>
            <button className={`disp_btn grey`}>View Task</button>
            <button className="assign_task">Assign Task</button>
          </div>
        );
      });
    finalContent = <>{dispEmployees}</>;
  }
  return (
    <>
      {initialContent ? (
        initialContent
      ) : (
        <div>
          <input
            placeholder="Search by name or email"
            onChange={getQuery}
            type="text"
            className="search_inp"
          />
          <select className="sort_feature">
            <option className="sort_option">Tasks</option>
            <option className="sort_option">Not Assigned</option>
            <option className="sort_option">Completed</option>
            <option className="sort_option">Not completed</option>
          </select>
          <div className="users_section">
            <div className="emp_card_holder">
              {dispEmployees?.length === 0 && httpObj.status === "pending" ? (
                <p
                  style={{
                    fontSize: "18px",
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  No users found
                </p>
              ) : (
                finalContent
              )}
            </div>
            <div className="pagination_element">
              <Pagination
                pageno={p}
                totalPages={pagenos}
                getPageno={getPageno}
                noOfUsersPerPage={noOfUsersPerPage}
                nextPage={goToPage.bind(null, p + 1, "backward")}
                next5Pages={goToPage.bind(null, p + 5, "forward")}
                previousPage={goToPage.bind(null, p - 1, "backward")}
                previous5Pages={goToPage.bind(null, p - 5, "forward")}
                finalPagenos={{ f, l }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
