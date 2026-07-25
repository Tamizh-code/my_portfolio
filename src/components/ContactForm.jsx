import React, { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending message...');

    try {
      const response = await fetch('https://formsubmit.co/ajax/mr.tamizh77@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`,
          _captcha: 'false' // Disables captcha checks for smooth AJAX submission
        })
      });

      const data = await response.json();

      if (response.ok && data.success === 'true') {
        setStatus('Message sent! Please check your email to activate FormSubmit (only needed for the first submission).');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setStatus('Failed to send message. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="contactForm" onSubmit={handleSubmit}>
      <input
        id="name"
        type="text"
        placeholder="Your name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSubmitting}
      />
      <input
        id="email"
        type="email"
        placeholder="you@domain.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
      />
      <textarea
        id="message"
        rows="6"
        placeholder="Tell me about your project"
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isSubmitting}
      />
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send message'}
        </button>
        <div id="formStatus" className="muted small" style={{ fontWeight: 600 }}>
          {status}
        </div>
      </div>
    </form>
  );
}
