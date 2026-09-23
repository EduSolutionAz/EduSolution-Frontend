import { useState } from 'react';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', service: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend /api/contact qoşulacaq
    console.log('Contact məlumatları:', form);
  };

  return (
    <section
      id="contact"
      className="bg-[#080d4a] pt-10 sm:pt-14 pb-12 sm:pb-16"
      style={{
        backgroundImage: `linear-gradient(rgba(8,13,74,0.94), rgba(8,13,74,0.94)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div className="max-w-[980px] mx-auto px-4">
        <h2 className="text-center text-[#f7f7f7] font-heading font-bold text-[24px] sm:text-[30px] tracking-wide mb-7">
          Contact us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          {/* Form */}
          <div className="bg-[#0a1145] rounded-lg px-6 sm:px-8 py-8">
            <h3 className="text-[#f7f7f7] font-accent font-semibold text-[16px] mb-5 text-center">
              Enter Your Information
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name and Surname"
                required
                className="w-full h-[44px] bg-[#f6eeee] rounded-full px-5 text-[#323643] text-[13px] outline-none placeholder-[#323643]/60 focus:ring-2 focus:ring-[#26aec4]"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full h-[44px] bg-[#f6eeee] rounded-full px-5 text-[#323643] text-[13px] outline-none placeholder-[#323643]/60 focus:ring-2 focus:ring-[#26aec4]"
              />
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="w-full h-[44px] bg-[#f6eeee] rounded-full px-5 text-[#323643] text-[13px] outline-none focus:ring-2 focus:ring-[#26aec4] cursor-pointer"
              >
                <option value="" disabled hidden>
                  Service you Want
                </option>
                <option>Admission to Universities</option>
                <option>Legalization Process in Poland</option>
                <option>Student / Work / Touristic Visa</option>
                <option>Consultation</option>
              </select>
              <button
                type="submit"
                className="self-center w-[150px] h-[42px] bg-[#26aec4] text-[#080d4a] rounded-full font-accent font-semibold text-[14px] hover:bg-[#3cc3d8] hover:scale-105 active:scale-95 transition-all tracking-wide cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>

          {/* Side info */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-[#f7f7f7]/90 text-[13px] leading-6 max-w-[360px]">
              Enter Your Information to the boxes, and we will contact you shortly. By entering your
              information, you are accepting the terms and condition of our website.
            </p>

            <div className="my-6 flex items-center gap-3 text-[#f7f7f7]/50 text-[13px] font-accent w-full justify-center md:justify-start">
              <span className="h-px w-10 bg-[#f7f7f7]/25" />
              Or
              <span className="h-px w-10 bg-[#f7f7f7]/25" />
            </div>

            <p className="text-[#f7f7f7] font-accent font-medium text-[14px] mb-3">
              Contact Through Whatsapp
            </p>
            <a
              href="https://wa.me/994000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-[44px] px-6 rounded-full bg-[#25D366] text-[#080d4a] font-accent font-semibold text-[14px] hover:bg-[#2ee06f] hover:scale-105 active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 14.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.15-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.8-1.48-1.78-1.65-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.12 3.25 5.15 4.56.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35zM12.05 21.8h-.03a9.7 9.7 0 0 1-4.95-1.35l-.35-.21-3.67.96.98-3.58-.23-.37a9.72 9.72 0 0 1-1.49-5.2c0-5.38 4.38-9.76 9.77-9.76 2.6 0 5.05 1.02 6.9 2.86a9.7 9.7 0 0 1 2.85 6.91c0 5.38-4.38 9.76-9.78 9.76zm8.55-18.33A11.74 11.74 0 0 0 12.05 0C5.46 0 .1 5.35.1 11.92c0 2.1.55 4.16 1.6 5.97L.07 24l6.23-1.63a11.9 11.9 0 0 0 5.75 1.46h.01c6.58 0 11.93-5.35 11.93-11.92 0-3.19-1.24-6.18-3.49-8.44z" />
              </svg>
              +994 00 000 00 00
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}