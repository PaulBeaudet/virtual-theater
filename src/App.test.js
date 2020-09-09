import React from 'react';
import ReactDOM from 'react-dom'
// import { render } from '@testing-library/react';
import renderer from 'react-test-renderer'
import App from './App';

test('smoke test', () => {
  const component = renderer.create(<App />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
