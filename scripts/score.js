let user
window.onload = function () {
    const score = JSON.parse(sessionStorage.getItem("score")) || 0; 
    const questions = JSON.parse(sessionStorage.getItem("questions")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.gender) {
        user=currentUser
    } else {
        console.log("No user is currently logged in or gender information is missing.");
    }
    if (questions.length > 0) {
        let percent = (((questions.length - score) / questions.length) * 100);
        updateProgress(percent);
        } else {
        console.error("No questions found.");
    }
}
function updateProgress(score) {
    const percentage =100- ((score / 100) * 100);
    const progressCircle = document.getElementById('progress-circle');
    const progressText = document.getElementById('progress-text');
      progressCircle.style.background = `conic-gradient(
      var(--browm) ${percentage}%,
      var(--bage) ${percentage}%
    )`;

    if(percentage>=60){
        $('#score').html(`Congratulation ${user.name} Your score is ${Math.round(percentage)}% `);
        if(user.gender=='female'){            
            $('#gender img').attr('src','../images/passFemale.gif'); 
        }else{
            $('#gender img').attr('src','../images/passMale.gif'); 
        }
    }else{
        $('#score').html(`Sorry ${user.name} Your score is ${Math.round(percentage)}% `);
        if(user.gender=='male'){            
            $('#gender img').attr('src','../images/maleFail.svg'); 
        }else{
            $('#gender img').attr('src','../images/femaleFail.svg'); 
        }

    }
    progressText.textContent = `${Math.round(percentage)}%`;
  }


  
 
