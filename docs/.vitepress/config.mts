import { defineConfig } from "vitepress";
import { sidebar, socialLinks, outline, nav } from "./src/config/";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Docs Brasil",
  description: "A laravel pt_BR docs",
  cleanUrls: true,
  appearance: "force-dark",
  ignoreDeadLinks: [
    /\/localhost\//,
  ],
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
