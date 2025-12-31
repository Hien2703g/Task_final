const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const http = require("http");
const systemConfig = require("./v2/config/system");
const database = require("./v1/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const moment = require("moment");
const methodOverride = require("method-override");

const route = require("./v1/routes/User/index.route");
const routeAdmin = require("./v2/routes/index.route");
const routeManager = require("./v1/routes/Manager/index.route");

const port = process.env.PORT;

// DB
database.connect();

// Server + Socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
global._io = io;

// ===== MIDDLEWARE (THỨ TỰ CHUẨN) =====

// body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// cookie
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// static
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// method override
app.use(methodOverride("_method"));

// locals
app.locals.moment = moment;
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// routes
route(app);
routeAdmin(app);
routeManager(app);

// start
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
