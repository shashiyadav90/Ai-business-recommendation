import axios from "axios";

const API = axios.create({
baseURL: "http://localhost:5000/api",
});

export const sendOTP = (phone) => {
return API.post("/auth/send-otp", {
phone,
});
};

export const verifyOTP = (phone, otp) => {
return API.post("/auth/verify-otp", {
phone,
otp,
});
};
