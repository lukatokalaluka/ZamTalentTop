import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { discoverTalent } from '../../data/mockData';

export default function BookingPage() {
  const { slug } = useParams();
  const talent = useMemo(
    () => discoverTalent.find((person) => person.slug === slug) || discoverTalent[0],
    [slug]
  );

  const initialService = talent.services?.[0]?.name || 'Custom project';
  const [selectedService, setSelectedService] = useState(initialService);
  const [projectName, setProjectName] = useState(`${talent.name} project`);
  const [budget, setBudget] = useState(talent.price || 'K3,500');
  const [projectDate, setProjectDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const summary = useMemo(() => {
    const service = talent.services?.find((item) => item.name === selectedService) || {
      name: selectedService,
      price: talent.price,
    };

    return {
      serviceName: service.name,
      price: service.price,
    };
  }, [selectedService, talent]);

  const handleSubmit = (event) => {
    event.preventDefault();
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
