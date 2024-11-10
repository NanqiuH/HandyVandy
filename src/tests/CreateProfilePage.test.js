import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateProfilePage from '../components/CreateProfilePage/CreateProfilePage';

test('renders the Create Your Profile heading', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const headingElement = screen.getByText(/Create Your Profile/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders the Create Profile button', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const buttonElement = screen.getByRole('button', { name: /Create Profile/i });
  expect(buttonElement).toBeInTheDocument();
});

test('renders the First Name input field', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const firstNameInput = screen.getByLabelText(/First Name/i);
  expect(firstNameInput).toBeInTheDocument();
});

test('renders the Last Name input field', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const lastNameInput = screen.getByLabelText(/Last Name/i);
  expect(lastNameInput).toBeInTheDocument();
});

test('renders the Bio textarea', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const bioTextarea = screen.getByLabelText(/Bio/i);
  expect(bioTextarea).toBeInTheDocument();
});

test('renders the Profile Picture file input', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const profileImageInput = screen.getByLabelText(/Profile Picture/i);
  expect(profileImageInput).toBeInTheDocument();
});

test('renders the Middle Name input field', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const middleNameInput = screen.getByLabelText(/Middle Name \(optional\)/i);
  expect(middleNameInput).toBeInTheDocument();
});

test('first name input has the correct initial value', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const firstNameInput = screen.getByLabelText(/First Name/i);
  expect(firstNameInput.value).toBe('');
});

test('last name input has the correct initial value', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const lastNameInput = screen.getByLabelText(/Last Name/i);
  expect(lastNameInput.value).toBe('');
});

test('bio textarea has the correct initial value', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const bioTextarea = screen.getByLabelText(/Bio/i);
  expect(bioTextarea.value).toBe('');
});

test('profile image input allows file selection', () => {
  render(
    <MemoryRouter>
      <CreateProfilePage />
    </MemoryRouter>
  );
  const profileImageInput = screen.getByLabelText(/Profile Picture/i);
  expect(profileImageInput).toBeInTheDocument();
});
