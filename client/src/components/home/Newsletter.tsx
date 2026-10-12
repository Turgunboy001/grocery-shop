import { MailIcon } from "lucide-react";
import React from "react";

const Newsletter = () => {
  return (
    <section className="bg-white py-18  px-4 sm:px-6 md:px-8 rounded-3xl mx-auto shadow-xs mt-32 mb-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="size-16 bg-white rounded-xl flex-center flex-col mx-auto mb-6 shadow">
          <MailIcon className="size-8 text-app-green" strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl font-semibold text-app-green mb-4">
          Subscribe to our Newsletter
        </h2>
        <p className="text-app-text-light text-base mb-8">
          Get weekly updates on fresh produce, seasonal offers, and exclucive
          discount right to your inbox.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email address"
            required
            className="flex-1 px-5 py-3.5 rounded-xl border border-app-border focus:border-app-green focus:ring bg-white text-sm transition-all"
          />
          <button
            className="px-8 py-3.5 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors shadow-sm active:scale-[0.98] whitespace-nowrap"
            type="submit"
          >
            Subscribe
          </button>
        </form>
      </div>{" "}
    </section>
  );
};

export default Newsletter;
