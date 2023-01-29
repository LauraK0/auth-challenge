const {
  listConfessions,
  createConfession,
} = require("../model/confessions.js");
const { getSession } = require("../model/session.js");
const { Layout } = require("../templates.js");

function get(req, res) {
  const sid = req.signedCookies.sid; // * [1] Get the session ID from the cookie
  const session = getSession(sid); // * [2] Get the session from the DB
  const current_user = session && session.user_id; // * [3] Get the logged in user's ID from the session
  const page_owner = Number(req.params.user_id); // * [4] Get the page owner from the URL params
  if (current_user !== page_owner) {
    // * [5] If the logged in user is not the page owner send a 401 response
    return res.status(401).send("You are not authorized to view this page");
  }
  const confessions = listConfessions(req.params.user_id);
  const title = "Your secrets";
  const content = /*html*/ `
    <div class="Cover">
      <h1>${title}</h1>
      <form method="POST" class="Stack" style="--gap: 0.5rem">
        <textarea name="content" aria-label="your confession" rows="4" cols="30" style="resize: vertical"></textarea>
        <button class="Button">Confess 🤫</button>
      </form>
      <ul class="Center Stack">
        ${confessions
          .map(
            (entry) => `
            <li>
              <h2>${entry.created_at}</h2>
              <p>${entry.content}</p>
            </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;
  const body = Layout({ title, content });
  res.send(body);
}

function post(req, res) {
  /**
   * Currently any user can POST to any other user's confessions (this is bad!)
   * We can't rely on the URL params. We can only trust the cookie.
   * [1] Get the session ID from the cookie
   * [2] Get the session from the DB
   * [3] Get the logged in user's ID from the session
   * [4] Use the user ID to create the confession in the DB
   * [5] Redirect back to the logged in user's confession page
   */
  const current_user = Number(req.params.user_id);
  createConfession(req.body.content, current_user);
  res.redirect(`/confessions/${current_user}`);
}

module.exports = { get, post };
