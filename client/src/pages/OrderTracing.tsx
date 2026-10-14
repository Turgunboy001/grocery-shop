import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Order } from "../types";
import Loading from "../components/Loading";
import { ArrowLeftIcon, MapIcon, PhoneIcon } from "lucide-react";
import OrderOTP from "../components/OrderTracking/OrderOTP";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";
import api from "../config/api";
import toast from "react-hot-toast";

const OrderTracing = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const locationErrorShown = useRef(false);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order))
      .catch(() => navigate("/orders"))
      .finally(() => setLoading(false));
  }, [id, navigate]);
  useEffect(() => {
    if (!order || ["Delivered", "Cancelled", "Placed"].includes(order.status))
      return;

    const fetchLocation = async () => {
      try {
        const { data } = await api.get(`/orders/${id}/location`);
        const location = data.liveLocation;
        if (
          typeof location?.lat === "number" &&
          typeof location?.lng === "number"
        ) {
          setLiveLocation({
            lat: location.lat,
            lng: location.lng,
          });
        }
        if (data.status && data.status !== order.status) {
          setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
        }
        locationErrorShown.current = false;
      } catch (error: any) {
        if (!locationErrorShown.current) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to update delivery location",
          );
          locationErrorShown.current = true;
        }
      }
    };
    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);
    return () => clearInterval(interval);
  }, [id, order?.status]);

  if (loading) return <Loading />;
  if (!order) return null;

  return (
    <div className="min-h-screen mb-20 bg-app-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* header  */}
        <button
          className="flex items-center gap-2 text-sm text-app-text-light"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeftIcon className="size-4" /> Back to Orders
        </button>

        {/* oder id, date, status  */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className=" text-2xl font-semibold text-app-green">
              Order #{order!.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-app-text-light">
              Placed on{" "}
              {new Date(order!.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className={` px-4 py-1.5 text-sm font-semibold rounded-full ${order!.status === "Delivered" ? "bg-green-100 text-green-700" : order!.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-app-orange/10 text-app-orange"}`}
          >
            {order!.status}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* left site timeline + map area */}
          <div className="lg:col-span-2 space-y-6">
            {/* OTP card */}
            <OrderOTP order={order} />

            {/* live map  */}
            <LiveMap order={order} liveLocation={liveLocation} />

            {/* progress timeline  */}
            <OrderTimeLine order={order} />

            {/* Deliveried  */}
            {order?.deliveryPartner &&
              order.status !== "Delivered" &&
              order.status !== "Cancelled" && (
                <div className="bg-white rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-app-green flex-center">
                      <span className="text-white font-semibold text-sm">
                        {order.deliveryPartner.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-app-green">
                        {order.deliveryPartner.name}
                      </p>
                      <p className="text-xs text-app-text-light capitalize">
                        {order.deliveryPartner.vehicleType} • Delivery Partner
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${order.deliveryPartner.phone}`}
                    className="p-2.5 bg-app-cream rounded-xl hover:bg-app-cream-dark transition-colors"
                  >
                    <PhoneIcon className="size-4 text-app-green" />
                  </a>
                </div>
              )}
          </div>
          {/* right side  - order detils  */}
          <div className="space-y-5">
            {/* delivery address  */}
            <div className="bg-white rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-app-green mb-3 flex items-center gap-2">
                <MapIcon className="size-4" /> Delivery Address
              </h3>
              <p className="text-sm text-app-text-light leading-relaxed">
                {order?.shippingAddress.label}
                <br />
                {order?.shippingAddress.address}
                <br />
                {order?.shippingAddress.city},{order?.shippingAddress.state}
                {order?.shippingAddress.zip}
              </p>
            </div>

            {/* items  */}
            <div className="bg-white rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-app-green mb-3">
                ({order?.items.length})
              </h3>
              <div className="space-y-3">
                {order?.items.map((item, i) => (
                  <div className="flex items-center gap-3" key={i}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-app-green truncate">
                        {item.name}
                      </p>
                      <p className=" text-xs text-app-text-light">
                        {item.quantity}
                      </p>
                    </div>
                    <span className=" text-sm font-semibold">
                      {currency}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-app-border space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-app-text-light">Subtotal</span>
                  <span>
                    {currency}
                    {order?.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-text-light">Delivery</span>
                  <span>
                    {order?.deliveryFee === 0
                      ? "Free"
                      : `${currency}${order?.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-text-light">Tax</span>
                  <span>
                    {currency}
                    {order?.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-app-text-light">Total</span>
                  <span>
                    {currency}
                    {order?.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracing;
