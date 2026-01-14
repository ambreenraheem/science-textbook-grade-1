/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Main sidebar for Grade-1 Science topics
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: '01. Living and Non-living Things',
      link: {
        type: 'doc',
        id: 'topics/01-living-nonliving/index',
      },
      items: [
        'topics/01-living-nonliving/what-is-alive',
        'topics/01-living-nonliving/nonliving-things',
        'topics/01-living-nonliving/sorting-activity',
      ],
    },
    {
      type: 'category',
      label: '02. Human Body and Senses',
      link: {
        type: 'doc',
        id: 'topics/02-human-body-senses/index',
      },
      items: [
        'topics/02-human-body-senses/five-senses',
        'topics/02-human-body-senses/body-parts',
        'topics/02-human-body-senses/using-senses',
      ],
    },
    {
      type: 'category',
      label: '03. Animals',
      link: {
        type: 'doc',
        id: 'topics/03-animals/index',
      },
      items: [
        'topics/03-animals/animals-around-us',
        'topics/03-animals/animal-homes',
        'topics/03-animals/what-animals-eat',
        'topics/03-animals/animal-sounds',
      ],
    },
    {
      type: 'category',
      label: '04. Plants',
      link: {
        type: 'doc',
        id: 'topics/04-plants/index',
      },
      items: [
        'topics/04-plants/plant-parts',
        'topics/04-plants/plants-need',
        'topics/04-plants/types-of-plants',
        'topics/04-plants/plants-help-us',
      ],
    },
    {
      type: 'category',
      label: '05. Earth and Universe',
      link: {
        type: 'doc',
        id: 'topics/05-earth-universe/index',
      },
      items: [
        'topics/05-earth-universe/day-and-night',
        'topics/05-earth-universe/sun-moon-stars',
        'topics/05-earth-universe/weather-seasons',
        'topics/05-earth-universe/our-planet-earth',
      ],
    },
  ],
};

module.exports = sidebars;
