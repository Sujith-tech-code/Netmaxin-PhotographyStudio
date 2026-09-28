import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle, Calendar, Mail, User, MessageSquare, Camera } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Stamp from '../components/Stamp';
import { submitBooking } from '../services/api';
import './Contact.css';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const sessionQuery = searchParams.get('session');

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    sessionType: 'portrait',
    preferredDate: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);
  const [serverError, setServerError] = useState('');

  // Pre-select session type from URL if present
  useEffect(() => {
    if (sessionQuery) {
      const validTypes = ['portrait', 'wedding', 'commercial', 'still-life', 'editorial', 'other'];
      if (validTypes.includes(sessionQuery.toLowerCase())) {
        setFormData((prev) => ({ ...prev, sessionType: sessionQuery.toLowerCase() }));
      }
    }
  }, [sessionQuery]);

  const validate = () => {
    const errs = {};

    if (!formData.clientName.trim()) {
      errs.clientName = 'Please provide your full name or company name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.clientEmail.trim()) {
      errs.clientEmail = 'Please provide an email address for correspondence.';
    } else if (!emailRegex.test(formData.clientEmail.trim())) {
      errs.clientEmail = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!formData.sessionType) {
      errs.sessionType = 'Please select an inquiry or session type.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please tell us a little about your project or sitting goals.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide a few more details (minimum 10 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await submitBooking(formData);
      if (result.success) {
        setIsSubmitted(true);
        setSubmissionReceipt(result.data || formData);
      } else {
        setServerError(result.message || 'Unable to submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setServerError('An unexpected error occurred. Please contact the studio directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      sessionType: 'portrait',
      preferredDate: '',
      message: ''
    });
    setErrors({});
    setIsSubmitted(false);
    setSubmissionReceipt(null);
  };

  return (
    <div className="contact-page">
      <PageHeader
        label="Inquiries &amp; Ledger Reservations"
        title="Book a Sitting"
        subtitle="Let us know what you would like to photograph. We answer all inquiries within one business day."
      />

      <div className="container container-narrow">
        {/* Darkroom Notice Banner */}
        <div className="contact-ledger-banner">
          <div className="ledger-banner-header">
            <span className="typewriter-label">STUDIO LEDGER AVAILABILITY</span>
            <Stamp variant="rust">6 SITTINGS / MONTH</Stamp>
          </div>
          <p>
            Because every frame is exposed on analog emulsion and hand-scanned in our darkroom, we strictly limit commissions. Early booking is advised.
          </p>
        </div>

        {/* Confirmation Receipt State */}
        {isSubmitted ? (
          <div className="confirmation-card">
            <div className="confirmation-stamp">
              <Stamp variant="olive">ENTRY RECORDED IN STUDIO LEDGER</Stamp>
            </div>

            <div className="confirmation-icon">
              <CheckCircle size={48} />
            </div>

            <h2>Thank You, {submissionReceipt?.clientName || 'Friend'}.</h2>
            <p className="lead">
              Your inquiry has been safely received. We will review our darkroom calendar and send a thoughtful reply to <strong>{formData.clientEmail}</strong> within 24 hours.
            </p>

            {/* Typewriter Receipt Box */}
            <div className="receipt-box">
              <div className="receipt-header">
                <span>APERTURE &amp; ASH • PROOF OF INQUIRY</span>
                <span>ENTRY REF: {submissionReceipt?._id || `AA-${Date.now().toString().slice(-6)}`}</span>
              </div>
              <div className="receipt-rows">
                <div className="receipt-row">
                  <span className="receipt-label">CLIENT NAME:</span>
                  <span className="receipt-value">{formData.clientName}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">COMMISSION TYPE:</span>
                  <span className="receipt-value text-uppercase">{formData.sessionType}</span>
                </div>
                {formData.preferredDate && (
                  <div className="receipt-row">
                    <span className="receipt-label">TIMEFRAME / DATE:</span>
                    <span className="receipt-value">{formData.preferredDate}</span>
                  </div>
                )}
                <div className="receipt-row">
                  <span className="receipt-label">STATUS:</span>
                  <span className="receipt-value text-accent">PENDING STUDIO REVIEW</span>
                </div>
              </div>
            </div>

            <div className="confirmation-actions">
              <button onClick={resetForm} className="btn btn-secondary">
                Submit Another Inquiry
              </button>
              <Link to="/gallery" className="btn btn-primary">
                Explore Darkroom Gallery
              </Link>
            </div>
          </div>
        ) : (
          /* Booking Inquiry Form */
          <div className="contact-form-card">
            <form onSubmit={handleSubmit} noValidate className="booking-form">
              {serverError && (
                <div className="form-server-error">
                  <AlertCircle size={20} />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Client Name */}
              <div className="form-group">
                <label htmlFor="clientName" className="form-label">
                  <User size={15} className="label-icon" />
                  <span>Your Name / Organization <span className="required-star">*</span></span>
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="e.g. Thomas Vance or Vance Studio"
                  className={`form-input ${errors.clientName ? 'input-error' : ''}`}
                />
                {errors.clientName && <span className="form-error">{errors.clientName}</span>}
              </div>

              {/* Client Email */}
              <div className="form-group">
                <label htmlFor="clientEmail" className="form-label">
                  <Mail size={15} className="label-icon" />
                  <span>Email Address <span className="required-star">*</span></span>
                </label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className={`form-input ${errors.clientEmail ? 'input-error' : ''}`}
                />
                {errors.clientEmail && <span className="form-error">{errors.clientEmail}</span>}
              </div>

              {/* Two Column Row: Session Type & Preferred Date */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sessionType" className="form-label">
                    <Camera size={15} className="label-icon" />
                    <span>Session Category <span className="required-star">*</span></span>
                  </label>
                  <select
                    id="sessionType"
                    name="sessionType"
                    value={formData.sessionType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="portrait">Portrait Sitting (₹5,500)</option>
                    <option value="wedding">Wedding &amp; Union (₹65,000)</option>
                    <option value="commercial">Product / Commercial (₹450/item)</option>
                    <option value="still-life">Still Life / Fine Art Study</option>
                    <option value="editorial">Editorial / Publication</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="preferredDate" className="form-label">
                    <Calendar size={15} className="label-icon" />
                    <span>Preferred Date / Season</span>
                  </label>
                  <input
                    type="text"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    placeholder="e.g. October 2026 or Late Autumn"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  <MessageSquare size={15} className="label-icon" />
                  <span>Tell Us About Your Project <span className="required-star">*</span></span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share details about the desired atmosphere, location, number of subjects, or any special requests..."
                  className={`form-textarea ${errors.message ? 'input-error' : ''}`}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              {/* Submit Button */}
              <div className="form-submit-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-submit"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Transcribing to Ledger...' : 'Send Sitting Inquiry'}</span>
                </button>
                <span className="submit-note">
                  No payment required today. We will discuss dates and film stock options upon receipt.
                </span>
              </div>
            </form>
          </div>
        )}

        {/* Direct Studio Contact Alternatives */}
        <div className="direct-contact-section">
          <div className="direct-contact-grid">
            <div className="direct-contact-col">
              <h5>Direct Studio Post</h5>
              <p>inquiries@apertureandash.studio</p>
            </div>
            <div className="direct-contact-col">
              <h5>Studio Location</h5>
              <p>Loft 4B, The Old Foundry Works, Mill District</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
