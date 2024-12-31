export const getValidToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "/login";
    throw new Error("No token found. please log in again");
  }
  return token;
};
