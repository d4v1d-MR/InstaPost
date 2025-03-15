/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { InstaPostApp } from '../src/InstaPostApp';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<InstaPostApp />);
  });
});
