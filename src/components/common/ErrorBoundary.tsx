import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-bg-primary text-white p-8 flex flex-col items-center justify-center font-archivo">
                    <div className="max-w-2xl w-full bg-bg-secondary p-8 border border-accent-red rounded-lg shadow-2xl">
                        <h1 className="text-3xl font-black text-accent-red mb-4">Something went wrong</h1>
                        <p className="mb-4 text-text-secondary">The application encountered an unexpected error.</p>

                        <div className="bg-bg-tertiary p-4 rounded overflow-auto mb-6 border border-border-color">
                            <code className="text-accent-red block mb-2 font-bold">
                                {this.state.error?.toString()}
                            </code>
                            <pre className="text-xs text-text-secondary whitespace-pre-wrap">
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-accent-blue text-bg-primary font-bold py-3 px-6 hover:bg-white transition-colors uppercase tracking-wider"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
