"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  LoaderCircle,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  UserRound,
  Crown,
  Mail,
  Phone,
  CalendarDays,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ROLES = ["student", "tutor", "admin"];

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RoleBadge({ role }) {
  const styles = {
    student: "bg-blue-50 text-blue-700 border-blue-200",
    tutor: "bg-purple-50 text-purple-700 border-purple-200",
    admin: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const icons = {
    student: GraduationCap,
    tutor: BookOpen,
    admin: ShieldCheck,
  };

  const Icon = icons[role] || UserRound;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        styles[role] || "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      <Icon size={13} />
      {role || "Unknown"}
    </span>
  );
}

export default function AdminUsersPage() {
  const { data: session, isPending } = authClient.useSession();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const currentUserEmail = session?.user?.email?.toLowerCase();

  const fetchUsers = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load users.");
      }

      setUsers(result.data || []);
    } catch (error) {
      console.error("Admin users fetch error:", error);
      toast.error(error.message || "Could not load registered users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      fetchUsers();
    }
  }, [isPending, session, fetchUsers]);

  const roleCounts = useMemo(
    () => ({
      all: users.length,
      student: users.filter((user) => user.role === "student").length,
      tutor: users.filter((user) => user.role === "tutor").length,
      admin: users.filter((user) => user.role === "admin").length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        String(user.name || "").toLowerCase().includes(query) ||
        String(user.email || "").toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = async (user, newRole) => {
    if (newRole === user.role) return;

    const confirmed = window.confirm(
      `Change ${user.name || user.email}'s role from ${user.role} to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user._id);

      const response = await fetch(
        `${API_URL}/api/admin/users/${user._id}/role`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user role.");
      }

      setUsers((previous) =>
        previous.map((item) =>
          item._id === user._id ? result.data : item
        )
      );

      toast.success(
        `${user.name || "User"} is now assigned the ${newRole} role.`
      );
    } catch (error) {
      console.error("Role update error:", error);
      toast.error(error.message || "Could not update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
          <p className="text-sm text-[#887D92]">
            Loading registered users...
          </p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h2 className="font-bold text-[#30213D]">
          Admin access required
        </h2>
        <p className="mt-2 text-sm text-[#887D92]">
          You do not have permission to manage users.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#8066A8]">
            <ShieldCheck size={17} />
            Administration
          </div>

          <h1 className="text-2xl font-bold text-[#30213D] sm:text-3xl">
            Manage Users
          </h1>

          <p className="mt-2 text-sm text-[#887D92]">
            View registered accounts and manage their platform roles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] bg-white px-4 py-3 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA] disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Users
        </button>
      </div>

      {/* Role statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: roleCounts.all,
            icon: Users,
            color: "text-[#8066A8]",
            bg: "bg-[#EEE8F5]",
          },
          {
            label: "Students",
            value: roleCounts.student,
            icon: GraduationCap,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Tutors",
            value: roleCounts.tutor,
            icon: BookOpen,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Admins",
            value: roleCounts.admin,
            icon: ShieldCheck,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-[#EAE4F0] bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-[#95879F]">
                  {item.label}
                </p>

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                >
                  <Icon size={18} />
                </div>
              </div>

              <p className="mt-2 text-2xl font-bold text-[#30213D]">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search and filter */}
      <div className="space-y-4 rounded-2xl border border-[#EAE4F0] bg-white p-4 sm:p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69AAF]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-[#E8E1EF] bg-white py-3 pl-11 pr-4 text-sm text-[#30213D] outline-none transition placeholder:text-[#B0A5B9] focus:border-[#8066A8] focus:ring-2 focus:ring-[#8066A8]/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", `All (${roleCounts.all})`],
            ["student", `Students (${roleCounts.student})`],
            ["tutor", `Tutors (${roleCounts.tutor})`],
            ["admin", `Admins (${roleCounts.admin})`],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRoleFilter(value)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                roleFilter === value
                  ? "bg-[#8066A8] text-white"
                  : "border border-[#E8E1EF] bg-white text-[#756B80] hover:bg-[#F7F4FA]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* User list */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE4F0] bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#F0ECF4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-[#30213D]">
            Registered Accounts
          </h2>

          <p className="text-xs text-[#95879F]">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Users className="mx-auto mb-3 h-9 w-9 text-[#B8AFC1]" />
            <h3 className="font-semibold text-[#493B56]">
              No users found
            </h3>
            <p className="mt-1 text-sm text-[#95879F]">
              Try changing your search or role filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-[#FAF8FC] text-xs uppercase tracking-wide text-[#95879F]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Contact</th>
                    <th className="px-5 py-4 font-semibold">Plan</th>
                    <th className="px-5 py-4 font-semibold">Joined</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold">Manage Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0ECF4]">
                  {filteredUsers.map((user) => {
                    const isCurrentUser =
                      user.email?.toLowerCase() === currentUserEmail;

                    const isUpdating = updatingId === user._id;

                    return (
                      <tr
                        key={user._id}
                        className="transition hover:bg-[#FCFBFD]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEE8F5] text-sm font-bold text-[#8066A8]">
                                {(user.name || user.email || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-[#493B56]">
                                {user.name || "Unnamed User"}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs font-medium text-[#8066A8]">
                                    You
                                  </span>
                                )}
                              </p>
                              <p className="mt-1 text-xs text-[#95879F]">
                                {user._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="flex items-center gap-2 text-sm text-[#756B80]">
                            <Mail size={14} />
                            {user.email}
                          </p>

                          {user.phone && (
                            <p className="mt-2 flex items-center gap-2 text-xs text-[#95879F]">
                              <Phone size={13} />
                              {user.phone}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium capitalize text-[#756B80]">
                            {user.plan === "pro" && (
                              <Crown size={14} className="text-amber-500" />
                            )}
                            {user.plan || "free"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#756B80]">
                          <span className="flex items-center gap-2">
                            <CalendarDays size={14} />
                            {formatDate(user.createdAt)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <RoleBadge role={user.role} />
                        </td>

                        <td className="px-5 py-4">
                          {isCurrentUser ? (
                            <span className="text-xs text-[#A096A9]">
                              Your account
                            </span>
                          ) : (
                            <div className="relative">
                              <select
                                value={user.role}
                                disabled={isUpdating}
                                onChange={(event) =>
                                  handleRoleChange(user, event.target.value)
                                }
                                className="w-full min-w-[125px] appearance-none rounded-lg border border-[#E8E1EF] bg-white px-3 py-2 pr-8 text-xs font-semibold capitalize text-[#493B56] outline-none focus:border-[#8066A8] disabled:opacity-50"
                              >
                                {ROLES.map((role) => (
                                  <option key={role} value={role}>
                                    {role}
                                  </option>
                                ))}
                              </select>

                              {isUpdating ? (
                                <LoaderCircle
                                  size={14}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#8066A8]"
                                />
                              ) : (
                                <ChevronDown
                                  size={14}
                                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#95879F]"
                                />
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredUsers.map((user) => {
                const isCurrentUser =
                  user.email?.toLowerCase() === currentUserEmail;

                const isUpdating = updatingId === user._id;

                return (
                  <article
                    key={user._id}
                    className="rounded-xl border border-[#EEE8F5] p-4"
                  >
                    <div className="flex items-start gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEE8F5] font-bold text-[#8066A8]">
                          {(user.name || user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="break-words font-bold text-[#30213D]">
                          {user.name || "Unnamed User"}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs font-medium text-[#8066A8]">
                              You
                            </span>
                          )}
                        </p>

                        <p className="mt-1 break-all text-xs text-[#95879F]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="mb-1 text-[#A096A9]">Current Role</p>
                        <RoleBadge role={user.role} />
                      </div>

                      <div>
                        <p className="mb-1 text-[#A096A9]">Plan</p>
                        <p className="flex items-center gap-1 font-semibold capitalize text-[#493B56]">
                          {user.plan === "pro" && (
                            <Crown size={13} className="text-amber-500" />
                          )}
                          {user.plan || "free"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-[#A096A9]">Phone</p>
                        <p className="text-[#756B80]">
                          {user.phone || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-[#A096A9]">Joined</p>
                        <p className="text-[#756B80]">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>

                    {!isCurrentUser && (
                      <div className="mt-4 border-t border-[#F0ECF4] pt-3">
                        <label
                          htmlFor={`role-${user._id}`}
                          className="mb-2 block text-xs font-semibold text-[#756B80]"
                        >
                          Change User Role
                        </label>

                        <div className="relative">
                          <select
                            id={`role-${user._id}`}
                            value={user.role}
                            disabled={isUpdating}
                            onChange={(event) =>
                              handleRoleChange(user, event.target.value)
                            }
                            className="w-full appearance-none rounded-xl border border-[#E8E1EF] bg-white px-4 py-3 pr-9 text-sm font-semibold capitalize text-[#493B56] outline-none focus:border-[#8066A8] disabled:opacity-50"
                          >
                            {ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>

                          {isUpdating ? (
                            <LoaderCircle
                              size={16}
                              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#8066A8]"
                            />
                          ) : (
                            <ChevronDown
                              size={16}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#95879F]"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-[#E8E1EF] bg-[#F9F7FB] p-4">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#8066A8]" />
        <p className="text-xs leading-5 text-[#756B80]">
          Role changes affect dashboard access. Your own admin role cannot
          be changed here, and the last administrator cannot be demoted.
        </p>
      </div>
    </div>
  );
}
