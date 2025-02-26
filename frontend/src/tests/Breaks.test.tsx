// import { render, screen, fireEvent } from '@testing-library/react';
// import { describe, it, expect } from 'vitest';
// import Breaks from '../pages/Breaks';
// import { IonRange, IonCheckbox } from '@ionic/react';

// // Mocking Ionic components that use web components
// vi.mock('@ionic/react', async (importOriginal) => {
//   const mod = await importOriginal();
//   return {
//     ...mod,
//     IonRange: (props) => <input type="range" {...props} />, // Mocking IonRange
//     IonCheckbox: (props) => <input type="checkbox" {...props} />, // Mocking IonCheckbox
//   };
// });

// describe('Breaks Component', () => {
//   it('renders the header and title', () => {
//     render(<Breaks />);
//     expect(screen.getByText('Breaks')).toBeInTheDocument();
//     expect(screen.getByText('How long do you like your breaks?')).toBeInTheDocument();
//   });

//   it('renders default break duration value', () => {
//     render(<Breaks />);
//     const rangeInput = screen.getByRole('slider');
//     expect(rangeInput).toHaveValue("15");
//   });

// // Modify once we finalize the slider/sync the onboarding preferences UI

// //   it('updates break duration on slider change', () => {
// //     render(<Breaks />);
// //     const rangeInput = screen.getByRole('slider');
// //     fireEvent.change(rangeInput, { target: { value: '30' } });
// //     expect(rangeInput).toHaveValue("30");
// //   });

//   it('renders all break checkboxes as checked by default', () => {
//     render(<Breaks />);
//     const checkboxes = screen.getAllByRole('checkbox');
//     checkboxes.forEach((checkbox) => {
//       expect(checkbox).toBeChecked();
//     });
//   });

//   // Modify once we finalize the slider/sync the onboarding preferences UI

// //   it('allows toggling checkboxes', () => {
// //     render(<Breaks />);
// //     const checkboxes = screen.getAllByRole('checkbox');
// //     fireEvent.click(checkboxes[0]);
// //     expect(checkboxes[0]).not.toBeChecked();
// //   });
// });

// import { render, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { describe, it, expect } from 'vitest';
// import Breaks from '../pages/Breaks'; // Adjust path as needed
// import { IonReactRouter } from '@ionic/react-router';
// import { MemoryRouter } from 'react-router-dom';



// // Mocking Ionic components that use web components
// // vi.mock('@ionic/react', async (importOriginal) => {
// //   const mod = await importOriginal();
// //   return {
// //     ...mod,
// //     IonRange: (props) => <input type="range" {...props} />, // Mocking IonRange
// //     IonCheckbox: (props) => <input type="checkbox" {...props} />, // Mocking IonCheckbox
// //   };
// // });

// describe("Breaks Page", () => {
//   it("renders the Break Preferences page", () => {
//     render(
//       <MemoryRouter>
//         <Breaks />
//       </MemoryRouter>
//     );

//     expect(screen.getByText("Break Preferences")).toBeInTheDocument();
//     expect(
//       screen.getByText("How long do you prefer to work before a break (in minutes)?")
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText("How long do you like your breaks (in minutes)?")
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText("What types of breaks do you want suggestions for?")
//     ).toBeInTheDocument();
//   });

//   it("updates value when changed", () => {
//     render(
//       <MemoryRouter>
//         <Breaks />
//       </MemoryRouter>
//     );

//     const rangeInput = screen.getByRole("slider");
//     fireEvent.ionChange(rangeInput, { detail: { value: 60 } });

//     expect(screen.getByText("60 min")).toBeInTheDocument();
//   });


//   it("updates the work duration slider", async () => {
//     render(
//       <MemoryRouter>
//         <Breaks />
//       </MemoryRouter>
//     );

//     const workSlider = screen.getByLabelText("30 min"); // Initial value
//     expect(workSlider).toBeInTheDocument();

//     fireEvent.ionChange(workSlider, { detail: { value: 60 } });
//     expect(screen.getByLabelText("60 min")).toBeInTheDocument();
//   });

//   it("updates the break duration slider", async () => {
//     render(
//       <MemoryRouter>
//         <Breaks />
//       </MemoryRouter>
//     );

//     const breakSlider = screen.getByLabelText("5 min"); // Initial value
//     expect(breakSlider).toBeInTheDocument();

//     fireEvent.ionChange(breakSlider, { detail: { value: 20 } });
//     expect(screen.getByLabelText("20 min")).toBeInTheDocument();
//   });

//   it("checks if checkboxes are initially checked", () => {
//     render(
//       <MemoryRouter>
//         <Breaks />
//       </MemoryRouter>
//     );

//     expect(screen.getByLabelText("Water Break")).toBeChecked();
//     expect(screen.getByLabelText("Snack Break")).toBeChecked();
//     expect(screen.getByLabelText("Active Break")).toBeChecked();
//     expect(screen.getByLabelText("Meditation Break")).toBeChecked();
//   });

//   it("allows checkboxes to be toggled", async () => {
//     render(
//       <MemoryRouter>
//         <Breaks />
//       </MemoryRouter>
//     );

//     // Find the Water Break checkbox container
//     const waterBreakItem = screen.getByText(/Water Break/i).closest("ion-item");

//     // Query the actual checkbox inside it
//     const waterCheckbox = waterBreakItem?.querySelector("input[type='checkbox']");

//     expect(waterCheckbox).toBeChecked(); // Ensure it's initially checked

//     await userEvent.click(waterCheckbox!);
//     expect(waterCheckbox).not.toBeChecked(); // Ensure it toggles correctly
//   });
// });

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Breaks from "../pages/Breaks"; // Adjust path as needed
import { IonReactRouter } from "@ionic/react-router";
import { MemoryRouter } from "react-router-dom";



describe("Breaks Page", () => {
  it("renders the Break Preferences page", () => {
    render(
      <MemoryRouter>
        <Breaks />
      </MemoryRouter>
    );

    expect(screen.getByText("Break Preferences")).toBeInTheDocument();
    expect(
      screen.getByText("How long do you prefer to work before a break (in minutes)?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("How long do you like your breaks (in minutes)?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("What types of breaks do you want suggestions for?")
    ).toBeInTheDocument();
  });

  it("updates the work duration slider", async () => {
    render(
      <MemoryRouter>
        <Breaks />
      </MemoryRouter>
    );

    const workSlider = screen.getByRole("slider");

    // Manually trigger the event to mimic Ionic's onIonChange
    fireEvent(workSlider, new CustomEvent("ionChange", { detail: { value: 60 } }));

    expect(screen.getByText("60 min")).toBeInTheDocument();
  });

  it("updates the break duration slider", async () => {
    render(
      <MemoryRouter>
        <Breaks />
      </MemoryRouter>
    );

    const breakSlider = screen.getByRole("slider");

    fireEvent(breakSlider, new CustomEvent("ionChange", { detail: { value: 20 } }));

    expect(screen.getByText("20 min")).toBeInTheDocument();
  });

  it("checks if checkboxes are initially checked", () => {
    render(
      <MemoryRouter>
        <Breaks />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Water Break")).toBeChecked();
    expect(screen.getByLabelText("Snack Break")).toBeChecked();
    expect(screen.getByLabelText("Active Break")).toBeChecked();
    expect(screen.getByLabelText("Meditation Break")).toBeChecked();
  });

  it("allows checkboxes to be toggled", async () => {
    render(
      <MemoryRouter>
        <Breaks />
      </MemoryRouter>
    );
  
    const checkboxes = screen.getAllByRole("checkbox"); // Get all checkboxes
  
    const firstCheckbox = checkboxes[0];
  
    expect(firstCheckbox).toBeChecked(); // Initially checked
    await userEvent.click(firstCheckbox); // Click to uncheck
    expect(firstCheckbox).not.toBeChecked(); // Ensure it's unchecked
  
    await userEvent.click(firstCheckbox); // Click again to check
    expect(firstCheckbox).toBeChecked();
  });
});

