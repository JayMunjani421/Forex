import { Component } from 'react';

export default class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="w-full max-w-5xl mx-auto rounded-3xl border border-rose-500/30 bg-rose-950/20 p-8 text-center"
          role="alert"
        >
          <p className="text-lg font-semibold text-rose-200">{this.props.title ?? 'Something went wrong'}</p>
          <p className="mt-2 text-sm text-slate-400">
            {this.props.description ?? 'Please refresh the page or try again in a moment.'}
          </p>
          <button
            type="button"
            className="mt-6 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
