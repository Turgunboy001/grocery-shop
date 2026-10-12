import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BikeIcon,
  ChevronDownIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const user: any = {
    name: "Jhone Doe",
    email: "jhon@gmail.com",
    isAdmin: true,
  };
  const { cartCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (searchQuery.trim())
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  return (
    <div className="bg-white sticky top-0 z-50 border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-16">
        {/* logo */}
        <Link
          to={"/"}
          className="flex items-center gap-2 text-[22px] font-medium shrink-0"
        >
          <BikeIcon size={24} /> Instacart
        </Link>
        <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
          {/* Nav links  */}

          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
            <Link to={"/"}>Home</Link>
            <Link to={"/products"}>Profucts</Link>
            <Link to={"/deals"} className="text-app-orange">
              Deals
            </Link>
          </div>

          {/* search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex  flex-1 max-w-sm text-xs sm:text-sm"
          >
            <div className="relative w-full">
              <SearchIcon className="v absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search for groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=" w-full pl-8 p-2 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange/30"
              />
            </div>
          </form>
          <div className="flex items-center gap-3">
            {/* cart  */}
            <button
              className="relative p-2 rounded-xl"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon className=" size-5 text-zinc-900" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-app-orange text-white text-[10px]  rounded-full flex-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* user  */}
            <div className="relative">
              {user ? (
                <button
                  className="md:flex items-center gap-2 p-2 hidden"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="size-7 rounded-full bg-orange-950 text-white flex-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <ChevronDownIcon className="size-3 text-zinc-500" />
                </button>
              ) : (
                <div className="flex-center gap-2">
                  <Link
                    to={"/login"}
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-950 rounded-full hover:bg-green-950-light transition-colors"
                  >
                    <UserIcon size={16} /> Sign In
                  </Link>
                </div>
              )}
              {userMenuOpen ? (
                <XIcon
                  className="md:hidden"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                />
              ) : (
                <MenuIcon
                  className="md:hidden"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                />
              )}
              {userMenuOpen && (
                <>
                  {/* muammo bosa  shu yerda boladi  */}
                  <div
                    className="fixed inset-0   z-40 "
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-xl shadow-lg border border-app-border py-2 z-50 animate-fade-in">
                      {user && (
                        <div className="px-4 py-2 border-b border-app-border">
                          <p className="text-sm font-medium  text-zinc-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-zinc-500">{user?.email}</p>
                        </div>
                      )}
                      <div className="" onClick={() => setUserMenuOpen(false)}>
                        {!user && (
                          <Link to={"/login"} className="dropdown-link">
                            <UserIcon size={16} /> Sign In
                          </Link>
                        )}
                        {user && (
                          <Link to={"/orders"} className="dropdown-link">
                            <PackageIcon size={16} />
                            My Orders
                          </Link>
                        )}
                        {user && (
                          <Link to={"/address"} className="dropdown-link">
                            <MapPinIcon size={16} /> Addresses
                          </Link>
                        )}

                        <Link
                          to={"/products"}
                          className="dropdown-link md:hidden"
                        >
                          <ArrowRightIcon size={16} /> Products
                        </Link>
                        <Link to={"/deals"} className="dropdown-link md:hidden">
                          <ArrowUpRightIcon size={16} /> Deals
                        </Link>
                        {user?.isAdmin && (
                          <Link
                            to={"/admin/products"}
                            className="dropdown-link"
                          >
                            <ShieldIcon
                              className="text-app-orange-dark"
                              size={16}
                            />
                            <span className="text-app-orange-dark">
                              Admin Pannel
                            </span>
                          </Link>
                        )}
                        {user && (
                          <div className="border-t border-app-border pt-1">
                            <button
                              onClick={handleLogout}
                              className=" flex items-center gap-3 px-4 py-2.5 text-sm text-app-error hover:bg-red-50 w-full transition-colors"
                            >
                              <LogOutIcon size={16} /> Logout
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
