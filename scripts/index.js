
$('#startExam').on("click",function(){    
    startExam(`${this.value}`)
})

$(".start").click(function(e){
    let imageSrc = $(this).closest('.parent').find('img').attr("src");    
   $(".innerBox img").attr("src",`${imageSrc}`)
   $("#boxContainer").removeClass("d-none");
   $("#boxContainer").addClass("d-flex");
   $("#startExam").html(`Start ${this.id} exam`).attr("value",`${this.id}`)
})
$('#backHome').on('click', function () {
    $("#boxContainer").addClass("d-none");
   $("#boxContainer").removeClass("d-flex");
});
let time=300
let currentSubject = 'html'; 
async function startExam(subject) {
    currentSubject = subject;
    sessionStorage.setItem("time", time);
    sessionStorage.setItem('currentSubject', JSON.stringify(currentSubject));
    window.location.replace('../quize/quize.html')
}





