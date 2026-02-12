/***************************************
 * CONFIGURATION
 ***************************************/
const CONFIG = {
  QUOTE_API_URL: "https://zenquotes.io/api/random",
  SLACK_WEBHOOK_URL: "WEBHOOK_URL"
};


/***************************************
 * MAIN FUNCTION (Triggered Daily)
 ***************************************/
function sendDailyQuote() {
  try {
    const quote = fetchQuote();
    
    if (isDuplicate(quote.text)) {
      Logger.log("Duplicate quote detected. Fetching another...");
      return;
    }

    postToSlack(quote);
    saveLastQuote(quote.text);

  } catch (error) {
    Logger.log("Error occurred: " + error);
    postFallbackQuote();
  }
}


/***************************************
 * FETCH QUOTE FROM API
 ***************************************/
function fetchQuote() {
  const response = UrlFetchApp.fetch(CONFIG.QUOTE_API_URL);
  const data = JSON.parse(response.getContentText());

  return {
    text: data[0].q,
    author: data[0].a
  };
}


/***************************************
 * SEND MESSAGE TO SLACK
 ***************************************/
function postToSlack(quote) {

  const payload = {
    text: `📖 *Daily Motivation*\n\n"${quote.text}"\n— *${quote.author}*`
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(CONFIG.SLACK_WEBHOOK_URL, options);

  if (response.getResponseCode() !== 200) {
    throw new Error("Slack webhook failed");
  }
}


/***************************************
 * FALLBACK MESSAGE IF API FAILS
 ***************************************/
function postFallbackQuote() {

  const fallback = {
    text: "Stay consistent. Small progress daily beats random bursts.",
    author: "Daily Bot"
  };

  postToSlack(fallback);
}


/***************************************
 * PREVENT DUPLICATE QUOTES
 ***************************************/
function isDuplicate(newQuote) {
  const properties = PropertiesService.getScriptProperties();
  const lastQuote = properties.getProperty("LAST_QUOTE");

  return lastQuote === newQuote;
}

function saveLastQuote(quoteText) {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty("LAST_QUOTE", quoteText);
}
