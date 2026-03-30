class User < ApplicationRecord
  has_many :recipes, dependent: :destroy

  validates :google_sub, presence: true, uniqueness: true, length: { maximum: 255 }
  validates :name, presence: true, length: { maximum: 255 }
  validates :email, presence: true, uniqueness: true, length: { maximum: 255 }
end
