import Button from '../../components/common/Button';

export default function LoginPage() {
  return (
    <div className="page-shell auth-shell">
      <div className="container auth-card">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h1>Login to your dashboard</h1>
          <p>Access your profile, messages, bookings and product listings.</p>
        </div>

        <form className="auth-form">
          <label>
            <span>Email</span>
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>
          <Button type="submit" className="full-width">Login</Button>
        </form>
      </div>
    </div>
  );
}
