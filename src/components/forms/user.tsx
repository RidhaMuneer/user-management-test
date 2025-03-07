"use client"
import type { UserFormProps, ValidationErrors } from "@/types/form.types"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import LoadingSpinner from "../loading"

const UserForm: React.FC<UserFormProps> = ({
  mode,
  initialData = { email: "", name: "", password: "" },
  onSubmit,
  onCancel,
  requestError,
}) => {
  const [email, setEmail] = useState(initialData.email)
  const [name, setName] = useState(initialData.name || "")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    passwordConfirm: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  useEffect(() => {
    if (validateTimeoutRef.current) {
      clearTimeout(validateTimeoutRef.current)
    }

    validateTimeoutRef.current = setTimeout(() => {
      validateForm()
    }, 300)

    return () => {
      if (validateTimeoutRef.current) {
        clearTimeout(validateTimeoutRef.current)
      }
    }
  }, [email, name, password, passwordConfirm, mode])

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    })
  }, [password])

  const validateForm = () => {
    const newErrors: ValidationErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address"
    }

    if (!name) {
      newErrors.name = "Name is required"
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (mode === "add" || password) {
      if (!password) {
        newErrors.password = "Password is required"
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) {
        newErrors.password = "Password must include uppercase, lowercase, number and special character"
      }

      if (!passwordConfirm) {
        newErrors.passwordConfirm = "Please confirm your password"
      } else if (password !== passwordConfirm) {
        newErrors.passwordConfirm = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({
      name: true,
      email: true,
      password: true,
      passwordConfirm: true,
    })

    const isValid = validateForm()

    if (isValid) {
      setIsSubmitting(true)

      try {
        await onSubmit({ email, name, password, role_id: "2" })
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const getFieldErrorClass = (field: keyof ValidationErrors) => {
    return touched[field as keyof typeof touched] && errors[field] ? "input-error" : ""
  }

  return (
    <div className="user-form-container">
      <h2 className="form-title">{mode === "add" ? "Add New User" : "Update User"}</h2>

      <form className="user-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={`form-input ${getFieldErrorClass("name")}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Enter your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            required
          />
          {touched.name && errors.name && (
            <div className="error-message" id="name-error" role="alert">
              {errors.name}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${getFieldErrorClass("email")}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="Enter email address"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          {touched.email && errors.email && (
            <div className="error-message" id="email-error" role="alert">
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password {mode === "add" && <span className="required">*</span>}
          </label>
          <div className="password-input-container">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`form-input ${getFieldErrorClass("password")}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder={mode === "update" ? "Leave blank to keep current password" : "Enter password"}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : "password-requirements"}
              required={mode === "add"}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {touched.password && errors.password && (
            <div className="error-message" id="password-error" role="alert">
              {errors.password}
            </div>
          )}

          {(mode === "add" || password) && (
            <div className="password-requirements" id="password-requirements">
              <p className="requirements-title">Password must contain:</p>
              <ul className="requirements-list">
                <li className={passwordStrength.length ? "met" : ""}>At least 8 characters</li>
                <li className={passwordStrength.uppercase ? "met" : ""}>At least one uppercase letter (A-Z)</li>
                <li className={passwordStrength.lowercase ? "met" : ""}>At least one lowercase letter (a-z)</li>
                <li className={passwordStrength.number ? "met" : ""}>At least one number (0-9)</li>
                <li className={passwordStrength.special ? "met" : ""}>At least one special character (!@#$%^&*)</li>
              </ul>
            </div>
          )}
        </div>

        {(mode === "add" || password) && (
          <div className="form-group">
            <label htmlFor="passwordConfirm" className="form-label">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                id="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                className={`form-input ${getFieldErrorClass("passwordConfirm")}`}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                onBlur={() => handleBlur("passwordConfirm")}
                placeholder="Confirm your password"
                aria-invalid={!!errors.passwordConfirm}
                aria-describedby={errors.passwordConfirm ? "passwordConfirm-error" : undefined}
                required={mode === "add" || !!password}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                aria-label={showPasswordConfirm ? "Hide password confirmation" : "Show password confirmation"}
              >
                {showPasswordConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {touched.passwordConfirm && errors.passwordConfirm && (
              <div className="error-message" id="passwordConfirm-error" role="alert">
                {errors.passwordConfirm}
              </div>
            )}
          </div>
        )}

        {requestError && <div className="error-message">{requestError.message}</div>}

        <div className="form-actions">
          <button type="button" className="button button-secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner size="small" /> : mode === "add" ? "Add User" : "Update User"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm

