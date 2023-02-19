/**
 * i am so sorry but a hackathon that is 24 hours long does not give me time to,
 * organize my code >w<
 * authors: Refaat 🐸
 */
const express = require("express");
const rp = require("request-promise");
const cheerio = require("cheerio");
const cors = require("cors");
const path = require("path");
const serpapi = require("serpapi");
// create an instance of express
const app = express();
app.use(cors());
//getJson data func from serp
const { getJson } = serpapi;

//serve static files on localhost
console.log(path.join(__dirname, "..", "..", "/frontend/styles"));
app.use(express.static(path.join(__dirname, "..", "..", "frontend/")));

const getEventsData = async (req, res) => {
  try {
    const { city, eventType, date } = req.query;
    console.log(city);
    const params = {
      q: `Events in ${city}`,
      hl: "en",
      gl: "us",
      htichips: `event_type:${eventType},date:${date}`,
      api_key:
        "e4c34b91f9e2462dbb95c9020d3c4b4256e0fa8a4b38f17e26c0ac6fff7ccbac",
    };

    // Show result as JSON
    const response = await getJson("google_events", params);
    console.log(response["events_results"]);
    return res.json(response["events_results"]);
  } catch (error) {
    console.log(error);
  }
};

/**
 * this function gets the raw data from the https://www.jobbank.gc.ca website.
 * the data is contains the bussiness name, date posted, and link the the business
 */
function getRawDataFromURL(url) {
  let results = "";
  return new Promise((resolve, reject) => {
    rp(url)
      .then(function (html) {
        // initalize cheerio with the provided html
        const $ = cheerio.load(html);

        // loops through the article tags in the results-jobs container
        $(".results-jobs article", html).each(function () {
          const hrefs = $(this).find("a.resultJobItem").attr("href").trim(); // get all the li with the business class
          const businesses = $(this).find("li.business").text().trim(); // get all the li with the business class
          const dates = $(this).find("li.date").text().trim(); // get all the li with the date class

          // add new line of data into results
          results +=
            "https://www.jobbank.gc.ca" +
            hrefs +
            "~" +
            businesses +
            "~" +
            dates +
            "\n";
        });

        // magic 🧙‍♂️
        resolve(results);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

/**
 * this function formats the raw data as JSON
 */
function getJsonFromRawData(url) {
  let data = [];

  return new Promise((resolve, reject) => {
    getRawDataFromURL(url)
      .then((jobs) => {
        const jobsarray = jobs.split("\n");

        jobsarray.forEach((job) => {
          const [redirect, companyName, datePosted] = job.split("~");
          data.push({ redirect, companyName, datePosted });
        });

        resolve(data);
      })
      .catch((error) => reject(error));
  });
}

/**
 * this endpoint returns a list of job objects that are,
 * scraped off of jobbank.gc.ca.
 * i hope this is not illegal, if the RCMP is reading this i want them to know that,
 * this is for learning purposes only >:3
 */
app.get("/", (req, res) => {
  res.redirect('/pages/home');
});

app.get("/api/events", getEventsData);

app.get("/api/jobs", (request, response) => {
  const query = request.query.query;
  const url = `https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=${query}&locationstring=Calgary%2C+AB&sort=M`;

  getJsonFromRawData(url)
    .then((jobsAsJson) => {
      return response.status(200).json(jobsAsJson);
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).json({
        message: "something went wrong on our side 🐸",
      });
    });
});

/**
 * render hompage.html
 */
app.get("/pages/home", (request, response) => {
  response.sendFile(
    path.join(__dirname, "..", "..", "frontend/pages/homepage.html")
  );
});
/**render budget page */
app.get("/pages/budget", (request, response) => {
  response.sendFile(
    path.join(__dirname, "..", "..", "frontend/pages/BudgetPage.html")
  );
});
/**
 * render JobBoardPage.html
 */
app.get("/pages/jobs", (request, response) => {
  response.sendFile(
    path.join(__dirname, "..", "..", "frontend/pages/JobBoardPage.html")
  );
});

/**
 * render SafetyPage.html
 */
app.get("/pages/safety", (request, response) => {
  response.sendFile(
    path.join(__dirname, "..", "..", "frontend/pages/SafetyPage.html")
  );
});

/**
 * render {Insert Jay Nguyens Stuff}.html
 */
app.get("/pages/events", (request, response) => {
  response.sendFile(
    path.join(__dirname, "..", "..", "frontend/pages/EventsPage.html")
  );
});

// open port 🐸
app.listen(3333, () => console.log("listening @ http://localhost:3333"));
