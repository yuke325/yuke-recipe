class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from GoogleIdTokenVerifier::VerificationError, with: :render_unauthorized

  private

  def authenticate_user!
    return if current_user.present?

    render_unauthorized
  end

  def current_identity
    authenticate_with_http_token do |token|
      GoogleIdTokenVerifier.call(token)
    end
  end

  def current_user
    return @current_user if defined?(@current_user)

    identity = current_identity
    @current_user = identity.present? ? find_or_create_user_from_identity!(identity) : nil
  end

  def render_not_found(_exception)
    render json: {
      errors: [
        { code: "not_found", message: "Resource not found" }
      ]
    }, status: :not_found
  end

  def render_unprocessable_entity(exception)
    render json: {
      errors: exception.record.errors.full_messages.map do |message|
        { code: "unprocessable_entity", message: message }
      end
    }, status: :unprocessable_entity
  end

  def render_unauthorized(_exception = nil)
    render json: {
      errors: [
        { code: "unauthorized", message: "Authentication required" }
      ]
    }, status: :unauthorized
  end

  def find_or_create_user_from_identity!(identity)
    user = User.find_by(google_sub: identity["sub"]) || User.find_by(email: identity["email"]) || User.new

    user.google_sub = identity["sub"]
    user.email = identity["email"]
    user.name = identity["name"].presence || identity["email"]
    user.save! if user.new_record? || user.changed?
    user
  end
end
