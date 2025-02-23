import { IonApp } from '@ionic/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CreateTask from '../pages/CreateTask';
import { useUid } from "../context/AuthContext";

vi.mock("../context/AuthContext", () => ({
  useUid: vi.fn(() => "mock-user-id"),
}));

// describe('CreateTask component', () => {
//   beforeEach(() => {
//     render(<CreateTask />);
//   });

//   test('page should have a title of Create Task', async () => {
//     const titleElement = await screen.findByText('Create Task');
//     expect(titleElement).toBeInTheDocument();
//   });

//   test('updates input task name', async() => {
//     // Get input
//     const inputNameElement = screen.getByLabelText('Name') as HTMLInputElement;

//     // Type into input field
//     const newInput = 'writing tests for CreateTask page'
//     fireEvent.input(inputNameElement, { target: { value: newInput } });
//     expect(inputNameElement.value).toBe(newInput);
//   });
// });

describe("CreateTask Component", () => {
  test("renders the Create Task page", () => {
    render(
      <MemoryRouter>
        <CreateTask />
      </MemoryRouter>
    );

    expect(screen.getByText("Create Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add task name")).toBeInTheDocument();
  });

  test("displays an error when trying to create a task without a name", async () => {
    render(
      <MemoryRouter>
        <CreateTask />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Create"));

    expect(await screen.findByText("<Name> is required!")).toBeInTheDocument();
  });

  test("updates task name input", () => {
    render(
      <MemoryRouter>
        <CreateTask />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText("Add task name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "New Task" } });

    expect(nameInput.value).toBe("New Task");
  });

  // test("handles form submission", async () => {
  //   vi.spyOn(global, "fetch").mockImplementation(() =>
  // Promise.resolve({
  //   ok: true,
  //   json: () => Promise.resolve({ message: "Task successfully added" }),
  // })


  //   const nameInput = screen.getByPlaceholderText("Add task name");
  //   fireEvent.change(nameInput, { target: { value: "Test Task" } });

  //   fireEvent.click(screen.getByText("Create"));

  //   expect(global.fetch).toHaveBeenCalledWith(
  //     "http://localhost:5050/api/createTasks/addnewtask",
  //     expect.objectContaining({
  //       method: "POST",
  //     })
  //   );
  // });
});