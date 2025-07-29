🚀 Phase 2: Firebase + MongoDB Integration
Setup lib/firebase.ts

Configure .env.local for Firebase

Use Firebase Auth for login/register (Email + Google)

Store user data in MongoDB via API routes (app/api/)

📦 Phase 3: User Roles & Registration Logic
Multi-role registration: Admin, Seller, Buyer, Family Tenant, Bachelor Tenant

Form validation using Yup + React Hook Form

Cloudinary for NID/Passport upload (for Seller)

Saved MongoDB user schema:

ts
Copy
Edit
{
firebaseUid: string,
name: string,
email: string,
role: 'admin' | 'seller' | 'buyer' | 'family_tenant' | 'bachelor_tenant',
nidOrPassportUrl?: string,
phone?: string,
verified: boolean
}
🏠 Phase 4: Flat Listing Feature
Sellers can:

Pay for listing (mock initially)

Upload flat details

Upload images (Cloudinary)

Buyers/Families/Bachelors can:

Browse listings

Filter/search

Book visits or contact landlords

🛡️ Phase 5: Admin Dashboard
Admins can:

Approve/reject listings

Verify users (seller/buyer)

View complaints

Warn or ban users

💬 Phase 6: Complaints, Trust System, Bookings (Updated)
Buyers can submit complaints and bookings

After payment, buyers will see their:

Pending bookings

Booking history

Transaction details: including payment info, selected flat details, booking date, etc.

Sellers will see:

Booking/payment history from buyers

Buyer info + contact for confirmed appointments

View bookings made for their flats

Admin Dashboard:

Two types of transactions view:

Sale Flat Transactions (full payment)

Buyer Appointment Transactions (appointment fee)

Admin can see:

Buyer/seller details

Transaction/payment status

Flat involved

Option to mark a transaction as complete

💸 Phase 7: Payment (bKash/Nagad/Rocket) (Updated)
Listing fees (Sellers)

Appointment fees (Buyers)

✅ Initially mocked → then integrated with real payment gateways (bKash/Nagad) via hosted links or APIs.

💡 After payment:

Booking and transaction details are saved

Available to respective users (buyer/seller/admin)

Admins can verify/complete them manually if needed

🌐 Final Phase: Polishing
Multilingual support (Bangla/English)

SEO optimization

Mobile responsiveness

PWA or installable app support
