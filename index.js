const fs = require("fs"); // return object with a lot of functions
const http = require("http"); // http module, networking capabilites(building https server)
const url = require("url"); // url module, for working with urls

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate"); // importing our own module

//////////////////////////
//FILES

// //Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); // reads the data from the file and return it
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut); // write something inside into the file
// console.log("File written !");

// //NonBlocking, asynchronous way(with callbacks)
// fs.readFile("./txt/start.txt", "utf-8", (error, data1) => {
//   if (error) return console.log("Error!");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (error, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written !");
//       });
//     });
//   });
// });
// console.log("Will read file!");

//////////////////////////
//SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8"); //__dirname means directory name
const dataObj = JSON.parse(data); // parsing json into an object

const slugs = dataObj.map((item) => slugify(item.productName, { lower: true }));
console.log(slugs);

//we created a server by .createServer and passed a callback function that hits every time when request sends to a server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); // getting a query and a path name of our url

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      // sending header
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const product = dataObj[query.id];

    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      // write a header and making it into an error
      "Content-type": "text/html",
      "my-own-header": "hello -world",
    });
    res.end("<h1>Page not found!</h1>");
  }
}); // server is a result of creating method

//then we started listening for incoming request on local host api and on port(8000)
server.listen(8000, "127.0.0.1", () => {
  console.log("Server started, listening to requests on port 8000");
}); // start listening for incoming requests
