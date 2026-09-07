INSERT INTO auth_user (id, email, first_name, last_name, role, is_active, created_at, updated_at, name)
VALUES ('admin-user-01', 'latviansof@gmail.com', 'Admin', 'User', 'admin', 1, 1788447001336, 1788447001336, 'Admin User')
ON CONFLICT(email) DO UPDATE SET role = 'admin', is_active = 1, updated_at = 1788447001336;

INSERT INTO auth_account (id, user_id, account_id, provider_id, password, created_at, updated_at)
VALUES ('acc-admin-user-01', 'admin-user-01', 'admin-user-01', 'credential', 'pbkdf2:100000:61ed4814a3cd29b06f77334086cf1d51:ef8be3c29c859a306e7f9ef07be82023b92f14ea1b4afd799a4138a7a700df36', 1788447001336, 1788447001336)
ON CONFLICT(id) DO UPDATE SET password = 'pbkdf2:100000:61ed4814a3cd29b06f77334086cf1d51:ef8be3c29c859a306e7f9ef07be82023b92f14ea1b4afd799a4138a7a700df36', updated_at = 1788447001336;