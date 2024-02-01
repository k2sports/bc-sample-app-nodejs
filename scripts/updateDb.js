const mysql = require("mysql2");
const util = require("util");
require("dotenv").config();

const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  ...(process.env.MYSQL_PORT && { port: process.env.MYSQL_PORT }),
};

const connection = mysql.createConnection(
  process.env.DATABASE_URL ? process.env.DATABASE_URL : MYSQL_CONFIG
);
const query = util.promisify(connection.query.bind(connection));

const storeSettingsCreate = query(
  "CREATE TABLE `storeSettings` (\n" +
    "  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,\n" +
    "  `storeHash` varchar(10) NOT NULL,\n" +
    "  `isEnabled` boolean,\n" +
    "  `showRecommendedMethod` boolean,\n" +
    "  `hideFreeShippingGroups` varchar(120),\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  UNIQUE KEY `storeHash` (`storeHash`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;\n"
);

Promise.all([storeSettingsCreate]).then(() => {
  connection.end();
});
