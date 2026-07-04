import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import WalletModal from '../components/WalletModal';

describe('WalletModal Component', () => {
  test('does not render when isOpen is false', () => {
    const { container } = render(
      <WalletModal isOpen={false} onClose={() => {}} onConnect={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders options and calls handlers when open', () => {
    const onClose = vi.fn();
    const onConnect = vi.fn();

    render(
      <WalletModal isOpen={true} onClose={onClose} onConnect={onConnect} />
    );

    // Assert that the title and all wallets are displayed
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    expect(screen.getByText('Freighter')).toBeInTheDocument();
    expect(screen.getByText('xBull')).toBeInTheDocument();
    expect(screen.getByText('Albedo')).toBeInTheDocument();

    // Click on Freighter wallet option
    fireEvent.click(screen.getByText('Freighter'));
    expect(onConnect).toHaveBeenCalledWith('freighter');

    // Click on Close button (first button in container)
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalled();
  });
});
