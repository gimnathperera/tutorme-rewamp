"use client";

export const SentryExampleClient = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-lightwhite px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold text-black">
          Sentry Example Page
        </h1>
        <p className="mt-3 text-sm text-slate-700">
          Use this page in staging or development to verify Sentry error
          reporting.
        </p>
        <button
          type="button"
          className="mt-6 rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-800"
          onClick={() => {
            throw new Error("Sentry Example Page Error");
          }}
        >
          Trigger Test Error
        </button>
      </div>
    </main>
  );
};
