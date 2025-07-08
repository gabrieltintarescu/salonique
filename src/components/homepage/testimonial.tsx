"use client";

import { fadeIn, staggerContainer } from "@/components/animations/PageTransition";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import avatar1 from '../../assets/testimonial/1.webp';
import avatar2 from '../../assets/testimonial/2.webp';
import avatar3 from '../../assets/testimonial/3.webp';
import avatar4 from '../../assets/testimonial/4.webp';
import avatar5 from '../../assets/testimonial/5.webp';
import avatar6 from '../../assets/testimonial/6.webp';
import { type CarouselApi, Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Andrei Popescu",
    designation: "Manager salon",
    company: "Beauty Studio",
    testimonial:
      "Platforma ne-a ajutat să gestionăm programările mult mai eficient. Clienții pot rezerva online, iar noi avem totul organizat într-un singur loc!",
    avatar: avatar1,
  },
  {
    id: 2,
    name: "Ioana Marinescu",
    designation: "Medic stomatolog",
    company: "DentalCare",
    testimonial:
      "Reamintirile automate și calendarul integrat ne-au redus semnificativ numărul de programări ratate. Recomand cu încredere!",
    avatar: avatar2,
  },
  {
    id: 3,
    name: "Mihai Ionescu",
    designation: "Consultant",
    company: "ConsultingPro",
    testimonial:
      "Interfața este intuitivă și ușor de folosit, atât pentru noi cât și pentru clienți. Programările se fac rapid, fără bătăi de cap.",
    avatar: avatar4,
  },
  {
    id: 4,
    name: "Elena Dumitru",
    designation: "Terapeut",
    company: "Relax Clinic",
    testimonial:
      "Folosim platforma de câteva luni și suntem foarte mulțumiți. Suportul tehnic răspunde prompt la orice întrebare.",
    avatar: avatar3,
  },
  {
    id: 5,
    name: "Radu Georgescu",
    designation: "Dezvoltator web",
    company: "WebWorks",
    testimonial:
      "Integrarea cu site-ul nostru a fost rapidă, iar funcțiile de raportare ne ajută să urmărim evoluția afacerii.",
    avatar: avatar5,
  },
  {
    id: 6,
    name: "Sorina Ilie",
    designation: "Analist date",
    company: "DataVision",
    testimonial:
      "Platforma oferă rapoarte detaliate și statistici utile. Acum putem lua decizii informate pentru a ne crește afacerea!",
    avatar: avatar6,
  },
];
const Testimonial = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="py-12 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-2xl"></div>
      </div>

      <motion.div
        className="w-full max-w-(--breakpoint-xl) mx-auto px-6 relative z-10"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          className="mb-6 xs:mb-10 text-3xl md:text-4xl font-bold text-center tracking-tight text-gray-900"
          variants={fadeIn}
          id="recenzii"
          transition={{ delay: 0.2 }}
        >
          Ce spun clienții noștri
        </motion.h2>
        <div className="h-6 xs:h-8" />
        <motion.div
          className="container w-full mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Carousel setApi={setApi}>
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn("h-3 w-3 rounded-full transition-all duration-200", {
                  "bg-gradient-to-r from-purple-500 to-pink-500 shadow-md": current === index + 1,
                  "bg-gray-200 hover:bg-gray-300": current !== index + 1,
                })}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) => (
  <div className="mb-6 bg-white rounded-xl p-6 shadow-sm floating-card hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-between gap-12">
      <div className="hidden lg:block relative shrink-0 aspect-3/4 max-w-[12rem] w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden">
        <img
          src={testimonial.avatar}
          alt=""
          className="object-cover w-full h-full rounded-xl"
        />

        <div className="absolute top-1/4 right-0 translate-x-1/2 h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
          <svg
            width="102"
            height="102"
            viewBox="0 0 102 102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M26.0063 19.8917C30.0826 19.8625 33.7081 20.9066 36.8826 23.024C40.057 25.1414 42.5746 28.0279 44.4353 31.6835C46.2959 35.339 47.2423 39.4088 47.2744 43.8927C47.327 51.2301 44.9837 58.4318 40.2444 65.4978C35.4039 72.6664 28.5671 78.5755 19.734 83.2249L2.54766 74.1759C8.33598 71.2808 13.2548 67.9334 17.3041 64.1335C21.2515 60.3344 23.9203 55.8821 25.3105 50.7765C20.5179 50.4031 16.6348 48.9532 13.6612 46.4267C10.5864 44.0028 9.03329 40.5999 9.00188 36.2178C8.97047 31.8358 10.5227 28.0029 13.6584 24.7192C16.693 21.5381 20.809 19.9289 26.0063 19.8917ZM77.0623 19.5257C81.1387 19.4965 84.7641 20.5406 87.9386 22.6581C91.1131 24.7755 93.6306 27.662 95.4913 31.3175C97.3519 34.9731 98.2983 39.0428 98.3304 43.5268C98.383 50.8642 96.0397 58.0659 91.3004 65.1319C86.4599 72.3005 79.6231 78.2095 70.79 82.859L53.6037 73.8099C59.392 70.9149 64.3108 67.5674 68.3601 63.7676C72.3075 59.9685 74.9763 55.5161 76.3665 50.4105C71.5739 50.0372 67.6908 48.5873 64.7172 46.0608C61.6424 43.6369 60.0893 40.2339 60.0579 35.8519C60.0265 31.4698 61.5787 27.6369 64.7145 24.3532C67.7491 21.1722 71.865 19.563 77.0623 19.5257Z"
              className="fill-white"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center justify-between gap-1">
          <div className="hidden sm:flex md:hidden items-center gap-3">
            <Avatar className="w-7 h-7 md:w-8 md:h-8">
              <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {testimonial.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-xs text-gray-500">{testimonial.designation}</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <StarIcon className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            <StarIcon className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            <StarIcon className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            <StarIcon className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            <StarIcon className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
          </div>
        </div>
        <p className="mt-4 text-base sm:text-lg lg:text-xl leading-normal font-semibold tracking-tight text-gray-900">
          &quot;{testimonial.testimonial}&quot;
        </p>
        <div className="flex sm:hidden md:flex mt-4 items-center gap-3">
          <Avatar>
            <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-semibold text-gray-900">{testimonial.name}</p>
            <p className="text-xs text-gray-500">{testimonial.designation}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Testimonial;