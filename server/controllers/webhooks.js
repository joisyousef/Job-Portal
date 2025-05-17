import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhook = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await wh.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;
    const email = data.email_addresses?.[0]?.email_address ?? "";

    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          email,
          name: `${data.first_name} ${data.last_name}`,
          Image: data.image_url,
          resume: "",
        });
        return res.json({ success: true });

      case "user.updated":
        await User.findByIdAndUpdate(
          data.id,
          {
            email,
            name: `${data.first_name} ${data.last_name}`,
            Image: data.image_url,
          },
          { new: true, runValidators: true }
        );
        return res.json({ success: true });

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true });

      default:
        return res.status(400).json({ error: "Unhandled event type" });
    }
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
