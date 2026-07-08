import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';
import Button from '../components/ui/Button';
import Dialog from '../components/ui/Dialog';

export default function Contact() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('IDLE');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('open') === 'true') {
      setIsOpen(true);
    }
  }, [location]);

  const [formData, setFormData] = useState({
    userName: '',
    company: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('TRANSMITTING');

    try {
      await emailjs.send(
        'service_13y9211',
        'template_lztcq5d',
        formData,
        'ambDOfaJJ-98n0jEy'
      );
      setStatus('SUCCESS');
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStatus('IDLE');
      setFormData({ userName: '', company: '', email: '', phoneNumber: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 min-h-[90vh] flex items-center relative z-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] gap-x-16 gap-y-8 lg:gap-y-12 items-start w-full">
        {/* Heading — top on both mobile and desktop */}
        <div className="lg:col-span-5 lg:row-start-1 order-1">
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-black dark:text-white mb-8">
            Let's Connect
          </h1>
          <p className="text-xl md:text-2xl text-black dark:text-neutral-300 font-light leading-relaxed">
            We'd love to hear from you. Whether you have questions, feedback, or partnership ideas—our team is here to help. Reach out and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact info — below form on mobile, bottom-left on desktop */}
        <div className="lg:col-span-5 lg:row-start-2 order-3 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#14b5bc] flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-550 uppercase tracking-wider">Email Us</p>
                <a href="mailto:hello@go100days.com" className="text-lg font-medium text-black dark:text-white hover:text-[#14b5bc] dark:hover:text-[#14b5bc] transition-colors">
                  hello@go100days.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#14b5bc] flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-550 uppercase tracking-wider">Call Us</p>
                <a href="tel:+919643601472" className="text-lg font-medium text-black dark:text-white hover:text-[#14b5bc] dark:hover:text-[#14b5bc] transition-colors">
                  +91-9643601472
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#14b5bc] flex items-center justify-center text-white flex-shrink-0 shadow-lg mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-550 uppercase tracking-wider">Office</p>
                <a
                  href="https://maps.app.goo.gl/NyHFpD3vWrvgn6Xz8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium text-neutral-700 dark:text-neutral-300 hover:text-[#14b5bc] dark:hover:text-[#14b5bc] transition-colors"
                >
                  5th Floor, Vipul Plaza, Suncity,<br />Sector 54, Gurugram, 122011
                </a>
              </div>
            </div>
        </div>

        {/* Form — second on mobile, right column spanning both rows on desktop */}
        <div className="lg:col-span-7 lg:row-span-2 lg:row-start-1 w-full order-2">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-3xl p-8 sm:p-10">
            <h2 className="text-3xl font-bold mb-2 text-black dark:text-white">Get in Touch with Us</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
              Share your questions, thoughts, or ideas—we're here to help and ready to listen.
            </p>

            {status === 'SUCCESS' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#14b5bc] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">Submission Successful</h3>
                <p className="text-neutral-500 dark:text-neutral-400">Our strategic team will contact you shortly.</p>
                <button
                  onClick={() => setStatus('IDLE')}
                  className="mt-8 px-6 py-2 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black rounded-lg font-semibold transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500 dark:text-neutral-400">Name</label>
                    <input
                      type="text"
                      name="userName"
                      required
                      value={formData.userName}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-[#14b5bc] dark:focus:border-[#14b5bc] transition-colors text-black dark:text-white placeholder-neutral-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500 dark:text-neutral-400">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-[#14b5bc] dark:focus:border-[#14b5bc] transition-colors text-black dark:text-white placeholder-neutral-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500 dark:text-neutral-400">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-[#14b5bc] dark:focus:border-[#14b5bc] transition-colors text-black dark:text-white placeholder-neutral-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500 dark:text-neutral-400">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-[#14b5bc] dark:focus:border-[#14b5bc] transition-colors text-black dark:text-white placeholder-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500 dark:text-neutral-400">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-[#14b5bc] dark:focus:border-[#14b5bc] transition-colors text-black dark:text-white placeholder-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase mb-2 text-neutral-500 dark:text-neutral-400">Messages</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-200 dark:border-neutral-800 px-4 py-3 rounded-xl focus:outline-none focus:border-[#14b5bc] dark:focus:border-[#14b5bc] transition-colors text-black dark:text-white placeholder-neutral-400 resize-none"
                  />
                </div>

                {status === 'ERROR' && (
                  <p className="text-red-500 text-sm">Submission failed. Please check credentials.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'TRANSMITTING'}
                  className={`w-full py-4 px-8 rounded-xl font-bold transition-all shadow-md ${status === 'TRANSMITTING'
                      ? 'bg-neutral-400 cursor-not-allowed text-white'
                      : 'bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black'
                    }`}
                >
                  {status === 'TRANSMITTING' ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Dialog isOpen={isOpen} onClose={closeModal}>
        {status === 'SUCCESS' ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#14b5bc] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black mb-4">Transmission Successful</h2>
            <p className="text-neutral-400">Our strategic team will contact you shortly.</p>
            <Button onClick={closeModal} className="mt-8">Close</Button>
          </div>
        ) : (
          <div className="py-4">
            <h2 className="text-3xl font-black mb-8">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-400">Name</label>
                <input
                  type="text"
                  name="userName"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-400">Phone</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-400">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-400">Message</label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
                />
              </div>

              {status === 'ERROR' && (
                <p className="text-red-500 text-sm">Transmission failed. Please check credentials.</p>
              )}

              <Button
                type="submit"
                className={`w-full mt-4 ${status === 'TRANSMITTING' ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => { }}
              >
                {status === 'TRANSMITTING' ? 'Transmitting...' : 'Submit Transmission'}
              </Button>
            </form>
          </div>
        )}
      </Dialog>
    </div>
  );
}
