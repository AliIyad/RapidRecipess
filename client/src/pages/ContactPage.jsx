import React, { useState } from "react";
import "../CSS/ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    // Implement actual form submission logic here
  };

  return (
    <div className='contact-page'>
      <section className='contact-header'>
        <h1>Contact Us</h1>
      </section>

      <section className='contact-form'>
        <h2>We'd love to hear from you!</h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            placeholder='Your Name'
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type='email'
            name='email'
            placeholder='Your Email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name='message'
            placeholder='Your Message'
            value={formData.message}
            onChange={handleChange}
            required
            rows='5'></textarea>
          <button type='submit'>Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default ContactPage;
