import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProfileListPage from "./ProfileListPage";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("../../firebase", () => ({
  db: {},
}));

const mockProfiles = [
  {
    id: "1",
    firstName: "John",
    middleName: "A.",
    lastName: "Doe",
    bio: "Software Engineer",
    profileImageUrl: "https://example.com/john.png",
  },
  {
    id: "2",
    firstName: "Jane",
    middleName: "",
    lastName: "Smith",
    bio: "Graphic Designer",
    profileImageUrl: "https://example.com/jane.png",
  },
];

beforeEach(() => {
  getDocs.mockResolvedValue({
    docs: mockProfiles.map((profile) => ({
      id: profile.id,
      data: () => profile,
    })),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders ProfileListPage without crashing", () => {
    render(
      <MemoryRouter>
        <ProfileListPage />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Profiles/i).length).toBeGreaterThan(0);
  });
  
test("displays profiles fetched from the database", async () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const johnDoeProfile = await screen.findByText("John A. Doe");
  const janeSmithProfile = await screen.findByText("Jane Smith");

  expect(johnDoeProfile).toBeInTheDocument();
  expect(janeSmithProfile).toBeInTheDocument();
});

test("displays 'No profiles available.' when there are no profiles", async () => {
  getDocs.mockResolvedValue({ docs: [] });

  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const noProfilesMessage = await screen.findByText("No profiles available.");
  expect(noProfilesMessage).toBeInTheDocument();
});

test("renders the search input field", () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );
  const searchInput = screen.getByPlaceholderText("Search profiles...");
  expect(searchInput).toBeInTheDocument();
});

test("filters profiles based on search input", async () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const searchInput = screen.getByPlaceholderText("Search profiles...");
  fireEvent.change(searchInput, { target: { value: "Jane" } });

  const janeSmithProfile = await screen.findByText("Jane Smith");
  expect(janeSmithProfile).toBeInTheDocument();
  expect(screen.queryByText("John A. Doe")).toBeNull();
});

test("navigates to the correct profile page when a profile is clicked", async () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const johnDoeProfileLink = await screen.findByText("John A. Doe");
  expect(johnDoeProfileLink.closest("a")).toHaveAttribute("href", "/profile/1");
});

test("renders ProfileListPage without crashing", () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );
  expect(screen.getAllByText(/Profiles/i).length).toBeGreaterThan(0);
});

test("displays profiles fetched from the database", async () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const johnDoeProfile = await screen.findByText("John A. Doe");
  const janeSmithProfile = await screen.findByText("Jane Smith");

  expect(johnDoeProfile).toBeInTheDocument();
  expect(janeSmithProfile).toBeInTheDocument();
});

test("displays 'No profiles available.' when there are no profiles", async () => {
  getDocs.mockResolvedValue({ docs: [] });

  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const noProfilesMessage = await screen.findByText("No profiles available.");
  expect(noProfilesMessage).toBeInTheDocument();
});

test("renders the search input field", () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );
  const searchInput = screen.getByPlaceholderText("Search profiles...");
  expect(searchInput).toBeInTheDocument();
});

test("filters profiles based on search input", async () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const searchInput = screen.getByPlaceholderText("Search profiles...");
  fireEvent.change(searchInput, { target: { value: "Jane" } });

  const janeSmithProfile = await screen.findByText("Jane Smith");
  expect(janeSmithProfile).toBeInTheDocument();
  expect(screen.queryByText("John A. Doe")).toBeNull();
});

test("navigates to the correct profile page when a profile is clicked", async () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const johnDoeProfileLink = await screen.findByText("John A. Doe");
  expect(johnDoeProfileLink.closest("a")).toHaveAttribute("href", "/profile/1");
});

// New tests to improve coverage

test("renders a profile with the anonymous profile image if no profile image URL is provided", async () => {
  const mockProfilesWithAnonImage = [
    { ...mockProfiles[0], profileImageUrl: "" },
  ];
  getDocs.mockResolvedValue({
    docs: mockProfilesWithAnonImage.map((profile) => ({
      id: profile.id,
      data: () => profile,
    })),
  });

  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const profileImage = await screen.findByAltText("John Doe");
  expect(profileImage).toHaveAttribute("src", expect.stringContaining("anon_profile.png"));
});

test("logs an error when there is an issue fetching profiles from the database", async () => {
  console.error = jest.fn();
  getDocs.mockRejectedValue(new Error("Database error"));

  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  expect(console.error).toHaveBeenCalledWith("Error fetching profiles:", expect.any(Error));
});

test("displays all profiles when the search term is cleared", async () => {
  render(
    <MemoryRouter>
      <ProfileListPage />
    </MemoryRouter>
  );

  const searchInput = screen.getByPlaceholderText("Search profiles...");
  fireEvent.change(searchInput, { target: { value: "John" } });

  const johnDoeProfile = await screen.findByText("John A. Doe");
  expect(johnDoeProfile).toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: "" } });

  const janeSmithProfile = await screen.findByText("Jane Smith");
  expect(janeSmithProfile).toBeInTheDocument();
  expect(johnDoeProfile).toBeInTheDocument();
});