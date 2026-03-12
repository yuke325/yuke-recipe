 create_table :users, force: :cascade do |t|
  t.string :name, null: false
  t.string :email, null: false
  t.string :password_hash, null: false
  t.timestamps null: false

  t.index :email, unique: true
 end
