import { exportMembersCSV } from "@/actions/admin-actions";

export async function GET() {
  const members = await exportMembersCSV();

  const headers = Object.keys(members[0] || {});
  const csvRows = [headers.join(",")];
  for (const member of members) {
    csvRows.push(
      headers.map((h) => {
        const val = (member as any)[h]?.toString() || "";
        // Escape quotes and wrap in quotes if contains comma or quote
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(",")
    );
  }

  const csv = csvRows.join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="HEVACRAZ-members-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
