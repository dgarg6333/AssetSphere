# 🏛️ Karmayogi – Government Training Institution Asset Registry & Booking Platform

A **GovTech** platform built for the **MeitY Karmayogi initiative** to unify and manage government training institution resources.  
This system allows institutions to **register assets**, ministries to **discover & filter** them, and users to **book with ease** — all while ensuring **approval workflows**, **availability checks**, and **secure booking processes**.

---

## 📜 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Flow](#-system-flow)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📌 Overview

Government training institutions possess a variety of **physical and human assets** such as:
- Classrooms 🏫  
- Labs 🔬  
- Hostels 🏠  
- Seminar Halls 🎤  
- Faculty & Courses 👩‍🏫  

These assets are often **unstructured and siloed**, making discovery and booking cumbersome.  
**Karmayogi** solves this by providing a **centralized registry** and **discovery interface** for seamless **planning, booking, and collaboration**.

---

## 🚀 Features

### 🏢 Institution Registration & Approval
- Institutions sign up → **Admin approves** before asset registration.
- Admin dashboard to **manage institutions**.

### 📦 Asset Management
- Register assets with:
  - Asset Type (Classroom, Lab, Hostel, etc.)
  - Capacity
  - Location
  - Amenities
  - Functional Use
  - Availability Dates
- Edit & delete asset details.

### 🔍 Asset Discovery
- Search with **advanced filters**:
  - Location
  - Date Range
  - Capacity
  - Amenities
  - Asset Type
  - Purpose

### 📅 Booking System
- Institutions book assets matching their requirements.
- Add **special requests** while booking.
- Availability check to avoid double-booking.
- Cancel bookings **up to 24 hours before start date**.

### 📊 Dashboard
- Institutions: View current, upcoming, and past bookings.
- Admin: Manage all bookings, assets, and institutions.

---

## 🛠 Tech Stack

**Frontend:**  
![React](https://img.shields.io/badge/Frontend-React-blue)  
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC)

**Backend:**  
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)  
![Express.js](https://img.shields.io/badge/Framework-Express.js-black)

**Database:**  
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

**Authentication:**  
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 🔄 System Flow

```mermaid
flowchart TD
    A[Institution Registers] --> B[Admin Approval]
    B --> C[Institution Adds Assets]
    C --> D[Discovery Page with Filters]
    D --> E[Booking Request]
    E --> F[Availability Check]
    F --> G[Booking Confirmed]
    E --> H[Booking Rejected if Unavailable]
    G --> I[Cancellation Flow]
