import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
const cloud = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const timestamp = Math.round(Date.now() / 1000);
const signature = cloudinary.utils.api_sign_request({ timestamp }, apiSecret);
const form = new FormData();
form.append("file", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==");
form.append("api_key", apiKey);
form.append("timestamp", String(timestamp));
form.append("signature", signature);
const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
});
console.log("STATUS:", res.status);
console.log("HEADERS:", Object.fromEntries(res.headers));
console.log("BODY:", await res.text());
