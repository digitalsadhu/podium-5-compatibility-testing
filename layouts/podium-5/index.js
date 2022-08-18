import express from "express";
import Layout from "@podium/layout";

const layout = new Layout({
  name: "podium-5-layout",
  pathname: "/",
});

layout.js({ value: "/client/js" });

const podium4PodletClient = layout.client.register({
  name: "podium-4-podlet",
  uri: "http://localhost:4001/manifest.json",
});

const podium5PodletClient = layout.client.register({
  name: "podium-5-podlet",
  uri: "http://localhost:5001/manifest.json",
});

const app = express();

app.use(layout.middleware());

app.get("/client/js", (req, res) => {
  res.set("content-type", "application/javascript");
  res.send(`
    window.addEventListener('load', async () => {
      document.querySelector('#scripts-status').innerHTML = 'Layout scripts operational';
    });
  `);
});

app.get("/", async (req, res) => {
  const incoming = res.locals.podium;
  const podlets = await Promise.all([
    podium4PodletClient.fetch(incoming),
    podium5PodletClient.fetch(incoming),
  ]);
  incoming.podlets = podlets;
  const [v4, v5] = podlets;
  res.podiumSend(`
    <h1>Podium 5 backwards compatibility test</h1>
    <section>
      <h2>Layout (v5)</h2>
      <div id="scripts-status">
        Layout scripts non operational
      </div>
    </section>
    <section>
      <h2>Podlet (v4)</h2>
      ${v4}
    </section>
    <section>
      <h2>Podlet (v5)</h2>
      ${v5}
    </section>
  `);
});

app.listen(5002);
console.log("Podium (v5) layout started on port 5002");
