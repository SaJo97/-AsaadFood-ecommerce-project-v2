import { checkAuth } from "@/store/auth/authSlice";
import { deleteUser, fetchUsers, updateUserRole } from "@/store/user/userSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((state) => state.users);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter users by name or email
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        `${user.contactPerson.firstName} ${user.contactPerson.lastName}`.toLowerCase();
      const email = user.loginEmail.toLowerCase();
      const searchValue = search.toLowerCase();

      return fullName.includes(searchValue) || email.includes(searchValue);
    });
  }, [users, search]);

  const handleRoleChange = async (id, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "member" : "admin";
      await dispatch(updateUserRole({ id, role: newRole })).unwrap();
      dispatch(checkAuth());
    } catch (error) {
      console.error("Error changing role:", error);
      alert(error || "Ett oväntat fel uppstod när rollen skulle ändras.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Är du säker att du vill ta bort användaren?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <main
      className="w-full max-w-200 mx-auto flex flex-col gap-3 p-3 font-raleway"
      id="main-content"
      aria-labelledby="manage-users-heading"
    >
      {/* SEO */}
      <title>Admin | Hantera användare</title>
      <meta
        name="description"
        content="Adminpanel för att hantera användare i systemet. Byt roll eller ta bort användare."
      />

      <header className="flex flex-col gap-2">
        <h1
          id="manage-users-heading"
          className="text-center font-crimsontext font-bold text-2xl"
        >
          Hantera användare
        </h1>

        <nav aria-label="Admin navigation">
          <Link to="/adminpanel">Tillbaka till adminpanelen</Link>
        </nav>
      </header>

      {/* Search */}
      <section aria-labelledby="search-users-heading">
        <h2 id="search-users-heading" className="sr-only">
          Sök användare
        </h2>
        <label htmlFor="user-search" className="sr-only">
          Sök användare efter namn eller e-post
        </label>
        <p id="search-help" className="sr-only">
          Filtrera användare efter namn eller e-postadress.
        </p>
        <input
          aria-describedby="search-help"
          id="user-search"
          type="search"
          placeholder="Sök efter namn eller e-post..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1E5BCC] outline-none"
        />
      </section>

      {/* Users List */}
      <section
        className="rounded-2xl bg-[#f9f9f9] border p-4 flex flex-col gap-3"
        aria-labelledby="users-list-heading"
      >
        <h2 id="users-list-heading" className="sr-only">
          Lista över användare
        </h2>
        {loading.fetchUsers && (
          <p role="status" aria-live="polite" className="text-center">
            Laddar användare...
          </p>
        )}

        {filteredUsers.length === 0 && !loading.fetchUsers && (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-gray-500"
          >
            Inga användare hittades
          </p>
        )}

        {filteredUsers.map((user) => (
          <article
            key={user._id}
            className="flex justify-between items-center bg-white border rounded-lg p-3 shadow-sm"
            aria-labelledby={`user-${user._id}-name`}
          >
            {/* User Info */}
            <div>
              <p id={`user-${user._id}-name`} className="font-semibold">
                {user.contactPerson.firstName} {user.contactPerson.lastName}
              </p>
              <p className="text-sm text-gray-600">{user.loginEmail}</p>
              <span className="text-xs font-medium">Roll: {user.role}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-2">
              {/* Toggle Role */}
              <button
                onClick={() => handleRoleChange(user._id, user.role)}
                disabled={loading.updateUserRole}
                className="bg-[#1E5BCC] text-white rounded-md hover:bg-[#1747A3] px-2 py-1 transition-colors duration-150 border border-black"
                aria-label={`Ändra roll för ${user.contactPerson.firstName} ${user.contactPerson.lastName}`}
              >
                Byt roll
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(user._id)}
                disabled={loading.delete}
                className="bg-red-600 text-white rounded-md hover:bg-red-700 px-3 py-1 transition-colors duration-150 border border-black"
                aria-label={`Ta bort användaren ${user.contactPerson.firstName} ${user.contactPerson.lastName}`}
              >
                Ta bort
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default UpdateUser;
