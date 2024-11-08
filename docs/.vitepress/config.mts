import { defineConfig } from "vitepress";
import { sidebar, socialLinks, outline, nav } from "./src/config/";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Docs Brasil - Laravel",
  description: "A documentação do Laravel traduzida para o português do Brasil",
  cleanUrls: true,
  appearance: "force-dark",
  ignoreDeadLinks: true,
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  markdown: {
    container: {
      tipLabel: 'Dica',
      warningLabel: 'Aviso',
      dangerLabel: 'Atenção',
      infoLabel: 'Informação',
      detailsLabel: 'Detalhes',
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar: sidebar,
    socialLinks,
    outline,
    docFooter: {
      prev: "Página anterior: ",
      next: "Próxima página: ",
    },
  },
});
