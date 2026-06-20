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

  const Btn = ({ action, label, color, loading: l }: { action: string; label: string; color: string; loading: string }) => (
    <button onClick={() => doAction(action, l === "approve" ? () => approveApplication(application.id) : l === "reject" ? () => rejectApplication(application.id) : l === "suspend" ? () => suspendMember(application.id) : () => markUnderReview(application.id))}
      disabled={loading !== null}
      className={`inline-flex items-center gap-1.5 px-4 py-2 ${color} text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}>
      {loading === action ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {action === "review" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
          {action === "approve" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
          {action === "reject" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
          {action === "suspend" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />}
        </svg>
      )}
      {loading === action ? "Processing..." : label}
    </button>
  );

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center gap-2">
        {status === ApplicationStatus.PENDING && (
          <Btn action="review" label="Mark Under Review" color="bg-blue-600" loading="review" />
        )}
        {(status === ApplicationStatus.PENDING || status === ApplicationStatus.UNDER_REVIEW) && (
          <>
            <Btn action="approve" label="Approve" color="bg-green-600" loading="approve" />
            <Btn action="reject" label="Reject" color="bg-red-600" loading="reject" />
          </>
        )}
        {status === ApplicationStatus.APPROVED && (
          <Btn action="suspend" label="Suspend Member" color="bg-gray-600" loading="suspend" />
        )}
        {status === ApplicationStatus.SUSPENDED && (
          <Btn action="review" label="Reactivate (Under Review)" color="bg-blue-600" loading="review" />
        )}
        {error && (
          <div className="flex items-center gap-1.5 text-red-600 text-sm ml-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
