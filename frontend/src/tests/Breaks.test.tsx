import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Breaks from '../pages/Breaks';
import { IonRange, IonCheckbox } from '@ionic/react';

// Mocking Ionic components that use web components
vi.mock('@ionic/react', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    IonRange: (props) => <input type="range" {...props} />, // Mocking IonRange
    IonCheckbox: (props) => <input type="checkbox" {...props} />, // Mocking IonCheckbox
  };
});

describe('Breaks Component', () => {
  it('renders the header and title', () => {
    render(<Breaks />);
    expect(screen.getByText('Breaks')).toBeInTheDocument();
    expect(screen.getByText('How long do you like your breaks?')).toBeInTheDocument();
  });

  it('renders default break duration value', () => {
    render(<Breaks />);
    const rangeInput = screen.getByRole('slider');
    expect(rangeInput).toHaveValue("15");
  });

// Modify once we finalize the slider/sync the onboarding preferences UI

//   it('updates break duration on slider change', () => {
//     render(<Breaks />);
//     const rangeInput = screen.getByRole('slider');
//     fireEvent.change(rangeInput, { target: { value: '30' } });
//     expect(rangeInput).toHaveValue("30");
//   });

  it('renders all break checkboxes as checked by default', () => {
    render(<Breaks />);
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  // Modify once we finalize the slider/sync the onboarding preferences UI
  
//   it('allows toggling checkboxes', () => {
//     render(<Breaks />);
//     const checkboxes = screen.getAllByRole('checkbox');
//     fireEvent.click(checkboxes[0]);
//     expect(checkboxes[0]).not.toBeChecked();
//   });
});