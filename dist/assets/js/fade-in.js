$('.animation01').css('visibility','hidden');
$('.animation02').css('visibility','hidden');
$('.animation03').css('visibility','hidden');
$('.animation04').css('visibility','hidden');

const targetPosition01 = $('#animation01').offset().top;
const targetPosition02 = $('#animation02').offset().top;
const targetPosition03 = $('#animation03').offset().top;
const targetPosition04 = $('#animation04').offset().top;

$(window).scroll(function() {
  const windowHeight = $(window).height();
  const topWindow = $(window).scrollTop();

  // 01
  if(topWindow > targetPosition01 - windowHeight) {
    $('#animation01').addClass("fadeInDown01")
  } else {
    $('#animation01').removeClass("fadeInDown01")
    $('#animation01').css('visibility','hidden');
  }

  // 02
  if(topWindow > targetPosition02 - windowHeight) {
    $('#animation02').addClass("fadeInDown02")
  } else {
    $('#animation02').removeClass("fadeInDown02")
    $('#animation02').css('visibility','hidden');
  }

  // 03
  if(topWindow > targetPosition03 - windowHeight) {
    $('#animation03').addClass("fadeInDown01")
  } else {
    $('#animation03').removeClass("fadeInDown01")
    $('#animation03').css('visibility','hidden');
  }

  // 04
  if(topWindow > targetPosition04 - windowHeight) {
    $('#animation04').addClass("fadeInDown02")
  } else {
    $('#animation04').removeClass("fadeInDown02")
    $('#animation04').css('visibility','hidden');
  }
})