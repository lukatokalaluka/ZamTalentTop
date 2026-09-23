import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { createBooking, getProfile } from '../../services/api';

export default function BookingPage({ onShowToast }) {
  const { slug } = useParams();
  const [remoteTalent, setRemoteTalent] = useState(null);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [projectName, setProjectName] = useState('');
  const [budget, setBudget] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => { getProfile(slug).then(({ profile }) => setRemoteTalent(profile)).catch((requestError) => setError(requestError.message)); }, [slug]);
  const talent = remoteTalent;

  useEffect(() => {
    if (!talent) return;
    setSelectedService(talent.services?.[0]?.name || 'Custom project');
    setProjectName(`${talent.name} project`);
    setBudget(talent.price || '');
  }, [talent]);

  const summary = useMemo(() => {
    const service = talent?.services?.find((item) => item.name === selectedService) || {
      name: selectedService,
      price: talent?.price || '',
    };

    return {
      serviceName: service.name,
      price: service.price,
    };
  }, [selectedService, talent]);

  if (!talent) return <div className="page-shell"><div className="container empty-state"><p>{error || 'Loading profile...'}</p></div></div>;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await createBooking({ seller_id: talent.user_id, service_name: selectedService, date: projectDate, time: '09:00', duration_hours: 1, total_minor: Number.parseInt(budget.replace(/\D/g, ''), 10) * 100 });
      onShowToast?.('Your booking request was sent.');
    } catch (requestError) {
      setError(requestError.message);
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="page-shell booking-page">
      <div className="container">
        <div className="booking-header">
          <div>
            <span className="eyebrow">Booking request</span>
            <h1>Book with {talent.name}</h1>
          </div>
          <Link to={`/talent/${talent.slug}`} className="link-text">
            View profile
          </Link>
        </div>

        <div className="booking-layout">
          <form className="booking-form info-panel" onSubmit={handleSubmit}>
            <div className="booking-form__grid">
              <label>
                <span>Project name</span>
                <input
                  type="text"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="Brand launch content"
                />
              </label>

              <label>
                <span>Service</span>
                <select
                  value={selectedService}
                  onChange={(event) => setSelectedService(event.target.value)}
                >
                  {(talent.services || []).map((service) => (
                    <option key={service.name} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Budget range</span>
                <input
                  type="text"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  placeholder="K5,000"
                />
              </label>

              <label>
                <span>Preferred start date</span>
                <input
                  type="date"
                  value={projectDate}
                  onChange={(event) => setProjectDate(event.target.value)}
                />
              </label>
            </div>

            <label>
              <span>Project details</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows="6"
                placeholder="Tell us about your goals, timeline, deliverables, and the audience you want to reach."
              />
            </label>

            <div className="booking-form__actions">
              <Button type="submit">Send booking request</Button>
              <Button variant="secondary" type="button" onClick={() => setIsSubmitted(false)}>
                Save draft
              </Button>
            </div>

            {isSubmitted ? (
              <p className="booking-success">
                Your request has been prepared for {talent.name}. They will reply within 1–2 business hours.
              </p>
            ) : null}
            {error ? <p role="alert" className="form-error">{error}</p> : null}
          </form>

          <aside className="booking-summary info-panel">
            <div className="booking-summary__profile">
              <img src={talent.image} alt={talent.name} />
              <div>
                <span className="eyebrow">Selected talent</span>
                <h2>{talent.name}</h2>
                <p>{talent.title}</p>
              </div>
            </div>

            <div className="booking-summary__meta">
              <div>
                <span>Location</span>
                <strong>{talent.location}</strong>
              </div>
              <div>
                <span>Response time</span>
                <strong>{talent.stats?.response || '1h'}</strong>
              </div>
            </div>

            <div className="booking-summary__line">
              <span>{summary.serviceName}</span>
              <strong>{summary.price}</strong>
            </div>
            <div className="booking-summary__line">
              <span>Consultation</span>
              <strong>K1,200</strong>
            </div>
            <div className="booking-summary__line booking-summary__total">
              <span>Estimated total</span>
              <strong>{summary.price}</strong>
            </div>

            <p className="muted-copy">
              Secure payment and milestone tracking are available after the request is reviewed.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
