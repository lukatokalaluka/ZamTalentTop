import Button from '../../components/common/Button';

const stats = [
  { label: 'Profile views', value: '2,843', trend: '+18%' },
  { label: 'Portfolio views', value: '1,204', trend: '+11%' },
  { label: 'Messages', value: '74', trend: '+9%' },
  { label: 'Service requests', value: '18', trend: '+5%' },
];

const activity = [
  'New inquiry from Lusaka for a brand shoot package.',
  'Wedding photography quote accepted and deposit received.',
  'Marketplace listing received 12 new saves this week.',
  'Portfolio review scheduled with a repeat client tomorrow.',
];

const bookings = [
  { title: 'Brand portrait session', date: 'Wed, 12 Sep', time: '10:00 AM', amount: 'K2,600' },
  { title: 'Corporate event coverage', date: 'Fri, 14 Sep', time: '3:30 PM', amount: 'K4,800' },
  { title: 'Studio retouching package', date: 'Mon, 17 Sep', time: '9:00 AM', amount: 'K1,900' },
];

const trustSignals = [
  { title: 'Identity verification', status: 'Verified', tone: 'good' },
  { title: 'Payment protection', status: 'Enabled', tone: 'good' },
  { title: 'Client review score', status: '4.9/5', tone: 'good' },
  { title: 'Payout schedule', status: 'Weekly', tone: 'neutral' },
];

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header dashboard-header">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>Welcome back, John.</h1>
          </div>
          <div className="dashboard-actions">
            <Button variant="secondary">Update profile</Button>
            <Button>Add service</Button>
          </div>
        </div>

        <div className="dashboard-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="overview-box">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.trend} this month</small>
            </div>
          ))}
        </div>

        <div className="dashboard-panels">
          <section className="info-panel">
            <h2>Recent activity</h2>
            <ul className="activity-list">
              {activity.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="info-panel">
            <h2>Quick actions</h2>
            <div className="quick-actions">
              <span className="action-chip">Update portfolio</span>
              <span className="action-chip">Set availability</span>
              <span className="action-chip">Create listing</span>
              <span className="action-chip">Review messages</span>
            </div>
          </section>
        </div>

        <section className="info-panel bookings-panel">
          <div className="panel-headline">
            <h2>Upcoming bookings</h2>
            <a href="#" className="link-text">View all</a>
          </div>
          <div className="booking-list">
            {bookings.map((booking) => (
              <div key={booking.title} className="booking-card">
                <div>
                  <h3>{booking.title}</h3>
                  <p>{booking.date} · {booking.time}</p>
                </div>
                <strong>{booking.amount}</strong>
              </div>
            ))}
          </div>
        </section>

        <div className="dashboard-panels dashboard-panels--bottom">
          <section className="info-panel">
            <h2>Trust & safety</h2>
            <div className="trust-list">
              {trustSignals.map((signal) => (
                <div key={signal.title} className="trust-item">
                  <div>
                    <strong>{signal.title}</strong>
                  </div>
                  <span className={`trust-status trust-status--${signal.tone}`}>{signal.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="info-panel">
            <h2>Seller essentials</h2>
            <ul className="detail-list">
              <li>Completed 12 client projects this quarter</li>
              <li>Average response time: under 1 hour</li>
              <li>Profile conversion rate is trending upward</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
