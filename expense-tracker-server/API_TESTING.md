# API Endpoint Testing Plan

## Authentication Endpoints

### 1. Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
**Save the `access_token` from response!**

---

## User Endpoints

### 3. Get Profile
```bash
GET http://localhost:5000/api/users/me
Authorization: Bearer <access_token>
```

### 4. Update Profile
```bash
PATCH http://localhost:5000/api/users/<user-id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name"
}
```

---

## Category Endpoints

### 5. Create Category
```bash
POST http://localhost:5000/api/categories
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Food",
  "type": "expense",
  "icon": "🍔",
  "color": "#FF5733"
}
```

### 6. Get All Categories
```bash
GET http://localhost:5000/api/categories
Authorization: Bearer <access_token>
```

---

## Expense Endpoints

### 7. Create Expense
```bash
POST http://localhost:5000/api/expenses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 50.00,
  "currency": "USD",
  "categoryId": "<category-id>",
  "date": "2025-11-28",
  "description": "Lunch",
  "type": "expense"
}
```

### 8. Get All Expenses
```bash
GET http://localhost:5000/api/expenses
Authorization: Bearer <access_token>
```

---

## Loan Endpoints

### 9. Create Loan (Registered User)
```bash
POST http://localhost:5000/api/loans
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "lenderUserId": "<your-user-id>",
  "borrowerUserId": "<other-user-id>",
  "amount": 1000,
  "currency": "USD",
  "loanDate": "2025-11-28",
  "description": "Personal loan"
}
```

### 10. Create Loan (Non-Registered Borrower)
```bash
POST http://localhost:5000/api/loans
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "lenderUserId": "<your-user-id>",
  "borrowerName": "John Doe",
  "borrowerEmail": "john@example.com",
  "borrowerPhone": "+1234567890",
  "amount": 500,
  "currency": "USD",
  "loanDate": "2025-11-28",
  "description": "Dinner split"
}
```

### 11. Get All Loans
```bash
GET http://localhost:5000/api/loans
Authorization: Bearer <access_token>
```

### 12. Add Loan Payment
```bash
POST http://localhost:5000/api/loans/<loan-id>/payments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 200,
  "paymentDate": "2025-11-28",
  "paymentMethod": "cash"
}
```

---

## Split Endpoints

### 13. Create Split (Equal)
```bash
POST http://localhost:5000/api/splits
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "totalAmount": 100,
  "currency": "USD",
  "description": "Dinner with friends",
  "paidByUserId": "<your-user-id>",
  "splitType": "equal",
  "participants": [
    { "userId": "<user-1-id>" },
    { "userId": "<user-2-id>" },
    { "participantName": "Guest", "participantEmail": "guest@example.com" }
  ]
}
```

### 14. Create Split (Percentage)
```bash
POST http://localhost:5000/api/splits
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "totalAmount": 100,
  "currency": "USD",
  "description": "Project costs",
  "paidByUserId": "<your-user-id>",
  "splitType": "percentage",
  "participants": [
    { "userId": "<user-1-id>", "percentage": 50 },
    { "userId": "<user-2-id>", "percentage": 30 },
    { "participantName": "Contractor", "percentage": 20 }
  ]
}
```

### 15. Get All Splits
```bash
GET http://localhost:5000/api/splits
Authorization: Bearer <access_token>
```

### 16. Settle Participant
```bash
POST http://localhost:5000/api/splits/<split-id>/participants/<participant-id>/settle
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 33.33
}
```

---

## Group Endpoints

### 17. Create Group
```bash
POST http://localhost:5000/api/groups
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Roommates",
  "description": "Shared apartment expenses",
  "imageUrl": "https://example.com/group.jpg"
}
```

### 18. Get All Groups
```bash
GET http://localhost:5000/api/groups
Authorization: Bearer <access_token>
```

### 19. Add Group Member
```bash
POST http://localhost:5000/api/groups/<group-id>/members
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "userId": "<user-id>",
  "role": "member"
}
```

### 20. Add Non-Registered Member
```bash
POST http://localhost:5000/api/groups/<group-id>/members
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "memberName": "New Roommate",
  "memberEmail": "newroommate@example.com",
  "role": "member"
}
```

### 21. Get Group Expenses
```bash
GET http://localhost:5000/api/groups/<group-id>/expenses
Authorization: Bearer <access_token>
```

---

## Invite Endpoints

### 22. Get Invite Details (Public)
```bash
GET http://localhost:5000/api/invites/<invite-token>
```

### 23. Accept Invite
```bash
POST http://localhost:5000/api/invites/<invite-token>/accept
Authorization: Bearer <access_token>
```

### 24. Resend Invite
```bash
POST http://localhost:5000/api/invites/<invite-token>/resend
Authorization: Bearer <access_token>
```

---

## Summary Endpoints

### 25. Get Financial Summary
```bash
GET http://localhost:5000/api/summaries
Authorization: Bearer <access_token>
```

---

## Testing Checklist

- [ ] Authentication (register, login)
- [ ] User management
- [ ] Categories CRUD
- [ ] Expenses CRUD
- [ ] Loans (registered users)
- [ ] Loans (non-registered users)
- [ ] Loan payments
- [ ] Splits (all 4 types)
- [ ] Split settlements
- [ ] Groups CRUD
- [ ] Group members
- [ ] Invite system
- [ ] Summaries
