const SLACK_WEBHOOK_URL = "xxxx";
const QUOTE_API_URL = "https://zenquotes.io/api/random";

function sendDailyQuote() {
  try {
    const quote = fetchQuote();
    postToSlack(quote);
  } catch (error) {
    logError(error);
  }
}

function fetchQuote() {
  const response = UrlFetchApp.fetch(QUOTE_API_URL);
  const data = JSON.parse(response.getContentText());

  return {
    text: data.content,
    author: data.author
  };
}

function postToSlack(quote) {
  const payload = {
    text: `📖 *Daily Motivation*\n\n"${quote.text}"\n— *${quote.author}*`
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
}

function logError(error) {
  Logger.log("Error: " + error.toString());
}
