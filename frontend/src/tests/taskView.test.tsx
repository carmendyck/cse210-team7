import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import ViewTask from "../pages/ViewTask";  // Adjust import path if necessary
import { IonButton, IonContent, IonPage, IonTitle, IonToolbar, IonText, IonItemDivider } from "@ionic/react";

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

  it("should have a button that says 'Start Task'", () => {
    const mockParams = { id: "123" };
    const { getByText } = render(
      <MemoryRouter initialEntries={["/viewtask/123"]}>
        <ViewTask params={mockParams} />
      </MemoryRouter>
    );
    expect(getByText("Start Task")).toBeInTheDocument();
  });

  it("should render Stop Task and toggle button text between 'Pause Task' and 'Resume Task' when clicked", async () => {
    const mockParams = { id: "123" };
    const { findByText } = render(
      <MemoryRouter initialEntries={["/viewtask/123"]}>
        <ViewTask params={mockParams} />
      </MemoryRouter>
    );
  
    // Wait for the button to appear
    const startButton = await screen.findByText("Start Task");
    fireEvent.click(startButton);

    // Wait for "Stop Task" button to appear
    await waitFor(() => {
      expect(screen.getByText("Stop Task")).toBeInTheDocument();
    });
  
    // Wait for the "Pause Task" button to appear
    await waitFor(() => {
      expect(screen.getByText("Pause Task")).toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByText("Pause Task"));
  
    // Wait for the "Resume Task" button to appear
    await waitFor(() => {
      expect(screen.getByText("Resume Task")).toBeInTheDocument();
    });
  });

});


