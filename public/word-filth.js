// vi: set sw=2 et :

(function () {

  var shuffle = function(array) {
    var i = 0
      , j = 0
      , temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  var wordList = [];

  var addWordList = function(listName, pairs) {
    wordList = wordList.concat(pairs);
  };

  var importSimplePairs = function (blockOfText) {
    var pairs = [];

    blockOfText.split(/\n/).forEach(function (lineOfText) {
      var m;
      if (m = lineOfText.match(/^\s*(\w+)\s+(\w+)\s*$/)) {
        pairs.push({ en_gb: m[2], da_dk: m[1] });
      }
    });

    return pairs;
  };

  addWordList('days', importSimplePairs(`
    mandag	Monday
    tirsdag	Tuesday
    onsdag	Wednesday
    torsdag	Thursday
    fredag	Friday
    lørdag	Saturday
    søndag	Sunday
  `));

  addWordList('months', importSimplePairs(`
    januar	January
    februar	February
    marts	March
    april	April
    maj	May
    juni	June
    juli	July
    august	August
    september	September
    oktober	October
    november	November
    december	December
  `));

  addWordList('seasons', importSimplePairs(`
    forår	Spring
    sommer	Summer
    efterår	Autumn
    vinter	Winter
  `));

  const SHUFFLE_EVERY = 5;
  const SHUFFLE_EXCEPT_LAST_N = 5;
  var iterations = 0;
  var nextWordPair = function() {
    var p = wordList.pop();
    wordList.unshift(p);

    if (++iterations >= SHUFFLE_EVERY) {
      var p1 = wordList.splice(0, wordList.length - SHUFFLE_EXCEPT_LAST_N);
      shuffle(p1);
      wordList = p1.concat(wordList);
      iterations = 0;
    }

    return(p);
  };

  var tidyText = function(t) {
    return t.toLowerCase().replace(/\s+/g, ' ').trim();
  };

  var matchingText = function(textA, textB) {
    return(tidyText(textA) === tidyText(textB));
  };

  var doSimpleTextToText = function(promptText, challengeWord, correctResponseWord) {
    $('.heading').text(promptText);
    $('.challenge').text(challengeWord);
    $('.response').val('');
    $('.response').focus();

    $('.message-correct').hide();
    $('.message-incorrect').hide();
    $('.message-give-up').hide();

    $('form').off('submit');
    $('form').off('reset');

    $('form').on('submit', function (event) {

      var givenAnswer = $('.response').val();

      if (matchingText(correctResponseWord, givenAnswer)) {
        $('.message-correct').show().delay(500).fadeOut(250, function () {
          nextQuestion();
        });
      } else {
        $('.message-incorrect').show().delay(750).fadeOut(250);
      }

      return false;
    });

    $('form').on('reset', function (event) {
      $('.message-give-up .correct-answer').text(correctResponseWord);
      $('.message-give-up').show().delay(2000).fadeOut(250, function () {
        nextQuestion();
      });

      return false;
    });
  };

  var doSimpleDkToEn = function() {
    var pair = nextWordPair();
    doSimpleTextToText('Hvad er den engelsk ord for:', pair.da_dk, pair.en_gb);
  };

  var doSimpleEnToDk = function() {
    var pair = nextWordPair();
    doSimpleTextToText('Hvad er den dansk ord for:', pair.en_gb, pair.da_dk);
  };

  var nextQuestion = function() {
    if (Math.random() > 0.5) {
      doSimpleDkToEn();
    } else {
      doSimpleEnToDk();
    }
  };

  var newGame = function () {
    shuffle(wordList);
    nextQuestion();
  };

  $(document).ready(newGame);

})();
