"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Search,
  RefreshCw,
  LoaderCircle,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Receipt,
  Inbox,
  Crown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMoney(amount, currency = "USD") {
  const numericAmount = Number(amount || 0);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency.toUpperCase()} ${numericAmount.toLocaleString()}`;
  }
}

function RoleBadge({ role }) {
  const styles = {
    student: "bg-blue-50 text-blue-700 border-blue-200",
    tutor: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const Icon = role === "tutor" ? BookOpen : GraduationCap;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
        styles[role] || "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      <Icon size={12} />
      {role || "Unknown"}
    </span>
  );
}

export default function AdminTransactionsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const fetchTransactions = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        `${API_URL}/api/admin/transactions`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load transactions."
        );
      }

      setTransactions(result.data || []);
    } catch (error) {
      console.error("Admin transactions error:", error);
      toast.error(error.message || "Could not load transactions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      fetchTransactions();
    }
  }, [isPending, session, fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        [
          transaction.userName,
          transaction.userEmail,
          transaction.userRole,
          transaction.planName,
          transaction.transactionId,
          transaction.stripeSessionId,
          transaction.currency,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesRole =
        roleFilter === "all" || transaction.userRole === roleFilter;

      const matchesPlan =
        planFilter === "all" ||
        String(transaction.planName || "").toLowerCase() ===
          planFilter;

      return matchesSearch && matchesRole && matchesPlan;
    });
  }, [transactions, search, roleFilter, planFilter]);

  const revenueByCurrency = useMemo(() => {
    return transactions.reduce((totals, transaction) => {
      const currency = String(transaction.currency || "USD").toUpperCase();
      const amount = Number(transaction.amount || 0);

      totals[currency] = (totals[currency] || 0) + amount;

      return totals;
    }, {});
  }, [transactions]);

  const studentPayments = transactions.filter(
    (item) => item.userRole === "student"
  ).length;

  const tutorPayments = transactions.filter(
    (item) => item.userRole === "tutor"
  ).length;

  const proPayments = transactions.filter(
    (item) =>
      String(item.planName || "").toLowerCase().includes("pro")
  ).length;

  if (isPending || loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-9 w-9 animate-spin text-[#8066A8]" />
          <p className="text-sm text-[#887D92]">
            Loading transactions...
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
          You do not have permission to view transactions.
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
            Transactions
          </h1>

          <p className="mt-2 text-sm text-[#887D92]">
            View successful Stripe subscription payments and payment details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchTransactions(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E1EF] bg-white px-4 py-3 text-sm font-semibold text-[#70558F] transition hover:bg-[#F7F4FA] disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Transactions
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Transactions",
            value: transactions.length,
            icon: Receipt,
            color: "text-[#8066A8]",
            bg: "bg-[#EEE8F5]",
          },
          {
            label: "Student Payments",
            value: studentPayments,
            icon: GraduationCap,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Tutor Payments",
            value: tutorPayments,
            icon: BookOpen,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Pro Payments",
            value: proPayments,
            icon: Crown,
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
                {item.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Revenue totals */}
      <section className="rounded-2xl border border-[#EAE4F0] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Wallet size={19} className="text-[#8066A8]" />
          <div>
            <h2 className="font-bold text-[#30213D]">
              Recorded Subscription Revenue
            </h2>
            <p className="mt-1 text-xs text-[#95879F]">
              Successful payments grouped by currency
            </p>
          </div>
        </div>

        {Object.keys(revenueByCurrency).length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(revenueByCurrency).map(([currency, total]) => (
              <div
                key={currency}
                className="rounded-xl border border-[#EEE8F5] bg-[#FAF8FC] p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#95879F]">
                  {currency}
                </p>

                <p className="mt-2 text-2xl font-bold text-[#30213D]">
                  {formatMoney(total, currency)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#DCD1E7] bg-[#FAF8FC] px-4 py-8 text-center">
            <Inbox className="mx-auto mb-2 h-7 w-7 text-[#A69AAF]" />
            <p className="text-sm font-medium text-[#756B80]">
              No successful payments recorded yet.
            </p>
          </div>
        )}
      </section>

      {/* Search and filters */}
      <section className="space-y-4 rounded-2xl border border-[#EAE4F0] bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69AAF]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search user, email, plan or transaction ID..."
            className="w-full rounded-xl border border-[#E8E1EF] bg-white py-3 pl-11 pr-4 text-sm text-[#30213D] outline-none transition placeholder:text-[#B0A5B9] focus:border-[#8066A8] focus:ring-2 focus:ring-[#8066A8]/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#95879F]">
            <Filter size={14} />
            Role:
          </span>

          {[
            ["all", "All"],
            ["student", "Student"],
            ["tutor", "Tutor"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRoleFilter(value)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                roleFilter === value
                  ? "bg-[#8066A8] text-white"
                  : "border border-[#E8E1EF] bg-white text-[#756B80] hover:bg-[#F7F4FA]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#95879F]">
            Plan:
          </span>

          {[
            ["all", "All"],
            ["student pro", "Student Pro"],
            ["tutor pro", "Tutor Pro"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPlanFilter(value)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                planFilter === value
                  ? "bg-[#8066A8] text-white"
                  : "border border-[#E8E1EF] bg-white text-[#756B80] hover:bg-[#F7F4FA]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Transaction records */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE4F0] bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-[#F0ECF4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-[#30213D]">
            Payment Records
          </h2>

          <p className="text-xs text-[#95879F]">
            Showing {filteredTransactions.length} of {transactions.length} successful payments
          </p>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <CreditCard className="mx-auto mb-3 h-9 w-9 text-[#B8AFC1]" />
            <h3 className="font-semibold text-[#493B56]">
              {transactions.length === 0
                ? "No transactions yet"
                : "No matching transactions"}
            </h3>
            <p className="mt-1 text-sm text-[#95879F]">
              {transactions.length === 0
                ? "Successful Stripe subscription payments will appear here."
                : "Try changing your search or filters."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full text-left">
                <thead className="bg-[#FAF8FC] text-xs uppercase tracking-wide text-[#95879F]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold">Plan</th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">Transaction ID</th>
                    <th className="px-5 py-4 font-semibold">Payment Date</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0ECF4]">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="transition hover:bg-[#FCFBFD]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#493B56]">
                          {transaction.userName || "Unknown User"}
                        </p>
                        <p className="mt-1 text-xs text-[#95879F]">
                          {transaction.userEmail || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <RoleBadge role={transaction.userRole} />
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold capitalize text-[#493B56]">
                          <Crown size={14} className="text-amber-500" />
                          {transaction.planName || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-[#30213D]">
                        {formatMoney(
                          transaction.amount,
                          transaction.currency
                        )}
                      </td>

                      <td className="max-w-[190px] px-5 py-4">
                        <p
                          className="truncate text-xs text-[#756B80]"
                          title={
                            transaction.transactionId ||
                            transaction.stripeSessionId ||
                            ""
                          }
                        >
                          {transaction.transactionId ||
                            transaction.stripeSessionId ||
                            "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-[#756B80]">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={14} />
                          {formatDate(transaction.paidAt)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle2 size={13} />
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet and mobile cards */}
            <div className="space-y-3 p-4 xl:hidden">
              {filteredTransactions.map((transaction) => (
                <article
                  key={transaction._id}
                  className="rounded-xl border border-[#EEE8F5] p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-bold text-[#30213D]">
                        {transaction.userName || "Unknown User"}
                      </h3>
                      <p className="mt-1 break-all text-xs text-[#95879F]">
                        {transaction.userEmail || "—"}
                      </p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      <CheckCircle2 size={13} />
                      Paid
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="mb-1 text-[#A096A9]">Role</p>
                      <RoleBadge role={transaction.userRole} />
                    </div>

                    <div>
                      <p className="mb-1 text-[#A096A9]">Plan</p>
                      <p className="font-semibold capitalize text-[#493B56]">
                        {transaction.planName || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[#A096A9]">Amount</p>
                      <p className="font-bold text-[#30213D]">
                        {formatMoney(
                          transaction.amount,
                          transaction.currency
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[#A096A9]">Payment Date</p>
                      <p className="text-[#756B80]">
                        {formatDate(transaction.paidAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[#F0ECF4] pt-3">
                    <p className="mb-1 text-xs text-[#A096A9]">
                      Transaction ID
                    </p>
                    <p className="break-all font-mono text-xs text-[#756B80]">
                      {transaction.transactionId ||
                        transaction.stripeSessionId ||
                        "—"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
