export const YouAreBlocked = () => {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Account Blocked
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your account has been blocked. If you believe this is a mistake,
              please contact our support team.
            </p>
          </div>
          <div className="mt-8">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                For assistance, please contact support at:{" "}
                <a
                  href="mailto:support@internhub.ma"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  support@internhub.ma
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
