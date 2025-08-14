import React from "react";
import TutorDetailsSection from "./components/tutor-details-page";
import TuitionRatesByLevel from "./components/all-tuition-rates";

const TuitionRatesPage = () => {
  return (
    <div className="m-10">
      <div className="mx-auto max-w-7xl py-4 m-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Check the Tuition Rates and Let&apos;s Get Learning!
        </h2>
        <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
          Explore courses and resources just for you! See the relative tuition
          rates to begin
          <br className="hidden sm:block" />
          an exciting and personalized learning adventure!
        </h3>
      </div>
      <TutorDetailsSection />
      <TuitionRatesByLevel />
    </div>
  );
};

export default TuitionRatesPage;

// "use client";

// import { FC } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import Icon from "@/components/shared/icon";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";


// const TuitionRatesPage: FC = () => {
//   const router = useRouter();

//   const { data, isLoading } = useFetchTuitionRatesQuery({});

//   const subjects = data?.results || [];

//   const onHandleSubjectClick = (id: string) => {
//     router.push(`/tuition-rates/rate`);
//   };

//   return (
//     <div className="px-4 py-6 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl py-4 m-3">
//         <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
//           Find Your Levels and Exams and Let&apos;s Get Learning!
//         </h2>
//         <h3 className="text-xl sm:text-2xl font-medium text-center pt-4 sm:pt-10 opacity-50">
//           Explore levels and exams just for you! Pick your subject to begin
//           <br className="hidden sm:block" />
//           an exciting and personalized learning adventure!
//         </h3>
//       </div>
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:py-16 lg:px-10 rounded-3xl bg-lightgrey grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//         {isLoading
//           ? Array.from({ length: 8 }).map((_, index) => (
//               <Card key={index} className="flex flex-col m-2 bg-white">
//                 <CardContent className="flex-grow p-6">
//                   <div className="h-16 flex items-center justify-center">
//                     <Skeleton circle height={32} width={32} />
//                   </div>
//                   <h2 className="text-xl font-semibold text-center mb-2">
//                     <Skeleton width="60%" />
//                   </h2>
//                   <p className="text-center text-muted-foreground">
//                     <Skeleton width="80%" />
//                   </p>
//                 </CardContent>
//                 <CardFooter className="p-6 pt-0">
//                   <Skeleton height={40} />
//                 </CardFooter>
//               </Card>
//             ))
//           : subjects.map(({ _id, level }) => (
//               <Card key={_id} className="flex flex-col m-2 bg-white">
//                 <CardContent className="flex-grow p-6">
//                   <div className="h-16 flex items-center justify-center">
//                     <Icon name="ScrollText" size={32} />
//                   </div>
//                   <h2 className="text-xl font-semibold text-center mb-2">
//                     {level?.title}
//                   </h2>
//                 </CardContent>
//                 <CardFooter className="p-6 pt-0">
//                   <button
//                     className="py-3 px-5 text-sm disabled:opacity-50 font-medium w-full text-center text-white rounded-lg bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:opacity-90"
//                     onClick={() => {
//                       router.push(`/tuition-rates/${level?.id}/rate`);
//                     }}
//                   >
//                     View Tuition Rates for {level?.title}
//                   </button>
//                 </CardFooter>
//               </Card>
//             ))}
//       </div>
//     </div>
//   );
// };

// export default TuitionRatesPage;

