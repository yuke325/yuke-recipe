FactoryBot.define do
  factory :recipe do
    association :user
    name { "Curry" }
    description { "very very so delicious !!!!" }
  end
end
