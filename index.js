// 'use strict';
var newsPageNumber = 1;
let input = document.querySelector('#addressBox').value;

function getWiki(searchQuery, callback) {
  let wikiEP = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchQuery}&limit=1&format=json&callback=?`;
  $.ajax({
    type: 'GET',
    url: wikiEP,
    async: true,
    dataType: 'json',      
    success: callback
  });
}

function displayWikiResults(wikiData) {
  let title = wikiData[1][0];
  let description = wikiData[2][0];
  let link = wikiData[3][0];
  description = description.replace("( ( listen))", "");

  $('.historyContainer').append(`<h2>${title}</h2>
  <p>${description}</p>
  <p><a href="${link}" target="_blank" class="wikiLink">Click here to read more about ${title}</a></p>`);
}

function getNews(searchQuery, callback) {
  let newsEP = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=relevancy&pageSize=5&page=${newsPageNumber}&apiKey=0b1e1594e959400e9c6179dd16bd5369`;
  $.ajax({
    type: 'GET',
    url: newsEP,
    async: true,
    datatype: 'json',
    success: callback,
  });
}

//separate into two functions
function displayNewsResults(newsData) {
  if (newsData.articles.length < 1) {
    $('.newsContainer').html("<h2>Sorry!  We couldn't find any news results for that search!</h2>");
  }
  else {
    printNewsResults(newsData);
  }   
}

function printNewsResults(newsData) {
  $('.newsContainer').prepend(`<h1>Trending News:</h1>`);
  for (var i=0; i<=newsData.articles.length; i++) { 
    let title = newsData.articles[i].title;
    let sourceName = newsData.articles[i].source.name;
    let description = newsData.articles[i].description;
    let articleUrl = newsData.articles[i].url;

    $('.newsContainer').append(`<h2>${title}</h2>
    <h3>${sourceName}</h3>
    <p>${description}</p>
    <a href="${articleUrl}" target="_blank">${articleUrl}</a>`);
  }
}

function handleSubmit() {
  //search news using raw input so results aren't as limited as a Wiki search
  input = document.querySelector('#addressBox').value;
  getNews(input, displayNewsResults);

  //reformat raw input to retrieve more accurate Wiki results
  let searchQuery = toTitleCase(input);
  searchQuery = searchQuery.replace(" ", "_");
  getWiki(searchQuery, displayWikiResults);

  $('header').removeClass("centerOnLoad");
  $('.nextPage').removeClass("hideOnLoad");
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
  getNews(input, displayNewsResults);
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
  getNews(input, displayNewsResults);
  $('.pageNumber').html(`<p>${newsPageNumber}</p>`);
  if (newsPageNumber === 1) {
    $('.previousPage').addClass("hideOnLoad");
    $('.pageNumber').addClass("hideOnLoad");
  }
});

//right now, the page number add/removeClass methods are nested in the next and previous page functions.  Should it be a standalone function?  what would be ways to implement that?

//listener that starts Wiki and News searches
document.getElementById('searchButton').addEventListener('click',  function (e) {
  e.preventDefault();
  handleSubmit();
});


//long load times.  load screen or animation to cover it up?

//give credit to newsapi.org