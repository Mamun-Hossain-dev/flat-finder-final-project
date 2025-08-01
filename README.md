# Flat Finder

Flat Finder is a modern web application designed to streamline the process of finding and listing rental properties. It caters to various user roles, including administrators, sellers (landlords), and different types of tenants (buyers, families, bachelors), providing a comprehensive platform for property management and booking.

## Features

### For Everyone:
- **User-friendly interface:** A clean and intuitive design for easy navigation.
- **Secure authentication:** Robust login and registration system using Firebase Auth (Email/Password and Google).
- **Responsive design:** Fully accessible on both desktop and mobile devices.

### For Admins:
- **Dashboard:** A powerful dashboard to manage the entire platform.
- **User management:** Verify, warn, or ban users.
- **Listing approval:** Approve or reject property listings submitted by sellers.
- **Complaint resolution:** View and address complaints filed by users.
- **Transaction monitoring:** Track all platform transactions, including listing fees and appointment payments.

### For Sellers (Landlords):
- **Property listing:** Easily upload and manage property details, including images (via Cloudinary).
- **Booking management:** View booking requests and history for their properties.
- **Payment processing:** Securely pay for listings using various payment methods.

### For Buyers/Tenants:
- **Advanced search and filtering:** Find the perfect property with detailed search criteria.
- **Secure booking:** Book property visits and appointments.
- **Complaint system:** Submit complaints regarding listings or users.
- **Payment history:** Track all payments and transaction details.

## Tech Stack

- **Frontend:** React, Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase Authentication
- **Image storage:** Cloudinary
- **Form validation:** Yup, React Hook Form
- **Payment gateway:** bKash, Nagad, Rocket (via hosted links/APIs)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB account
- Firebase project
- Cloudinary account

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your_username/flat-finder.git
   ```
2. **Install NPM packages**
   ```sh
   npm install
   ```
3. **Set up environment variables**
   - Create a `.env.local` file in the root directory.
   - Add the necessary environment variables for Firebase, MongoDB, and Cloudinary. You can use `.env.example` as a reference.
4. **Run the development server**
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
flat-finder/
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   ├── (pages)/        # Page components
│   └── layout.tsx      # Root layout
├── components/         # Shared React components
├── hooks/              # Custom React hooks
├── lib/                # Helper functions and libraries
├── models/             # Mongoose models for MongoDB
├── public/             # Static assets
├── store/              # Redux Toolkit store
└── styles/             # Global styles
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
