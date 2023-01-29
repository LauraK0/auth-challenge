const { getSession } = require("../model/session");
const { removeSession } = require("../model/session");
const { Layout } = require("../templates.js");

function get(req, res) {
  const sid = req.signedCookies.sid;
  const session = getSession(sid);
  const title = "Confess your secrets!";
  const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      ${
        session
          ? /*html*/ `<form method="POST" action="/log-out"><button class="Button">Log out</button></form>`
          : /*html*/ `<nav><a href="/sign-up">Sign up</a> or <a href="/log-in">log in</a></nav>`
      }
    </div>
  `;
  const body = Layout({ title, content });
  res.send(body);
}

function post(req, res) {
  const sid = req.signedCookies.sid;
  removeSession(sid);
  res.clearCookie("sid");
  res.redirect("/");
}
module.exports = { get, post };
