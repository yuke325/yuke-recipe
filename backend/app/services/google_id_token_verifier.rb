class GoogleIdTokenVerifier
  class VerificationError < StandardError; end

  def self.call(id_token)
    new(id_token).call
  end

  def initialize(id_token, client_id: ENV.fetch("GOOGLE_CLIENT_ID"))
    @id_token = id_token
    @client_id = client_id
  end

  def call
    raise VerificationError, "Missing Google ID token" if id_token.blank?

    payload = Google::Auth::IDTokens.verify_oidc(id_token, aud: client_id)

    raise VerificationError, "Google ID token is missing email" if payload["email"].blank?
    raise VerificationError, "Google account email is not verified" unless email_verified?(payload)
    raise VerificationError, "Google ID token is missing sub" if payload["sub"].blank?
    raise VerificationError, "Google account is not in the allowed domain" unless allowed_domain?(payload)

    payload
  rescue VerificationError
    raise
  rescue StandardError => e
    raise VerificationError, "Invalid Google ID token: #{e.message}"
  end

  private

  attr_reader :id_token, :client_id

  def email_verified?(payload)
    payload["email_verified"] == true || payload["email_verified"] == "true"
  end

  def allowed_domain?(payload)
    allowed_domain = ENV["ALLOWED_DOMAIN"]
    return true if allowed_domain.blank?

    payload["email"].to_s.end_with?("@#{allowed_domain}")
  end
end
