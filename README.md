<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

# Online Electronics Marketplace

## Project Overview  
This project is an **online platform for buying and selling phones, laptops, accessories, and other electronic devices**. Users can register, post product listings, and interact with other users via chat and comments.  

---

## 🔹 Features  

### 1️⃣ User Authentication  
- Users register based on their **region**.  
- **OTP verification** via email.  
- After verification, users receive a **JWT token** and can log in.  

### 2️⃣ Product Listings  
Users can post products in **four main categories**:  
- **Phones** (Samsung, Redmi, iPhone, etc.)  
- **Laptops** (Dell, HP, Asus, etc.)  
- **Accessories** (headphones, chargers, cables, etc.)  
- **Electronics** (cameras, smartwatches, TVs, etc.)  

**Additional features:**  
- **Admins and superadmins** create subcategories.  
- Users can list items as **new or used**.  
- Selling options: **for money, barter, or free**.  
- Admin approval is required before listings are published.  

### 3️⃣ Chat & Interaction  
- **Chat system** between the seller and potential buyers.  
- **Comments & reviews** with star ratings.  
- Users can **like** listings.  
- **View count tracking** for each listing.  

### 4️⃣ Roles & Permissions  
- **User** – Can list, buy, comment, and chat.  
- **Admin** – Can manage users, approve listings, and create categories.  
- **Superadmin** – Can manage admins and their permissions.  

### 5️⃣ Sorting & Filters  
- Listings are sorted **by rating** by default.  
- **Advanced filters** (category, price range, condition, etc.).  
- **Search functionality** for specific products.  

### 6️⃣ Orders  
- Users can place **orders**, but **no online payment** is available.  
- The order system is for **viewing and tracking only**.  

---

## 🛠️ Tech Stack  
The frontend can be developed using:  
- **React, Next.js, or Vue.js**  
- **JWT-based authentication**  
- **Interactive UI with filtering, searching, and rating features**  
- **Real-time chat and notifications**  

This project aims to create a **user-friendly and efficient** marketplace for electronics. 🚀  

