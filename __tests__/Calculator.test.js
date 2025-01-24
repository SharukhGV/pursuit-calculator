// import React from 'react';
// import { render, fireEvent, screen } from '@testing-library/react';
// import axios from 'axios';
// import Calculator from '../src/components/Calculator';

// // Mock axios
// jest.mock('axios');

// // Mock localStorage
// const localStorageMock = {
//   getItem: jest.fn(),
//   setItem: jest.fn(),
//   clear: jest.fn()
// };
// global.localStorage = localStorageMock;

// describe('Calculator', () => {
//   beforeEach(() => {
//     axios.get.mockResolvedValue({ data: [] });
//     axios.post.mockResolvedValue({});
//     localStorage.getItem.mockReturnValue('mock-token');
//   });

//   test('adds two numbers correctly', () => {
//     render(<Calculator emailz="test@example.com" />);
    
//     fireEvent.click(screen.getByText('5'));
//     fireEvent.click(screen.getByText('+'));
//     fireEvent.click(screen.getByText('3'));
//     fireEvent.click(screen.getByText('Enter'));

//     expect(screen.getByText('= 8')).toBeInTheDocument();
//   });

//   test('subtracts two numbers correctly', () => {
//     render(<Calculator emailz="test@example.com" />);
    
//     fireEvent.click(screen.getByText('9'));
//     fireEvent.click(screen.getByText('-'));
//     fireEvent.click(screen.getByText('4'));
//     fireEvent.click(screen.getByText('Enter'));

//     expect(screen.getByText('= 5')).toBeInTheDocument();
//   });

//   test('multiplies two numbers correctly', () => {
//     render(<Calculator emailz="test@example.com" />);
    
//     fireEvent.click(screen.getByText('6'));
//     fireEvent.click(screen.getByText('×'));
//     fireEvent.click(screen.getByText('7'));
//     fireEvent.click(screen.getByText('Enter'));

//     expect(screen.getByText('= 42')).toBeInTheDocument();
//   });

//   test('divides two numbers correctly', () => {
//     render(<Calculator emailz="test@example.com" />);
    
//     fireEvent.click(screen.getByText('8'));
//     fireEvent.click(screen.getByText('÷'));
//     fireEvent.click(screen.getByText('2'));
//     fireEvent.click(screen.getByText('Enter'));

//     expect(screen.getByText('= 4')).toBeInTheDocument();
//   });

//   test('handles division by zero', () => {
//     render(<Calculator emailz="test@example.com" />);
    
//     fireEvent.click(screen.getByText('5'));
//     fireEvent.click(screen.getByText('÷'));
//     fireEvent.click(screen.getByText('0'));
//     fireEvent.click(screen.getByText('Enter'));

//     expect(screen.getByText('= Error: Division by zero')).toBeInTheDocument();
//   });
// });
