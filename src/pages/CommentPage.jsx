import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { APPLICANT_SERVICES, LIMITS } from '../services/commentApi';
import { sendReview } from '../services/contentApi';

const STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  DONE: 'done',
  BLOCKED: 'blocked',
};

const FIELD_LABEL = 'block text-[#323643]/70 text-[11px] mb-1';
const FIELD =
  'w-full bg-white border border-[#323643]/15 rounded px-3 py-2.5 text-[13px] text-[#2f3f80] outline-none focus:border-[#26aec4] transition';

export default function CommentPage() {
  const { id: token = '' } = useParams();

  const [service, setService] = useState(APPLICANT_SERVICES[0].value);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(STATUS.IDLE);
  const [messages, setMessages] = useState([]);

  const length = comment.trim().length;
  const isLongEnough = length >= LIMITS.COMMENT_MIN;
  const isTooLong = length > LIMITS.COMMENT_MAX;
  const isSubmitting = status === STATUS.SENDING;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(STATUS.SENDING);
    setMessages([]);

    let result;
    try {
      result = await sendReview({ token, service, comment: comment.trim() });
    } catch (error) {
      setMessages(
        error?.errors?.length > 0
          ? error.errors.map((item) => item.message)
          : [error?.message || 'Rəy göndərilmədi. Yenidən cəhd edin.'],
      );
      setStatus(STATUS.IDLE);
      return;
    }

    if (result?.is_comment_accepted) {
      setStatus(STATUS.DONE);
      setMessages([]);
      setComment('');
      return;
    }

    const found = (result?.errors || []).map((item) => item.message);
    const isTokenProblem = found.some((message) =>
      /token/i.test(message),
    );

    setMessages(
      found.length > 0 ? found : ['Rəy qəbul edilmədi. Yenidən cəhd edin.'],
    );
    setStatus(isTokenProblem ? STATUS.BLOCKED : STATUS.IDLE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6eeee] font-sans overflow-x-hidden">
      <Header />

      <main
        className="flex-1 px-4 sm:px-6 py-12 sm:py-16"
        style={{
          backgroundImage: `
            linear-gradient(rgba(246,238,238,0.94), rgba(246,238,238,0.94)),
            url('/assets/topographic.png')
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '650px auto',
        }}
      >
        <div className="max-w-[560px] mx-auto">
          <h1 className="text-center text-[#2f3f80] font-bold text-[22px] sm:text-[28px] tracking-wide mb-2">
            Share Your Feedback
          </h1>
          <p className="text-center text-[#323643]/60 text-[12px] mb-8">
            Your opinion helps us improve. This review link can be used once.
          </p>

          {status === STATUS.DONE ? (
            <div className="bg-white rounded-lg shadow px-6 py-8 text-center" role="status">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#26aec4]/15 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#1a8a99]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-[#2f3f80] text-[17px] font-semibold mb-2">Təşəkkür edirik!</h2>
              <p className="text-[#323643]/60 text-[13px] leading-6">
                Rəyiniz qeydə alındı. Faylınız üçün təşəkkür edirik.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex px-5 py-2 rounded-full bg-[#080d4a] text-white text-[13px] hover:bg-[#141c63] transition"
              >
                Ana səhifə
              </Link>
            </div>
          ) : status === STATUS.BLOCKED ? (
            <div className="bg-white rounded-lg shadow px-6 py-8 text-center" role="alert">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M12 8v5M12 16.5v.5" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <h2 className="text-[#2f3f80] text-[17px] font-semibold mb-2">Link işləmir</h2>
              <ul className="text-[#323643]/60 text-[13px] leading-6 space-y-1">
                {messages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
              <p className="text-[#323643]/50 text-[12px] mt-4">
                Yeni link üçün bizimlə əlaqə saxlayın.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow px-6 py-6 space-y-5">
              <div>
                <label htmlFor="review-service" className={FIELD_LABEL}>
                  Xidmət növü *
                </label>
                <select
                  id="review-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={`${FIELD} cursor-pointer`}
                >
                  {APPLICANT_SERVICES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="review-comment" className={FIELD_LABEL}>
                  Rəyiniz *
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  maxLength={LIMITS.COMMENT_MAX}
                  placeholder="Təcrübənizi yazın..."
                  className={`${FIELD} resize-y leading-6`}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span
                    className={`text-[11px] ${
                      isTooLong || (length > 0 && !isLongEnough)
                        ? 'text-red-600'
                        : 'text-[#323643]/50'
                    }`}
                  >
                    {length < LIMITS.COMMENT_MIN
                      ? `Ən azı ${LIMITS.COMMENT_MIN} simvol`
                      : isTooLong
                        ? `Maksimum ${LIMITS.COMMENT_MAX} simvol`
                        : 'Hazırdır'}
                  </span>
                  <span className="text-[11px] text-[#323643]/40">
                    {length}/{LIMITS.COMMENT_MAX}
                  </span>
                </div>
              </div>

              {messages.length > 0 && (
                <ul className="text-red-600 text-[12px] space-y-1" role="alert">
                  {messages.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-full bg-[#080d4a] text-white text-[13px] font-semibold hover:bg-[#141c63] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Göndərilir...' : 'Rəyi göndər'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
