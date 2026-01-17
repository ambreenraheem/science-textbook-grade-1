// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Science Textbook Grade-1',
  tagline: 'Learn science in a fun way!',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://science-grade1.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config (if using GitHub Pages)
  organizationName: 'science-education',
  projectName: 'science-textbook-grade-1',

  onBrokenLinks: 'throw',

  // Markdown configuration
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // i18n configuration for bilingual support (English and Urdu)
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
        htmlLang: 'ur-PK',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Serve docs at the root
          editUrl: undefined, // Disable edit links
        },
        blog: false, // Disable blog
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Navbar configuration
      navbar: {
        title: 'Science Grade 1',
        logo: {
          alt: 'Science Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Learn',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      // Footer configuration
      footer: {
        style: 'dark',
        copyright: `© ${new Date().getFullYear()} Science Textbook Grade-1. Built for young learners.`,
      },
      // Color mode configuration (light/dark theme)
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      // Metadata
      metadata: [
        {name: 'keywords', content: 'science, education, grade-1, children, learning'},
        {name: 'description', content: 'Interactive science learning for Grade-1 students'},
      ],
    }),
};

// Add webpack aliases for component imports
const path = require('path');

config.plugins = [
  function customWebpackPlugin() {
    return {
      name: 'custom-webpack-plugin',
      configureWebpack() {
        return {
          resolve: {
            alias: {
              '@components': path.resolve(__dirname, 'src/components'),
              '@lib': path.resolve(__dirname, 'src/lib'),
              '@api': path.resolve(__dirname, 'src/api'),
            },
          },
          devServer: {
            proxy: [
              {
                context: ['/api'],
                target: 'http://localhost:3001',
                changeOrigin: true,
              },
            ],
          },
        };
      },
    };
  },
];

module.exports = config;
