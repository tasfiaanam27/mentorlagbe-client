
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[#E8E1EF] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute h-14 w-14 animate-spin rounded-full border-4 border-[#EDE7F6] border-t-[#8B6BB1]" />
            <div className="h-3 w-3 rounded-full bg-[#8B6BB1]" />
          </div>

          <h2 className="mt-6 text-lg font-semibold text-[#30243D]">
            Loading MentorLagbe
          </h2>

          <p className="mt-2 text-sm text-[#81758E]">
            Please wait while we prepare everything for you.
          </p>

          <div className="mt-7 w-full space-y-3">
            <div className="h-3 w-full animate-pulse rounded-full bg-[#F0ECF5]" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-[#F0ECF5]" />
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-[#F0ECF5]" />
          </div>
        </div>
      </div>
    </main>
  );
}
