process.env.NODE_ENV = "test";
const request = require("supertest");
const Book = require("./models/book");
const app = require("./app");
const db = require("./db");

let sicp = {
  isbn: "8173715270",
  amazon_url:
    "https://www.amazon.com/Structure-Interpretation-Computer-Programs-Sussman/dp/8173715270",
  author: "Harold Abelson, Gerald Jay Sussman, Julie Sussman",
  language: "english",
  pages: 684,
  publisher: "Universities Press (India) Pvt. Limited",
  title: "Structure and Interpretation of Computer Programs - 2nd Edition",
  year: 1979,
};

let k_and_r = {
  isbn: "0131103628",
  amazon_url:
    "https://www.amazon.com/Programming-Language-2nd-Brian-Kernighan/dp/0131103628/ref=sr_1_3?adid=082VK13VJJCZTQYGWWCZ&campaign=211041&creative=374001&dchild=1&keywords=C+Programming+Language&qid=1607496736&s=books&sr=1-3&tag=x_gr_w_bb_sin-20",
  author: "Brian W. Kernighan, Dennis Ritchie",
  language: "english",
  pages: 272,
  publisher: "Pearson Education",
  title: "C Programming Language (2nd Ed.)",
  year: 1988,
};

beforeEach(async function () {
  await Book.create(sicp);
});

afterEach(async function () {
  await db.query(`DELETE FROM books`);
});

describe("GET /books", function () {
  test("Get all books", async function () {
    const resp = await request(app).get("/books");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ books: [sicp] });
  });
});

describe("POST /books", function () {
  test("Adds a new book", async function () {
    const resp = await request(app).post("/books").send(k_and_r);
    expect(resp.statusCode).toBe(201);
    const resp2 = await request(app).get("/books");
    expect(resp2.body.books.length).toEqual(2);
    expect(resp2.body).toEqual({ books: [k_and_r, sicp] });
  });
});

describe("GET /books/:isbn", function () {
  test("Get single book", async function () {
    const resp = await request(app).get("/books/8173715270");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ book: { ...sicp } });
  });
});

describe("PATCH /books/:isbn", function () {
  test("Patch single book", async function () {
    let newSicp = {
      amazon_url:
        "http://amazon.com/Structure-Interpretation-Computer-Programs-Sussman/dp/8173715270",
      author: "Hal Abelson",
      language: "english",
      pages: 1,
      publisher: "MIT??",
      title: "SICP",
      year: 2020,
    };
    const resp = await request(app).put("/books/8173715270").send(newSicp);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      book: {
        isbn: "8173715270",
        amazon_url:
          "http://amazon.com/Structure-Interpretation-Computer-Programs-Sussman/dp/8173715270",
        author: "Hal Abelson",
        language: "english",
        pages: 1,
        publisher: "MIT??",
        title: "SICP",
        year: 2020,
      },
    });
  });
});

describe("DELETE /books/:isbn", function () {
  test("Delete single book", async function () {
    const resp = await request(app).delete("/books/8173715270");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Book deleted" });
  });
});
