 create_table :users, force: :cascade do |t|
  t.string :google_sub, null: false
  t.string :name, null: false
  t.string :email, null: false
  t.string :password_hash
  t.timestamps null: false

  t.index :google_sub, unique: true
  t.index :email, unique: true
 end
