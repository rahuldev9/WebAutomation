"use client";
import { useState } from "react";

export default function UserForm() {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [Webhook, setWebhook] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      Name,
      Email,
      sheetName: "Automation",
    };

    try {
      const scriptUrl =
        "https://script.google.com/macros/s/AKfycbz3pNxH76iKXxFwYzzcmJsjp7Llai1J8son-Zw62sD49OKc4ez7lTGB9ZZFFHlztAg3/exec";

      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      await SendWebhook();

      setMessage("✅ Saved successfully!");
    } catch (err) {
      setMessage("⚠️ Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const SendWebhook = async () => {
    setLoading(true);
    setWebhook("");

    try {
      const webhookUrl = "https://75ca6ecc0759.ngrok-free.app/webhook/message";

      // Send the Name and Email as payload
      const payload = { Name, Email };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Webhook request failed");
      }

      setWebhook("✅ Sent email successfully!");
    } catch (err) {
      console.error(err);
      setWebhook("⚠️ Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6 animate-fadeIn"
      >
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          User Information
        </h2>

        <input
          className="border border-gray-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="text"
          placeholder="Name"
          value={Name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border border-gray-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          type="email"
          placeholder="Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {message && (
          <p
            className={`text-center font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        {Webhook && (
          <p
            className={`text-center font-medium ${
              Webhook.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {Webhook}
          </p>
        )}
      </form>
    </div>
  );
}
