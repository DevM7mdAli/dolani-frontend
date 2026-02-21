import { GlobalConfig } from 'payload';

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nav',
      type: 'group',
      fields: [
        { name: 'logoText', type: 'text', localized: true, required: true },
        { name: 'logoSubtext', type: 'text', localized: true, required: true },
        { name: 'features', type: 'text', localized: true, required: true },
        { name: 'howItWorks', type: 'text', localized: true, required: true },
        { name: 'technology', type: 'text', localized: true, required: true },
        { name: 'team', type: 'text', localized: true, required: true },
        { name: 'faq', type: 'text', localized: true, required: true },
        { name: 'viewDemo', type: 'text', localized: true, required: true },
        { name: 'login', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', localized: true, required: true },
        { name: 'headlineHighlight', type: 'text', localized: true, required: true },
        { name: 'subheadline', type: 'textarea', localized: true, required: true },
        { name: 'downloadApp', type: 'text', localized: true, required: true },
        { name: 'watchDemo', type: 'text', localized: true, required: true },
        { name: 'activeUsers', type: 'text', localized: true, required: true },
        { name: 'activeUsersText', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'features',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true, required: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true, required: true },
        {
          name: 'items',
          type: 'array',
          localized: true,
          required: true,
          fields: [
            { name: 'icon', type: 'text', required: true },
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
            { name: 'linkText', type: 'text', localized: true, required: true },
          ],
        },
      ],
    },
    {
      name: 'howItWorks',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true, required: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true, required: true },
        {
          name: 'steps',
          type: 'array',
          localized: true,
          required: true,
          fields: [
            { name: 'number', type: 'text', required: true },
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
          ],
        },
        { name: 'whyChooseBadge', type: 'text', localized: true, required: true },
        { name: 'whyChooseTitle', type: 'text', localized: true, required: true },
        { name: 'whyChooseSubtitle', type: 'textarea', localized: true, required: true },
        {
          name: 'whyChooseItems',
          type: 'array',
          localized: true,
          required: true,
          fields: [
            { name: 'icon', type: 'text', required: true },
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
          ],
        },
      ],
    },
    {
      name: 'techStack',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true, required: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true, required: true },
        {
          name: 'items',
          type: 'array',
          localized: true,
          required: true,
          fields: [
            { name: 'icon', type: 'text', required: true },
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
            { name: 'color', type: 'text', required: true },
          ],
        },
        {
          name: 'bottomItems',
          type: 'array',
          localized: true,
          required: true,
          fields: [
            { name: 'icon', type: 'text', required: true },
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
          ],
        },
      ],
    },
    {
      name: 'team',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true, required: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true, required: true },
        {
          name: 'members',
          type: 'array',
          localized: true,
          required: true,
          fields: [
            { name: 'icon', type: 'text', required: true },
            { name: 'name', type: 'text', localized: true, required: true },
            { name: 'role', type: 'text', localized: true, required: true },
            { name: 'description', type: 'textarea', localized: true, required: true },
          ],
        },
      ],
    },
    {
      name: 'faq',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true, required: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true, required: true },
        {
          name: 'questions',
          type: 'array',
          localized: true,
          required: true,
          fields: [
            { name: 'question', type: 'text', localized: true, required: true },
            { name: 'answer', type: 'textarea', localized: true, required: true },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        { name: 'logoText', type: 'text', localized: true, required: true },
        { name: 'logoSubtext', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        { name: 'quickLinksTitle', type: 'text', localized: true, required: true },
        {
          name: 'quickLinks',
          type: 'array',
          localized: true,
          required: true,
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
        { name: 'resourcesTitle', type: 'text', localized: true, required: true },
        {
          name: 'resources',
          type: 'array',
          localized: true,
          required: true,
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
        { name: 'copyright', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtitle', type: 'textarea', localized: true, required: true },
        { name: 'downloadIos', type: 'text', localized: true, required: true },
        { name: 'downloadAndroid', type: 'text', localized: true, required: true },
        { name: 'feature1', type: 'text', localized: true, required: true },
        { name: 'feature2', type: 'text', localized: true, required: true },
        { name: 'feature3', type: 'text', localized: true, required: true },
      ],
    },
  ],
};
