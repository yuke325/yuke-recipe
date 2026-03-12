require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'バリデーション' do
    it '有効な属性をもつ場合は有効であること' do
      user = build(:user)

      expect(user).to be_valid
    end

    it 'name が nil の場合は無効であること' do
      user = build(:user, name: nil)

      expect(user).not_to be_valid
      expect(user.errors[:name]).to include("can't be blank")
    end

    it 'name が空文字の場合は無効であること' do
      user = build(:user, name: '')

      expect(user).not_to be_valid
      expect(user.errors[:name]).to include("can't be blank")
    end

    it 'email が nil の場合は無効であること' do
      user = build(:user, email: nil)

      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it 'email が空文字の場合は無効であること' do
      user = build(:user, email: '')

      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it 'password_hash が nil の場合は無効であること' do
      user = build(:user, password_hash: nil)

      expect(user).not_to be_valid
      expect(user.errors[:password_hash]).to include("can't be blank")
    end

    it 'password_hash が空文字の場合は無効であること' do
      user = build(:user, password_hash: '')

      expect(user).not_to be_valid
      expect(user.errors[:password_hash]).to include("can't be blank")
    end

    it 'email が重複する場合は無効であること' do
      create(:user, email: 'spec@example.com')
      user = build(:user, email: 'spec@example.com')

      expect(user).not_to be_valid
      expect(user.errors[:email]).to include('has already been taken')
    end
  end

  describe '関連付け' do
    it 'recipes を複数持てること' do
      association = described_class.reflect_on_association(:recipes)

      expect(association.macro).to eq(:has_many)
    end
  end

  describe 'ユーザー削除' do
    it '紐づく recipes も一緒に削除されること' do
      user = create(:user)
      create_list(:recipe, 2, user: user)

      expect { user.destroy }.to change(Recipe, :count).by(-2)
    end
  end
end
