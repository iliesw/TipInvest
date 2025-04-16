/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";

export default function ImageShowcase() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating) {
        setIndex((prevIndex) => {
          const newIndex = prevIndex - 1;
          if (newIndex <= -(238.9 * 10 + 10 * 9)) {
            return 0;
          }
          return newIndex;
        });
      }
    }, 10);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const projects = [
    {
      title: "Modern Family Home",
      description: "A beautifully designed family residence with 4 bedrooms, a spacious garden, and a stunning view of the countryside.",
      image: "/assets/images/houses/1.avif",
    },
    {
      title: "Urban Studio Apartment",
      description: "Perfect for young professionals—this cozy studio is located in the heart of downtown with access to all amenities.",
      image: "/assets/images/houses/2.avif",
    },
    {
      title: "Luxury Beach Villa",
      description: "Experience the pinnacle of coastal living with our beachside villa, featuring a private pool and panoramic ocean views.",
      image: "/assets/images/houses/3.webp",
    },
    {
      title: "Countryside Retreat",
      description: "Reconnect with nature in this peaceful countryside home, complete with a large deck and wooded trails nearby.",
      image: "/assets/images/houses/4.webp",
    },
    {
      title: "High-Rise Penthouse",
      description: "This top-floor penthouse offers skyline views, a modern open-plan design, and high-end finishes throughout.",
      image: "/assets/images/houses/5.jpg",
    },
  ];

  // Duplicate array for seamless scrolling
  const allProjects = [...projects, ...projects, ...projects];

  return (
    <div className="w-full px-3 sm:px-0 sm:w-2/3 mx-auto overflow-hidden">
      <p className="text-lime-600 font-bold mb-2">Our Projects</p>
      <h1 className="text-4xl font-[Figtree] font-bold">
        Creating Lasting Memories through Real Estate
      </h1>
      <div className="rounded-lg overflow-hidden mt-24">
        <div
          className={`flex justify-start gap-2 flex-row h-full rounded-lg`}
          style={{ transform: `translateX(${index}px)` }}
          onMouseEnter={() => setIsAnimating(false)}
          onMouseLeave={() => setIsAnimating(true)}
        >
          {allProjects.map((project, i) => (
            <div
              key={i}
              className="w-full aspect-[1/2.1] h-[500px] group relative rounded-md"
            >
              <div className="group-hover:bg-black/40 group-hover:backdrop-blur absolute w-full z-10 aspect-[1/2.1] rounded-md h-[500px] flex flex-col justify-end text-white p-4 group-hover:opacity-100 opacity-0">
                <h1 className="text-2xl">{project.title}</h1>
                <p className="text-sm">{project.description}</p>
                <a className="mt-24" href="#">Learn More ↗</a>
              </div>
              <img
                className="rounded-md block w-full h-[500px] aspect-[1/2.1] relative object-cover"
                src={project.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
