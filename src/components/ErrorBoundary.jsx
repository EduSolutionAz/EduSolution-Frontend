import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Səhifə xətası:', error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f6eeee] px-6 text-center font-sans">
        <h1 className="text-2xl font-bold text-[#080d4a]">Səhifə yüklənmədi</h1>
        <p className="text-sm text-[#080d4a]/70 max-w-[440px] break-words">
          {error.message || 'Naməlum xəta baş verdi'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-full bg-[#26aec4] text-[#080d4a] text-[13px] font-semibold hover:bg-[#3cc3d8] transition"
          >
            Səhifəni yenilə
          </button>
          <a
            href="/"
            className="px-5 py-2 rounded-full bg-[#080d4a] text-white text-[13px] hover:bg-[#141c63] transition"
          >
            Ana səhifə
          </a>
        </div>
      </div>
    );
  }
}
