import { I18N } from "./constants/i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { PaymentsPage } from "./features/payments";
import { createQueryClient } from "./shared/lib/queryClient";
import { ErrorBoundary } from "./shared/ui/ErrorBoundary";
import { ErrorBox } from "./shared/ui/styles";

const queryClient = createQueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">{I18N.APP_TITLE}</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <ErrorBoundary
            fallback={<ErrorBox role="alert">{I18N.SOMETHING_WENT_WRONG}</ErrorBox>}
          >
            <PaymentsPage />
          </ErrorBoundary>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
