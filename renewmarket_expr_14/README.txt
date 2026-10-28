RENEWMARKET - SECOND-HAND GOODS MARKETPLACE
Internet Programming Lab Experiment

FILES
- index.html: marketplace home page and sections
- style.css: responsive styling
- script.js: listing, account, negotiation, transaction and admin demo logic

HOW TO RUN
1. Extract the ZIP file.
2. Open index.html in a modern browser.
3. Register an account to create listings or start a demo transaction.
4. Click "Admin console" in the footer.
   Demo admin email: admin@renewmarket.demo
   Demo admin password: renew123

FEATURES
USER MANAGEMENT
- Demo user registration and login
- Admin can set/reset demo passwords and delete users

CATEGORY MANAGEMENT
- Add custom category information
- Delete custom categories (default categories remain)

COMMODITY / LISTING MANAGEMENT
- Seller listing creation
- Admin can edit item details and prices
- Admin can delete listings

ORDER MANAGEMENT
- Buyer can start a demo transaction from a listing
- Admin can change logistics status to Pending, Shipped, or Received
- Admin can delete demo orders

BUYER/SELLER FEATURES
- Search listings, filter by category, sort by price
- Listing descriptions, photos, price, condition and seller/location details
- Save favourites
- Send demo seller messages and negotiate an offer
- View demo transaction history

LIMITATIONS
- Frontend-only prototype. Data is stored in browser localStorage, not a shared database.
- Passwords are stored locally for demo purposes. Do not use real credentials.
- Payment, messaging and logistics are simulated; no real payment or delivery is arranged.
- Photos load from Unsplash and require internet access.
- Production deployment needs a secure backend/database, hashed passwords, server-side authorization, payment integration and delivery provider integration.
