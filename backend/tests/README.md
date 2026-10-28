# Test checklist

After implementing the TODOs, add automated tests for:
- Register succeeds with valid data.
- Duplicate email is rejected.
- Password is stored as a hash, never as plain text.
- Login rejects a wrong password with 401.
- `GET /api/users/me` returns 401 without a valid session.
- `GET /api/users/me` returns safe fields with a valid session.
- A normal user receives 403 on an admin-only route.
- Logout clears the session cookie.
