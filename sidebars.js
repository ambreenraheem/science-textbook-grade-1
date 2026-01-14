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
        id: 'topics/living-nonliving/index',
      },
      items: [
        'topics/living-nonliving/what-is-alive',
        'topics/living-nonliving/nonliving-things',
        'topics/living-nonliving/sorting-activity',
      ],
    },
    {
      type: 'category',
      label: '02. Human Body and Senses',
      link: {
        type: 'doc',
        id: 'topics/human-body-senses/index',
      },
      items: [
        'topics/human-body-senses/five-senses',
        'topics/human-body-senses/body-parts',
        'topics/human-body-senses/using-senses',
      ],
    },
    {
      type: 'category',
      label: '03. Animals',
      link: {
        type: 'doc',
        id: 'topics/animals/index',
      },
      items: [
        'topics/animals/animals-around-us',
        'topics/animals/animal-homes',
        'topics/animals/what-animals-eat',
        'topics/animals/animal-sounds',
      ],
    },
    {
      type: 'category',
      label: '04. Plants',
      link: {
        type: 'doc',
        id: 'topics/plants/index',
      },
      items: [
        'topics/plants/plant-parts',
        'topics/plants/plants-need',
        'topics/plants/types-of-plants',
        'topics/plants/plants-help-us',
      ],
    },
    {
      type: 'category',
      label: '05. Earth and Universe',
      link: {
        type: 'doc',
        id: 'topics/earth-universe/index',
      },
      items: [
        'topics/earth-universe/day-and-night',
        'topics/earth-universe/sun-moon-stars',
        'topics/earth-universe/weather-seasons',
        'topics/earth-universe/our-planet-earth',
      ],
    },
  ],
};

module.exports = sidebars;
