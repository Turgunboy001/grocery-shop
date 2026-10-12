import { Link } from "react-router-dom";
import { categoriesData } from "../../assets/assets";

const HomeCategories = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <div className="">
          <h2 className="text-2xl font-semibold">Browse Categpries</h2>
          <p className=" text-sm text-app-text-light">
            Find exactly what you need using
          </p>
          <div className="flex items-center mt-8 overflow-x-scroll no-scrollbar">
            {categoriesData.map((cat, i) => (
              <Link
                to={`/products?category=${cat.slug}`}
                onClick={() => window.scrollTo(0, 0)}
                className="group flex flex-col items-center gap-3 p-4"
                key={i}
              >
                <div className="size-18 sm:size-26 sm:p-2 rounded-2xl overflow-hidden bg-orange-100 group-hover:ring-2 ring-orange-300/75 transition-all">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain rounded-full transition-all"
                  />
                </div>
                <span className="text-xs font-medium text-zinc-600 text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;
