import express from "express";
import Podlet from "@podium/podlet";

const podlet = new Podlet({
  name: "podium-4-podlet",
  pathname: "/",
  version: `${Date.now()}`,
  development: true,
});

podlet.js({ value: "/client/js" });

const app = express();

app.use(podlet.middleware());

app.get(podlet.manifest(), (req, res) => {
  res.send(podlet);
});

app.get("/client/js", (req, res) => {
  res.set("content-type", "application/javascript");
  res.send(`
    window.addEventListener('load', async () => {
      const el = document.querySelector('#podium-4-podlet');
      const { mountOrigin, publicPathname } = el.dataset;
      const res = await fetch(new URL(publicPathname + '/api', mountOrigin));
      el.innerHTML = await res.text();
    });
  `);
});

app.get(podlet.content(), (req, res) => {
  const { mountOrigin, publicPathname } = res.locals.podium.context;
  res.podiumSend(`
    <div
      id="podium-4-podlet"
      data-mount-origin="${mountOrigin}"
      data-public-pathname="${publicPathname}"
    >Podlet scripts and proxy non operational<div>
  `);
});

app.get(podlet.proxy({ target: "/api", name: "api" }), (req, res) => {
  res.send("Podlet scripts and proxy operational");
});

app.listen(4001);
console.log("Podium (v4) podlet started on port 4001.");
