RSpec.configure do |config|
  config.before(:suite) do
    Recipe.delete_all
    User.delete_all
  end
end
