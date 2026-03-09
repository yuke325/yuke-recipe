 FactoryBot.define do
   factory :user do
     name { "test user" }
     sequence(:email) { |n| "user#{n}@example.com" }
     password_hash { "dummy_hash" }
   end
 end
