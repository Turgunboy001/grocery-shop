import { KeyRoundIcon } from "lucide-react";
import type { Order } from "../../types";

export default function OrderOTP({ order }: { order: Order }) {
  const showOtp =
    order.deliveryOtp &&
    ["Assigned", "Packed", "Out for Delivery"].includes(order.status);
  if (!showOtp) return null;

  console.log(order, "otp");

  return (
    <div className="rounded-2xl border border-white/15 bg-linear-to-r from-app-green to-app-green-light p-6 text-white shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15">
          <KeyRoundIcon className="size-6" />
        </div>
        <div>
          <h3 className="font-semibold">Delivery OTP</h3>
          <p className="text-xs text-white/70">
            Share this with your delivery partner
          </p>
        </div>
      </div>
      <div
        className="flex flex-wrap gap-2"
        aria-label={`Delivery OTP: ${order.deliveryOtp}`}
      >
        {order.deliveryOtp.split("").map((digit, index) => (
          <div
            key={`${index}-${digit}`}
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 font-mono text-2xl font-bold tracking-wider"
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
}
