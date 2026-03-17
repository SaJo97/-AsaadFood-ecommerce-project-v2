import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import { MemoryRouter } from "react-router";

import UpdateUser from "../UpdateUser";
import {
  fetchUsers,
  updateUserRole,
  deleteUser,
} from "@/store/user/userSlice";
import { checkAuth } from "@/store/auth/authSlice";

/* ---------------- MOCKS ---------------- */

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("@/store/user/userSlice", () => ({
  fetchUsers: vi.fn(() => ({ type: "users/fetchUsers" })),
  updateUserRole: vi.fn(() => ({ unwrap: vi.fn() })),
  deleteUser: vi.fn(() => ({ type: "users/deleteUser" })),
}));

vi.mock("@/store/auth/authSlice", () => ({
  checkAuth: vi.fn(() => ({ type: "auth/checkAuth" })),
}));

/* ---------------- TESTS ---------------- */

describe("UpdateUser", () => {
  const dispatchMock = vi.fn();

  const users = [
    {
      _id: "1",
      loginEmail: "john@test.com",
      role: "admin",
      contactPerson: {
        firstName: "John",
        lastName: "Doe",
      },
    },
    {
      _id: "2",
      loginEmail: "jane@test.com",
      role: "member",
      contactPerson: {
        firstName: "Jane",
        lastName: "Smith",
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    useDispatch.mockReturnValue(dispatchMock);

    useSelector.mockImplementation((selector) =>
      selector({
        users: {
          list: users,
          loading: {},
        },
      })
    );
  });

  it("dispatches fetchUsers on mount", () => {
    render(
      <MemoryRouter>
        <UpdateUser />
      </MemoryRouter>
    );

    expect(dispatchMock).toHaveBeenCalledWith(fetchUsers());
  });

  it("shows loading state", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        users: {
          list: [],
          loading: { fetchUsers: true },
        },
      })
    );

    render(
      <MemoryRouter>
        <UpdateUser />
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toHaveTextContent("Laddar användare");
  });

  it("shows empty state when no users exist", () => {
    useSelector.mockImplementation((selector) =>
      selector({
        users: {
          list: [],
          loading: {},
        },
      })
    );

    render(
      <MemoryRouter>
        <UpdateUser />
      </MemoryRouter>
    );

    expect(screen.getByText("Inga användare hittades")).toBeInTheDocument();
  });

  it("renders users", () => {
    render(
      <MemoryRouter>
        <UpdateUser />
      </MemoryRouter>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    expect(screen.getByText("john@test.com")).toBeInTheDocument();
  });

  it("filters users by search", () => {
    render(
      <MemoryRouter>
        <UpdateUser />
      </MemoryRouter>
    );

    const searchInput = screen.getByRole("searchbox");

    fireEvent.change(searchInput, {
      target: { value: "Jane" },
    });

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("toggles user role", async () => {
    updateUserRole.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(),
    });

    render(
      <MemoryRouter>
        <UpdateUser />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {
      name: /ändra roll för john doe/i,
    });

    fireEvent.click(button);

    expect(updateUserRole).toHaveBeenCalledWith({
      id: "1",
      role: "member",
    });
  });

  it("deletes user after confirmation", () => {
    window.confirm = vi.fn(() => true);

    render(
      <MemoryRouter>
        <UpdateUser />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {
      name: /ta bort användaren john doe/i,
    });

    fireEvent.click(button);

    expect(deleteUser).toHaveBeenCalledWith("1");
  });

  it("does not delete if confirmation cancelled", () => {
    window.confirm = vi.fn(() => false);

    render(
      <MemoryRouter>
        <UpdateUser />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {
      name: /ta bort användaren john doe/i,
    });

    fireEvent.click(button);

    expect(deleteUser).not.toHaveBeenCalled();
  });

  it("renders navigation link", () => {
    render(
      <MemoryRouter>
        <UpdateUser />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", { name: /tillbaka till adminpanelen/i })
    ).toBeInTheDocument();
  });
});