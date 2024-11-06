import { defineConfig } from 'vitepress'
import { sidebar, socialLinks, outline } from './src/config/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Laravel Brasil",
  description: "A laravel pt_BR docs",
  cleanUrls: true,
  appearance: 'force-dark',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Apoie o Projeto", link: "/" }],
    
    sidebar,
    socialLinks,
    outline,
  },
})
