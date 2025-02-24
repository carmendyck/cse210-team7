import { IonApp } from '@ionic/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import CreateTask from '../pages/CreateTask';

describe('CreateTask component', () => {
  beforeEach(() => {
    render(<CreateTask />);
  });

  test('page should have a title of Create Task', async () => {
    const titleElement = await screen.findByText('Create Task');
    expect(titleElement).toBeInTheDocument();
  });

  test('updates input task name', async() => {
    // Get input
    const inputNameElement = screen.getByLabelText('Name') as HTMLInputElement;

    // Type into input field
    const newInput = 'writing tests for CreateTask page'
    fireEvent.input(inputNameElement, { target: { value: newInput } });
    expect(inputNameElement.value).toBe(newInput);
  });
});