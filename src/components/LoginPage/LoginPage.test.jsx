import LoginPage from "./LoginPage";
import LoginForm from './LoginForm';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { auth } from "../../__mocks__/firebase"; // Imports the mock functions (see __mock__/firebase.js)
import userEvent from "@testing-library/user-event";

const mockUser = {
    uid: "test-uid",
  };
  
  jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
  }));
  
  jest.mock("firebase/storage", () => ({
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
  }));
  
  jest.mock("../../firebase", () => ({
    auth: {
      currentUser: { uid: "test-uid" },
    },
    db: {},
    storage: {},
  }));
  
  // Mock the useNavigate function
  const mockedUsedNavigate = jest.fn();
  
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUsedNavigate,
  }));
  
  afterEach(() => {
    jest.clearAllMocks();
  });

test("renders the LoginPage component", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginPage />
    </MemoryRouter>
  );
  const loginPageElement = screen.getByRole("main");
  expect(loginPageElement).toBeInTheDocument();
});

test("renders the welcome message", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginPage />
    </MemoryRouter>
  );
  const welcomeText = screen.getByText(/Welcome to/i);
  expect(welcomeText).toBeInTheDocument();
});

test("renders the brand name", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginPage />
    </MemoryRouter>
  );
  const brandName = screen.getByText("HandyVandy");
  expect(brandName).toBeInTheDocument();
});

test("renders the hero image", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginPage />
    </MemoryRouter>
  );
  const heroImage = screen.getByAltText("HandyVandy illustration");
  expect(heroImage).toBeInTheDocument();
});

test("renders the divider", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginPage />
    </MemoryRouter>
  );
  const dividerText = screen.getByText("OR");
  expect(dividerText).toBeInTheDocument();
});

test("renders the welcome header", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginPage />
    </MemoryRouter>
  );
  const welcomeHeader = screen.getByRole("heading", { name: /Welcome to/i });
  expect(welcomeHeader).toBeInTheDocument();
});

test('Render Email and password successfully', async () => {
    render(
        <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <LoginForm />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
});