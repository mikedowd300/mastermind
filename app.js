var activeColor;
var guessCount = 0;
var guessDiv = 8;
var pegCount = 0;
var solved = false;
var pegArray = [[],[]];
var hidRay = [];
setHidRay();

tableResize();

function setHidRay(){
  for ( i = 0; i < 4; i ++) {
    hidRay[i] = Math.floor(((Math.random()*391)%6)) + 1;
  }
}

function setPegArray(){
  var guessRay = document.getElementsByClassName('guess');
  for (var g = 0; g < 9; g += 1){
    pegArray[g] = [];
    var pegRay = guessRay[g].getElementsByClassName('peg');
    for(var p = 0; p < 4; p += 1) {
      pegArray[g][p] = $(pegRay[p]).css("backgroundColor");
    }
  }
}

function addAllowClass(x){
  var pegAllow;
  var guessAllow = document.getElementsByClassName('guess');
  for ( i = 0; i < 4; i++) {
    if(x >= 0){
      pegAllow = guessAllow[x].getElementsByClassName('peg');
      $(pegAllow[i]).addClass('allow');
    }
  }
}

function removeAllowClass(x){
  var pegRemove;
  var guessRemove = document.getElementsByClassName('guess');
  for ( i = 0; i < 4; i++) {
    pegRemove = guessRemove[x].getElementsByClassName('peg');
    $(pegRemove[i]).removeClass('allow');
  }
}

$(window).resize(tableResize);

function tableResize() {
  var myWidth = $(".guess").css("height") - 1;
  var tableWidth = parseInt($("#table").css("width"));
  $(".peg").css("height", myWidth);
  $(".peg").css("width", myWidth);
  $("#board").css("min-width", 300);
}

setPegArray();
var nativeColor = pegArray[8][1];
activeColor = nativeColor;
addAllowClass(guessDiv);

$(".inner").click(function(){
   // Set the active color
  activeColor = $(this).css("backgroundColor");
   // Unmark the other color that were previosly marked active
  var selectedArray = document.getElementsByClassName('selected');
   for (var i = 0; i < 6; i += 1) {
    $(selectedArray[i]).css("backgroundColor", "rgba(0, 0, 0, 0)");
  }
   //Mark as selected by coloring the slected class with the same color
  $(this).parent().css("backgroundColor", activeColor);
});

function putPeg(){
  if( $(this).css("backgroundColor") === activeColor && activeColor !== nativeColor){
    $(this).css("backgroundColor", nativeColor);//change back to no color when same color is entered twice
    pegCount--;
  } else if( $(this).css("backgroundColor") === nativeColor && activeColor !== nativeColor) {
    $(this).css("backgroundColor", activeColor);
    pegCount++;
  } else {
    $(this).css("backgroundColor", activeColor);
  }
  //Check to see if its the fourth peg of the guess. If so this triggers a submit - eventually
  if(pegCount === 4){
    $('#button').css('visibility','visible');
    setPegArray();
  } else {
    $('#button').css('visibility','hidden');//This is actually necessary
  }
}

$('.allow').bind('click', putPeg);

function skipper(){
  $('#howto').css('visibility', 'hidden');
}

function showInstructions(){
  $('#howto').css('visibility', 'hidden');
  $('.instructions').css('display', 'block');
}

function hideInstructions() {
  $('.instructions').css('display', 'none');
}

function preGrader(){
  $('.allow').unbind('click');
  guessCount++;
  guessDiv--;
  pegCount = 0;
  $('#button').css('visibility','hidden');
  addAllowClass(guessDiv);
  removeAllowClass(guessDiv + 1);
  $('.allow').bind('click', putPeg);
  grader();
}

function grader() {
  var gradeRay = [];
  var numRay = [];
  var tempRay = [];
  var gesElem = document.getElementsByClassName('guess');
  var pegElem = gesElem[guessDiv + 1].getElementsByClassName('peg');

  for ( i = 0; i < hidRay.length; i++) {
    tempRay[i] = hidRay[i];
  }

  for ( i = 0; i < pegElem.length; i++) {
    var myColor = pegElem[i].style.backgroundColor;
    if (myColor === $('#redPeg').css('backgroundColor') ) {
      numRay[i] = 1;
    } else if (myColor === $('#bluePeg').css('backgroundColor') ) {
      numRay[i] = 2;
    } else if (myColor === $('#greenPeg').css('backgroundColor') ) {
      numRay[i] = 3;
    } else if (myColor === $('#yellowPeg').css('backgroundColor') ) {
      numRay[i] = 4;
    } else if (myColor === $('#blackPeg').css('backgroundColor') ) {
      numRay[i] = 5;
    } else {
      numRay[i] = 6;
    }
  }

  //Check for black Grade pegs
  for ( i = 0; i < 4; i++) {
    if( numRay[i] === tempRay[i]){
      gradeRay.push('black');
      numRay[i] = -1; //So it doesnt get double counted when checking for white pegs
      tempRay[i] = -2;//So it doesnt get double counted when checking for white pegs
    }
  }

  //Check for white grade peg
  for ( i = 0; i < numRay.length; i++) {
    for ( j = 0; j < numRay.length; j++) {
      if ( numRay[i] === tempRay[j]) {
        gradeRay.push('white');
        numRay[i] = -1; //So it doesnt get double counted - i don't think this is necessary
        tempRay[j] = -2;//So it doesnt get double counted when there are multipl pegs of the same color
      }
    }
  }

  if(gradeRay[0] === 'black' && gradeRay[1] === 'black' && gradeRay[2] === 'black' && gradeRay[3] === 'black') {
      $('#winner').css('display','block');
  }

  //set the grade peg colors in there holes
  var gradeElem = gesElem[guessDiv + 1].getElementsByClassName('grade');
  var gradePegElem = gradeElem[0].getElementsByClassName('pegGrade');
  //console.log(gradePegElem.length);
  for ( i = 0; i < gradeRay.length; i++) {
    //var tempColor = gradeRay[i];
    $(gradePegElem[i]).css('backgroundColor', gradeRay[i]);
  }
}
