import { useState } from "react";
import { heroSectionData } from "../assets/assets";
import { Link } from "react-router-dom";
import { BikeIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { LoaderIcon } from "react-hot-toast";

const Login = () => {
  const [isLoginState, setIsLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSiubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => (window.location.href = "/"), 1000);
  };
  return (
    <div className="min-h-screen flex">
      {/* left side  */}
      <div className="hidden  lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
        <img
          src={heroSectionData.hero_image}
          alt="heroBanner"
          className="absolute inset-0 object-cover h-full bg-center opacity-10"
        />
        <div className="relative text-center px-12">
          <h2 className="text-4xl mb-4 font-semibold text-white">
            Welcome back to Instacart
          </h2>
          <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">
            Fresh groceries and organic produce, deliveried to your doorstep
          </p>
        </div>
      </div>

      {/* rigth side  */}

      <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
        <div className="w-full max-w-md">
          {/* form massage  */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center mb-6 gap-2">
              <BikeIcon className="size-8 text-app-green" />
              <span className="text-2xl font-semibold text-app-green">
                Instacart
              </span>
            </Link>
            <h1 className="text-2xl font-semibold text-app-green mb-2">
              {isLoginState
                ? "Sign in to your acccount"
                : "Sign up for an account"}
            </h1>
            <p className="text-sm text-app-text-light">
              {isLoginState
                ? "Don't have an account?"
                : "Alredy have an account?"}
              <button
                className="text-orange-500  ml-1 font-semibold hover:text-orange-600 transition-colors"
                onClick={() => setIsLoginState(!isLoginState)}
              >
                {isLoginState ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
          <form onSubmit={handleSiubmit} className="space-y-5">
            {!isLoginState && (
              <label className="flex flex-col gap-1 text-sm ">
                Name
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/5 size-4 text-app-text-light" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className=" w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border transition-all not-focus:border-app-border"
                  />
                </div>
              </label>
            )}
            <label className="flex flex-col gap-1 text-sm ">
              Email
              <div className="relative">
                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/5 size-4 text-app-text-light" />
                <input
                  type="text"
                  placeholder="Your Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=" w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border transition-all not-focus:border-app-border"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1 text-sm ">
              Password
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/5 size-4 text-app-text-light" />
                <input
                  type="password"
                  placeholder="........"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=" w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border transition-all not-focus:border-app-border"
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="flex-center w-full py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900  transition-colors disabled:opacity-50"
            >
              {loading ? (
                <LoaderIcon className="animate-spin" />
              ) : isLoginState ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
