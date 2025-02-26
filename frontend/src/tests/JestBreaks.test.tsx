import { render, screen, fireEvent } from '@testing-library/react';
import Breaks from './Breaks';
import '@testing-library/jest-dom';

describe('Breaks Component', () => {
  test('renders the Breaks page title', () => {
    render(<Breaks />);
    expect(screen.getByTestId('breaks-title')).toHaveTextContent('Break Preferences');
  });

  test('renders the back button', () => {
    render(<Breaks />);
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });

  test('renders work duration range and updates value', () => {
    render(<Breaks />);
    const workDurationRange = screen.getByTestId('work-duration-range');
    expect(workDurationRange).toBeInTheDocument();
    fireEvent.ionChange(workDurationRange, { detail: { value: 45 } });
    expect(workDurationRange).toHaveAttribute('value', '45');
  });

  test('renders break duration range and updates value', () => {
    render(<Breaks />);
    const breakDurationRange = screen.getByTestId('break-duration-range');
    expect(breakDurationRange).toBeInTheDocument();
    fireEvent.ionChange(breakDurationRange, { detail: { value: 10 } });
    expect(breakDurationRange).toHaveAttribute('value', '10');
  });

  test('renders break type checkboxes and toggles them', () => {
    render(<Breaks />);
    const checkbox = screen.getByTestId('checkbox-Water Break');
    expect(checkbox).toBeChecked();
    fireEvent.ionChange(checkbox, { detail: { checked: false } });
    expect(checkbox).not.toBeChecked();
  });
});