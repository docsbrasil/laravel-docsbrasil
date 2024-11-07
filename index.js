import fs from "fs";

let items = [
  {
    text: "Breeze",
    link: "/pacotes/breeze",
  },
  {
    text: "Cashier (Stripe)",
    link: "/pacotes/cashier-stripe",
  },
  {
    text: "Cashier (Paddle)",
    link: "/pacotes/cashier-paddle",
  },
  {
    text: "Dusk",
    link: "/pacotes/dusk",
  },
  {
    text: "Envoy",
    link: "/pacotes/envoy",
  },
  {
    text: "Fortify",
    link: "/pacotes/fortify",
  },
  {
    text: "Folio",
    link: "/pacotes/folio",
  },
  {
    text: "Homestead",
    link: "/pacotes/homestead",
  },
  {
    text: "Horizon",
    link: "/pacotes/horizon",
  },
  {
    text: "Jetstream",
    link: "/pacotes/jetstream",
  },
  {
    text: "Mix",
    link: "/pacotes/mix",
  },
  {
    text: "Octane",
    link: "/pacotes/octane",
  },
  {
    text: "Passport",
    link: "/pacotes/passport",
  },
  {
    text: "Pennant",
    link: "/pacotes/pennant",
  },
  {
    text: "Pint",
    link: "/pacotes/pint",
  },
  {
    text: "Precognition",
    link: "/pacotes/precognition",
  },
  {
    text: "Prompts",
    link: "/pacotes/prompts",
  },
  {
    text: "Pulse",
    link: "/pacotes/pulse",
  },
  {
    text: "Reverb",
    link: "/pacotes/reverb",
  },
  {
    text: "Sail",
    link: "/pacotes/sail",
  },
  {
    text: "Sanctum",
    link: "/pacotes/sanctum",
  },
  {
    text: "Scout",
    link: "/pacotes/scout",
  },
  {
    text: "Socialite",
    link: "/pacotes/socialite",
  },
  {
    text: "Telescope",
    link: "/pacotes/telescope",
  },
  {
    text: "Valet",
    link: "/pacotes/valet",
  },
];

items.forEach((item) => {
  let fileName = item.link.split("/").pop();
  let content = `# ${item.text} \n\nEsse projeto é um trabalho em andamento, e a documentação está sendo construída aos poucos. Se você deseja contribuir, fique à vontade para abrir uma issue ou um pull request.`;
  fs.writeFileSync(`./docs/pacotes/${fileName}.md`, content);
});
