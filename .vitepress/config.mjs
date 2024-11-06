import {defineConfig} from 'vitepress'

const title = "MingleJS"
const description = "Use JS components in Laravel Livewire Applications, with benefits."
const url = 'https://minglejs.unitedbycode.com'
const logoUrl = `${url}/logo.jpg`

const head = [
    ['meta', {name: 'twitter:title', content: title}],
    ['meta', {name: 'twitter:description', content: description}],
    ['meta', {name: 'twitter:image', content: logoUrl}],

    ['meta', {name: 'og:title', content: title}],
    ['meta', {name: 'og:description', content: description}],
    ['meta', {name: 'og:image', content: logoUrl}],
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title,
    description,
    head,
    srcDir: 'docs',
    cleanUrls: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: 'Guide', link: '/what-is-minglejs'},
            {text: 'Demo', link: 'https://minglejs-demo.unitedbycode.com/demo-with-all'},
            {text: 'Demo source code', link: 'https://github.com/ijpatricio/minglejs-demo'},

        ],
        sidebar: [
            {
                text: 'Introduction',
                items: [
                    {text: 'What is MingleJS?', link: '/what-is-minglejs'},
                    {text: 'Why MingleJS?', link: '/why-minglejs'},
                    {text: 'Getting Started', link: '/getting-started'},
                    {text: 'Creating Mingles', link: '/creating-mingles.md'},
                ],
            },
            {
                text: 'Digging Deeper',
                items: [
                    {text: 'Anatomy of a Mingle', link: '/anatomy-of-a-mingle'},
                    {text: 'Anatomy - Vue specifics', link: '/anatomy-vue-specifics'},
                    {text: 'Anatomy - React specifics', link: '/anatomy-react-specifics'},
                    {text: 'Manual Instructions', link: '/manual-instructions'},
                    {text: 'Events and Backend', link: '/events-and-backend'},
                    {text: 'Filament & React', link: '/filament-and-react'},
                    {text: 'Auto Import on Build', link: '/auto-import-on-build'},
                    {text: 'Configuration', link: '/configuration'},
                ],
            },


            // { text: 'API Examples', link: '/api-examples' },
            { text: 'Visit the demo', link: 'https://minglejs-demo.unitedbycode.com/demo-with-all' },
            { text: 'Demo source code', link: 'https://github.com/ijpatricio/minglejs-demo' },

        ],
        socialLinks: [
            {icon: 'github', link: 'https://github.com/ijpatricio/mingle'}
        ]
    }
})
