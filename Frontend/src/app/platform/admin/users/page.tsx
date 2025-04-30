/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import useFetch from "@/lib/fetch";

interface User {
  role: any;
  id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}



const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await useFetch.get("/admin/users");
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get unique roles from users
  const roles = React.useMemo(() => {
    const roleSet = new Set<string>();
    users.forEach(u => {
      if (u.role) roleSet.add(u.role);
    });
    return Array.from(roleSet);
  }, [users]);

  // Filter users by selected role
  const filteredUsers = React.useMemo(() => {
    if (selectedRole === "all") return users;
    return users.filter(u => u.role === selectedRole);
  }, [users, selectedRole]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="role-filter" className="text-sm font-medium text-neutral-700">Filter by role:</label>
        <select
          id="role-filter"
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          className="border border-neutral-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="all">All</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && filteredUsers.length === 0 && <p>No users found.</p>}
      {!loading && filteredUsers.length > 0 && (
        <table className="min-w-full border border-neutral-300 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-neutral-100 text-neutral-700 uppercase text-sm font-semibold">
          <tr>
            {Object.keys(filteredUsers[0]).filter(e => ['email',"role","name","isEmailVerified"].includes(e)).map((e) => (
              <th key={e} className="px-1 py-2 border-b border-neutral-300 text-left">
                {e}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-neutral-800">
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-neutral-50 transition-colors"
            >
                {Object.keys(filteredUsers[0]).filter(e => ['email',"role","name","isEmailVerified"].includes(e)).map((e) => (
                <td
                  key={e}
                  className="p-1 border-b border-neutral-200 text-sm whitespace-nowrap"
                >
                  {user[e as keyof User]?.toString() ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
};

export default AdminUsersPage;