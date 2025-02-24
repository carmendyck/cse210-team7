import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CreateTask from '../pages/CreateTask';

// Mock dependencies at the top
vi.mock('../context/AuthContext', () => ({
  useUid: vi.fn(() => 'mock-user-id'),
}));

// Mock the fetch API to simulate a successful response
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, taskId: 1 }),
  })
);

describe('CreateTask Component', () => {
  
  // Setup common render for CreateTask component
  const setup = () => {
    render(
      <MemoryRouter>
        <CreateTask />
      </MemoryRouter>
    );
  };

  test('renders the Create Task page', () => {
    setup();

    // Assert elements exist on the page
    expect(screen.getByText("Create Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add task name")).toBeInTheDocument();
  });

  test('updates task name input', () => {
    setup();

    const nameInput = screen.getByPlaceholderText("Add task name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "New Task" } });

    expect(nameInput.value).toBe("New Task");
  });

  test('displays an error when trying to create a task without a name', async () => {
    setup();

    fireEvent.click(screen.getByText('Create'));

    expect(await screen.findByText("<Name> is required!")).toBeInTheDocument();
  });

  // Failing this test currently
  test('submits the form successfully when a valid task name is provided', async () => {
    setup();

    const nameInput = screen.getByPlaceholderText("Add task name") as HTMLInputElement;
    const createButton = screen.getByText('Create');

    // Simulate user typing a valid task name
    fireEvent.change(nameInput, { target: { value: 'Complete project report' } });

    // Simulate form submission
    fireEvent.click(createButton);

    // Wait for the fetch call to complete and ensure it was called
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Ensure the fetch call was made with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5050/api/createTasks/addnewtask',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String), // Body should be a JSON string
      })
    );
  });

});
