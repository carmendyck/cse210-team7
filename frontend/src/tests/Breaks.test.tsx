import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest'; 
import Breaks from '../pages/Breaks';
import { IonCheckbox } from '@ionic/react';

describe('Breaks Component', () => {
  it('should allow the user to select valid break types', () => {
    render(<Breaks />);

    const waterCheckbox = screen.getByLabelText('Water Break');
    expect(waterCheckbox).toBeChecked();

    fireEvent.click(waterCheckbox);
    expect(waterCheckbox).not.toBeChecked();
  });

  it('should allow the user to select valid break lengths', () => {
    render(<Breaks />);

    const breakRange = screen.getByTestId('break-slider');
    expect(breakRange).toHaveValue(15)

    fireEvent.change(breakRange, { target: { value: 20 } });
    expect(breakRange).toHaveValue(20);
  });
});

