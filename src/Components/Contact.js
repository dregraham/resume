
import React from "react";
import { useForm, ValidationError } from '@formspree/react';


const Contact = (props) => {
  const [state, handleSubmit] = useForm("mzzkljgg");
  const message = props.data?.contactmessage;


  const [showPopup, setShowPopup] = React.useState(false);
  React.useEffect(() => {
    if (state.succeeded) {
      setShowPopup(true);
    }
  }, [state.succeeded]);

  return (
    <section id="contact">
      <div className="row section-head">
        <h1>Get In Touch</h1>
      </div>
      <div className="row section-head">
        <p className="lead">{message}</p>
      </div>
      <div className="row">
        <div className="eight columns">
          <form onSubmit={handleSubmit} id="contactForm" name="contactForm">
            <fieldset>
              <div>
                <label htmlFor="contactName">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  size="35"
                  id="contactName"
                  name="contactName"
                  required
                />
                <ValidationError prefix="Name" field="contactName" errors={state.errors} />
              </div>
              <div>
                <label htmlFor="contactEmail">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  size="35"
                  id="contactEmail"
                  name="contactEmail"
                  required
                />
                <ValidationError prefix="Email" field="contactEmail" errors={state.errors} />
              </div>
              <div>
                <label htmlFor="contactSubject">Subject</label>
                <input
                  type="text"
                  size="35"
                  id="contactSubject"
                  name="contactSubject"
                />
                <ValidationError prefix="Subject" field="contactSubject" errors={state.errors} />
              </div>
              <div>
                <label htmlFor="contactMessage">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  cols="50"
                  rows="15"
                  id="contactMessage"
                  name="contactMessage"
                  required
                ></textarea>
                <ValidationError prefix="Message" field="contactMessage" errors={state.errors} />
              </div>
              <div>
                <button className="submit" type="submit" disabled={state.submitting}>
                  {state.submitting ? (
                    <span>
                      <img alt="Loading..." src="images/loader.gif" style={{ height: "20px" }} /> Sending...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </fieldset>
          </form>
          {state.errors && state.errors.length > 0 && (
            <div id="message-warning" style={{ color: "red" }}>
              {state.errors.map((err, idx) => (
                <div key={idx}>{err.message}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            textAlign: "center"
          }}>
            <h2>Thanks for your message!</h2>
            <p>I will reach back out as soon as possible.</p>
            <button onClick={() => window.location.href = "/"} style={{ marginTop: "1rem" }}>OK</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
