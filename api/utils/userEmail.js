import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Assuming you have a User model imported or defined elsewhere to use 'ref'
// If not, you'll need to fetch the owner's details using `asset.ownerId`
// and the user's details using `booking.userId`.
// For simplicity, we'll assume `user` and `owner` documents are passed to the function.
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getFullAddress = (address) => {
  if (!address) return "N/A";
  const addressParts = [
    address.buildingName,
    address.street,
    address.locality,
    address.city,
    address.district,
    address.state,
    address.pincode,
  ].filter(Boolean);
  return addressParts.length > 0 ? addressParts.join(", ") : "N/A";
};

export const sendBookingConfirmation = async (user, booking, asset, institute) => {
  try {
    const mailOptions = {
      from: `"ATI CTI" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Booking Confirmed for ${asset.name} - ATI CTI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4CAF50; text-align: center;">Booking Confirmed ✅</h2>
          <p style="text-align: center;">Hello <strong>${user.username}</strong>,</p>
          <p>Your booking for <strong>${asset.name}</strong> has been successfully confirmed. Here are the details of your reservation:</p>

          <hr style="border-top: 1px solid #eee;">

          <h3>📅 Booking Details</h3>
          <ul>
            <li><strong>Booking ID:</strong> ${booking._id}</li>
            <li><strong>Asset:</strong> ${asset.name} (${asset.type})</li>
            <li><strong>Purpose:</strong> ${booking.purpose}</li>
            <li><strong>Attendees:</strong> ${booking.attendeeCount}</li>
            <li><strong>From:</strong> ${new Date(booking.startDate).toLocaleString()}</li>
            <li><strong>To:</strong> ${new Date(booking.endDate).toLocaleString()}</li>
          </ul>

          <hr style="border-top: 1px solid #eee;">

          <h3>🏢 Asset Details</h3>
          <ul>
            <li><strong>Institution:</strong> ${asset.institutionName}</li>
            <li><strong>Address:</strong> ${getFullAddress(asset.address)}</li>
            <li><strong>Category:</strong> ${asset.category}</li>
            <li><strong>Capacity:</strong> ${asset.capacity} people</li>
            <li><strong>Features:</strong> ${asset.features.join(", ")}</li>
            <li><strong>Amenities:</strong> ${asset.amenities.join(", ")}</li>
            <li><strong>Description:</strong> ${asset.description}</li>
            ${asset.website ? `<li><strong>Website:</strong> <a href="${asset.website}" target="_blank">${asset.website}</a></li>` : ''}
          </ul>
          
          <hr style="border-top: 1px solid #eee;">

          <h3>👤 Institute Information</h3>
          <p>Please contact the asset owner directly for any inquiries or special requests.</p>
          <ul>
            <li><strong>Institute Name:</strong> ${institute.institutionName}</li>
            <li><strong>Email:</strong> ${institute.ownerEmail}</li>
            <li><strong>Phone:</strong> ${institute.ownerphone || "N/A"}</li>
          </ul>

          <p style="text-align: center; margin-top: 20px;">Thank you for using <strong>ATI CTI</strong> 🚀</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Booking confirmation email sent");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};