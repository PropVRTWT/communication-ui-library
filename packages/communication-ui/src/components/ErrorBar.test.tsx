// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { CommunicationUiErrorSeverity } from '../types/CommunicationUiError';
import { ErrorBarComponent } from './ErrorBar';

let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (container !== null) {
    unmountComponentAtNode(container);
    container.remove();
  }
});

const testMessage = 'test message';

describe('ErrorBar tests', () => {
  test('ErrorBar should display nothing when no there are no messages', () => {
    act(() => {
      render(<ErrorBarComponent />, container);
    });

    expect(container.children.length).toBe(0);
  });

  test('ErrorBar should display message when message is specified', () => {
    act(() => {
      render(<ErrorBarComponent message={testMessage} severity={CommunicationUiErrorSeverity.ERROR} />, container);
    });

    expect(container.children.length).toBeGreaterThan(0);
  });
});
