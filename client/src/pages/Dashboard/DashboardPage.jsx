export default function DashboardPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>Welcome back, John.</h1>
          </div>
          <p>Track profile views, bookings, messages and marketplace sales.</p>
        </div>

        <div className="dashboard-grid">
          <div className="overview-box">
            <span>Profile views</span>
            <strong>2,843</strong>
          </div>
          <div className="overview-box">
            <span>Portfolio views</span>
            <strong>1,204</strong>
          </div>
          <div className="overview-box">
            <span>Messages</span>
            <strong>74</strong>
          </div>
          <div className="overview-box">
            <span>Service requests</span>
            <strong>18</strong>
          </div>
        </div>

        <div className="dashboard-panels">
          <section className="info-panel">
            <h2>Recent activity</h2>
            <ul className="detail-list">
              <li>New message from a Lusaka client</li>
              <li>Two quotes requested for brand photography</li>
              <li>Marketplace order confirmed</li>
            </ul>
          </section>

          <section className="info-panel">
            <h2>Quick actions</h2>
            <ul className="detail-list">
              <li>Update portfolio</li>
              <li>Set availability</li>
              <li>Create a new service</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
