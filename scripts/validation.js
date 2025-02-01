let userFirstName
let userLastName
let firstnameInput
let lastnameInput
let userEmail
let password
let rePassword
let usersList=[]
let user
let signUp=false
let signIn=false
function showError(){
    $('.alert').addClass("error");
}
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("signUp") === "true") {
        window.location.href = "../signIn/signIn.html";
    }
    if (localStorage.getItem("signIn") === "true") {
        window.location.href = "../home/home.html";
    }
});
if(localStorage.getItem("userlist")!=null){
    usersList=JSON.parse(localStorage.getItem("userlist"))
}

$("#firstname").on('keyup', function(){
    userFirstName=$("#firstname").val()
    validFirstName()
})
$("#lastname").on('keyup', function(){
    userLastName=$("#lastname").val()
    validLastName()
})
$("#email").on('keyup', function(){
    userEmail=$("#email").val()
    validuserEmail()
})
$("#pass").on('keyup', function(){
    password=$("#pass").val()
    validPassword()
})
$("#repass").on('keyup', function(){
    rePassword=$("#repass").val()
    validRepassword()
})
function validFirstName(){
        var ragName=/^[A-Z][a-z]{3,20}$/
        if(!(ragName.test(userFirstName)===true)){
        showError()
        $("#firstname").removeClass('is-valid')
        $("#firstname").addClass('is-invalid')
        $("#firstnameAlert").removeClass('d-none')
    }else{
        $("#firstname").addClass('is-valid')
        $("#firstname").removeClass('is-invalid')
        $("#firstnameAlert").addClass('d-none')
        return true 
    }
        
}
function validLastName(){
        var ragName=/^[A-Z][a-z]{3,20}$/
        if(!(ragName.test(userLastName)===true)){
            showError()
        $("#lastname").removeClass('is-valid')
        $("#lastname").addClass('is-invalid')
        $("#lastnameAlert").removeClass('d-none')
    }else{
        $("#lastname").addClass('is-valid')
        $("#lastname").removeClass('is-invalid')
        $("#lastnameAlert").addClass('d-none')
        return true 
    }
        
}
function validuserEmail(){
    var ragEmail=/\w+@\w+\.\w+/ig
    if(!(ragEmail.test(userEmail)===true)){
        showError()
        $("#email").removeClass('is-valid')
        $("#email").addClass('is-invalid')
        $("#emailAlert").removeClass('d-none')
    }else{
        $("#email").addClass('is-valid')
        $("#email").removeClass('is-invalid')
        $("#emailAlert").addClass('d-none')
        return true 
    }
    
}
let pass=''
function validPassword(){
    var ragPass=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if(!(ragPass.test(password)==true)){
        showError()
        $("#pass").removeClass('is-valid')
        $("#pass").addClass('is-invalid')
        $("#userPasswordAlert").removeClass('d-none')
    }else{
        $("#pass").addClass('is-valid')
        $("#pass").removeClass('is-invalid')
        $("#userPasswordAlert").addClass('d-none')
        pass=password
        return true 
    }    
}
function validRepassword(){
    if(!(rePassword==pass)){
        showError()
        $("#repass").removeClass('is-valid')
        $("#repass").addClass('is-invalid')
        $("#rePasswordAlert").removeClass('d-none')
    }else{
        $("#repass").addClass('is-valid')
        $("#repass").removeClass('is-invalid')
        $("#rePasswordAlert").addClass('d-none')
        return true 
    }    
}
function isGenderSelected() {
    let isChecked = $("input[name='flexRadioDefault']:checked").length > 0;
    if (!isChecked) {
        showError()
        $("#genderAlert").html("Please select a gender").removeClass('d-none');
    }else{
        $("#genderAlert").addClass('d-none')
    }
    return isChecked;
}
function isExist(){
    for (let i = 0; i < usersList.length; i++) {
        if(usersList[i].email.toLowerCase()==userEmail.toLowerCase()){
            return true
        }
    }
    return false
}
function clearForm(){
    $("#firstname").val('')
    $("#lastname").val('')
    $("#email").val('')
    $("#pass").val('')
    $("#repass").val('')
    $("input[name='flexRadioDefault']").prop('checked', false); 
}
/////////////////////////////////////////////////////////////////////////////////////sign up
$("#signup").on('submit', function(e) {
    e.preventDefault(); 
    submit();
});
function submit(){
    if(validFirstName() &&validLastName()&& validuserEmail() && validPassword()&& validRepassword()&&isGenderSelected()){
        if(isExist()){
            showError()
            $("#error").removeClass('d-none')
            $("#error").html("Email is exist");
        }else{
            $("#error").addClass('d-none')
             user={
                name:userFirstName +' '+userLastName,
                email:userEmail,
                pass:password,
                gender:$("input:checked" ).val()
            }
            usersList.push(user)
            localStorage.setItem("userlist",JSON.stringify(usersList))
            signUp=true
            localStorage.setItem("signUp",JSON.stringify(signUp))
            clearForm()
            window.location.href="../signIn/signIn.html"
        }
    }
    else{
        showError()
        $("#error").html("All inputs is required and all inputs must valid").removeClass('d-none');
    }
}

/////////////////////////////////////////////////////////////////////////////////////login

$("#login").on('submit', function(e) {
    e.preventDefault(); 
    login();
});
function login(){
    if(validuserEmail()&&validPassword()){
        if(usersList.length>0){
            for (let i = 0; i < usersList.length; i++) {
            if(usersList[i].email.toLowerCase()==userEmail.toLowerCase() && usersList[i].pass==password){
                $("#error").addClass('d-none')
                signIn=true
                localStorage.setItem("signIn",JSON.stringify(signIn))
                localStorage.setItem("currentUser", JSON.stringify(usersList[i]));
                clearForm()
                window.location.href="../home/home.html"
                } else{
                    showError()
                    $("#error").html("Invalid email or password ").removeClass('d-none')
                }

            }
        }else{
            showError()
            $("#error").html("User doesn't exist ").removeClass('d-none')
        }
    }else{
        showError()
        $("#error").html("All inputs is required and all inputs must valid").removeClass('d-none')
    }  

}

///////////////////////////////////////////////////////////////////////

let span=document.querySelectorAll("span")
span[0].addEventListener("click",function(e){
    span[0].style.display="none"
    span[1].style.display="block"
    $('#pass').attr('type',"text")
})
span[1].addEventListener("click",function(e){
    span[1].style.display="none"
    span[0].style.display="block"
    $('#pass').attr('type',"password")
})

span[2]?.addEventListener("click",function(e){
    span[2].style.display="none"
    span[3].style.display="block"
    $('#repass').attr('type',"text")
})
span[3]?.addEventListener("click",function(e){
    span[3].style.display="none"
    span[2].style.display="block"
    $('#repass').attr('type',"password")
})

