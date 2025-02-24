import { IonApp } from '@ionic/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import TaskList from '../pages/TaskList';

describe('CreateTask component', () => {
  beforeEach(() => {
    render(<TaskList />);
  });

  test('page should have a title of Task List', async () => {
    const titleElement = await screen.findByText('Task List');
    expect(titleElement).toBeInTheDocument();
  });

});