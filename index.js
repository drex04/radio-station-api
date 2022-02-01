import app from "./app.js";

function App(req, res) {
  if (!req.url) {
    req.url = "/";
    req.path = "/";
  }
  return app(req, res);
}
const blogApi = App;
export { blogApi };
