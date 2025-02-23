import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import ViewTask from "../pages/ViewTask";  // Adjust import path if necessary

describe("ViewTask Component", () => {
  it("should render 'View Task' on the page", () => {
    const mockParams = { id: "123" };  // Mock params if needed
    
    // Wrap the ViewTask component in a MemoryRouter
    const { getByText } = render(
      <MemoryRouter initialEntries={["/viewtask/123"]}> {/* Simulate the URL */}
        <ViewTask params={mockParams} />
      </MemoryRouter>
    );
    
    // Check if 'View Task' is in the document
    expect(getByText("View Task")).toBeInTheDocument();
  });
});
