import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
console.log("cloud:", JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME));
console.log("key length:", process.env.CLOUDINARY_API_KEY?.length);
console.log("secret length:", process.env.CLOUDINARY_API_SECRET?.length);
cloudinary.api
    .ping()
    .then((r) => console.log("PING OK:", r))
    .catch((e) => console.log("PING XATO:", JSON.stringify(e, null, 2)));
// 1x1 piksel test rasm (base64)
const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
cloudinary.uploader
    .upload(testImage, { folder: "grocery-del" })
    .then((r) => console.log("UPLOAD OK:", r.secure_url))
    .catch((e) => console.log("UPLOAD XATO:", JSON.stringify(e, null, 2)));
