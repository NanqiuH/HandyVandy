import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewPostingsPage from "./ViewPostingsPage";
import { collection, getDocs } from "firebase/firestore";

// Mock Firebase functions directly in the test file
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(), // Mock getFirestore to simulate a Firestore instance
  collection: jest.fn(), // Mock collection to simulate a Firestore collection
  getDocs: jest.fn(), // Mock getDocs to simulate fetching documents from Firestore
}));

jest.mock("../../firebase", () => ({
    db: {},
}));

// Mocked data for postings
const mockPostingsData = [
  {
    id: "1",
    postingName: "Gardening Service",
    description: "Offering gardening services",
    price: "50",
    serviceType: "offering",
    category: "Landscaping",
    createdAt: "2023-08-22T10:00:00Z",
  },
  {
    id: "2",
    postingName: "Dog Walking",
    description: "Need a dog walker",
    price: "15",
    serviceType: "requesting-with-delivery",
    category: "Pet Care",
    createdAt: "2023-08-21T10:00:00Z",
  },
  {
    id: "3",
    postingName: "House Cleaning",
    description: "Offering house cleaning services",
    price: "30",
    serviceType: "offering",
    category: "Cleaning",
    createdAt: "2023-08-20T10:00:00Z",
  },
];

beforeEach(() => {
  getDocs.mockResolvedValue({
    docs: mockPostingsData.map((posting) => ({
      data: () => posting,
    })),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders ViewPostingsPage without crashing", async () => {
  render(
    <MemoryRouter>
      <ViewPostingsPage />
    </MemoryRouter>
  );
    expect(screen.getAllByText(/Price/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Service Type/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Category/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sort By/i).length).toBeGreaterThan(0);
});

test("fetches and displays postings from Firestore", async () => {
  render(
    <MemoryRouter>
      <ViewPostingsPage />
    </MemoryRouter>
  );

  const gardeningPost = await screen.findByText("Gardening Service");
  const dogPost = await screen.findByText("Dog Walking");

  expect(gardeningPost).toBeInTheDocument();
  expect(dogPost).toBeInTheDocument();
});

test("filters postings by title search term", async () => {
    render(
      <MemoryRouter>
        <ViewPostingsPage />
      </MemoryRouter>
    );
  
    // Wait for the input to be available and then enter the search term
    const searchInput = await screen.findByPlaceholderText("Search by title...");
    fireEvent.change(searchInput, { target: { value: "Gardening" } });
  
    // Wait for the filtered result to appear
    await waitFor(() => {
      expect(screen.getByText("Gardening Service")).toBeInTheDocument();
      expect(screen.queryByText("Dog Walking")).not.toBeInTheDocument();
    });
  });  

test("filters postings by price", async () => {
  render(
    <MemoryRouter>
      <ViewPostingsPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText("Max price"), { target: { value: "20" } });
  await waitFor(() => {
    expect(screen.queryByText("Gardening Service")).not.toBeInTheDocument();
    expect(screen.getByText("Dog Walking")).toBeInTheDocument();
  });
});

test("sorts postings by price low to high", async () => {
  render(
    <MemoryRouter>
      <ViewPostingsPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText("Sort By:"), { target: { value: "price-low-high" } });
  await waitFor(() => {
    const postingTitles = screen.getAllByRole("heading", { level: 2 }).map((el) => el.textContent);
    expect(postingTitles).toEqual(["Dog Walking", "House Cleaning", "Gardening Service"]);
  });
});

test("displays no postings available message when there are no postings", async () => {
  getDocs.mockResolvedValue({ docs: [] }); // Mock getDocs to return an empty array

  render(
    <MemoryRouter>
      <ViewPostingsPage />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/No postings available/i)).toBeInTheDocument();
  });
});

test("filters postings by service type 'offering'", async () => {
    render(
      <MemoryRouter>
        <ViewPostingsPage />
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByLabelText("Service Type:"), { target: { value: "offering" } });
  
    await waitFor(() => {
      expect(screen.getByText("Gardening Service")).toBeInTheDocument();
      expect(screen.getByText("House Cleaning")).toBeInTheDocument();
      expect(screen.queryByText("Dog Walking")).not.toBeInTheDocument();
    });
  });

test("sorts postings by price from high to low", async () => {
  render(
    <MemoryRouter>
      <ViewPostingsPage />
    </MemoryRouter>
  );
  
  fireEvent.change(screen.getByLabelText("Sort By:"), { target: { value: "price-high-low" } });
  
  await waitFor(() => {
    const postingTitles = screen.getAllByRole("heading", { level: 2 }).map((el) => el.textContent);
    expect(postingTitles).toEqual(["Gardening Service", "House Cleaning", "Dog Walking"]);
  });
});

test("displays a message when no postings match filters", async () => {
  render(
    <MemoryRouter>
      <ViewPostingsPage />
    </MemoryRouter>
  );
  
  fireEvent.change(screen.getByLabelText("Category:"), { target: { value: "Food" } });
  
  await waitFor(() => {
    expect(screen.getByText(/No postings available/)).toBeInTheDocument();
  });
});

test("sorts postings by price from high to low", async () => {
  render(
    <MemoryRouter>
      <ViewPostingsPage />
    </MemoryRouter>
  );
    
  fireEvent.change(screen.getByLabelText("Sort By:"), { target: { value: "alphabetical" } });
    
  await waitFor(() => {
    const postingTitles = screen.getAllByRole("heading", { level: 2 }).map((el) => el.textContent);
    expect(postingTitles).toEqual(["Dog Walking", "Gardening Service", "House Cleaning"]);
  });
});
