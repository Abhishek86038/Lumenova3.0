import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import DonateForm from '../components/DonateForm';

describe('DonateForm Component', () => {
  test('renders connect prompt when wallet is not connected', () => {
    const onConnectClick = vi.fn();
    render(
      <DonateForm pubKey={null} onDonationSuccess={() => {}} onConnectClick={onConnectClick} />
    );

    expect(screen.getByText('Connect Wallet to Donate')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  test('renders amount input and donation form when wallet is connected', () => {
    render(
      <DonateForm pubKey="GDLU7V..." onDonationSuccess={() => {}} onConnectClick={() => {}} />
    );

    expect(screen.getByPlaceholderText('Amount (XLM)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /donate now/i })).toBeInTheDocument();
  });
});
