window.onload = function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.gender) {
    $("#time").html(`Sorry ${currentUser.name} time out !`);
    if (currentUser.gender === "female") {
      $("#timeOut").attr("src", "../images/time outF.svg");
    } else {
      $("#timeOut").attr("src", "../images/time outM.svg");
    }
  } else {
    console.log(
      "No user is currently logged in or gender information is missing."
    );
  }
};
