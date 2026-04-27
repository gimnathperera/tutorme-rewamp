"use client";

import { useParams } from "next/navigation";
import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TuitionRateItem } from "@/types/response-types";

type Rate = { minimumRate: string | number; maximumRate: string | number };

function formatRateValue(value: string | number) {
  const numericValue = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(numericValue)) {
    return new Intl.NumberFormat("en-US").format(numericValue);
  }
  return String(value);
}

function RateLine({ rate }: { rate?: Rate }) {
  if (!rate?.minimumRate && !rate?.maximumRate) return <span>N/A</span>;

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
        <span className="tracking-wide text-[10px] opacity-70">Rs</span>
        <span>{formatRateValue(rate.minimumRate)}</span>
      </span>
      <span className="text-gray-400">-</span>
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
        <span className="tracking-wide text-[10px] opacity-70">Rs</span>
        <span>{formatRateValue(rate.maximumRate)}</span>
      </span>
    </span>
  );
}

const RatePage = () => {
  const params = useParams();
  const { levelId } = params;

  const { data: rate, isLoading } = useFetchTuitionRatesQuery({
    page: 1,
    limit: 1000,
  });

  if (isLoading) return <p>Loading tuition rates...</p>;
  if (!rate?.results || rate.results.length === 0)
    return <p>No tuition rates found.</p>;

  const gradesMap: Record<string, TuitionRateItem[]> = {};

  rate.results.forEach((item) => {
    const gradeKey = item.grade?.title || "Unknown Grade";
    if (!gradesMap[gradeKey]) {
      gradesMap[gradeKey] = [];
    }
    gradesMap[gradeKey].push(item);
  });

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">{levelId}</h2>
      <h3 className="text-xl text-center mb-8 opacity-60">
        Explore the tuition rates for each subject by grade
      </h3>

      {Object.entries(gradesMap).map(([gradeTitle, subjects]) => (
        <div key={gradeTitle} className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">{gradeTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {subjects.map((item) => (
              <Card key={item._id} className="bg-white">
                <CardContent className="space-y-3 pt-6">
                  <h4 className="text-lg font-semibold mb-2">
                    {item.subject?.title || "Unknown Subject"}
                  </h4>
                  <p className="mb-1">
                    <strong>University Students:</strong>{" "}
                    <RateLine rate={item.universityStudentsRate} />
                  </p>
                  <p className="mb-1">
                    <strong>Part Time Tutor:</strong>{" "}
                    <RateLine rate={item.partTimeTutorRate} />
                  </p>
                  <p className="mb-1">
                    <strong>Full Time Tutor:</strong>{" "}
                    <RateLine rate={item.fullTimeTutorRate} />
                  </p>
                  <p className="mb-1">
                    <strong>MOE Teacher:</strong>{" "}
                    <RateLine rate={item.moeTeacherRate} />
                  </p>
                </CardContent>
                <CardFooter>
                  <button className="w-full py-2 rounded-lg bg-primary-700 text-white hover:opacity-90">
                    Book {item.subject?.title || "Class"} Class
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatePage;
