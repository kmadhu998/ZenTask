import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import "./Login.css";

function GoogleIcon() {
  return (
    <svg
      className="google-icon"
      viewBox="0 0 48 48"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />

      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />

      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.96 13.96 0 0 1 10.94 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A21.98 21.98 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />

      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function FocusMark() {
  return (
    <svg
      className="brand-mark"
      viewBox="0 0 32 32"
      width="30"
      height="30"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.5"
      />

      <circle
        cx="16"
        cy="16"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Enter your email address.";
    }

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pattern.test(value)) {
      return "Enter a valid email address.";
    }

    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Enter your password.";
    }

    if (value.length < 8) {
      return "Password must be at least 8 characters.";
    }

    return "";
  };

  const handleBlur = (field) => {
    setTouched((previous) => ({
      ...previous,
      [field]: true,
    }));

    if (field === "email") {
      setErrors((previous) => ({
        ...previous,
        email: validateEmail(email),
      }));
    }

    if (field === "password") {
      setErrors((previous) => ({
        ...previous,
        password: validatePassword(password),
      }));
    }
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  setErrors({
    email: emailError,
    password: passwordError,
  });

  setTouched({
    email: true,
    password: true,
  });

  if (!emailError && !passwordError) {
  const userName = email
    .split("@")[0]
    .replace(/[0-9]/g, "")
    .replace(/[._-]/g, " ")
    .trim();

  localStorage.setItem("zentask_user_email", email);

  localStorage.setItem(
    "zentask_user_name",
    userName
      .split(" ")
      .filter(Boolean)
      .map(
        (name) =>
          name.charAt(0).toUpperCase() +
          name.slice(1).toLowerCase()
      )
      .join(" ")
  );

  navigate("/dashboard");
}
};

  return (
    <div className="login-page">
      <section className="login-brand">
        <div className="login-brand-content">
          <div className="brand-lockup">
            <FocusMark />
            <span className="brand-name">ZenTask</span>
          </div>

          <h1 className="brand-heading">
            Clarity for your workday.
          </h1>

          <p className="brand-subtitle">
            ZenTask reads your workload and focus patterns, then quietly
            reorders your day around what actually matters.
          </p>

          <p className="brand-footnote">
            Focus Intelligence learns from how you work, not just what
            you've listed.
          </p>
        </div>

        <svg
          className="brand-rings"
          viewBox="0 0 420 420"
          aria-hidden="true"
        >
          <circle
            cx="340"
            cy="340"
            r="60"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1"
            opacity="0.35"
          />

          <circle
            cx="340"
            cy="340"
            r="110"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1"
            opacity="0.22"
          />

          <circle
            cx="340"
            cy="340"
            r="160"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1"
            opacity="0.12"
          />
        </svg>
      </section>

      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="mobile-brand-lockup">
            <FocusMark />
            <span className="brand-name">ZenTask</span>
          </div>

          <div className="login-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to your workspace.</p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-field">
              <label htmlFor="email">
                Email address
              </label>

              <div
                className={`input-wrapper ${
                  touched.email && errors.email
                    ? "input-error"
                    : ""
                }`}
              >
                <Mail
                  className="input-icon"
                  size={18}
                  strokeWidth={1.75}
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  onBlur={() => handleBlur("email")}
                  aria-invalid={Boolean(
                    touched.email && errors.email
                  )}
                  aria-describedby="email-error"
                />
              </div>

              {touched.email && errors.email && (
                <p
                  className="field-error"
                  id="email-error"
                >
                  <AlertCircle
                    size={14}
                    strokeWidth={2}
                  />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password">
                Password
              </label>

              <div
                className={`input-wrapper ${
                  touched.password && errors.password
                    ? "input-error"
                    : ""
                }`}
              >
                <Lock
                  className="input-icon"
                  size={18}
                  strokeWidth={1.75}
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  onBlur={() => handleBlur("password")}
                  aria-invalid={Boolean(
                    touched.password &&
                      errors.password
                  )}
                  aria-describedby="password-error"
                />

                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      strokeWidth={1.75}
                    />
                  ) : (
                    <Eye
                      size={18}
                      strokeWidth={1.75}
                    />
                  )}
                </button>
              </div>

              {touched.password &&
                errors.password && (
                  <p
                    className="field-error"
                    id="password-error"
                  >
                    <AlertCircle
                      size={14}
                      strokeWidth={2}
                    />
                    {errors.password}
                  </p>
                )}
            </div>

            <div className="form-options">
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />

                <span className="checkbox-box">
                  {rememberMe && (
                    <Check
                      size={13}
                      strokeWidth={3}
                    />
                  )}
                </span>

                Remember me for 30 days
              </label>

              <button
                type="button"
                className="link-button forgot-link"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="submit-button"
            >
              Log in

              <ArrowRight
                size={17}
                strokeWidth={2}
              />
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <button
              type="button"
              className="google-button"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <p className="signup-line">
            Don&apos;t have an account?{" "}

            <button
              type="button"
              className="link-button"
            >
              Create one
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}