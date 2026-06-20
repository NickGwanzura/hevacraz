"use client";

import { approveApplication, rejectApplication, markUnderReview, suspendMember } from "@/actions/admin-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationStatus } from "@/lib/enums";

interface Application {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  membershipNumber: string | null;
}

export function AdminActions({ application }: { application: Application }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const status = application.status;

  const doAction = async (action: string, fn: () => Promise<any>) => {
    setLoading(action);
    setError("");
    try {
      await fn();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Action failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {status === ApplicationStatus.PENDING && (
          <button
            onClick={() => doAction("review", () => markUnderReview(application.id))}
            disabled={loading !== null}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
          >
            {loading === "review" ? "..." : "Mark Under Review"}
          </button>
        )}
        {(status === ApplicationStatus.PENDING || status === ApplicationStatus.UNDER_REVIEW) && (
          <>
            <button
              onClick={() => doAction("approve", () => approveApplication(application.id))}
              disabled={loading !== null}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
            >
              {loading === "approve" ? "..." : "Approve"}
            </button>
            <button
              onClick={() => doAction("reject", () => rejectApplication(application.id))}
              disabled={loading !== null}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
            >
              {loading === "reject" ? "..." : "Reject"}
            </button>
          </>
        )}
        {status === ApplicationStatus.APPROVED && (
          <button
            onClick={() => doAction("suspend", () => suspendMember(application.id))}
            disabled={loading !== null}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
          >
            {loading === "suspend" ? "..." : "Suspend Member"}
          </button>
        )}
        {status === ApplicationStatus.SUSPENDED && (
          <button
            onClick={() => doAction("review", () => markUnderReview(application.id))}
            disabled={loading !== null}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:opacity-50"
          >
            {loading === "review" ? "..." : "Reactivate (Under Review)"}
          </button>
        )}
        {error && <span className="text-red-600 text-sm ml-2">{error}</span>}
      </div>
    </div>
  );
}
