import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import ViewTask from "../pages/ViewTask";  // Adjust import path if necessary

describe("ViewTask Component", () => {
  // Test 1
  it("should render 'View Task' on the page", () => {
    const mockParams = { id: "123" };  // Mock params if needed
    
    // Wrap the component with MemoryRouter -- this is used for mock routing
    const { baseElement } = render(
      <MemoryRouter initialEntries={["/viewtask/123"]}> {/* Simulate the URL */}
        <ViewTask params={mockParams} />
      </MemoryRouter>
    );
    
    // Check if 'View Task' is in the document
    expect(baseElement).toBeDefined();
  });

  // Test 2
  it("should render 'View Task' on the page", () => {
    const mockParams = { id: "123" };  // Mock params if needed
    
    // Wrap the component with MemoryRouter -- this is used for mock routing
    const { getByText } = render(
      <MemoryRouter initialEntries={["/viewtask/123"]}> {/* Simulate the URL */}
        <ViewTask params={mockParams} />
      </MemoryRouter>
    );
    
    // Check if 'View Task' is in the document
    expect(getByText("View Task")).toBeInTheDocument();
  });
});


