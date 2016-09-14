const sass = require("node-sass");
const uglifycss = require("uglifycss");
const pug = require("pug");
const fs = require("fs");

var result = sass.renderSync({
	file: "./app/styles/index.scss"
});
const css = uglifycss.processString(result.css.toString(), { });

const prodIndexHtml = pug.renderFile("./app/index.pug", { css: css });
fs.writeFile("app/index.html", prodIndexHtml);
