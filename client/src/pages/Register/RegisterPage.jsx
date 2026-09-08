import Button from '../../components/common/Button';

export default function RegisterPage() {
  return (
    <div className="page-shell auth-shell">
      <div className="container auth-card">
        <div>
          <span className="eyebrow">Join ZAM TALENT TOP</span>
          <h1>Create a professional profile.</h1>
          <p>Showcase your work, get discovered and grow your freelance or business presence.</p>
        </div>

        <form className="auth-form">
          <label>
            <span>Full name</span>
            <input type="text" placeholder="Your full name" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            <span>Professional category</span>
            <select defaultValue="Photographer">
              <option>Photographer</option>
              <option>Music Producer</option>
              <option>Web Developer</option>
              <option>Graphic Designer</option>
              <option>Event Planner</option>
            </select>
          </label>
          <Button type="submit" className="full-width">Create account</Button>
        </form>
      </div>
    </div>
  );
}
