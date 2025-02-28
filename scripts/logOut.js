function logOut() {
  localStorage.removeItem("submit");
  localStorage.setItem("signIn", "false");
  localStorage.removeItem("signUp");
  //   sessionStorage.removeItem("questions");
  //   sessionStorage.removeItem("choisesSelected");
  //   sessionStorage.removeItem("markedQuestions");
  //   sessionStorage.removeItem("answers");
  sessionStorage.clear();
  window.location.replace("../index.html");
}
function backHome() {
  localStorage.removeItem("submit");
  //   sessionStorage.removeItem("questions");
  //   sessionStorage.removeItem("choisesSelected");
  //   sessionStorage.removeItem("markedQuestions");
  //   sessionStorage.removeItem("answers");
  sessionStorage.clear();
  window.location.href = "../home/home.html";
}
