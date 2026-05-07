import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] p-6 text-center">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Something went wrong.</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md">We apologize for the inconvenience. Please try refreshing the page or return home.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-black text-white px-8 py-3 text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
          >
            Return Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
