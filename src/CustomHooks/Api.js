const base_url = import.meta.env.VITE_API_URL;
export const SignupUser = async (userObj, emp) => {
  const res = await fetch(
    `${base_url}/${emp ? "signup" : "register"}/${emp ? "employee" : "admin"}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Validation error");
    error.status = res.status;
    error.errors = data.errors || null;
    throw error;
  }

  return data;
};

export const LoginUser = async (userObj, emp) => {
  console.log("Sending to backend:", JSON.stringify(userObj)); // ✅ debug
  const res = await fetch(`${base_url}/login/${emp ? "employee" : "admin"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObj),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Validation error");
    error.status = res.status;
    error.errors = data.errors || null;
    throw error;
  }

  return data;
};

export const AllUsers = async (token, emp) => {
  const res = await fetch(
    `${base_url}/allusers/${emp ? "employee" : "admin"}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!res.ok) {
    let error = new Error("failed to fetch");
    if (res.status === 401) {
      error = new Error("Please Authenticate");
    }
    error.status = res.status;
    throw error;
  }
  const data = await res.json();
  return data;
};

export const UserProfile = async (token, emp) => {
  const res = await fetch(`${base_url}/profile/${emp ? "employee" : "admin"}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (!res.ok) {
    let error = new Error("failed to fetch");
    if (res.status === 401) {
      error = new Error("Please Authenticate");
    }
    error.status = res.status;
    throw error;
  }
  const data = await res.json();
  return data;
};

export const UpdateUserData = async (userObj, emp) => {
  const res = await fetch(`${base_url}/update/${emp ? "employee" : "admin"}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + userObj.token,
    },
    body: JSON.stringify(userObj.data),
  });
  if (!res.ok) {
    let error = new Error("bad request");
    if (res.status === 401) {
      error = new Error("Please authenticate");
    }
    error.status = res.status;
    throw error;
  }
};

export const LogoutUser = async (token, emp) => {
  const res = await fetch(`${base_url}/logout/${emp ? "employee" : "admin"}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  if (!res.ok) {
    let error = new Error("bad request");
    if (res.status === 401) {
      error = new Error("Please authenticate");
    }
    error.status = res.status;
    throw error;
  }
};
