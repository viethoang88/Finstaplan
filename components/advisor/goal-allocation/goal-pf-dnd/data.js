// import { colors } from "@atlaskit/theme";
// import jakeImg from "./assets/jake.png";
// import finnImg from "./assets/finn.png";
// import bmoImg from "./assets/bmo.png";
// import princessImg from "./assets/princess.png";

const jake = {
  id: "1",
  name: "SomeCompany (123456)",
  url: "http://adventuretime.wikia.com/wiki/Jake",
  // avatarUrl: jakeImg,
  colors: {
    soft: "rgb(255, 250, 230)",
    hard: "rgb(255, 196, 0)",
  },
};

const BMO = {
  id: "2",
  name: "OtherCompany (7654321)",
  url: "http://adventuretime.wikia.com/wiki/BMO",
  // avatarUrl: bmoImg,
  colors: {
    soft: "rgb(255, 250, 230)",
    hard: "rgb(255, 196, 0)",
    // soft: colors.G50,
    // hard: colors.G200,
  },
};

const finn = {
  id: "3",
  name: "Madison Financial",
  url: "http://adventuretime.wikia.com/wiki/Finn",
  // avatarUrl: finnImg,
  colors: {
    soft: "rgb(255, 250, 230)",
    hard: "rgb(255, 196, 0)",
    // soft: colors.B50,
    // hard: colors.B200,
  },
};

const princess = {
  id: "4",
  name: "MFM",
  url: "http://adventuretime.wikia.com/wiki/Princess_Bubblegum",
  // avatarUrl: princessImg,
  colors: {
    soft: "rgb(255, 250, 230)",
    hard: "rgb(255, 196, 0)",
    // soft: colors.P50,
    // hard: colors.P200,
  },
};

export const authors = [jake, BMO, finn, princess];

export const quotes = [
  {
    id: "1",
    content: "Retirement Income",
    author: BMO,
  },
  {
    id: "2",
    content: "Arrange Financial Documents",
    author: jake,
  },
  {
    id: "3",
    content: "Restructure Superannuation",
    author: jake,
  },
  {
    id: "4",
    content: "Buy/Build a Residential Property",
    author: finn,
  },
  {
    id: "5",
    content: "My new goal",
    author: finn,
  },
  {
    id: "6",
    content: "Buy/Build a Residential Property",
    author: princess,
  },
  {
    id: "7",
    content: "Renovate Property",
    author: princess,
  },
  {
    id: "8",
    content: "Education",
    author: finn,
  },
  {
    id: "9",
    content: "Start a Business",
    author: finn,
  },
  {
    id: "10",
    content: "Pay off Debts",
    author: princess,
  },
  {
    id: "11",
    content: "Gift",
    author: princess,
  },
];

const getByAuthor = (author, items) =>
  items.filter((quote) => quote.author === author);

export const authorQuoteMap = authors.reduce(
  (previous, author) => ({
    ...previous,
    [author.name]: getByAuthor(author, quotes),
  }),
  {}
);
