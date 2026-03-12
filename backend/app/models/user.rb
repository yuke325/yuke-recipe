class User < ApplicationRecord
  has_many :recipes, dependent: :destroy

  validates :name, presence: true, length: { maximum: 255 }
  validates :email, presence: true, uniqueness: true, length: { maximum: 255 }
  validates :password_hash, presence: true
end
