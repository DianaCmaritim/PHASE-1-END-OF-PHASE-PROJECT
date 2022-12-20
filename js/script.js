$(document).ready(function(){
 //toggler-btn
    $('.navbar-toggler').click(function () {
        $('.navbar-toggler').toggleClass('change')
    })
    
    //sticky-nabvar less padding
    $(window).scroll(function () {
        let position = $(this).scrollTop(); 
        if(position>= 718) {
            $('.navbar').addClass('navbar-background');
            $('.navbar').addClass('fixed-top');

        }
        else{
            $('.navbar').removeClass('navbar-background');
            $('.navbar').removeClass('fixed-top');
        }
    })

    //smooth scroll
    $('.nav-item a, .header-link,#back-to-top').click(function(link){
        link.preventDefault();
        let target= $(this).attr('href');
        $('html,body').stop().animate({
            scrollTop: $(target).offset().top - 25
        },3000);
    })
    
    
    //back to top
    $(window).scroll(function () {
        let position = $(this).scrollTop();
        if(position>= 718) {
            $('#back-to-top').addClass('scrollTop');
            

        }
        else{
            $('#back-to-top').removeClass('scrollTop');
        }
    })

    
    //ripples
    $("#header, .info").ripples({
        dropRadius: 25,
        perturbance: 0.6,
      });
      //magnific popup
      $('.parent-container').magnificPopup({
        delegate: 'a', // child items selector, by clicking on it popup will open
        type: 'image',

        gallery:{
            enabled:true 
        }
        // other options
      });
});



// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}