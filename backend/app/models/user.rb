class User < ApplicationRecord
  has_many :recipes, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password_hash, presence: true
end
