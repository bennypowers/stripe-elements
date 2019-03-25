import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';
import { color, number, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import compose from 'crocks/helpers/compose';
import propOr from 'crocks/helpers/propOr';

import { StripeElements } from '../src/StripeElements.js';
import '../src/stripe-elements.js';

import readme from '../README.md';

const getDetail = propOr(null, 'detail');
const getValue = propOr(null, 'value');
const getError = propOr(null, 'error');

storiesOf('stripe-elements', module)
  .addDecorator(withKnobs)
  .add(
    'iFrame Styles and Events',
    () => html`
      <style>
      aside {
        font-size: 18px;
        font-style: italic;
      }
      html {
        --stripe-elements-width: ${number('Width', 500, { range: true, min: 50, max: 1000 }, 'Element Styles')}px;
        --stripe-elements-height: ${number('Height', 40, { range: true, min: 10, max: 200 }, 'Element Styles')}px;
        --stripe-elements-element-padding: ${number('Padding', 4, { range: true, min: 0, max: 100 }, 'Element Styles')}px;
        --stripe-elements-element-background: ${color('Background', '#ffffff', 'Element Styles')};
        --stripe-elements-base-color: ${color('Color', '#000000', 'iFrame Styles')};
        --stripe-elements-base-font-family: ${text('Font Family', 'Fira Code', 'iFrame Styles')};
        --stripe-elements-base-font-size: ${number('Font Size', 14, { range: true, min: 8, max: 144 }, 'iFrame Styles')}px;
        --stripe-elements-base-icon-color: ${color('Icon Color', '#000000', 'iFrame Styles')};
        --stripe-elements-base-letter-spacing: ${number('Letter Spacing', 0, { range: true, min: -2, max: 20 }, 'iFrame Styles')}px;
        --stripe-elements-base-text-decoration: ${select('Text Decoration', ['none', 'underline', 'underline wavy green', 'strike-through'], 'none', 'iFrame Styles')};
        --stripe-elements-base-text-shadow: ${text('Text Shadow', '0 0 2px lightgrey', 'iFrame Styles')};
        --stripe-elements-base-text-transform: ${text('Text Transform', 'uppercase', 'iFrame Styles')};
      }
      </style>
      <stripe-elements
          publishable-key="${text('Publishable Key', 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX')}"
          @stripe-ready="${action('stripe-ready')}"
          @stripe-change="${compose(action('stripe-change'), getDetail)}"
          @stripe-token="${compose(action('stripe-token'), getDetail)}"
          @stripe-error="${compose(action('stripe-error'), getError)}"
          @brand-changed="${compose(action('brand-changed'), getValue, getDetail)}"
          @card-changed="${compose(action('card-changed'), getValue, getDetail)}"
          @publishable-key-changed="${compose(action('publishable-key-changed'), getValue, getDetail)}"
          @is-empty-changed="${compose(action('is-empty-changed'), getValue, getDetail)}"
          @is-complete-changed="${compose(action('is-complete-changed'), getValue, getDetail)}"
          @has-error-changed="${compose(action('has-error-changed'), getValue, getDetail)}"
      ></stripe-elements>
      <aside>Apply Your iFrame Styles by Resetting the Publishable Key in the Knobs Panel.</aside>
    `, { notes: { markdown: readme } })
  .add('Documentation', () =>
    withClassPropertiesKnobs(StripeElements), { notes: { markdown: readme } });
