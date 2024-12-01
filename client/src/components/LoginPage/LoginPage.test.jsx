import LoginPage from "./LoginPage";
import LoginForm from "./LoginForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

const mockUser = {
  uid: "test-uid",
};

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
  }));

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
    signInWithEmailAndPassword: jest.fn()
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

beforeEach (() => {
    jest.clearAllMocks();
});

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

test("Render Email and password successfully", async () => {
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

test("Render Remember me successfully", async () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginForm />
    </MemoryRouter>
  );

  const rememberMeInput = screen.getByLabelText(/Remember me/i);

  expect(rememberMeInput).toBeInTheDocument();
});

test("Render Forgot Password successfully", async () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginForm />
    </MemoryRouter>
  );

  const forgotPasswordInput = screen.getByText(/Forgot Password?/i);

  expect(forgotPasswordInput).toBeInTheDocument();
});

test("renders the Login button", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginForm />
    </MemoryRouter>
  );
  const buttonElement = screen.getByRole("button", { name: /Login/i });
  expect(buttonElement).toBeInTheDocument();
});

test("renders the Register button", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginForm />
    </MemoryRouter>
  );

  const registerInput = screen.getByText(/Register/i);

  expect(registerInput).toBeInTheDocument();
});

test("renders the remaining message", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <LoginForm />
    </MemoryRouter>
  );

  const input = screen.getByText(/Don't have an account?/i);

  expect(input).toBeInTheDocument();
});

test("successful login", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "test-uid" },
    });
  
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <LoginForm />
      </MemoryRouter>
    );
  
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });
  
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.click(loginButton);
  
    await waitFor(() => 
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@gmail.com",
        "123456"
      )
    );

    await waitFor(() => 
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/posting-list")
    );
  });

  test("unsuccessful login", async () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Invalid credentials"));
  
    render(
        <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <LoginForm />
      </MemoryRouter>
    );
  
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });
  
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);
  
    await waitFor(() => 
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "wrongpassword"
      )
    );
    expect(window.alert).toHaveBeenCalledWith("Login failed. Please check your email and password.");
  });