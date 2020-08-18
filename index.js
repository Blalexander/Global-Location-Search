'use strict';
var newsPageNumber = 1;
let input = document.querySelector('#addressBox').value;
document.addEventListener("touchstart", function() {}, true);


function getWiki(searchQuery, callback) {
  // let wikiEP = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchQuery}&limit=1&format=json&callback=?`;
  let wikiEP = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${searchQuery}`;
  $.ajax({
    type: 'GET',
    url: wikiEP,
    async: true,
    dataType: 'jsonp',      
    success: callback
  });
}

//searches description given from API for Wiki's default phrase "may refer to" and replaces it with a more helpful explanation
function filterWikiResults(wikiData) {
  console.log(wikiData.query.search[0])
  // if (wikiData[2][0].includes("may refer to")) {
  //   $('.historyContainer').append(`<p>Uh oh!  There seems to be a few places with that name.</p>
  //   <p>You can try making your search more specific, or clicking <a href="${wikiData[3][0]}" target="_blank">here</a> to see results on Wikipedia.</p>`);
  // }
  // else {
    printWikiResults(wikiData);
  // }
}

function printWikiResults(wikiData) {
  let title = wikiData.query.search[0].title;
  let description = wikiData.query.search[0].snippet;
  // let link = wikiData[3][0];
  description = description.replace("( ( listen))", "");
  description = description.replace("( listen);", "");
  description = description.replace("US:", "");
  description = description.replace("()", "");

  $('.historyContainer').append(`<h1 id="wikiTitle">${title}</h1>
  <h2 id="wikiDescription">${description}</h2>`);
}

function getNews(searchQuery, callback) {
  let newsEP = `https://microsoft-azure-bing-news-search-v1.p.rapidapi.com/search?count=10&q=${searchQuery}`;
  let settings = {
    "async": true,
    "crossDomain": true,
    "url": newsEP,
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "microsoft-azure-bing-news-search-v1.p.rapidapi.com",
      "x-rapidapi-key": "a2a1d6b4bemshe811d0c37dc6c6dp1397d1jsn9c0c4b73a639"
    }
  }
  
  $.ajax(settings).done(function (response) {
    callback(response)
    console.log(response);
  });
}

//Previous function which got news from NewsAPI.  Commenting out and keeping here for potential future use.
// function getNews(searchQuery, callback) {
//   let newsEP = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=relevancy&pageSize=5&page=${newsPageNumber}&apiKey=0b1e1594e959400e9c6179dd16bd5369`;
//   $.ajax({
//     type: 'GET',
//     url: newsEP,
//     contenttype: 'application/x-www-form-urlencoded; charset=UTF-8',
//     async: true,
//     datatype: 'jsonp',
//     success: callback,
//   });
// }

//checks to see if there is more than one result and prints a response if there is not
function filterNewsResults(newsData) {
  if (newsData.value.length < 1) {
    $('.newsContainer').html("<h2>Sorry!  We couldn't find any news results for that search!</h2>");
  }
  else {
    printNewsResults(newsData);
  }   
}

function printNewsResults(newsData) {
  $('.newsContainer').prepend(`<h1 class="trendingNews">Trending News:</h1>`);
  for (var i=0; i<newsData.value.length; i++) { 
    let title = newsData.value[i].name;
    let sourceName = newsData.value[i].provider[0].name;
    let description = newsData.value[i].description;
    let articleUrl = newsData.value[i].url;

    $('.newsContainer').append(`<h2 class="newsArticleTitle">${title}</h2>
    <h3 class="newsContent">${sourceName}</h3>
    <p class="newsContent">${description}</p>
    <a href="${articleUrl}" target="_blank" class="newsContent newsUrl">${articleUrl}</a>`);
  }
}

function handleSubmit() {
  //search news using raw input so results aren't as limited as a Wiki search
  input = document.querySelector('#addressBox').value;
  getNews(input, filterNewsResults);

  //reformat raw input to retrieve more accurate Wiki results
  let searchQuery = toTitleCase(input);
  searchQuery = searchQuery.replace(" ", "_");
  searchQuery = searchQuery.replace(",", "");
  getWiki(searchQuery, filterWikiResults);

  document.querySelector('body').style.overflowY = "unset";
  $('#stickThis').addClass("topAndBottomBars");
  $('header').addClass("adjustAfterSearch");
  $('.websiteDescription').addClass("hideAfterSearch");
  $('#politicalMap').removeClass("hideOnLoad");
  $('#geographicMap').removeClass("hideOnLoad");
  $('.currentEvents').removeClass("hideOnLoad");
  $('header').removeClass("centerOnLoad");
  $('.pageChangeButtons').removeClass('hideOnLoad');
  $('.nextPage').removeClass("hideOnLoad");
  $('footer').addClass("adjustmentsAfterSearch");
  $('.historyContainer').html(" ");
  $('.newsContainer').html(" ");
}

//standardizes the capitalization to search Wiki for proper names
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

//allows user to load the next 5 articles
$('.nextPage').on('click', function(e){
  e.preventDefault();
  $('.newsContainer').html(" ");
  newsPageNumber++;
  getNews(input, filterNewsResults);
  $('.pageNumber').removeClass("hideOnLoad");
  $('.pageNumber').html(`<p>${newsPageNumber}</p>`);
  if (newsPageNumber > 1) {
    $('.previousPage').removeClass("hideOnLoad");
  }
});

//allows user to see the previous 5 articles displayed
$('.previousPage').on('click', function(e){
  e.preventDefault();
  $('.newsContainer').html(" ");
  newsPageNumber--;
  getNews(input, filterNewsResults);
  $('.pageNumber').html(`<p>${newsPageNumber}</p>`);
  if (newsPageNumber === 1) {
    $('.previousPage').addClass("hideOnLoad");
    $('.pageNumber').addClass("hideOnLoad");
  }
});

//listener that starts Wiki and News searches
document.getElementById('searchButton').addEventListener('click',  function (e) {
  e.preventDefault();
  handleSubmit();
});

function sticktothetop() {
  var window_top = $(window).scrollTop();
  var top = $('#stick-here').offset().top;
  // var top = $('#stickThis').offset().top;
  if (window_top > top) {
      $('#stickThis').addClass('stick');
      // $('#stick-here').height($('#stickThis').outerHeight(true));
  } else {
      $('#stickThis').removeClass('stick');
      // $('#stick-here').height(0);
  }
}
$(function() {
  $(window).scroll(sticktothetop);
  sticktothetop();
});
